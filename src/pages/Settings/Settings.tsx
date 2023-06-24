import { useAuth } from '@/contexts/AuthContext';
import {
  getBlob,
  getBytes,
  getDownloadURL,
  getStream,
  ref,
  uploadBytes,
} from '@firebase/storage';
import React, { useState } from 'react';

const Settings = () => {
  const { userStorageRef } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUploadClick = async () => {
    const file = await ipcRenderer.invoke('get-sync-files', {});

    uploadBytes(userStorageRef!, file)
      .then(() => {
        setMessage('Uploaded files to the cloud bucket.');
      })
      .catch((error) => {
        console.log(error);
        setError('An error occurred while uploading the file.');
      });
  };

  const handleDownloadClick = async () => {
    const url = await getDownloadURL(userStorageRef!);

    ipcRenderer
      .invoke('update-sync-files', { url })
      .then((result) => {
        setMessage(result);
      })
      .catch((error) => {
        console.log(error);
        setError('An error occurred while downloading the file.');
      });
  };

  return (
    <>
      <div>Settings</div>
      <button onClick={handleUploadClick}>Upload</button>
      <button onClick={handleDownloadClick}>Download</button>
      <p>{message}</p>
    </>
  );
};

export default Settings;
