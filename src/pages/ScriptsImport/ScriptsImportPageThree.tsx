import React, {
  RefObject,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ScriptDataType } from './ScriptsImport';
import { Icon } from '@iconify/react';
import ColumnRow, { ColumnRowRefs } from './ColumnRow';
import FloatingLabelInput from '@/components/FloatingLabelInput';

interface Props {
  formData: ScriptDataType;
  columnsType: string[];
  setColumnsType: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface RefsStepThree {
  scriptColumnSeparatorRef: React.RefObject<HTMLInputElement>;
  scriptColumnsTypeRefs: React.RefObject<ColumnRowRefs>[];
}

const ScriptsImportPageThree = forwardRef<RefsStepThree, Props>(
  ({ formData, columnsType, setColumnsType }: Props, ref) => {
    const scriptColumnSeparatorRef = useRef<HTMLInputElement>(null);
    const [scriptColumnRowsRefs, setScriptColumnRowsRefs] = useState<
      React.RefObject<ColumnRowRefs>[]
    >([createRef<ColumnRowRefs>()]);

    useEffect(() => {
      if (scriptColumnRowsRefs.length === 1 && columnsType.length === 0) {
        setColumnsType(['string']);
      } else if (formData.scriptColumns && formData.scriptColumns.length > 0) {
        setScriptColumnRowsRefs(
          formData.scriptColumns.map(() => createRef<ColumnRowRefs>())
        );

        setColumnsType(
          formData.scriptColumns.map(
            (_, index) => formData.scriptColumns[index].type
          )
        );
      }
    }, []);

    useImperativeHandle(ref, () => ({
      scriptColumnSeparatorRef,
      scriptColumnsTypeRefs: scriptColumnRowsRefs,
    }));

    const handleAddFlag = () => {
      setScriptColumnRowsRefs((prevColumnRowsRefs) => [
        ...prevColumnRowsRefs,
        createRef<ColumnRowRefs>(),
      ]);

      setColumnsType((prevColumnsType) => [...prevColumnsType, 'string']);
    };

    const handleRemoveFlag = (index: number) => {
      if (scriptColumnRowsRefs.length > 1) {
        setColumnsType((prevColumnsType) =>
          prevColumnsType.filter((_, i) => i !== index)
        );

        setScriptColumnRowsRefs((prevColumnRowsRefs) => {
          // Shift the values for flag rows above the removed index
          for (let i = index; i < prevColumnRowsRefs.length - 1; i++) {
            const columnRowRef = prevColumnRowsRefs[i].current!;
            const nextColumnRowRef = prevColumnRowsRefs[i + 1].current!;
            columnRowRef.columnRef.current!.value =
              nextColumnRowRef.columnRef.current!.value;
          }

          return prevColumnRowsRefs.slice(0, -1); // Remove the last row
        });
      }
    };

    return (
      <>
        <p className='import-steps-title mb-1'>Let's translate it</p>
        <p className='import-steps-p mb-3'>
          Tell us what the script output will look like
        </p>
        <div className='mt-4 mb-4'>
          <div className='mt-4 mb-4'>
            <FloatingLabelInput
              helpText='Provide all the separators used to split the data into the columns. Please start with "space" if you need it.'
              defaultValue={`${
                formData.scriptOutputColsSeparator
                  ? formData.scriptOutputColsSeparator
                  : ''
              }`}
              label={'Column Separator'}
              type={'text'}
              name={'script-col-separator'}
              required={true}
              ref={scriptColumnSeparatorRef}
            />
          </div>
          <div className='d-flex mb-1'>
            <div className='ps-1'>
              <p className=''>Name</p>
            </div>
            <div className='ps-1 mb-2'>
              <p className=''>Type</p>
            </div>
          </div>
          {scriptColumnRowsRefs.map((columnRowRef, index) => (
            <ColumnRow
              formData={formData}
              key={index}
              index={index}
              handleRemoveFlag={handleRemoveFlag}
              columnsType={columnsType}
              setColumnsType={setColumnsType}
              ref={columnRowRef}
            />
          ))}
          <div className='d-flex mt-2 align-items-center'>
            <button
              className={`me-3 btn btn-info github-arrow d-flex align-items-center justify-content-center flag-icon-button-add`}
              onClick={handleAddFlag}
            >
              <Icon className='flag-icon-add' icon='ic:round-plus' />
            </button>
          </div>
        </div>
      </>
    );
  }
);

export default ScriptsImportPageThree;
