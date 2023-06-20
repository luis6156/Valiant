import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'node:os';
import path, { dirname, join } from 'node:path';
import { update } from './update';
import { exec, spawn } from 'child_process';
import fs from 'fs';

// Load the environment variables from the .env file
require('dotenv').config({ path: join(__dirname, '../../.env') });

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(__dirname, '../../public/icons/small-airplane.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true,
    },
    width: 1280,
    height: 950,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#111111', // #212121
      symbolColor: '#F74A39', // #cecece
      height: 30,
    },
  });

  if (url) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('env-vars', {
      licenseKey: process.env.LICENSE_KEY,
    });
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // Apply electron-updater
  update(win);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.on('open-external-link', (event, { href }) => {
  console.log('open-external-link', href);
  shell.openExternal(href);
});

ipcMain.handle('fs-exists-sync', async (event, { fileName }) => {
  console.log(
    `checking if file exists ${join(__dirname, '../../src/data/', fileName)}`
  );

  const exists = fs.existsSync(join(__dirname, '../../src/data/', fileName));

  return exists;
});

ipcMain.handle('fs-readfile-sync', async (event, { fileName }) => {
  console.log(`reading file ${join(__dirname, '../../src/data/', fileName)}`);

  const fileData = fs.readFileSync(
    join(__dirname, '../../src/data/', fileName),
    'utf8'
  );

  return fileData;
});

ipcMain.handle('fs-writefile-sync', async (event, { data, fileName }) => {
  console.log(
    `writing to file ${join(__dirname, '../../src/data/', fileName)}`
  );

  fs.writeFileSync(join(__dirname, '../../src/data/', fileName), data);
});

ipcMain.handle('fs-appendfile-sync', async (event, { data, fileName }) => {
  console.log(
    `writing to file ${join(__dirname, '../../src/data/', fileName)}`
  );

  fs.appendFileSync(join(__dirname, '../../src/data/', fileName), data);
});

ipcMain.on(
  'run-script',
  (
    event,
    {
      executionName,
      scriptExecutable,
      scriptPath,
      scriptName,
      args,
      outputFile,
    }
  ) => {
    const startTime = new Date().toLocaleString();

    // Send message to the renderer process
    win?.webContents.send('scripts-status', {
      scriptName,
      executionName: executionName,
      startTime,
      endTime: '',
      isRunning: true,
    });

    // Change working directory to the script directory
    const scriptDir = path.dirname(scriptPath);
    process.chdir(scriptDir);

    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }

    const command = [
      scriptPath,
      ...args.map((arg: { name?: string; value?: string }) => {
        if (arg.name && arg.value) {
          return arg.name + ' ' + arg.value;
        } else if (arg.name) {
          return arg.name;
        } else {
          return arg.value;
        }
      }),
    ];

    console.log('running command: ', command);

    const scriptProcess = spawn(scriptExecutable, command, { cwd: scriptDir });

    scriptProcess.stdout.on('data', (data) => {
      console.log(`stdout from script: ${data}`);
    });

    scriptProcess.stderr.on('data', (data) => {
      console.error(`stderr from script: ${data}`);
    });

    scriptProcess.on('close', (code) => {
      win?.webContents.send('scripts-status', {
        scriptName,
        executionName: executionName,
        startTime,
        endTime: new Date().toLocaleString(),
        isRunning: false,
      });
      console.log(`script exited with code ${code}`);
    });
  }
);

ipcMain.on('run-cross-linked', (event, { emailFormat, domain }) => {
  const scriptLocation = path.resolve(
    __dirname,
    '../../tools/social/crosslinked/crosslinked.py'
  );
  const namesTextLocation = path.resolve(__dirname, '../../names.txt');
  const namesCsvLocation = path.resolve(__dirname, '../../names.csv');
  const crossLinkedLocation = dirname(scriptLocation);

  process.chdir(crossLinkedLocation);

  exec(
    `python ${scriptLocation} -f '${emailFormat}' ${domain}`,
    (error, stdout, stderr) => {
      if (error) {
        event.reply('cross-linked-reply', error.message);
        console.log(error.message);
        return;
      }
      if (stderr) {
        event.reply('cross-linked-reply', stderr);
        console.log(stderr);
        return;
      }
      fs.readFile('names.txt', 'utf8', function (err, data) {
        if (err) {
          event.reply('cross-linked-reply', err);
          console.log(err);
          return;
        }
        console.log(`stdout: ${data}`);
        event.reply('cross-linked-reply', data);
      });
    }
  );
});

ipcMain.on('run-poastal', (event, { email }) => {
  const scriptLocation = path.resolve(
    __dirname,
    '../../tools/social/poastal/backend/cli.py'
  );
  const postalLocation = dirname(scriptLocation);

  process.chdir(postalLocation);

  exec(`python ${scriptLocation} ${email}`, (error, stdout, stderr) => {
    if (error) {
      event.reply('poastal-reply', error.message);
      console.log(error.message);
      return;
    }
    if (stderr) {
      event.reply('poastal-reply', stderr);
      console.log(stderr);
      return;
    }
    console.log(`stdout: ${stdout}`);
    event.reply('poastal-reply', stdout);
  });
});

