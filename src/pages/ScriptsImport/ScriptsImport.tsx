import Header from '@/components/Header';

import '../../styles/scripts_import/scripts_import.scss';
import { Icon } from '@iconify/react';
import { createRef, useEffect, useRef, useState } from 'react';
import AttentionText from '@/components/AttentionText';
import ScriptsImportPageOne, { RefsStepOne } from './ScriptsImportPageOne';
import ScriptsImportPageTwo, { RefsStepTwo } from './ScriptsImportPageTwo';
import { FlagsRowRefs } from './FlagRow';
import ScriptsImportPageThree, {
  RefsStepThree,
} from './ScriptsImportPageThree';
import { ColumnRowRefs } from './ColumnRow';
import ScriptsImportPageFour from './ScriptsImportPageFour';
import { useSidebar } from '@/contexts/SidebarContext';

const FILENAME = 'scripts.json';

export type ScriptFlag = {
  flag: string;
  description: string;
  required: boolean;
};

export type ScriptColumn = {
  name: string;
  type: string;
};

export type ScriptVisualizer = {
  type: string;
  labelXColumn: string;
  labelYColumn: string;
  labelZColumn: string;
};

export type ScriptOutputFormat = {
  type: string;
  name: string;
};

export type ScriptDataType = {
  scriptPage: string;
  scriptName: string;
  scriptDescription: string;
  scriptSpeed: string;
  scriptSuccessRate: string;
  scriptPath: string;
  scriptFlags: ScriptFlag[];
  scriptColumns: ScriptColumn[];
  scriptExecutable: string;
  scriptOutputColsSeparator: string;
  scriptVisualizer: ScriptVisualizer;
  scriptOutputFormat: ScriptOutputFormat;
};

