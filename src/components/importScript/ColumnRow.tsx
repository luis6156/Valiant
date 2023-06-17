import { Icon } from '@iconify/react';
import { ChangeEvent, forwardRef, useImperativeHandle, useRef } from 'react';
import { useImportScript } from '@/contexts/ImportScriptContext';

export interface ColumnRowRefs {
  getValues: () => {
    name: string | undefined;
  };
  setValues: (name: string) => void;
}

interface Props {
  index: number;
  handleRemoveColumn: (index: number) => void;
}

const ColumnRow = forwardRef<ColumnRowRefs, Props>(
  ({ index, handleRemoveColumn }: Props, ref) => {
    const columnNameRef = useRef<HTMLInputElement>(null);
    const { scriptColumns, setScriptColumns } = useImportScript();

    useImperativeHandle(ref, () => ({
      getValues: () => ({
        name: columnNameRef.current?.value,
      }),
      setValues: (name: string) => {
        columnNameRef.current!.value = name;
      },
    }));

    const handleRemoveClick = () => {
      handleRemoveColumn(index);
    };

    const handleColumnTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setScriptColumns(
        scriptColumns.map((column, columnIndex) =>
          columnIndex === index ? { ...column, type: selectedValue } : column
        )
      );
    };

    return (
      <div key={index} className='mb-3'>
        <div className='d-flex justify-content-between'>
          <div className='w-100'>
            <input
              defaultValue={scriptColumns[index]?.name}
              placeholder={`${index === 0 ? 'Name' : ''}`}
              type='text'
              className='form-control form-control-special me-2'
              ref={columnNameRef}
            />
          </div>
          <div className='px-3 column-select-container'>
            <select
              value={scriptColumns[index]?.type}
              className='form-select form-select-special'
              aria-label='default'
              onChange={handleColumnTypeChange}
            >
              <option value='string'>String</option>
              <option value='number'>Number</option>
            </select>
          </div>
          <div className='column-buttons-container d-flex justify-content-between'>
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
