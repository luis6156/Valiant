import React, { useState, useContext } from 'react';

export type ScenarioFlagFormat = {
  flag: string;
  name: string;
  description: string;
  type: 'flag' | 'checkbox' | 'argument';
  required: boolean;
};

export type ScenarioColumnFormat = {
  name: string;
  type: 'string' | 'number';
};

export type ScenarioVisualizerFormat = {
  type: string;
  labelXColumn: string;
  labelYColumn: string;
  labelZColumn: string;
};

export type ScenarioOutputFormat = {
  type: string;
  name: string;
};

export type ScenarioInputFormat = {
  scenarioName: string;
  scenarioDescription: string;
  scenarioInputTags: string[];
  scenarioOutputTags: string[];
  scenarioSpeed: string;
  scenarioSuccessRate: string;

  scriptPath: string;
  scriptFlags: ScenarioFlagFormat[];
  scriptColumns: ScenarioColumnFormat[];
  scriptExecutable: string;
  scriptOutputSkipRows: string;
  scriptOutputColsSeparator: string;
  scriptVisualizers: ScenarioVisualizerFormat[];
  scriptOutputFormat: ScenarioOutputFormat;
};

interface CreateScenarioContextProps {
  scenarioName: string;
  setScenarioName: React.Dispatch<React.SetStateAction<string>>;
  scenarioDescription: string;
  setScenarioDescription: React.Dispatch<React.SetStateAction<string>>;
  scenarioInputTags: string[];
  setScenarioInputTags: React.Dispatch<React.SetStateAction<string[]>>;
  scenarioOutputTags: string[];
  setScenarioOutputTags: React.Dispatch<React.SetStateAction<string[]>>;
  scenarioSpeed: string;
  setScenarioSpeed: React.Dispatch<React.SetStateAction<string>>;
  scenarioSuccessRate: string;
  setScenarioSuccessRate: React.Dispatch<React.SetStateAction<string>>;
  
  scriptPath: string;
  setScriptPath: React.Dispatch<React.SetStateAction<string>>;
  scriptFlags: ScenarioFlagFormat[];
  setScriptFlags: React.Dispatch<React.SetStateAction<ScenarioFlagFormat[]>>;
  scriptColumns: ScenarioColumnFormat[];
  setScriptColumns: React.Dispatch<React.SetStateAction<ScenarioColumnFormat[]>>;
  scriptExecutable: string;
  setScriptExecutable: React.Dispatch<React.SetStateAction<string>>;
  scriptOutputSkipRows: string;
  setScriptOutputSkipRows: React.Dispatch<React.SetStateAction<string>>;
  scriptOutputColsSeparator: string;
  setScriptOutputColsSeparator: React.Dispatch<React.SetStateAction<string>>;
  scriptVisualizers: ScenarioVisualizerFormat[];
  setScriptVisualizers: React.Dispatch<
    React.SetStateAction<ScenarioVisualizerFormat[]>
  >;
  scriptOutputFormat: ScenarioOutputFormat;
  setScriptOutputFormat: React.Dispatch<
    React.SetStateAction<ScenarioOutputFormat>
  >;
}

const CreateScenarioContext = React.createContext<CreateScenarioContextProps>(
  {} as CreateScenarioContextProps
);

export function useCreateScenario() {
  return useContext(CreateScenarioContext);
}

const CreateScenarioProvider = ({ children }: any) => {
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [scenarioInputTags, setScenarioInputTags] = useState<string[]>([]);
  const [scenarioOutputTags, setScenarioOutputTags] = useState<string[]>([]);
  const [scenarioSpeed, setScenarioSpeed] = useState('');
  const [scenarioSuccessRate, setScenarioSuccessRate] = useState('');
  const [scriptPath, setScriptPath] = useState('');
  const [scriptFlags, setScriptFlags] = useState<ScenarioFlagFormat[]>([
    {
      flag: '',
      name: '',
      description: '',
      type: 'flag',
      required: false,
    },
  ]);
  const [scriptColumns, setScriptColumns] = useState<ScenarioColumnFormat[]>([
    {
      name: '',
      type: 'string',
    },
  ]);
  const [scriptExecutable, setScriptExecutable] = useState('');
  const [scriptOutputSkipRows, setScriptOutputSkipRows] = useState('0');
  const [scriptOutputColsSeparator, setScriptOutputColsSeparator] =
    useState('');
  const [scriptVisualizers, setScriptVisualizers] = useState<
  ScenarioVisualizerFormat[]
  >([
    {
      type: '',
      labelXColumn: '',
      labelYColumn: '',
      labelZColumn: '',
    },
  ]);
  const [scriptOutputFormat, setScriptOutputFormat] =
    useState<ScenarioOutputFormat>({
      type: 'stdout',
      name: '',
    });

  const value = {
    scenarioName,
    setScenarioName,
    scenarioDescription,
    setScenarioDescription,
    scenarioInputTags,
    setScenarioInputTags,
    scenarioOutputTags,
    setScenarioOutputTags,
    scenarioSpeed,
    setScenarioSpeed,
    scenarioSuccessRate,
    setScenarioSuccessRate,
    
    scriptPath,
    setScriptPath,
    scriptFlags,
    setScriptFlags,
    scriptColumns,
    setScriptColumns,
    scriptExecutable,
    setScriptExecutable,
    scriptOutputSkipRows,
    setScriptOutputSkipRows,
    scriptOutputColsSeparator,
    setScriptOutputColsSeparator,
    scriptVisualizers,
    setScriptVisualizers,
    scriptOutputFormat,
    setScriptOutputFormat,
  };

  return (
    <CreateScenarioContext.Provider value={value}>
      {children}
    </CreateScenarioContext.Provider>
  );
};

export default CreateScenarioProvider;
