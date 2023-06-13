import { Icon } from '@iconify/react';
import { ChangeEvent, forwardRef, useImperativeHandle, useRef } from 'react';
import { FormDataType } from './ScriptsImport';

export interface ColumnRowRefs {
  columnRef: React.RefObject<HTMLInputElement>;
  index: number;
}

interface Props {
  index: number;
  handleRemoveFlag: (index: number) => void;
  columnsType: string[];
  setColumnsType: React.Dispatch<React.SetStateAction<string[]>>;
  formData: FormDataType;
}

const ColumnRow = forwardRef<ColumnRowRefs, Props>(
  (
    { index, handleRemoveFlag, columnsType, setColumnsType, formData }: Props,
    ref
  ) => {
    const columnNameRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      columnRef: columnNameRef,
      index,
    }));

    const handleRemoveClick = () => {
      handleRemoveFlag(index);
    };

    const handleColumnTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setColumnsType(
        columnsType.map((columnType, columnIndex) =>
          columnIndex === index ? selectedValue : columnType
        )
      );
    };

    return (
      <div key={index} className='mb-3'>
        <div className='d-flex justify-content-between'>
          <div className='flag-container-big'>
            <input
              defaultValue={`${
                formData.scriptColumns
                  ? formData.scriptColumns[index]?.name
                    ? formData.scriptColumns[index]?.name
                    : ''
                  : ''
              }`}
              placeholder={`${index === 0 ? 'Name' : ''}`}
              type='text'
              className='form-control form-control-special me-2'
              ref={columnNameRef}
            />
          </div>
          <div className='ps-3 pe-2'>
            <select
              defaultValue={`${
                formData.scriptColumns
                  ? formData.scriptColumns[index]?.type
                    ? formData.scriptColumns[index]?.type
                    : 'string'
                  : 'string'
              }`}
              className='form-select form-select-special'
              aria-label='default'
              onChange={handleColumnTypeChange}
            >
              <option value='string'>String</option>
              <option value='number'>Number</option>
            </select>
          </div>
          <div className='flag-buttons-container d-flex justify-content-between'>
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

export default ColumnRow;
