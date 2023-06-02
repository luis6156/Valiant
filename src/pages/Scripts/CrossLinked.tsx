import React, { useEffect, useState } from 'react';

const ipcRenderer = window.ipcRenderer;

const CrossLinked = () => {
  const [results, setResults] = useState('');
  const [emailFormat, setEmailFormat] = useState('');
  const [domain, setDomain] = useState('');

  const handleClick = () => {
    ipcRenderer.send('run-cross-linked', { emailFormat, domain });
  };

  useEffect(() => {
    ipcRenderer.on('cross-linked-reply', (data) => {
      console.log(data);
      setResults(data);
    });

    return () => {
      ipcRenderer.removeAllListeners('cross-linked-reply');
    };
  }, []);

  return (
    <>
      <div>CrossLinked</div>
      <label htmlFor='email-regex'>Enter Email Format:</label>
      <input
        type='text'
        id='email-regex'
        value={emailFormat}
        onChange={(event) => setEmailFormat(event.target.value)}
        required
      />
      <label htmlFor='domain'>Enter Domain</label>
      <input
        type='text'
        id='domain'
        value={domain}
        onChange={(event) => setDomain(event.target.value)}
        required
      />
      <button
        type='button'
        className='text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white'
        style={{ background: 'blue', borderRadius: '50%' }}
        onClick={handleClick}
      >
        Run
      </button>
      <div>
        <h2>Results:</h2>
        <div>{results}</div>
      </div>
    </>
  );
};

export default CrossLinked;
