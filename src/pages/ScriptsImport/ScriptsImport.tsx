import Header from '@/components/Header';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import AttentionText from '@/components/AttentionText';
import ScriptsImportPageThree, {
  RefsStepThree,
} from './ScriptsImportPageThree';
import ScriptsImportPageFour from './ScriptsImportPageFour';
import { useSidebar } from '@/contexts/SidebarContext';

import '../../styles/ScriptsImport/ScriptsImport.scss';
import {
  ScriptColumnFormat,
  ScriptFlagFormat,
  ScriptInputFormat,
  useImportScript,
} from '@/contexts/ImportScriptContext';
import ScriptsImportPageOne, { RefsStepOne } from './ScriptsImportPageOne';
import ScriptsImportPageTwo, { RefsStepTwo } from './ScriptsImportPageTwo';

const FILENAME = 'scripts.json';

const ScriptsImport = () => {
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const { handleIconClick } = useSidebar();
  const stepOneRefs = useRef<RefsStepOne>(null);
  const stepTwoRefs = useRef<RefsStepTwo>(null);
  const stepThreeRefs = useRef<RefsStepThree>(null);

  const {
    scriptPage,
    setScriptPage,
    scriptName,
    setScriptName,
    scriptDescription,
    setScriptDescription,
    scriptInputTags,
    scriptOutputTags,
    scriptSpeed,
    setScriptSpeed,
    scriptSuccessRate,
    setScriptSuccessRate,
    scriptPath,
    setScriptPath,
    scriptExecutable,
    setScriptExecutable,
    scriptFlags,
    setScriptFlags,
    scriptOutputColsSeparator,
    setScriptOutputColsSeparator,
    scriptColumns,
    setScriptColumns,
    scriptOutputFormat,
    scriptVisualizers,
  } = useImportScript();

  const handleContinueClickFirstStep = () => {
    const stepOneValues = stepOneRefs.current?.getValues();
    const scriptPageRefValue = stepOneValues?.scriptPage;
    const scriptNameRefValue = stepOneValues?.scriptName;
    const scriptDescRefValue = stepOneValues?.scriptDescription;
    const scriptSpeedRefValue = stepOneValues?.scriptSpeed;
    const scriptSuccessRateRefValue = stepOneValues?.scriptSuccessRate;

    if (
      scriptNameRefValue &&
      scriptDescRefValue &&
      scriptSpeedRefValue &&
      scriptSuccessRateRefValue &&
      scriptInputTags.length > 0 &&
      scriptOutputTags.length > 0
    ) {
      setError('');

      setScriptPage(scriptPageRefValue || '');
      setScriptName(scriptNameRefValue);
      setScriptDescription(scriptDescRefValue);
      setScriptSpeed(scriptSpeedRefValue);
      setScriptSuccessRate(scriptSuccessRateRefValue);

      setStep(2);
    } else {
      setError('All fields except URL are required');
    }
  };

  const handleContinueClickSecondStep = () => {
    const stepTwoValues = stepTwoRefs.current?.getValues();
    const scriptPathRefValue = stepTwoValues?.scriptPath;
    const scriptExecutableRefValue = stepTwoValues?.scriptExecutable;
    const scriptFlagsRefValues = stepTwoValues?.scriptFlags;

    if ((scriptPathRefValue || scriptPath) && scriptExecutableRefValue) {
      setError('');

      if (scriptFlagsRefValues) {
        const flags: ScriptFlagFormat[] = scriptFlagsRefValues.map(
          (flag, index) => {
            return {
              flag: flag?.flag,
              name: flag?.name,
              description: flag?.description,
              type: scriptFlags[index].type,
              required: scriptFlags[index].required,
            } as ScriptFlagFormat;
          }
        );

        if (scriptPathRefValue) {
          setScriptPath(scriptPathRefValue);
        }

        setScriptExecutable(scriptExecutableRefValue);

        setScriptFlags(flags);

        setStep(3);
      }
    } else {
      setError('Script file path and executable name are required.');
    }
  };

  const handleContinueClickThirdStep = () => {
    const stepThreeValues = stepThreeRefs.current?.getValues();
    const scriptColumnSeparatorRefValue =
      stepThreeValues?.scriptColumnSeparator;
    const scriptColumnRefValues = stepThreeValues?.scriptColumns;

    if (scriptColumnSeparatorRefValue && scriptColumnRefValues) {
      setError('');

      const columns: ScriptColumnFormat[] = scriptColumnRefValues.map(
        (column, index) => {
          return {
            name: column?.name,
            type: scriptColumns[index].type,
          } as ScriptColumnFormat;
        }
      );

      setScriptColumns(columns);

      setScriptOutputColsSeparator(scriptColumnSeparatorRefValue);

      setStep(4);
    } else {
      setError(
        'Columns separator and at least a column definition is required.'
      );
    }
  };

  const handleContinueClickFourthStep = async () => {
    if (scriptOutputFormat) {
      if (
        (scriptOutputFormat.type !== 'stdout' && scriptOutputFormat.name) ||
        scriptOutputFormat.type === 'stdout'
      ) {
        if (scriptVisualizers.length > 0) {
          for (let i = 0; i < scriptVisualizers.length; i++) {
            if (
              (scriptVisualizers[i].type === 'line-chart' ||
                scriptVisualizers[i].type === 'bar-chart' ||
                scriptVisualizers[i].type === 'pie-chart') &&
              (!scriptVisualizers[i].labelXColumn ||
                !scriptVisualizers[i].labelYColumn)
            ) {
              setError(
                'Label X and Y are required for one of the visualizers.'
              );
              return;
            } else if (
              scriptVisualizers[i].type === 'scatter-chart' &&
              (!scriptVisualizers[i].labelXColumn ||
                !scriptVisualizers[i].labelYColumn ||
                !scriptVisualizers[i].labelZColumn)
            ) {
              setError(
                'Label X, Y and Z are required for one of the visualizers.'
              );
              return;
            } else if (scriptOutputFormat.type === 'output-flag') {
              const flagData = scriptFlags.find(
                (flag) => flag.name === scriptOutputFormat.name
              );

              if (flagData?.required === false) {
                // set it to true and update the flags
                flagData.required = true;
                const flags = scriptFlags.map((flag) => {
                  if (flag.name === scriptOutputFormat.name) {
                    return flagData;
                  }
                  return flag;
                });
              }
            }
          }

          setError('');

          const existsFile = await ipcRenderer.invoke('fs-exists-sync', {
            fileName: FILENAME,
          });

          if (existsFile) {
            const scripts = await ipcRenderer.invoke('fs-readfile-sync', {
              fileName: FILENAME,
            });

            const scriptsParsed = JSON.parse(scripts);
            const existsScript = scriptsParsed.find(
              (script: ScriptInputFormat) => script.scriptName === scriptName
            );

            if (existsScript) {
              setError('Script name already exists.');
              return;
            }

            scriptsParsed.push({
              scriptPage,
              scriptName,
              scriptDescription,
              scriptInputTags,
              scriptOutputTags,
              scriptSpeed,
              scriptSuccessRate,
              scriptPath,
              scriptFlags,
              scriptColumns,
              scriptExecutable,
              scriptOutputColsSeparator,
              scriptVisualizers,
              scriptOutputFormat,
            });

            await ipcRenderer.invoke('fs-writefile-sync', {
              data: JSON.stringify(scriptsParsed),
              fileName: FILENAME,
            });
          } else {
            await ipcRenderer.invoke('fs-writefile-sync', {
              data: JSON.stringify([
                {
                  scriptPage,
                  scriptName,
                  scriptDescription,
                  scriptInputTags,
                  scriptOutputTags,
                  scriptSpeed,
                  scriptSuccessRate,
                  scriptPath,
                  scriptFlags,
                  scriptColumns,
                  scriptExecutable,
                  scriptOutputColsSeparator,
                  scriptVisualizers,
                  scriptOutputFormat,
                },
              ]),
              fileName: FILENAME,
            });
          }

          handleIconClick('scripts-search');
        } else {
          setError('At least a visualizer is required.');
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
              <ScriptsImportPageOne ref={stepOneRefs} />
            ) : step === 2 ? (
              <ScriptsImportPageTwo ref={stepTwoRefs} />
            ) : step === 3 ? (
              <ScriptsImportPageThree ref={stepThreeRefs} />
            ) : (
              <ScriptsImportPageFour />
            )}
          </div>
          <div className='col-md-3 script-import-right'>
            <div className='container h-100'>
              <div className='row'>
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

                    <div className='d-flex mt-5 mb-0'>
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
                  <div className='mt-3'>
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
