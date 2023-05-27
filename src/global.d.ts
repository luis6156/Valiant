interface Window {
  envVars: {
    licenseKey: string;
  };
}

declare module '*.jpg' {
  const value: any;
  export = value;
}
