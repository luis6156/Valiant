import AttentionText from '@/components/AttentionText';
import { Icon } from '@iconify/react';
import React from 'react';

const ScenariosCreatePageFour = () => {
  return (
    <>
      <p className='import-steps-title mb-1'>...And what goes out</p>
      <p className='import-steps-p mb-3'>Tell us what the outputs are</p>
      <div className='mb-3'>
        <div className='d-flex mb-1'>
          <div className='ps-1 me-3'>
            <p className=''>Identical Columns</p>
          </div>
        </div>
        <div className='d-flex'>
          <div className='w-100 pe-3'>
            <select
              value='photon-url'
              className='form-select form-select-special'
              aria-label='default'
              onChange={() => {}}
            >
              <option value='photon-url'>SocialScan - Facebook</option>
              <option value='checkbox'>Checkbox</option>
              <option value='argument'>Argument</option>
            </select>
          </div>
          <p className='pe-3 pt-2'>==</p>
          <div className='w-100 pe-2'>
            <select
              value='msdorkdump-url'
              className='form-select form-select-special'
              aria-label='default'
              onChange={() => {}}
            >
              <option value='msdorkdump-url'>Poastal - Facebook</option>
              <option value='checkbox'>Checkbox</option>
              <option value='argument'>Argument</option>
            </select>
          </div>
          <div className='scripts-buttons-container d-flex justify-content-between'>
            <button
              className={`btn btn-info github-arrow h-100 w-100 d-flex align-items-center justify-content-center`}
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
          <AttentionText text='Specify the identical output columns from the selected scripts.' />
        </div>
      </div>

      <div className='mb-4'>
        <div className='d-flex mb-1'>
          <div className='ps-1 me-3'>
            <p className=''>Output Columns</p>
          </div>
        </div>
        <div className='d-flex'>
          <div className='w-100 pe-2'>
            <select
              value='photon-verbosity'
              className='form-select form-select-special'
              aria-label='default'
              onChange={() => {}}
            >
              <option value='photon-verbosity'>SocialScan - Twitter</option>
              <option value='checkbox'>Checkbox</option>
              <option value='argument'>Argument</option>
            </select>
          </div>
          <div className='scripts-buttons-container d-flex justify-content-between'>
            <button
              className={`btn btn-info github-arrow h-100 w-100 d-flex align-items-center justify-content-center`}
            >
              <Icon className='flag-icons' icon='ic:round-remove' />
            </button>
          </div>
        </div>

        <div className='d-flex mt-2'>
          <div className='w-100 pe-2'>
            <select
              value='photon-verbosity'
              className='form-select form-select-special'
              aria-label='default'
              onChange={() => {}}
            >
              <option value='photon-verbosity'>Poastal - Duolingo</option>
              <option value='checkbox'>Checkbox</option>
              <option value='argument'>Argument</option>
            </select>
          </div>
          <div className='scripts-buttons-container d-flex justify-content-between'>
            <button
              className={`btn btn-info github-arrow h-100 w-100 d-flex align-items-center justify-content-center`}
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
          <AttentionText text='Add all required output columns.' />
        </div>
      </div>
    </>
  );
};

export default ScenariosCreatePageFour;
