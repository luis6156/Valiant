import FloatingLabelInput from '@/components/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/FloatingLabelTextarea';
import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { FormDataType } from './ScriptsImport';
import AttentionText from '@/components/AttentionText';

interface Props {
  formData: FormDataType;
  inputTags: string[];
  setInputTags: React.Dispatch<React.SetStateAction<string[]>>;
  outputTags: string[];
  setOutputTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface RefsStepOne {
  scriptPageRef: React.RefObject<HTMLInputElement>;
  scriptNameRef: React.RefObject<HTMLInputElement>;
  scriptDescRef: React.RefObject<HTMLTextAreaElement>;
  scriptSpeedRef: React.RefObject<HTMLInputElement>;
  scriptSuccessRateRef: React.RefObject<HTMLInputElement>;
}

const ScriptsImportPageOne = forwardRef<RefsStepOne, Props>(
  (
    { formData, inputTags, setInputTags, outputTags, setOutputTags }: Props,
    ref
  ) => {
    const scriptPageRef = useRef<HTMLInputElement>(null);
    const scriptNameRef = useRef<HTMLInputElement>(null);
    const scriptDescRef = useRef<HTMLTextAreaElement>(null);
    const scriptSpeedRef = useRef<HTMLInputElement>(null);
    const scriptSuccessRateRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      scriptPageRef,
      scriptNameRef,
      scriptDescRef,
      scriptSpeedRef,
      scriptSuccessRateRef,
    }));

    useEffect(() => {
      const slider = scriptSpeedRef.current;

      if (slider) {
        updateSliderBackground({
          target: slider,
        } as React.ChangeEvent<HTMLInputElement>);
      }

      const sliderSuc = scriptSuccessRateRef.current;

      if (sliderSuc) {
        updateSliderBackground({
          target: sliderSuc,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }, []); // Call the function once during initialization

    function updateSliderBackground(event: ChangeEvent<HTMLInputElement>) {
      const slider = event.target as HTMLInputElement;

      // Get the slider value
      const value = slider.value;
      let color = '';

      if (value === '0') {
        color = '#D43B3B';
      } else if (value === '1') {
        color = '#FF7D33';
      } else if (value === '2') {
        color = '#FFEB33';
      } else if (value === '3') {
        color = '#98FF7E';
      } else if (value === '4') {
        color = '#5FFF45';
      }

      console.log(value);

      // Set the background color based on the calculated hue, saturation, and lightness
      slider.style.setProperty('--slider-color-dynamic', `${color}`);
    }

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
            name='script-url'
            type='text'
            label='Script URL'
            defaultValue={formData.scriptPage}
            helpText='Provide the full URL to the Github page where your script can be downloaded for easier management. The link does not have to be from GitHub, but it must be a valid link.'
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
        <div className='mt-3 mb-3'>
          <label htmlFor='script-speed' className='form-label'>
            Script Speed
          </label>
          <input
            required={true}
            ref={scriptSpeedRef}
            type='range'
            className='form-range'
            min='0'
            max='4'
            id='script-speed'
            defaultValue={formData.scriptSpeed}
            onChange={updateSliderBackground}
          />
          <AttentionText text='Provide the usual speed range in which the script operations complete. It does not have to be completely accurate.' />
        </div>
        <div className='mt-3 mb-3'>
          <label htmlFor='script-success-rate' className='form-label'>
            Script Success Rate
          </label>
          <input
            required={true}
            ref={scriptSuccessRateRef}
            type='range'
            className='form-range'
            min='0'
            max='4'
            id='script-success-rate'
            defaultValue={formData.scriptSuccessRate}
            onChange={updateSliderBackground}
          />
          <AttentionText text='Provide how successful the script is at returning results in most scenarios. It does not have to be completely accurate.' />
        </div>
      </>
    );
  }
);

export default ScriptsImportPageOne;
