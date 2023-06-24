import React, {
  RefObject,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Icon } from '@iconify/react';
import ColumnRow, {
  ColumnRowRefs,
} from '../../components/ScriptImport/ColumnRow';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { useImportScript } from '@/contexts/ImportScriptContext';
import AttentionText from '@/components/AttentionText';

export interface RefsStepThree {
  getValues: () => {
    scriptOutputSkipRows: string | undefined;
    scriptColumnSeparator: string | undefined;
    scriptColumns: ({ name: string | undefined } | undefined)[];
  };
}

const ScenariosCreatePageThree = forwardRef<RefsStepThree>((_, ref) => {
  return (
    <>
      <p className='import-steps-title mb-1'>What goes in...</p>
      <p className='import-steps-p mb-3'>Tell us what the inputs are</p>
      {true ? (
        <>
          <div className='mb-3'>
            <div className='d-flex mb-1'>
              <div className='ps-1 me-3'>
                <p className=''>Identical Arguments</p>
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
                  <option value='photon-url'>Photon - URL</option>
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
                  <option value='msdorkdump-url'>MsDorkDump - URL</option>
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
              <AttentionText text='Specify the identical arguments from the selected scripts.' />
            </div>
          </div>

          <div className='mb-4'>
            <div className='d-flex mb-1'>
              <div className='ps-1 me-3'>
                <p className=''>Required Inputs</p>
              </div>
            </div>
            <div className='d-flex'>
              <div className='w-100 pe-2'>
                <select
                  value='photon-verbosity'
                  className='form-select form-select-special'
                  aria-label='default'
                  onChange={() => {}}
                  disabled
                >
                  <option value='photon-verbosity'>MsDorkDump - Proxy</option>
                  <option value='checkbox'>Checkbox</option>
                  <option value='argument'>Argument</option>
                </select>
              </div>
              <div className='flag-buttons-container d-flex justify-content-between'>
                <button
                  className={`disabled btn btn-info github-arrow h-100 w-100 d-flex align-items-center justify-content-center me-2`}
                >
                  <Icon className={`active flag-icons`} icon='mdi:required' />
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
                  <option value='photon-verbosity'>Photon - Verbosity</option>
                  <option value='checkbox'>Checkbox</option>
                  <option value='argument'>Argument</option>
                </select>
              </div>
              <div className='flag-buttons-container d-flex justify-content-between'>
                <button
                  className={`btn btn-info github-arrow h-100 w-100 d-flex align-items-center justify-content-center me-2`}
                >
                  <Icon className={`active flag-icons`} icon='mdi:required' />
                </button>
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
              <AttentionText text='Add all arguments needed and specify if they are required using the asterix button. Default required arguments cannot be changed.' />
            </div>
          </div>
        </>
      ) : (
        <div className='mb-3'>
          <div className='d-flex mb-1 position-relative'>
            <div className='ps-1 me-5 pe-5'>
              <p className=''>CrossLinked - Email</p>
            </div>
            <div className='position-absolute start-50'>
              <p className=''>Poastal - Email</p>
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
                <option value='photon-url'>Photon - URL</option>
                <option value='checkbox'>Checkbox</option>
                <option value='argument'>Argument</option>
              </select>
            </div>
            <p className='pe-3 pt-2'>➜</p>
            <div className='w-100 pe-2'>
              <select
                value='msdorkdump-url'
                className='form-select form-select-special'
                aria-label='default'
                onChange={() => {}}
              >
                <option value='msdorkdump-url'>MsDorkDump - URL</option>
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
            <AttentionText text='Map the outputs of the first script to the inputs of the second script.' />
          </div>
        </div>
      )}
    </>
  );
});

export default ScenariosCreatePageThree;
