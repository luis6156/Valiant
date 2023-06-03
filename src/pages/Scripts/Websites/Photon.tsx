import { useEffect, useState } from 'react';

const ipcRenderer = window.ipcRenderer;

const Photon = () => {
  const [results, setResults] = useState(
    localStorage.getItem('photonResults') || ''
  );
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    ipcRenderer.send('run-photon', { url });
  };

  useEffect(() => {
    ipcRenderer.on('photon-reply', (data) => {
      console.log(data);
      setResults(data);
      setIsLoading(false);
      localStorage.setItem('photonResults', data); // Save the result to localStorage
    });

    return () => {
      ipcRenderer.removeAllListeners('photon-reply');
    };
  }, []);

  return (
    <>
      <div>Photon</div>
      <label htmlFor='url'>Enter URL:</label>
      <input
        type='text'
        id='url'
        value={url}
        onChange={(event) => setUrl(event.target.value)}
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

export default Photon;
