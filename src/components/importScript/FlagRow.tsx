import { Icon } from '@iconify/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useImportScript } from '@/contexts/ImportScriptContext';

export interface FlagsRowRefs {
  getValues: () => {
    flag: string | undefined;
    description: string | undefined;
  };
  setValues: (flag: string, description: string) => void;
}

interface Props {
  index: number;
  handleRemoveFlag: (index: number) => void;
  handleToggleRequiredFlag: (index: number) => void;
}

const FlagRow = forwardRef<FlagsRowRefs, Props>(
  ({ index, handleRemoveFlag, handleToggleRequiredFlag }: Props, ref) => {
    const flagRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const { scriptFlags, setScriptFlags } = useImportScript();

    useImperativeHandle(ref, () => ({
      getValues: () => ({
        flag: flagRef.current?.value,
        description: descriptionRef.current?.value,
      }),
      setValues: (flag: string, description: string) => {
        flagRef.current!.value = flag;
        descriptionRef.current!.value = description;
      },
    }));

    const toggleRequired = () => {
      handleToggleRequiredFlag(index);
    };

    const handleRemoveClick = () => {
      handleRemoveFlag(index);
    };

    return (
      <div key={index} className='mb-3'>
        <div className='d-flex justify-content-between'>
          <div className='flag-container'>
            <input
              defaultValue={scriptFlags[index]?.flag}
              placeholder={`${index === 0 ? '-i' : ''}`}
              type='text'
              className='form-control me-2'
              ref={flagRef}
            />
          </div>
          <div className='w-100 px-3'>
            <input
              defaultValue={scriptFlags[index]?.description}
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
                className={`${
                  scriptFlags[index].required ? 'active' : ''
                } flag-icons`}
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