ipcMain.on('run-socialscan', (event, { user }) => {
  const scriptLocation = path.resolve(
    __dirname,
    '../../tools/social/socialscan/socialscan/__main__.py'
  );
  const socialscanLocation = dirname(scriptLocation);

  process.chdir(socialscanLocation);

  const child = exec(
    `python ${scriptLocation} ${user} --json results.json`,
    (error, stdout, stderr) => {
      if (error) {
        event.reply('socialscan-reply', error.message);
        console.log(error.message);
        return;
      }
      if (stderr) {
        event.reply('socialscan-reply', stderr);
        console.log(stderr);
        return;
      }
    }
  );

  child.on('exit', (code) => {
    if (code === 0) {
      fs.readFile('results.json', 'utf8', (err, data) => {
        if (err) {
          event.reply('socialscan-reply', err);
          console.log(err);
          return;
        }
        console.log(`stdout: ${data}`);
        event.reply('socialscan-reply', data);
      });
    }
  });
});

ipcMain.on('run-gitstalk', (event, { username }) => {
  const scriptLocation = path.resolve(
    __dirname,
    '../../tools/repositories/gitstalk/gitstalk.py'
  );
  const gitStalkLocation = dirname(scriptLocation);

  process.chdir(gitStalkLocation);

  exec(`python ${scriptLocation} ${username}`, (error, stdout, stderr) => {
    if (error) {
      event.reply('gitstalk-reply', error.message);
      console.log(error.message);
      return;
    }
    if (stderr) {
      event.reply('gitstalk-reply', stderr);
      console.log(stderr);
      return;
    }
    console.log(`stdout: ${stdout}`);
    event.reply('gitstalk-reply', stdout);
  });
});

ipcMain.on('run-gitrekt', (event, { url }) => {
  const scriptLocation = path.resolve(
    __dirname,
    '../../tools/repositories/gitrekt/gitrekt.py'
  );
  const gitRektLocation = dirname(scriptLocation);

  process.chdir(gitRektLocation);

  exec(`python ${scriptLocation} -u ${url}`, (error, stdout, stderr) => {
    if (error) {
      event.reply('gitrekt-reply', error.message);
      console.log(error.message);
      return;
    }
    if (stderr) {
      event.reply('gitrekt-reply', stderr);
      console.log(stderr);
      return;
    }
    console.log(`stdout: ${stdout}`);
    event.reply('gitrekt-reply', stdout);
  });
});

ipcMain.on('run-msdorkdump', (event, { url }) => {
  const scriptLocation = path.resolve(
    __dirname,
    '../../tools/websites/msdorkdump/msdorkdump.py'
  );
  const msdorkdumpLocation = dirname(scriptLocation);

  process.chdir(msdorkdumpLocation);

  exec(`python ${scriptLocation} -t ${url}`, (error, stdout, stderr) => {
    if (error) {
      event.reply('msdorkdump-reply', error.message);
      console.log(error.message);
      return;
    }
    if (stderr) {
      event.reply('msdorkdump-reply', stderr);
      console.log(stderr);
      return;
    }
    console.log(`stdout: ${stdout}`);
    event.reply('msdorkdump-reply', stdout);
  });
});

ipcMain.on('run-photon', (event, { url }) => {
  const scriptLocation = path.resolve(
    __dirname,
    '../../tools/websites/photon/photon.py'
  );
  const photonLocation = dirname(scriptLocation);

  process.chdir(photonLocation);

  exec(`python ${scriptLocation} -u ${url}`, (error, stdout, stderr) => {
    if (error) {
      event.reply('photon-reply', error.message);
      console.log(error.message);
      return;
    }
    if (stderr) {
      event.reply('photon-reply', stderr);
      console.log(stderr);
      return;
    }
    console.log(`stdout: ${stdout}`);
    event.reply('photon-reply', stdout);
  });
});

ipcMain.on('run-webenum', (event, { url }) => {
  const scriptLocation = path.resolve(
    __dirname,
    '../../tools/websites/webenum/w3b3num.py'
  );
  const webenumLocation = dirname(scriptLocation);

  process.chdir(webenumLocation);

  exec(`python ${scriptLocation} ${url}`, (error, stdout, stderr) => {
    if (error) {
      event.reply('webenum-reply', error.message);
      console.log(error.message);
      return;
    }
    if (stderr) {
      event.reply('webenum-reply', stderr);
      console.log(stderr);
      return;
    }
    console.log(`stdout: ${stdout}`);
    event.reply('webenum-reply', stdout);
  });
});
