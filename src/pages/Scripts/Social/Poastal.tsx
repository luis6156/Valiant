import { useEffect, useState } from 'react';

const ipcRenderer = window.ipcRenderer;

const Poastal = () => {
  const [results, setResults] = useState(
    localStorage.getItem('poastalResults') || ''
  );
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    ipcRenderer.send('run-poastal', { email });
  };

  useEffect(() => {
    ipcRenderer.on('poastal-reply', (data) => {
      console.log(data);
      setResults(data);
      setIsLoading(false);
      localStorage.setItem('poastalResults', data); // Save the result to localStorage
    });

    return () => {
      ipcRenderer.removeAllListeners('poastal-reply');
    };
  }, []);

  return (
    <>
      <div>Poastal</div>
      <label htmlFor='email'>Enter Email:</label>
      <input
        type='text'
        id='email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
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

export default Poastal;
