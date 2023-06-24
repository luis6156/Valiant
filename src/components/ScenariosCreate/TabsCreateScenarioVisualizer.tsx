import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import {
  ScriptVisualizerFormat,
  useImportScript,
} from '@/contexts/ImportScriptContext';
import TabVisualizer from '../ScriptImport/TabVisualizer';
import TabVisualizerScenario from './TabVisualizerScenario';

export interface Tab {
  title: string;
  active: boolean;
}

interface Props {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
}

const TabsImportScriptVisualizer = ({ tabs, setTabs }: Props) => {
  // const { setScriptVisualizers, scriptVisualizers, scriptColumns } =
  //   useImportScript();
  const [canAdd, setCanAdd] = useState<boolean>(true);

  const handleTabClick = (tabId: number) => {
    const updatedTabs = tabs.map((tab, index) => ({
      ...tab,
      active: index === tabId,
    }));
    setTabs(updatedTabs);
  };

  return (
    <>
      <ul className='tabs d-flex'>
        {tabs.map((tab, index) => (
          <li
            key={index}
            onClick={() => handleTabClick(index)}
            className={`tab-item d-flex align-items-center ${
              tab.active ? 'active' : ''
            }`}
          >
            {tab.title}
            {tab.active && tabs.length > 1 && (
              <div
                // onClick={}
                className='ms-2 tab-close-circle d-flex align-items-center justify-content-center'
              >
                <Icon className='tab-close' icon='ic:round-close' />
              </div>
            )}
          </li>
        ))}

        <div className='tab-separator me-2'></div>
        <li
          // onClick={canAdd ? handleAddTab : undefined}
          className={`mt-1 ${
            canAdd ? 'tab-item-add' : 'tab-item-add-disabled'
          } d-flex align-items-center justify-content-center`}
        >
          <Icon width={20} height={20} icon='ic:round-plus' />
        </li>
      </ul>

      <TabVisualizerScenario
        index={tabs.findIndex((tab) => tab.active)}
        setTabs={setTabs}
      />
    </>
  );
};

export default TabsImportScriptVisualizer;
