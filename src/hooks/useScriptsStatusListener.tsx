import { useEffect, useState } from 'react';

export type ScriptStatus = {
  executionName: string;
  scriptName: string;
  startTime: string;
  endTime: string;
  status: string;
};

const ipcRenderer = window.ipcRenderer;

const useScriptsStatusListener = () => {
  const [data, setData] = useState<ScriptStatus[]>([]);

  useEffect(() => {
    const handleScriptStatusUpdate = (scriptData: any) => {
      setData((prevData) => {
        const existingScript = prevData.find(
          (item) => item.startTime === scriptData.startTime
        );

        if (existingScript) {
          return prevData.map((item) => {
            if (item.startTime === scriptData.startTime) {
              return {
                ...item,
                status: scriptData.isRunning ? 'Running' : 'Completed',
                endTime: scriptData.endTime,
              };
            }
            return item;
          });
        } else {
          return [
            ...prevData,
            {
              executionName: scriptData.executionName,
              scriptName: scriptData.scriptName,
              startTime: scriptData.startTime,
              endTime: scriptData.endTime,
              status: scriptData.isRunning ? 'Running' : 'Completed',
            },
          ];
        }
      });
    };

    ipcRenderer.on('scripts-status', handleScriptStatusUpdate);

    return () => {
      ipcRenderer.removeListener('scripts-status', handleScriptStatusUpdate);
    };
  }, []);

  return data;
};

export default useScriptsStatusListener;
