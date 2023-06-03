import { useEffect, useState } from 'react';

const ipcRenderer = window.ipcRenderer;

const GitStalk = () => {
  const [results, setResults] = useState(
    localStorage.getItem('gitStalkResults') || ''
  );
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    ipcRenderer.send('run-gitstalk', { username });
  };

  useEffect(() => {
    ipcRenderer.on('gitstalk-reply', (data) => {
      console.log(data);
      setResults(data);
      setIsLoading(false);
      localStorage.setItem('gitStalkResults', data); // Save the result to localStorage
    });

    return () => {
      ipcRenderer.removeAllListeners('gitstalk-reply');
    };
  }, []);

  return (
    <>
      <div>GitStalk</div>
      <label htmlFor='username'>Enter Username:</label>
      <input
        type='text'
        id='username'
        value={username}
        onChange={(event) => setUsername(event.target.value)}
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

export default GitStalk;
