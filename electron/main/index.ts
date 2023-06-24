import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { release } from 'node:os';
import path, { dirname, join } from 'node:path';
import { update } from './update';
import { exec, spawn } from 'child_process';
import fs from 'fs';
import archiver from 'archiver';
import unzipper from 'unzipper';
import crypto from 'crypto';

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
      outputSkipRows,
      outputColsSeparator,
      outputColumns,
      outputFile,
    }
  ) => {
    const startTime = new Date().toLocaleString();
    const useStdout = outputFile === 'stdout';
    const outputFilePath = useStdout ? 'script_output.txt' : outputFile;

    // Send message to the renderer process
    win?.webContents.send('scripts-status', {
      scriptName,
      executionName: executionName,
      startTime,
      endTime: '-',
      isRunning: true,
      output: [],
      outputColumns,
    });

    // Change working directory to the script directory
    const scriptDir = path.dirname(scriptPath);
    process.chdir(scriptDir);

    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }

    const commandArgs: string[] = [];
    args.forEach((arg: { name?: string; value?: string }) => {
      if (arg.name) {
        commandArgs.push(arg.name);
      }
      if (arg.value) {
        commandArgs.push(arg.value);
      }
    });

    const command = [scriptPath, ...commandArgs];

    console.log('running command: ', command);

    let scriptProcess;

    if (useStdout) {
      scriptProcess = spawn(scriptExecutable, command, {
        cwd: scriptDir,
        stdio: ['inherit', 'pipe', 'ignore'],
      });
      const outputStream = fs.createWriteStream(outputFilePath);
      scriptProcess.stdout.pipe(outputStream);
    } else {
      scriptProcess = spawn(scriptExecutable, command, { cwd: scriptDir });
    }

    scriptProcess.stdout.on('data', (data) => {
      console.log(`stdout from script: ${data}`);
    });

    scriptProcess.stderr?.on('data', (data) => {
      console.error(`stderr from script: ${data}`);
      return win?.webContents.send('scripts-status', {
        scriptName,
        executionName: executionName,
        startTime,
        endTime: new Date().toLocaleString(),
        isRunning: false,
        output: [],
        outputColumns,
      });
    });

    scriptProcess.on('close', (code) => {
      const output = fs.readFileSync(outputFilePath, 'utf8');

      // Skip as many rows from the input as specified
      const outputRows = output.split('\r\n').slice(Number(outputSkipRows));

      const processedData: any[] = [];

      console.log('sep: ', outputColsSeparator);

      const regexPattern = new RegExp(outputColsSeparator, 'g');

      console.log('regexPattern: ', regexPattern);

      outputRows.forEach((row: string) => {
        console.log('row: ', row);
        const matches = row.match(regexPattern) || [];
        const rowData: any = {};

        outputColumns.forEach(
          (column: { name: string; type: string }, index: number) => {
            if (index >= matches.length) {
              return; // Skip the remaining tokens in the row
            }

            const match = matches[index];
            rowData[column.name] = match.replace(/"/g, '').trim();
          }
        );

        // Check if the rowData object contains any non-empty values
        if (Object.values(rowData).some((value) => value !== '')) {
          processedData.push(rowData);
        }
      });

      console.log('processedData: ', processedData);

      win?.webContents.send('scripts-status', {
        scriptName,
        executionName: executionName,
        startTime,
        endTime: new Date().toLocaleString(),
        isRunning: false,
        output: processedData,
        outputColumns,
      });
      console.log(`script exited with code ${code}`);
    });
  }
);

ipcMain.handle(
  'import-configuration',
  async (event, { archivePath, password }) => {
    // Create a temporary directory for extracting the files
    const tempDir = join(__dirname, 'temp');
    fs.mkdirSync(tempDir);

    try {
      // Extract the encrypted archive
      await fs
        .createReadStream(archivePath)
        .pipe(unzipper.Extract({ path: tempDir }))
        .promise();

      // Get the list of extracted files
      const files = fs.readdirSync(tempDir);

      // Decrypt and move each file to the data folder
      files.forEach((file) => {
        const filePath = join(tempDir, file);

        // Read the encrypted file content
        const encryptedContent = fs.readFileSync(filePath);

        // Decrypt the file content
        const algorithm = 'aes-256-cbc';
        const key = crypto.scryptSync(password, '', 32);
        const iv = encryptedContent.subarray(0, 16); // Extract IV from the encrypted content
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        const decryptedContent = Buffer.concat([
          decipher.update(encryptedContent.subarray(16)),
          decipher.final(),
        ]);

        // Write the decrypted content to the data folder
        const destinationPath = join(
          __dirname,
          '../../src/data',
          path.basename(file)
        );

        // Delete the existing file if it exists
        if (fs.existsSync(destinationPath)) {
          fs.unlinkSync(destinationPath);
        }

        fs.writeFileSync(destinationPath, decryptedContent);

        // Remove the temporary file
        fs.unlinkSync(filePath);
      });

      // Remove the temporary directory
      fs.rmdirSync(tempDir);

      return 'Files imported successfully.';
    } catch (error) {
      // Remove the temporary directory in case of error
      fs.rmdirSync(tempDir);

      return 'Error importing files. Invalid password or invalid archive format.';
    }
  }
);

ipcMain.handle('export-configuration', (event, { password }) => {
  const exportPath = dialog.showSaveDialogSync(win!, {
    title: 'Export configuration',
    defaultPath: 'configuration.zip',
  });

  if (!exportPath) {
    return 'No file selected.';
  }

  const output = fs.createWriteStream(exportPath);

  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.pipe(output);

  const dataFolderPath = join(__dirname, '../../src/data');

  // Read the content of the data folder
  const files = fs.readdirSync(dataFolderPath);

  // Encrypt and add each file to the archive
  files.forEach((file) => {
    if (
      file === 'scripts-status.json' ||
      file === 'scenarios-status.json' ||
      file === 'scenarios.json' ||
      file === 'scripts.json'
    ) {
      // Skip encrypting and adding scripts-status.json
      return;
    }

    const filePath = join(dataFolderPath, file);
    const fileContent = fs.readFileSync(filePath);

    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);

    // Encrypt the file content
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(password, '', 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encryptedContent = Buffer.concat([
      iv, // Add the initialization vector to the encrypted content
      cipher.update(fileContent),
      cipher.final(),
    ]);

    // Add the encrypted file to the archive
    archive.append(encryptedContent, { name: file });
  });

  archive.finalize();

  return 'Files exported successfully.';
});

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
