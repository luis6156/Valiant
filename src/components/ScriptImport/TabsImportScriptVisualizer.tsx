import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import {
  ScriptVisualizerFormat,
  useImportScript,
} from '@/contexts/ImportScriptContext';
import TabVisualizer from './TabVisualizer';

export interface Tab {
  title: string;
  active: boolean;
}

interface Props {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
}

const TabsImportScriptVisualizer = ({ tabs, setTabs }: Props) => {
  const { setScriptVisualizers, scriptVisualizers, scriptColumns } =
    useImportScript();
  const [canAdd, setCanAdd] = useState<boolean>(scriptColumns.length > 1);

  const handleTabClick = (tabId: number) => {
    const updatedTabs = tabs.map((tab, index) => ({
      ...tab,
      active: index === tabId,
    }));
    setTabs(updatedTabs);
  };

  useEffect(() => {
    setScriptVisualizers(() => {
      const updatedVisualizers = [
        {
          type: '',
          labelXColumn: scriptColumns[0]?.name,
          labelYColumn: scriptColumns[1]?.name,
          labelZColumn: scriptColumns[2]?.name,
        },
      ];

      return updatedVisualizers;
    });
  }, []);

  const handleAddTab = () => {
    if (tabs.length < 5) {
      if (tabs.length === 4) {
        setCanAdd(false);
      }

      let updatedTabs = tabs.map((tab) => ({ ...tab, active: false }));

      updatedTabs = [...updatedTabs, { title: 'None', active: true }];
      setTabs(updatedTabs);

      setScriptVisualizers((prev) => {
        const updatedVisualizers = [
          ...prev,
          {
            type: '',
            labelXColumn: scriptColumns[0]?.name,
            labelYColumn: scriptColumns[1]?.name,
            labelZColumn: scriptColumns[2]?.name,
          } as ScriptVisualizerFormat,
        ];

        return updatedVisualizers;
      });
    }
  };

  const handleRemoveTab = (tabId: number) => {
    if (tabs.length > 1) {
      let updatedTabs = [];

      setCanAdd(true);

      if (tabId === 0) {
        updatedTabs = tabs.map((tab, index) => ({
          ...tab,
          active: index === 1,
        }));
      } else {
        updatedTabs = tabs.map((tab, index) => ({
          ...tab,
          active: index === tabId - 1,
        }));
      }

      updatedTabs = updatedTabs.filter((_, index) => index !== tabId);
      setTabs(updatedTabs);

      const updatedScriptsVisualizers = scriptVisualizers.filter(
        (_, index) => index !== tabId
      );
      setScriptVisualizers(updatedScriptsVisualizers);
    }
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTab(index);
                }}
                className='ms-2 tab-close-circle d-flex align-items-center justify-content-center'
              >
                <Icon className='tab-close' icon='ic:round-close' />
              </div>
            )}
          </li>
        ))}

        <div className='tab-separator me-2'></div>
        <li
          onClick={canAdd ? handleAddTab : undefined}
          className={`mt-1 ${
            canAdd ? 'tab-item-add' : 'tab-item-add-disabled'
          } d-flex align-items-center justify-content-center`}
        >
          <Icon width={20} height={20} icon='ic:round-plus' />
        </li>
      </ul>

      <TabVisualizer
        index={tabs.findIndex((tab) => tab.active)}
        setTabs={setTabs}
      />
    </>
  );
};

export default TabsImportScriptVisualizer;
