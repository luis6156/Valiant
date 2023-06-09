interface Window {
  envVars: {
    licenseKey: string;
  };
  ipcRenderer: {
    send: (channel: string, data: any) => void;
    on: (channel: string, callback: (data: any) => void) => void;
    removeAllListeners: (channel: string) => void;
  };
  shell: {
    openExternal: (url: string) => void;
  };
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
