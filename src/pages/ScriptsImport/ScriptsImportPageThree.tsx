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

export interface RefsStepThree {
  getValues: () => {
    scriptOutputSkipRows: string | undefined;
    scriptColumnSeparator: string | undefined;
    scriptColumns: ({ name: string | undefined } | undefined)[];
  };
}

const ScriptsImportPageThree = forwardRef<RefsStepThree>((_, ref) => {
  const scriptOutputSkipRowsRef = useRef<HTMLInputElement>(null);
  const scriptColumnSeparatorRef = useRef<HTMLInputElement>(null);
  const {
    scriptColumns,
    setScriptColumns,
    scriptOutputColsSeparator,
    scriptOutputSkipRows,
  } = useImportScript();
  const [scriptColumnRowsRefs, setScriptColumnRowsRefs] = useState<
    React.RefObject<ColumnRowRefs>[]
  >(
    Array.from({ length: scriptColumns.length }, () =>
      createRef<ColumnRowRefs>()
    )
  );

  useEffect(() => {
    // remove all columns except the first one if the name of the second column is empty
    if (scriptColumns.length > 1) {
      const firstColumn = scriptColumnRowsRefs[1].current!;
      const firstColumnValue = firstColumn.getValues().name;

      if (!firstColumnValue) {
        setScriptColumns((prevScriptColumns) => prevScriptColumns.slice(0, 1));
        setScriptColumnRowsRefs((prevColumnRowsRefs) =>
          prevColumnRowsRefs.slice(0, 1)
        );
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getValues: () => {
      return {
        scriptOutputSkipRows: scriptOutputSkipRowsRef.current?.value,
        scriptColumnSeparator: scriptColumnSeparatorRef.current?.value,
        scriptColumns: scriptColumnRowsRefs.map((columnRowRef) =>
          columnRowRef.current?.getValues()
        ),
      };
    },
  }));

  const handleAddColumn = () => {
    setScriptColumns((prevScriptColumns) => [
      ...prevScriptColumns,
      { name: '', type: 'string' },
    ]);

    setScriptColumnRowsRefs((prevColumnRowsRefs) => [
      ...prevColumnRowsRefs,
      createRef<ColumnRowRefs>(),
    ]);
  };

  const handleRemoveColumn = (index: number) => {
    if (scriptColumnRowsRefs.length > 1) {
      setScriptColumnRowsRefs((prevColumnRowsRefs) => {
        for (let i = index; i < prevColumnRowsRefs.length - 1; i++) {
          const columnRowRef = prevColumnRowsRefs[i].current!;
          const nextColumnRowRefValues =
            prevColumnRowsRefs[i + 1].current?.getValues().name;

          columnRowRef.setValues(nextColumnRowRefValues || '');
        }

        return prevColumnRowsRefs.slice(0, -1);
      });

      setScriptColumns((prevScriptColumns) =>
        prevScriptColumns.filter((_, i) => i !== index)
      );
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
            helpText='Provide the number of rows to skip from the output if you need it.'
            defaultValue={scriptOutputSkipRows || '0'}
            label={'Skip Rows from Output'}
            type={'text'}
            name={'script-output-skip-rows'}
            required={false}
            ref={scriptOutputSkipRowsRef}
          />
        </div>
        <div className='mt-4 mb-4'>
          <FloatingLabelInput
            helpText='Provide all the separators used to split the data into the columns. Please start with "space" if you need it.'
            defaultValue={scriptOutputColsSeparator}
            label={'Column Separator'}
            type={'text'}
            name={'script-col-separator'}
            required={true}
            ref={scriptColumnSeparatorRef}
          />
        </div>
        <div className='d-flex mb-1'>
          <div className='ps-1'>
            <p className=''>Column Name</p>
          </div>
        </div>
        {scriptColumnRowsRefs.map((columnRowRef, index) => (
          <ColumnRow
            key={index}
            index={index}
            handleRemoveColumn={handleRemoveColumn}
            ref={columnRowRef}
          />
        ))}
        <div className='d-flex align-items-center'>
          <button
            className={`me-3 btn btn-info github-arrow d-flex align-items-center justify-content-center flag-icon-button-add`}
            onClick={handleAddColumn}
          >
            <Icon className='flag-icon-add' icon='ic:round-plus' />
          </button>
        </div>
      </div>
    </>
  );
});

export default ScriptsImportPageThree;
