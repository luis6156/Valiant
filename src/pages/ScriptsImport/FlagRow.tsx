import { Icon } from '@iconify/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { FormDataType } from './ScriptsImport';

export interface FlagsRowRefs {
  flagRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLInputElement>;
  index: number;
}

interface Props {
  index: number;
  handleRemoveFlag: (id: number) => void;
  requiredFlags: boolean[];
  setRequiredFlags: React.Dispatch<React.SetStateAction<boolean[]>>;
  formData: FormDataType;
}

const FlagRow = forwardRef<FlagsRowRefs, Props>(
  (
    {
      index,
      handleRemoveFlag,
      requiredFlags,
      setRequiredFlags,
      formData,
    }: Props,
    ref
  ) => {
    const flagRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      flagRef: flagRef,
      descriptionRef,
      index,
    }));

    const toggleRequired = () => {
      setRequiredFlags((prevRequiredFlags) => {
        const newRequiredFlags = [...prevRequiredFlags];
        newRequiredFlags[index] = !newRequiredFlags[index];
        return newRequiredFlags;
      });
    };

    const handleRemoveClick = () => {
      handleRemoveFlag(index);
    };

    return (
      <div key={index} className='mb-3'>
        <div className='d-flex justify-content-between'>
          <div className='flag-container'>
            <input
              defaultValue={`${
                formData.scriptFlags
                  ? formData.scriptFlags[index]?.flag
                    ? formData.scriptFlags[index]?.flag
                    : ''
                  : ''
              }`}
              placeholder={`${index === 0 ? '-i' : ''}`}
              type='text'
              className='form-control me-2'
              ref={flagRef}
            />
          </div>
          <div className='w-100 ps-3 pe-2'>
            <input
              defaultValue={`${
                formData.scriptFlags
                  ? formData.scriptFlags[index]?.description
                    ? formData.scriptFlags[index]?.description
                    : ''
                  : ''
              }`}
              placeholder={`${index === 0 ? 'Provide the input file' : ''}`}
              type='text'
              className='form-control'
              ref={descriptionRef}
            />
          </div>
          <div className='flag-buttons-container d-flex justify-content-between'>
            <button
              className={`btn btn-info github-arrow h-100 w-100 d-flex align-items-center justify-content-center me-2`}
              onClick={toggleRequired}
            >
              <Icon
                className={`${requiredFlags[index] ? 'active' : ''} flag-icons`}
                icon='mdi:required'
              />
            </button>
            <button
              className={`btn btn-info github-arrow h-100 w-100 d-flex align-items-center justify-content-center`}
              onClick={handleRemoveClick}
            >
              <Icon className='flag-icons' icon='ic:round-remove' />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default FlagRow;
