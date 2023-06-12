import Header from '@/components/Header';

import '../styles/scripts_import/scripts_import.scss';
import { Icon } from '@iconify/react';
import { createRef, useEffect, useRef, useState } from 'react';
import AttentionText from '@/components/AttentionText';
import ScriptsImportPageOne, { Refs } from './ScriptsImportPageOne';

export type FormDataType = {
  scriptPage: string;
  scriptName: string;
  scriptDescription: string;
};

const ScriptsImport = () => {
  const [formData, setFormData] = useState<FormDataType>({} as FormDataType);
  const [inputTags, setInputTags] = useState<string[]>([]);
  const [outputTags, setOutputTags] = useState<string[]>([]);
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const scriptsImportStepOneRef = createRef<Refs>();

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

    if (scriptPage && scriptName && scriptDesc) {
      setError('');

      setFormData({
        scriptPage,
        scriptName,
        scriptDescription: scriptDesc,
      });

      setStep(step + 1);
    } else {
      setError('All fields are mandatory for this step');
      scriptsImportStepOneRef.current?.scriptPageRef.current?.reportValidity();
      scriptsImportStepOneRef.current?.scriptNameRef.current?.reportValidity();
      scriptsImportStepOneRef.current?.scriptDescRef.current?.reportValidity();
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
            ) : null}
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
                            icon='fluent:person-16-regular'
                          />
                        </div>
                      </div>
                      <div>
                        <p className='checkpoint-text'>Step 1</p>
                        <p className='checkpoint-text-small'>
                          Short details about the script
                        </p>
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
                            icon='fluent:person-16-regular'
                          />
                        </div>
                      </div>
                      <div>
                        <p className='checkpoint-text'>Step 2</p>
                        <p className='checkpoint-text-small'>
                          Short details about
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
                            icon='fluent:person-16-regular'
                          />
                        </div>
                      </div>
                      <div>
                        <p className='checkpoint-text'>Step 3</p>
                        <p className='checkpoint-text-small'>Almost ready</p>
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
                            icon='fluent:person-16-regular'
                          />
                        </div>
                      </div>
                      <div>
                        <p className='checkpoint-text'>Step 4</p>
                        <p className='checkpoint-text-small'>Final touches</p>
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
                        onClick={handleContinueClickFirstStep}
                      >
                        <Icon icon='ic:round-arrow-right' />
                      </button>
                    </div>

                    {error && (
                      <div className='mt-4'>
                        <AttentionText danger={error} text='' />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScriptsImport;
