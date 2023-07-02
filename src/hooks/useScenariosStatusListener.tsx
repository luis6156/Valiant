import { useEffect, useState } from 'react';
import { ScriptStatus } from './useScriptsStatusListener';

const FILENAME = 'scenarios-status.json';
const ipcRenderer = window.ipcRenderer;

const useScenariosStatusListener = () => {
  const [data, setData] = useState<ScriptStatus[]>([]);

  useEffect(() => {
    const handleScenariosStatusUpdate = async (scriptData: any) => {
      setData((prevData) => {
        const existingScript = prevData.find(
          (item) => item.startTime === scriptData.startTime
        );

        if (existingScript) {
          const updatedData = prevData.map((item) => {
            if (item.startTime === scriptData.startTime) {
              return {
                ...item,
                status: scriptData.isRunning ? 'Running' : 'Completed',
                endTime: scriptData.endTime,
                output: scriptData.output,
                outputColumns: scriptData.outputColumns,
              };
            }
            return item;
          });

          if (!scriptData.isRunning) {
            writeDataToFile(JSON.stringify(updatedData));
          }

          return updatedData;
        } else {
          return [
            ...prevData,
            {
              executionName: scriptData.executionName,
              scriptName: scriptData.scriptName,
              startTime: scriptData.startTime,
              endTime: scriptData.endTime,
              status: scriptData.isRunning ? 'Running' : 'Completed',
              output: scriptData.output,
              outputColumns: scriptData.outputColumns,
              visualizers: scriptData.visualizers,
            },
          ];
        }
      });
    };

    const writeDataToFile = async (data: string) => {
      await ipcRenderer.invoke('fs-writefile-sync', {
        data,
        fileName: FILENAME,
      });
    };

    const loadDataFromFile = async () => {
      const existsFile = await ipcRenderer.invoke('fs-exists-sync', {
        fileName: FILENAME,
      });
      if (existsFile) {
        const fileContent = await ipcRenderer.invoke('fs-readfile-sync', {
          fileName: FILENAME,
        });
        const parsedData = JSON.parse(fileContent);
        setData(parsedData);
      }
    };

    loadDataFromFile();

    ipcRenderer.on('scenario-status', handleScenariosStatusUpdate);

    return () => {
      ipcRenderer.removeListener(
        'scenario-status',
        handleScenariosStatusUpdate
      );
    };
  }, []);

  return data;
};

export default useScenariosStatusListener;
