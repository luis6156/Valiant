import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import AttentionText from '@/components/AttentionText';
import { Icon } from '@iconify/react';

export interface RefsStepTwo {
  getValues: () => {
    scriptPath: string | undefined;
    scriptExecutable: string | undefined;
    scriptFlags: (
      | {
          flag: string | undefined;
          name: string | undefined;
          description: string | undefined;
        }
      | undefined
    )[];
  };
}

const ScenariosCreatePageTwo = forwardRef<RefsStepTwo>((_, ref) => {
  return (
    <>
      <p className='import-steps-title mb-1'>What should we build</p>
      <p className='import-steps-p mb-3'>
        Provide the type of scenario and scripts necessary to build it
      </p>
      <div className='mb-4'>
        <p className='ps-1 mb-2'>Scenario Type</p>
        <select
          value='aggregation'
          className='form-select form-select-special'
          aria-label='default'
          onChange={() => {}}
        >
          <option value='pipe'>Pipe</option>
          <option value='aggregation'>Aggregation</option>
        </select>
      </div>
      <div className='mt-4 mb-4'>
        <div className='d-flex mb-1'>
          <div className='ps-1 me-3'>
            <p className=''>Required Scripts</p>
          </div>
        </div>
        <div className='d-flex'>
          <div className='pe-2 w-100'>
            <select
              value='photon'
              className='form-select form-select-special'
              aria-label='default'
              onChange={() => {}}
            >
              <option value='photon'>Photon</option>
              <option value='checkbox'>Checkbox</option>
              <option value='argument'>Argument</option>
            </select>
          </div>
          <div className='scripts-buttons-container d-flex justify-content-between'>
            <button
              className={`btn btn-info github-arrow h-100 w-100 d-flex align-items-center justify-content-center`}
              onClick={() => {}}
            >
              <Icon className='flag-icons' icon='ic:round-remove' />
            </button>
          </div>
        </div>
        <div className='mt-2 d-flex'>
          <div className='pe-2 w-100'>
            <select
              value='msdorkdump'
              className='form-select form-select-special'
              aria-label='default'
              onChange={() => {}}
            >
              <option value='msdorkdump'>MsDorkDump</option>
              <option value='checkbox'>Checkbox</option>
              <option value='argument'>Argument</option>
            </select>
          </div>
          <div className='scripts-buttons-container d-flex justify-content-between'>
            <button
              className={`btn btn-info github-arrow h-100 w-100 d-flex align-items-center justify-content-center`}
              onClick={() => {}}
            >
              <Icon className='flag-icons' icon='ic:round-remove' />
            </button>
          </div>
        </div>
        <div className='d-flex mt-2 align-items-center'>
          <button
            className={`me-3 btn btn-info github-arrow d-flex align-items-center justify-content-center flag-icon-button-add`}
            onClick={() => {}}
          >
            <Icon className='flag-icon-add' icon='ic:round-plus' />
          </button>
          <AttentionText text='Add all the scripts required for this scenario.' />
        </div>
      </div>
    </>
  );
});

export default ScenariosCreatePageTwo;
