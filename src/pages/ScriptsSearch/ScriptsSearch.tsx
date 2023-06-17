import AttentionText from '@/components/AttentionText';
import Header from '@/components/Header';
import { ScriptInputFormat } from '@/contexts/ImportScriptContext';
import { useEffect, useState } from 'react';

import '../../styles/SearchScripts/searchScripts.scss';
import ScriptCard from '@/components/ScriptSearch/ScriptCard';

const FILENAME = 'scripts.json';
const FILENAME_CUSTOM = 'scripts_custom.json';

const ScriptsSearch = () => {
  const [showCustomScripts, setShowCustomScripts] = useState<boolean>(false);
  const [numCardsToShow, setNumCardsToShow] = useState(getNumCardsToShow());
  const [error, setError] = useState('');
  const [scripts, setScripts] = useState<ScriptInputFormat[]>([]);

  useEffect(() => {
    const getScripts = async () => {
      setError('');
      setScripts([]);

      const existsFile = await ipcRenderer.invoke('fs-exists-sync', {
        fileName: showCustomScripts ? FILENAME_CUSTOM : FILENAME,
      });

      if (!existsFile) {
        setError('File not found, please import scripts first.');
        return;
      }

      const scriptsJson = await ipcRenderer.invoke('fs-readfile-sync', {
        fileName: showCustomScripts ? FILENAME_CUSTOM : FILENAME,
      });

      const scriptsParsed: ScriptInputFormat[] = JSON.parse(scriptsJson);

      setScripts(scriptsParsed);
    };

    getScripts();
  }, [showCustomScripts]);

  useEffect(() => {
    const handleResize = () => {
      setNumCardsToShow(getNumCardsToShow());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onClickShowCustomScripts = () => {
    setShowCustomScripts(true);
  };

  const onClickShowNormalScripts = () => {
    setShowCustomScripts(false);
  };

  function getNumCardsToShow() {
    if (window.innerWidth < 900) {
      return 2;
    } else if (window.innerWidth < 1200) {
      return 3;
    } else if (window.innerWidth < 1400) {
      return 4;
    } else if (window.innerWidth < 1700) {
      return 5;
    } else {
      return 6;
    }
  }

  return (
    <>
      <div className='mt-3 mb-3'>
        <Header
          title='Explore Scripts'
          subtitle='Explore the best scripts for OSINT assessment'
        />
      </div>
      <div className='d-flex mb-3'>
        <div
          className={`${
            showCustomScripts
              ? 'script-page-select-normal'
              : 'script-page-select'
          } me-3 d-flex align-items-center justify-content-center`}
          onClick={onClickShowNormalScripts}
        >
          Our Choice
        </div>
        <div
          className={`${
            showCustomScripts
              ? 'script-page-select'
              : 'script-page-select-normal'
          } align-items-center justify-content-center`}
          onClick={onClickShowCustomScripts}
        >
          Custom Scripts
        </div>
      </div>
      {error && <AttentionText text='' danger={error} />}
      <div className='row w-100'>
        {scripts.map((script, index) => (
          <div
            key={index}
            className={`mb-3
            col-md-${
              numCardsToShow === 6
                ? '2'
                : numCardsToShow === 5
                ? '2-dot-4'
                : numCardsToShow === 4
                ? '3'
                : numCardsToShow === 3
                ? '4'
                : '6'
            }
            `}
          >
            <ScriptCard
              url={script.scriptPage}
              name={script.scriptName}
              description={script.scriptDescription}
              inputTags={script.scriptInputTags}
              outputTags={script.scriptOutputTags}
              speed={script.scriptSpeed}
              successRate={script.scriptSuccessRate}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ScriptsSearch;