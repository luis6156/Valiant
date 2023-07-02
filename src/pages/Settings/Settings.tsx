import AttentionText from '@/components/AttentionText';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import {
  getBlob,
  getBytes,
  getDownloadURL,
  getStream,
  ref,
  uploadBytes,
} from '@firebase/storage';
import { Icon } from '@iconify/react';
import { set } from 'lodash';
import React, { useRef, useState } from 'react';

const Settings = () => {
  const { userStorageRef } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const { resetPassword } = useAuth();
  const [theme, setTheme] = useState('dark');

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailRef.current) {
      setError('Fields cannot be empty');
      return;
    }

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions');
    } catch (error) {
      console.log(error);
      setError('Failed to reset password');
    }

    setLoading(false);
  }

  const handleChangeTheme = (theme: string) => {
    setTheme(theme);

    ipcRenderer.invoke('change-theme', { theme });

    const root = document.documentElement;
    root.style.setProperty('--background-color', theme === 'dark' ? '#111111' : theme === 'light' ? '#f1f1f1' : '#F4F4F0');
    root.style.setProperty('--primary-color', theme === 'dark' ? '#F74A39' : theme === 'light' ? '#E56B70' : '#3C2A21');
    root.style.setProperty('--secondary-color', theme === 'dark' ? '#F1FAEE' : theme === 'light' ? '#7899D4' : '#D5CEA3');
    root.style.setProperty('--secondary-color-contrast', theme === 'dark' ? '#323232' : theme === 'light' ? '#f8f8f8' : '#f8f8f8');
    root.style.setProperty('--h1-color', theme === 'dark' ? '#f1f1f1' : '#444444');
    root.style.setProperty('--h2-color', theme === 'dark' ? '#bbb' : '#444444');
    root.style.setProperty('--details-color', theme === 'dark' ? '#949494' : '#777777');
    root.style.setProperty('--title-page-color', theme === 'dark' ? '#dadada' : '#444444');
    root.style.setProperty('--primary-color-selected', theme === 'dark' ? '#A5271A' : theme === 'light' ? '#F0BBBD' : '#7D5948');
    root.style.setProperty('--button-color-selected', theme === 'dark' ? '#A5271A' : theme === 'light' ? '#F0BBBD' : '#7D5948');
    root.style.setProperty('--card-color', theme === 'dark' ? '#181818' : theme === 'light' ? '#FFFFFF' : '#FFFFFF');
    root.style.setProperty('--icon-glow-color', theme === 'dark' ? '#f8f8f8' : theme === 'light' ? '#222' : '#222');
    root.style.setProperty('--higher-contrast-color', theme === 'dark' ? '#dadada' : theme === 'light' ? '#333' : '#333');
  };

  return (
    <>
      <div className='mt-3 mb-3'>
        <Header
          title='Settings'
          subtitle='Customize your experience with the app'
        />
      </div>
      <p className='settings-title mb-4'>Sync files with Google Cloud</p>
      <div className='d-flex align-items-center'>
        <button className='btn btn-primary me-3' onClick={handleUploadClick}>
          <Icon
            className='me-1'
            width={20}
            height={20}
            icon='material-symbols:upload'
          />
          Upload files to Cloud
        </button>
        <p className='me-3'>or</p>
        <button className='btn btn-primary' onClick={handleDownloadClick}>
          <Icon
            className='me-1'
            width={20}
            height={20}
            icon='material-symbols:download'
          />
          Download files from Cloud
        </button>
      </div>
      <p className='settings-title mt-4'>Change Account Password</p>
      <form className='mt-3' onSubmit={handleSubmit}>
        <div className='mb-3'>
          <FloatingLabelInput
            required={true}
            ref={emailRef}
            name='email'
            type='email'
            label='Email Address'
          />
        </div>
        <div className='mb-3'>
          <FloatingLabelInput
            required={true}
            ref={passwordRef}
            name='password'
            type='password'
            label='New Password'
            isPassword={true}
          />
        </div>
        <div className='mb-3'>
          <FloatingLabelInput
            required={true}
            ref={confirmPasswordRef}
            name='confirmPassword'
            type='password'
            label='Confirm New Password'
            isPassword={true}
          />
        </div>
        <button
          className='btn btn-primary me-4'
          disabled={loading}
          type='submit'
        >
          Change Password
        </button>
      </form>
      <p className='settings-title mt-4 mb-2'>Delete Account</p>
      <AttentionText danger='This action cannot be undone.' text='' />
      <form className='mt-3' onSubmit={handleSubmit}>
        <div className='mb-3'>
          <FloatingLabelInput
            required={true}
            ref={emailRef}
            name='email'
            type='email'
            label='Email Address'
          />
        </div>
        <div className='mb-3'>
          <FloatingLabelInput
            required={true}
            ref={passwordRef}
            name='password'
            type='password'
            label='Password'
            isPassword={true}
          />
        </div>
        <button
          className='btn btn-secondary me-4'
          disabled={loading}
          type='submit'
        >
          Delete Account
        </button>
      </form>
      {error && (
        <div className='mt-3'>
          <AttentionText text='' danger={error} />
        </div>
      )}
      {message && (
        <div className='mt-3'>
          <AttentionText text={message} />
        </div>
      )}
      <p className='settings-title mt-4 mb-3'>Dashboard Theme</p>
      <div className='d-flex'>
        <div
          className={`circle-dark ${theme === 'dark' && 'circle-selected'}`}
          onClick={() => handleChangeTheme('dark')}
        ></div>
        <div
          className={`circle-light ${theme === 'light' && 'circle-selected'}`}
          onClick={() => handleChangeTheme('light')}
        ></div>
        <div
          className={`circle-alternate ${theme === 'alternate' && 'circle-selected'}`}
          onClick={() => handleChangeTheme('alternate')}
        ></div>
      </div>
    </>
  );
};

export default Settings;
