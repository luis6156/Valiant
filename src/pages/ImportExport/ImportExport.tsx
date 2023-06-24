import AttentionText from '@/components/AttentionText';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import Header from '@/components/Header';
import React, { useRef, useState } from 'react';

const ImportExport = () => {
  const [actionType, setActionType] = React.useState<
    'import' | 'export' | 'default'
  >('default');
  const [error, setError] = useState<string | null>(null);
  const archivePathRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    setActionMessage(null);

    if (actionType !== 'default') {
      if (
        actionType === 'import' &&
        archivePathRef.current?.files?.[0]?.path &&
        passwordRef.current?.value
      ) {
        setError(null);

        ipcRenderer
          .invoke('import-configuration', {
            archivePath: archivePathRef.current?.files?.[0]?.path,
            password: passwordRef.current.value,
          })
          .then((result) => {
            setActionMessage(result);
          })
          .catch((err) => {
            setError(err);
          });
      } else if (actionType === 'export' && passwordRef.current?.value) {
        setError(null);

        ipcRenderer
          .invoke('export-configuration', {
            password: passwordRef.current.value,
          })
          .then((result) => {
            setActionMessage(result);
          })
          .catch((err) => {
            setError(err);
          });
      } else {
        setError('Please fill all inputs.');
      }
    } else {
      setError('Please select an action type.');
    }
  };

  const handleActionTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setActionType(selectedValue as 'import' | 'export' | 'default');
  };

  return (
    <>
      <div className='mt-3 mb-3'>
        <Header
          title='Import or Export'
          subtitle='Share your configurations with other users'
        />
      </div>
      <div>
        <h5 className='mb-3'>Import/Export Form</h5>
        <div className='mb-3'>
          <select
            value={actionType}
            onChange={handleActionTypeChange}
            className='form-select'
            aria-label='Default select example'
          >
            <option disabled value='default'>
              Import or Export Configuration Files
            </option>
            <option value='import'>Import</option>
            <option value='export'>Export</option>
          </select>
        </div>
        {actionType === 'import' || actionType === 'default' ? (
          <div className='input-group'>
            <label className='input-group-text' htmlFor='archive-location'>
              Archive Path
            </label>
            <input
              required={true}
              type='file'
              className='form-control'
              id='archive-location'
              ref={archivePathRef}
            />
          </div>
        ) : (
          <AttentionText text='A file explorer window will open to select the name and the path of the archive on submit.' />
        )}
        <div className='mt-3'>
          <FloatingLabelInput
            label='Archive password'
            required={true}
            type='password'
            name='archive-password'
            ref={passwordRef}
            isPassword={true}
            helpText='Password used to encrypt the archive.'
          />
        </div>
        <button
          onClick={handleSubmit}
          className={`${
            actionType === 'default' ? 'disabled' : ''
          } btn btn-primary mt-3`}
        >
          Submit Configuration Files
        </button>
        {error && (
          <div className='mt-3'>
            <AttentionText text='' danger={error} />
          </div>
        )}
        {actionMessage && (
          <div className='mt-3'>
            <AttentionText text={actionMessage} />
          </div>
        )}
      </div>
    </>
  );
};

export default ImportExport;