const ScriptsImport = () => {
  const [formData, setFormData] = useState<ScriptDataType>(
    {} as ScriptDataType
  );
  const [inputTags, setInputTags] = useState<string[]>([]);
  const [outputTags, setOutputTags] = useState<string[]>([]);
  const [scriptRequiredFlags, setScriptRequiredFlags] = useState<boolean[]>([]);
  const [scriptColumnsType, setScriptColumnsType] = useState<string[]>([]);
  const [scriptVisualizerType, setScriptVisualizerType] = useState<string>('');
  const [scriptVisualizerLabelXColumn, setScriptVisualizerLabelXColumn] =
    useState<string>('');
  const [scriptVisualizerLabelYColumn, setScriptVisualizerLabelYColumn] =
    useState<string>('');
  const [scriptVisualizerLabelZColumn, setScriptVisualizerLabelZColumn] =
    useState<string>('');
  const [scriptOutputFormatType, setScriptOutputFormatType] =
    useState<string>('');
  const [scriptOutputFormatName, setScriptOutputFormatName] =
    useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const scriptsImportStepOneRef = createRef<RefsStepOne>();
  const scriptsImportStepTwoRef = useRef<RefsStepTwo>(null);
  const scriptsImportStepThreeRef = useRef<RefsStepThree>(null);
  const { handleIconClick } = useSidebar();

  useEffect(() => {
    console.log(formData);
    console.log(inputTags);
    console.log(outputTags);
  }, [formData]);

  const handleContinueClickFirstStep = () => {
    const scriptPage =
      scriptsImportStepOneRef.current?.scriptPageRef.current?.value;
    const scriptName =
      scriptsImportStepOneRef.current?.scriptNameRef.current?.value;
    const scriptDesc =
      scriptsImportStepOneRef.current?.scriptDescRef.current?.value;
    const scriptSpeed =
      scriptsImportStepOneRef.current?.scriptSpeedRef.current?.value;
    const scriptSuccessRate =
      scriptsImportStepOneRef.current?.scriptSuccessRateRef.current?.value;

    if (
      scriptName &&
      scriptDesc &&
      scriptSpeed &&
      scriptSuccessRate &&
      inputTags.length > 0 &&
      outputTags.length > 0
    ) {
      setError('');

      setFormData({
        ...formData,
        scriptPage: scriptPage || '',
        scriptName,
        scriptDescription: scriptDesc,
        scriptSpeed,
        scriptSuccessRate,
      });

      setStep(2);
    } else {
      setError('All fields except URL are required');
      scriptsImportStepOneRef.current?.scriptNameRef.current?.reportValidity();
      scriptsImportStepOneRef.current?.scriptDescRef.current?.reportValidity();
    }
  };

  const handleContinueClickSecondStep = () => {
    const scriptFile =
      scriptsImportStepTwoRef.current?.scriptFileRef.current?.files?.[0];
    const scriptExecutable =
      scriptsImportStepTwoRef.current?.scriptExecutableRef.current?.value;
    const scriptFileFlags =
      scriptsImportStepTwoRef.current?.scriptFlagsRowsRefs;

    if ((scriptFile || formData.scriptPath) && scriptExecutable) {
      setError('');

      if (scriptFileFlags) {
        const flags: ScriptFlag[] = [];

        scriptFileFlags.forEach(
          (
            flagsRowRef: React.RefObject<FlagsRowRefs> | null,
            index: number
          ) => {
            const flagValue =
              flagsRowRef?.current?.flagRef.current?.value || '';
            const descriptionValue =
              flagsRowRef?.current?.descriptionRef.current?.value || '';

            flags.push({
              flag: flagValue,
              description: descriptionValue,
              required: scriptRequiredFlags[index],
            });
          }
        );

        setFormData({
          ...formData,
          scriptExecutable,
          scriptPath: scriptFile?.path || formData.scriptPath,
          scriptFlags: flags,
        });

        setStep(3);
      }
    } else {
      setError('Script file path and executable name are required.');
    }
  };

  const handleContinueClickThirdStep = () => {
    const scriptOutputColsSeparator =
      scriptsImportStepThreeRef.current?.scriptColumnSeparatorRef.current
        ?.value;
    const scriptColumns =
      scriptsImportStepThreeRef.current?.scriptColumnsTypeRefs;

    if (scriptOutputColsSeparator && scriptColumns) {
      setError('');

      const columns: ScriptColumn[] = [];

      scriptColumns.forEach(
        (columnRef: React.RefObject<ColumnRowRefs> | null, index: number) => {
          const columnName = columnRef?.current?.columnRef.current?.value || '';
          const columnType = scriptColumnsType[index];

          columns.push({
            name: columnName,
            type: columnType,
          });
        }
      );

      setFormData({
        ...formData,
        scriptOutputColsSeparator,
        scriptColumns: columns,
      });

      setStep(4);
    } else {
      setError(
        'Columns separator and at least a column definition is required.'
      );
    }
  };

  const handleContinueClickFourthStep = async () => {
    if (scriptOutputFormatType) {
      if (
        (scriptOutputFormatType !== 'stdout' && scriptOutputFormatName) ||
        scriptOutputFormatType === 'stdout'
      ) {
        if (scriptVisualizerType) {
          if (
            (scriptVisualizerType === 'line-chart' ||
              scriptVisualizerType === 'bar-chart' ||
              scriptVisualizerType === 'pie-chart') &&
            (!scriptVisualizerLabelXColumn || !scriptVisualizerLabelYColumn)
          ) {
            setError(
              'Label X and Label Y columns are required for this type of visualizer.'
            );
            return;
          } else if (
            scriptVisualizerType === 'scatter-chart' &&
            (!scriptVisualizerLabelXColumn ||
              !scriptVisualizerLabelYColumn ||
              !scriptVisualizerLabelZColumn)
          ) {
            setError(
              'Label X, Label Y and Label Z columns are required for this type of visualizer.'
            );
            return;
          } else if (scriptOutputFormatType === 'output-flag') {
            const flagData = formData.scriptFlags.find(
              (flag) => flag.flag === scriptOutputFormatName
            );
            if (flagData?.required === false) {
              setError('Please set the output flag to required.');
              return;
            }
          }

          setError('');

          const outputFormat: ScriptOutputFormat = {
            type: scriptOutputFormatType,
            name: scriptOutputFormatName,
          };

          const visualizer: ScriptVisualizer = {
            type: scriptVisualizerType,
            labelXColumn: scriptVisualizerLabelXColumn,
            labelYColumn: scriptVisualizerLabelYColumn,
            labelZColumn: scriptVisualizerLabelZColumn,
          };

          setFormData({
            ...formData,
            scriptOutputFormat: outputFormat,
            scriptVisualizer: visualizer,
          });

          const existsFile = await ipcRenderer.invoke('fs-exists-sync', {
            fileName: FILENAME,
          });
          if (existsFile) {
            const scripts = await ipcRenderer.invoke('fs-readfile-sync', {
              fileName: FILENAME,
            });
            const scriptsParsed = JSON.parse(scripts);

            const existsScript = scriptsParsed.find(
              (script: ScriptDataType) =>
                script.scriptName === formData.scriptName
            );

            if (existsScript) {
              setError('Script name already exists.');
              return;
            }

            scriptsParsed.push({
              ...formData,
              scriptOutputFormat: outputFormat,
              scriptVisualizer: visualizer,
            });

            await ipcRenderer.invoke('fs-writefile-sync', {
              data: JSON.stringify(scriptsParsed),
              fileName: FILENAME,
            });
          } else {
            await ipcRenderer.invoke('fs-writefile-sync', {
              data: JSON.stringify([
                {
                  ...formData,
                  scriptOutputFormat: outputFormat,
                  scriptVisualizer: visualizer,
                },
              ]),
              fileName: FILENAME,
            });
          }

          handleIconClick('scripts-search');
        } else {
          setError('Visualizer is required.');
        }
      } else {
        setError('Output format name is required for this type.');
      }
    } else {
      setError('Output format type is required.');
    }
  };

  const handleGoBack = () => {
    setStep(step - 1);
  };

  return (
    <>
      <div className='mt-3 mb-3'>
        <Header
          title='Import Scripts'
          subtitle='Import your custom scripts for better vulnerability management'
        />
      </div>
      <div className='container-fluid'>
        <div className='row'>
          <div className='ps-0 col-md-9 pe-4'>
            {step === 1 ? (
              <ScriptsImportPageOne
                ref={scriptsImportStepOneRef}
                formData={formData}
                inputTags={inputTags}
                setInputTags={setInputTags}
                outputTags={outputTags}
                setOutputTags={setOutputTags}
              />
            ) : step === 2 ? (
              <ScriptsImportPageTwo
                ref={scriptsImportStepTwoRef}
                formData={formData}
                requiredFlags={scriptRequiredFlags}
                setRequiredFlags={setScriptRequiredFlags}
              />
            ) : step === 3 ? (
              <ScriptsImportPageThree
                ref={scriptsImportStepThreeRef}
                formData={formData}
                columnsType={scriptColumnsType}
                setColumnsType={setScriptColumnsType}
              />
            ) : (
              <ScriptsImportPageFour
                formData={formData}
                visualizerType={scriptVisualizerType}
                setVisualizerType={setScriptVisualizerType}
                setVisualizerLabelXColumn={setScriptVisualizerLabelXColumn}
                setVisualizerLabelYColumn={setScriptVisualizerLabelYColumn}
                setVisualizerLabelZColumn={setScriptVisualizerLabelZColumn}
                visualizerLabelXColumn={scriptVisualizerLabelXColumn}
                visualizerLabelYColumn={scriptVisualizerLabelYColumn}
                visualizerLabelZColumn={scriptVisualizerLabelZColumn}
                outputType={scriptOutputFormatType}
                setOutputType={setScriptOutputFormatType}
                outputName={scriptOutputFormatName}
                setOutputName={setScriptOutputFormatName}
              />
            )}
          </div>
          <div className='col-md-3 script-import-right'>
            <div className='container h-100'>
              <div className='row h-100'>
                <div className='col mt-5 d-flex justify-content-center align-items-start'>
                  <div>
                    <div className='d-flex align-items-center'>
                      <div className='me-3'>
                        <div className='active checkpoint-circle d-flex align-items-center justify-content-center'>
                          <Icon
                            className='active checkpoint-icon'
                            icon='ic:round-person'
                          />
                        </div>
                      </div>
                      <div>
                        <p className='checkpoint-text'>Step 1</p>
                        <p className='checkpoint-text-small'>Script details</p>
                      </div>
                    </div>

                    <div
                      className={`${
                        step > 1 ? 'active' : ''
                      } mt-2 mb-2 checkpoint-line`}
                    ></div>

                    <div className='d-flex align-items-center'>
                      <div className='me-3'>
                        <div
                          className={`${
                            step > 1 ? 'active' : ''
                          } checkpoint-circle d-flex align-items-center justify-content-center`}
                        >
                          <Icon
                            className={`${
                              step > 1 ? 'active' : ''
                            } checkpoint-icon`}
                            icon='ri:run-fill'
                          />
                        </div>
                      </div>
                      <div>
                        <p className='checkpoint-text'>Step 2</p>
                        <p className='checkpoint-text-small'>
                          Execution details
                        </p>
                      </div>
                    </div>

                    <div
                      className={`${
                        step > 2 ? 'active' : ''
                      } mt-2 mb-2 checkpoint-line`}
                    ></div>

                    <div className='d-flex align-items-center'>
                      <div className='me-3'>
                        <div
                          className={`${
                            step > 2 ? 'active' : ''
                          } checkpoint-circle d-flex align-items-center justify-content-center`}
                        >
                          <Icon
                            className={`${
                              step > 2 ? 'active' : ''
                            } checkpoint-icon`}
                            icon='ic:outline-output'
                          />
                        </div>
                      </div>
                      <div>
                        <p className='checkpoint-text'>Step 3</p>
                        <p className='checkpoint-text-small'>Output format</p>
                      </div>
                    </div>

                    <div
                      className={`${
                        step > 3 ? 'active' : ''
                      } mt-2 mb-2 checkpoint-line`}
                    ></div>

                    <div className='d-flex align-items-center'>
                      <div className='me-3'>
                        <div
                          className={`${
                            step > 3 ? 'active' : ''
                          } checkpoint-circle d-flex align-items-center justify-content-center`}
                        >
                          <Icon
                            className={`${
                              step > 3 ? 'active' : ''
                            } checkpoint-icon`}
                            icon='mdi:graph-box-outline'
                          />
                        </div>
                      </div>
                      <div>
                        <p className='checkpoint-text'>Step 4</p>
                        <p className='checkpoint-text-small'>
                          Visualizer setup
                        </p>
                      </div>
                    </div>

                    <div className='d-flex mt-5'>
                      <button
                        className={`btn btn-info github-arrow d-flex align-items-center ${
                          step === 1 ? 'disabled' : ''
                        }`}
                        onClick={handleGoBack}
                      >
                        <Icon icon='ic:round-arrow-left' />
                      </button>

                      <button
                        className={`btn btn-info ms-2 github-arrow d-flex align-items-center`}
                        onClick={
                          step === 1
                            ? handleContinueClickFirstStep
                            : step === 2
                            ? handleContinueClickSecondStep
                            : step === 3
                            ? handleContinueClickThirdStep
                            : handleContinueClickFourthStep
                        }
                      >
                        {step === 4 ? (
                          <p className='finish-button'>Finish</p>
                        ) : (
                          <Icon icon='ic:round-arrow-right' />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className=''>
                    <AttentionText danger={error} text='' />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScriptsImport;
