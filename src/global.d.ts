interface Window {
  envVars: {
    licenseKey: string;
  };
  ipcRenderer: {
    send: (channel: string, data: any) => void;
    on: (channel: string, callback: (data: any) => void) => void;
    removeAllListeners: (channel: string) => void;
  };
}

declare module '*.jpg' {
  const value: any;
  export = value;
}
