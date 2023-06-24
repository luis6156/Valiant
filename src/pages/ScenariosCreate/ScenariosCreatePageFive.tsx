import { ChangeEvent, useEffect, useState } from 'react';
import AttentionText from '@/components/AttentionText';
import TabsImportScriptVisualizer from '@/components/ScriptImport/TabsImportScriptVisualizer';
import { Tab } from '@/components/ScriptImport/TabsImportScriptVisualizer';
import { useImportScript } from '@/contexts/ImportScriptContext';
import TabsCreateScenarioVisualizer from '@/components/ScenariosCreate/TabsCreateScenarioVisualizer';

const ScenariosCreatePageFive = () => {
  const [showFlags, setShowFlags] = useState(false);
  // const [showFilename, setShowFilename] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([{ title: 'Default', active: true }]);
  // const { setScriptOutputFormat, scriptFlags } = useImportScript();

  // const handleOutputTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
  //   const selectedValue = event.target.value;

  //   if (selectedValue === 'file') {
  //     setShowFlags(false);
  //     setShowFilename(true);

  //     setScriptOutputFormat({ type: 'file', name: '' });
  //   } else if (selectedValue === 'output-flag') {
  //     setShowFilename(false);
  //     setShowFlags(true);

  //     setScriptOutputFormat({ type: 'output-flag', name: '' });
  //   } else {
  //     setShowFilename(false);
  //     setShowFlags(false);

  //     setScriptOutputFormat({ type: 'stdout', name: '' });
  //   }
  // };

  // const handleOutputNameFlagChange = (
  //   event: ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const selectedValue = event.target.value;

  //   setScriptOutputFormat({ type: 'output-flag', name: selectedValue });
  // };

  // const handleOutputNameFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;

  //   setScriptOutputFormat({ type: 'file', name: value });
  // };

  return (
    <>
      <p className='import-steps-title mb-1'>Teach us what to show</p>
      <p className='import-steps-p mb-3'>
        Choose the data visualizer according to the scenario output data
      </p>

      <div className=''>
        <TabsCreateScenarioVisualizer tabs={tabs} setTabs={setTabs} />
      </div>
    </>
  );
};

export default ScenariosCreatePageFive;
