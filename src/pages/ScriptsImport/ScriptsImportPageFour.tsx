import { ChangeEvent, useEffect, useState } from 'react';
import AttentionText from '@/components/AttentionText';
import TabsImportScriptVisualizer from '@/components/importScript/TabsImportScriptVisualizer';
import { Tab } from '@/components/importScript/TabsImportScriptVisualizer';
import { useImportScript } from '@/contexts/ImportScriptContext';

const ScriptsImportPageFour = () => {
  const [showFlags, setShowFlags] = useState(false);
  const [showFilename, setShowFilename] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([{ title: 'Default', active: true }]);
  const { setScriptOutputFormat, scriptFlags } = useImportScript();

  const handleOutputTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    if (selectedValue === 'file') {
      setShowFlags(false);
      setShowFilename(true);

      setScriptOutputFormat({ type: 'file', name: '' });
    } else if (selectedValue === 'output-flag') {
      setShowFilename(false);
      setShowFlags(true);

      setScriptOutputFormat({ type: 'output-flag', name: '' });
    } else {
      setShowFilename(false);
      setShowFlags(false);

      setScriptOutputFormat({ type: 'stdout', name: '' });
    }
  };

  const handleOutputNameFlagChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;

    setScriptOutputFormat({ type: 'output-flag', name: selectedValue });
  };

  const handleOutputNameFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setScriptOutputFormat({ type: 'file', name: value });
  };

  return (
    <>
      <p className='import-steps-title mb-1'>Teach us what to show</p>
      <p className='import-steps-p mb-3'>
        Choose the data visualizer according to the script output data
      </p>
      <div className='mb-1 d-flex'>
        <div className='output-select-container'>
          <div className='mb-1'>
            <p className='ps-1'>Output Type</p>
          </div>
        </div>
        {showFilename ? (
          <div className='w-100'>
            <div className='ms-3 mb-1'>
              <p className='ps-1'>Filename</p>
            </div>
          </div>
        ) : showFlags ? (
          <div className='w-100'>
            <div className='ms-3 mb-1'>
              <p className='ps-1'>Flag</p>
            </div>
          </div>
        ) : null}
      </div>
      <div className='mb-3 d-flex justify-content-between'>
        <div className='output-select-container'>
          <select
            defaultValue='stdout'
            className='form-select form-select-special'
            onChange={handleOutputTypeChange}
          >
            <option value='stdout'>stdout</option>
            <option value='file'>File</option>
            {scriptFlags.length > 0 &&
              scriptFlags.some(
                (flag) => flag.type === 'flag' || flag.type === 'argument'
              ) && <option value='output-flag'>Output Flag</option>}
          </select>
        </div>
        {showFilename ? (
          <div className='ps-3 w-100'>
            <input
              placeholder='Filename'
              type='text'
              className='form-control form-control-special me-2'
              onInput={handleOutputNameFileChange}
            />
          </div>
        ) : showFlags ? (
          <div className='ps-3 w-100'>
            <select
              defaultValue={
                scriptFlags.find(
                  (flag) => flag.type === 'argument' || flag.type === 'flag'
                )?.name
              }
              className='form-select form-select-special'
              aria-label='default'
              onChange={handleOutputNameFlagChange}
            >
              {scriptFlags &&
                scriptFlags
                  .filter(
                    (flag) => flag.type === 'argument' || flag.type === 'flag'
                  )
                  .map((flag, index) => (
                    <option key={index} value={flag.name}>
                      {flag.name}
                    </option>
                  ))}
            </select>
          </div>
        ) : null}
      </div>
      <div className='mb-4'>
        <AttentionText text='Output type and name are required as the visualizer needs to extract the data from a file type. Filename should be found in the exact location as the script. If output flag is available it will be automatically set as required.' />
      </div>

      <div className=''>
        <TabsImportScriptVisualizer tabs={tabs} setTabs={setTabs} />
      </div>
    </>
  );
};

export default ScriptsImportPageFour;
