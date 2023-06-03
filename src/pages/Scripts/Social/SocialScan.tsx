import { useEffect, useState } from 'react';

const ipcRenderer = window.ipcRenderer;

const SocialScan = () => {
  const [results, setResults] = useState(
    localStorage.getItem('socialScanResults') || ''
  );
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    ipcRenderer.send('run-socialscan', { user });
  };

  useEffect(() => {
    ipcRenderer.on('socialscan-reply', (data) => {
      console.log(data);
      setResults(data);
      setIsLoading(false);
      localStorage.setItem('socialScanResults', data); // Save the result to localStorage
    });

    return () => {
      ipcRenderer.removeAllListeners('socialscan-reply');
    };
  }, []);

  return (
    <>
      <div>SocialScan</div>
      <label htmlFor='email-or-username'>Enter Email or Username:</label>
      <input
        type='text'
        id='email-or-username'
        value={user}
        onChange={(event) => setUser(event.target.value)}
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
        {isLoading ? <div>Loading...</div> : <div>{results}</div>}
      </div>
    </>
  );
};

export default SocialScan;
