import { ScriptVisualizerFormat } from '@/contexts/ImportScriptContext';
import { useEffect, useState } from 'react';

export type ScriptStatus = {
  executionName: string;
  scriptName: string;
  startTime: string;
  endTime: string;
  status: string;
  output: any[];
  outputColumns: { name: string; type: string }[];
  visualizers: ScriptVisualizerFormat[];
};

const FILENAME = 'scripts-status.json';
const ipcRenderer = window.ipcRenderer;

const useScriptsStatusListener = () => {
  const [data, setData] = useState<ScriptStatus[]>([]);

  useEffect(() => {
    const handleScriptStatusUpdate = async (scriptData: any) => {
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

    ipcRenderer.on('scripts-status', handleScriptStatusUpdate);

    return () => {
      ipcRenderer.removeListener('scripts-status', handleScriptStatusUpdate);
    };
  }, []);

  return data;
};

export default useScriptsStatusListener;
