import FloatingLabelInput from '@/components/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/FloatingLabelTextarea';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FormDataType } from './ScriptsImport';

interface Props {
  formData: FormDataType;
  inputTags: string[];
  setInputTags: React.Dispatch<React.SetStateAction<string[]>>;
  outputTags: string[];
  setOutputTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface Refs {
  scriptPageRef: React.RefObject<HTMLInputElement>;
  scriptNameRef: React.RefObject<HTMLInputElement>;
  scriptDescRef: React.RefObject<HTMLTextAreaElement>;
}

const ScriptsImportPageOne = forwardRef<Refs, Props>(
  (
    { formData, inputTags, setInputTags, outputTags, setOutputTags }: Props,
    ref
  ) => {
    const scriptPageRef = useRef<HTMLInputElement>(null);
    const scriptNameRef = useRef<HTMLInputElement>(null);
    const scriptDescRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      scriptPageRef,
      scriptNameRef,
      scriptDescRef,
    }));

    return (
      <>
        <p className='import-steps-title mb-1'>Let's introduce ourselves</p>
        <p className='import-steps-p mb-3'>
          Provide some basic information about the script
        </p>
        <div className='mb-4'>
          <FloatingLabelInput
            required={true}
            ref={scriptPageRef}
            name='github-page'
            type='text'
            label='Github Page'
            defaultValue={formData.scriptPage}
            helpText='Provide the path to the Github page where your scripts are located for easier management. The link does not have to be from GitHub, but it must be a valid link.'
          />
        </div>
        <div className='mb-4'>
          <FloatingLabelInput
            required={true}
            ref={scriptNameRef}
            name='script-name'
            type='text'
            label='Script Name'
            defaultValue={formData.scriptName}
            maxLength={20}
          />
        </div>
        <div className='mb-4'>
          <FloatingLabelTextarea
            required={true}
            ref={scriptDescRef}
            name='script-description'
            label='Description'
            maxLength={200}
            isResizable={false}
            defaultValue={formData.scriptDescription}
          />
        </div>
        <div className='mb-4'>
          <FloatingLabelInput
            required={true}
            name='input-tags'
            type='text'
            label='Input Tags'
            maxLength={10}
            helpText='Used to provide a preview in the brief cards about what inputs your script will need/take.'
            pillValues={inputTags}
            setPillValues={setInputTags}
          />
        </div>
        <div className='mb-4'>
          <FloatingLabelInput
            required={true}
            name='output-tags'
            type='text'
            label='Output Tags'
            maxLength={10}
            helpText='Used to provide a preview in the brief cards about what outputs your script will provide.'
            pillValues={outputTags}
            setPillValues={setOutputTags}
          />
        </div>
      </>
    );
  }
);

export default ScriptsImportPageOne;
