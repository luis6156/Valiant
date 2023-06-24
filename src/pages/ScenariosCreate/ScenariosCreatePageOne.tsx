import FloatingLabelInput from '@/components/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/FloatingLabelTextarea';
import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import AttentionText from '@/components/AttentionText';
import { useCreateScenario } from '@/contexts/CreateScenarioContext';

export interface RefsStepOne {
  getValues: () => {
    scenarioName: string | undefined;
    scenarioDescription: string | undefined;
    scenarioSpeed: string | undefined;
    scenarioSuccessRate: string | undefined;
  };
}

const ScenariosCreatePageOne = forwardRef<RefsStepOne>((_, ref) => {
  const scenarioNameRef = useRef<HTMLInputElement>(null);
  const scenarioDescRef = useRef<HTMLTextAreaElement>(null);
  const scenarioSpeedRef = useRef<HTMLInputElement>(null);
  const scenarioSuccessRateRef = useRef<HTMLInputElement>(null);
  const {
    scenarioName,
    scenarioDescription,
    scenarioInputTags,
    setScenarioInputTags,
    scenarioOutputTags,
    setScenarioOutputTags,
    scenarioSpeed,
    scenarioSuccessRate,
  } = useCreateScenario();

  useEffect(() => {
    const slider = scenarioSpeedRef.current;

    if (slider) {
      updateSliderBackground({
        target: slider,
      } as React.ChangeEvent<HTMLInputElement>);
    }

    const sliderSuc = scenarioSuccessRateRef.current;

    if (sliderSuc) {
      updateSliderBackground({
        target: sliderSuc,
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getValues: () => {
      const scenarioNameRefValue = scenarioNameRef.current?.value;
      const scenarioDescRefValue = scenarioDescRef.current?.value;
      const scenarioSpeedRefValue = scenarioSpeedRef.current?.value;
      const scenarioSuccessRateRefValue = scenarioSuccessRateRef.current?.value;

      return {
        scenarioName: scenarioNameRefValue,
        scenarioDescription: scenarioDescRefValue,
        scenarioSpeed: scenarioSpeedRefValue,
        scenarioSuccessRate: scenarioSuccessRateRefValue,
      };
    },
  }));

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
          ref={scenarioNameRef}
          name='scenario-name'
          type='text'
          label='Scenario Name'
          defaultValue={scenarioName}
          maxLength={20}
        />
      </div>
      <div className='mb-4'>
        <FloatingLabelTextarea
          required={true}
          ref={scenarioDescRef}
          name='scenario-description'
          label='Description'
          maxLength={200}
          isResizable={false}
          defaultValue={scenarioDescription}
        />
      </div>
      <div className='mb-4'>
        <FloatingLabelInput
          required={true}
          name='input-tags'
          type='text'
          label='Input Tags'
          maxLength={10}
          helpText='Used to provide a preview in the brief cards about what inputs your scenario will need/take.'
          pillValues={scenarioInputTags}
          setPillValues={setScenarioInputTags}
        />
      </div>
      <div className='mb-4'>
        <FloatingLabelInput
          required={true}
          name='output-tags'
          type='text'
          label='Output Tags'
          maxLength={10}
          helpText='Used to provide a preview in the brief cards about what outputs your scenario will provide.'
          pillValues={scenarioOutputTags}
          setPillValues={setScenarioOutputTags}
        />
      </div>
      <div className='mt-3 mb-3'>
        <label htmlFor='script-speed' className='form-label'>
          Scenario Speed
        </label>
        <input
          required={true}
          ref={scenarioSpeedRef}
          type='range'
          className='form-range'
          min='0'
          max='4'
          id='scenario-speed'
          defaultValue={scenarioSpeed}
          onChange={updateSliderBackground}
        />
        <AttentionText text='Provide the usual speed range in which the total scenario operations complete. It does not have to be completely accurate.' />
      </div>
      <div className='mt-3 mb-3'>
        <label htmlFor='script-success-rate' className='form-label'>
          Scenario Success Rate
        </label>
        <input
          required={true}
          ref={scenarioSuccessRateRef}
          type='range'
          className='form-range'
          min='0'
          max='4'
          id='script-success-rate'
          defaultValue={scenarioSuccessRate}
          onChange={updateSliderBackground}
        />
        <AttentionText text='Provide how successful the scenario is at returning results in most scenarios. It does not have to be completely accurate.' />
      </div>
    </>
  );
});

export default ScenariosCreatePageOne;
