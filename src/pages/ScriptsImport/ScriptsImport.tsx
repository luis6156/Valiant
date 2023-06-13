import Header from '@/components/Header';

import '../../styles/scripts_import/scripts_import.scss';
import { Icon } from '@iconify/react';
import { createRef, useEffect, useRef, useState } from 'react';
import AttentionText from '@/components/AttentionText';
import ScriptsImportPageOne, { RefsStepOne } from './ScriptsImportPageOne';
import ScriptsImportPageTwo, { RefsStepTwo } from './ScriptsImportPageTwo';
import { FlagsRowRefs } from './FlagRow';
import ScriptsImportPageThree from './ScriptsImportPageThree';

export type ScriptFlag = {
  flag: string;
  description: string;
  required: boolean;
};

export type FormDataType = {
  scriptPage: string;
  scriptName: string;
  scriptDescription: string;
  scriptSpeed: string;
  scriptSuccessRate: string;
  scriptPath: string;
  scriptFlags: ScriptFlag[];
  scriptExecutable: string;
  scriptOutputCols: string[];
  scriptOutputColsSeparator: string;
};

const ScriptsImport = () => {
  const [formData, setFormData] = useState<FormDataType>({} as FormDataType);
  const [inputTags, setInputTags] = useState<string[]>([]);
  const [outputTags, setOutputTags] = useState<string[]>([]);
  const [scriptRequiredFlags, setScriptRequiredFlags] = useState<boolean[]>([]);
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const scriptsImportStepOneRef = createRef<RefsStepOne>();
  const scriptsImportStepTwoRef = useRef<RefsStepTwo>(null);

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

    if (scriptFile && scriptExecutable) {
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
          scriptPath: scriptFile.path,
          scriptFlags: flags,
        });

        setStep(3);
      }
    } else {
      setError('Script file path and executable name are required.');
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
            ) : step === 3 ? null : // <ScriptsImportPageThree />
            null}
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
                      {/* <button
                        onClick={handleGoBack}
                        className={`${
                          step <= 1 ? 'invisible' : ''
                        } btn btn-secondary me-3`}
                      >
                        <div className='d-flex align-items-center justify-content-center me-3'>
                          <Icon
                            className='scripts-import-button-icon-back'
                            icon='ic:round-arrow-left'
                          />
                          Back
                        </div>
                      </button>

                      <button
                        onClick={handleContinueClickFirstStep}
                        className='btn btn-primary'
                      >
                        <div className='d-flex align-items-center justify-content-center'>
                          Continue
                          <Icon
                            className='scripts-import-button-icon'
                            icon='ic:round-arrow-right'
                          />
                        </div>
                      </button> */}

                      <button
                        className={`btn btn-info github-arrow d-flex align-items-center ${
                          step === 1 ? 'disabled' : ''
                        }`}
                        onClick={handleGoBack}
                      >
                        <Icon icon='ic:round-arrow-left' />
                      </button>

                      <button
                        className={`btn btn-info ms-2 github-arrow d-flex align-items-center ${
                          step === 4 ? 'disabled' : ''
                        }`}
                        onClick={
                          step === 1
                            ? handleContinueClickFirstStep
                            : step === 2
                            ? handleContinueClickSecondStep
                            : undefined
                        }
                      >
                        <Icon icon='ic:round-arrow-right' />
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
