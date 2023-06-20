import React, { useState, useContext } from 'react';

export type ScriptFlagFormat = {
  flag: string;
  name: string;
  description: string;
  type: 'flag' | 'checkbox' | 'argument';
  required: boolean;
};

export type ScriptColumnFormat = {
  name: string;
  type: 'string' | 'number';
};

export type ScriptVisualizerFormat = {
  type: string;
  labelXColumn: string;
  labelYColumn: string;
  labelZColumn: string;
};

export type ScriptOutputFormat = {
  type: string;
  name: string;
};

export type ScriptInputFormat = {
  scriptPage: string;
  scriptName: string;
  scriptDescription: string;
  scriptInputTags: string[];
  scriptOutputTags: string[];
  scriptSpeed: string;
  scriptSuccessRate: string;
  scriptPath: string;
  scriptFlags: ScriptFlagFormat[];
  scriptColumns: ScriptColumnFormat[];
  scriptExecutable: string;
  scriptOutputColsSeparator: string;
  scriptVisualizers: ScriptVisualizerFormat[];
  scriptOutputFormat: ScriptOutputFormat;
};

interface ImportScriptContextProps {
  scriptPage: string;
  setScriptPage: React.Dispatch<React.SetStateAction<string>>;
  scriptName: string;
  setScriptName: React.Dispatch<React.SetStateAction<string>>;
  scriptDescription: string;
  setScriptDescription: React.Dispatch<React.SetStateAction<string>>;
  scriptInputTags: string[];
  setScriptInputTags: React.Dispatch<React.SetStateAction<string[]>>;
  scriptOutputTags: string[];
  setScriptOutputTags: React.Dispatch<React.SetStateAction<string[]>>;
  scriptSpeed: string;
  setScriptSpeed: React.Dispatch<React.SetStateAction<string>>;
  scriptSuccessRate: string;
  setScriptSuccessRate: React.Dispatch<React.SetStateAction<string>>;
  scriptPath: string;
  setScriptPath: React.Dispatch<React.SetStateAction<string>>;
  scriptFlags: ScriptFlagFormat[];
  setScriptFlags: React.Dispatch<React.SetStateAction<ScriptFlagFormat[]>>;
  scriptColumns: ScriptColumnFormat[];
  setScriptColumns: React.Dispatch<React.SetStateAction<ScriptColumnFormat[]>>;
  scriptExecutable: string;
  setScriptExecutable: React.Dispatch<React.SetStateAction<string>>;
  scriptOutputColsSeparator: string;
  setScriptOutputColsSeparator: React.Dispatch<React.SetStateAction<string>>;
  scriptVisualizers: ScriptVisualizerFormat[];
  setScriptVisualizers: React.Dispatch<
    React.SetStateAction<ScriptVisualizerFormat[]>
  >;
  scriptOutputFormat: ScriptOutputFormat;
  setScriptOutputFormat: React.Dispatch<
    React.SetStateAction<ScriptOutputFormat>
  >;
}

const ImportScriptContext = React.createContext<ImportScriptContextProps>(
  {} as ImportScriptContextProps
);

export function useImportScript() {
  return useContext(ImportScriptContext);
}

const ImportScriptProvider = ({ children }: any) => {
  const [scriptPage, setScriptPage] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [scriptDescription, setScriptDescription] = useState('');
  const [scriptInputTags, setScriptInputTags] = useState<string[]>([]);
  const [scriptOutputTags, setScriptOutputTags] = useState<string[]>([]);
  const [scriptSpeed, setScriptSpeed] = useState('');
  const [scriptSuccessRate, setScriptSuccessRate] = useState('');
  const [scriptPath, setScriptPath] = useState('');
  const [scriptFlags, setScriptFlags] = useState<ScriptFlagFormat[]>([
    {
      flag: '',
      name: '',
      description: '',
      type: 'flag',
      required: false,
    },
  ]);
  const [scriptColumns, setScriptColumns] = useState<ScriptColumnFormat[]>([
    {
      name: '',
      type: 'string',
    },
  ]);
  const [scriptExecutable, setScriptExecutable] = useState('');
  const [scriptOutputColsSeparator, setScriptOutputColsSeparator] =
    useState('');
  const [scriptVisualizers, setScriptVisualizers] = useState<
    ScriptVisualizerFormat[]
  >([
    {
      type: '',
      labelXColumn: '',
      labelYColumn: '',
      labelZColumn: '',
    },
  ]);
  const [scriptOutputFormat, setScriptOutputFormat] =
    useState<ScriptOutputFormat>({
      type: 'stdout',
      name: '',
    });

  const value = {
    scriptPage,
    setScriptPage,
    scriptName,
    setScriptName,
    scriptDescription,
    setScriptDescription,
    scriptInputTags,
    setScriptInputTags,
    scriptOutputTags,
    setScriptOutputTags,
    scriptSpeed,
    setScriptSpeed,
    scriptSuccessRate,
    setScriptSuccessRate,
    scriptPath,
    setScriptPath,
    scriptFlags,
    setScriptFlags,
    scriptColumns,
    setScriptColumns,
    scriptExecutable,
    setScriptExecutable,
    scriptOutputColsSeparator,
    setScriptOutputColsSeparator,
    scriptVisualizers,
    setScriptVisualizers,
    scriptOutputFormat,
    setScriptOutputFormat,
  };

  return (
    <ImportScriptContext.Provider value={value}>
      {children}
    </ImportScriptContext.Provider>
  );
};

export default ImportScriptProvider;
