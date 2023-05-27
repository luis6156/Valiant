import React from 'react';
import ReactDOM from 'react-dom/client';
import 'tailwindcss/tailwind.css';

import './index.css';
import App from './App';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
const licenseKey = window.envVars.licenseKey;

if (licenseKey) {
  registerLicense(licenseKey);
} else {
  // Handle the case when the license key is not defined
  console.error('License key is not defined');
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
