import FloatingLabelInput from '@/components/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/FloatingLabelTextarea';
import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

interface Props {
  formData: {
    scriptPage: string;
    scriptName: string;
    scriptDescription: string;
  };
}

export interface Refs {
  scriptPageRef: React.RefObject<HTMLInputElement>;
  scriptNameRef: React.RefObject<HTMLInputElement>;
  scriptDescRef: React.RefObject<HTMLTextAreaElement>;
}

const ScriptsImportPageOne = forwardRef<Refs, Props>(
  ({ formData }: Props, ref) => {
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
        <h4 className='link-no-underline mb-1'>Let's introduce ourselves</h4>
        <p className='import-steps-p mb-3'>
          Provide basic information about the script
        </p>
        <div className='mb-3'>
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
        <div className='mb-3'>
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
        <div className='mb-3'>
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
      </>
    );
  }
);

export default ScriptsImportPageOne;
