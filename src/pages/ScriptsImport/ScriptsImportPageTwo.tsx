import React, {
  RefObject,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import AttentionText from '@/components/AttentionText';
import { Icon } from '@iconify/react';
import FlagRow, { FlagsRowRefs } from '../../components/importScript/FlagRow';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import { useImportScript } from '@/contexts/ImportScriptContext';

export interface RefsStepTwo {
  getValues: () => {
    scriptPath: string | undefined;
    scriptExecutable: string | undefined;
    scriptFlags: (
      | { flag: string | undefined; description: string | undefined }
      | undefined
    )[];
  };
}

const ScriptsImportPageTwo = forwardRef<RefsStepTwo>((_, ref) => {
  const scriptFileRef = useRef<HTMLInputElement>(null);
  const scriptExecutableRef = useRef<HTMLInputElement>(null);
  const { scriptPath, scriptExecutable, scriptFlags, setScriptFlags } =
    useImportScript();
  const [scriptFlagsRowsRefs, setScriptFlagsRowsRefs] = useState<
    React.RefObject<FlagsRowRefs>[]
  >(
    Array.from({ length: scriptFlags.length }, () => createRef<FlagsRowRefs>())
  );

  useEffect(() => {
    // remove all flags except the first one if the name of the second flag is empty
    if (scriptFlags.length > 1) {
      const firstFlag = scriptFlagsRowsRefs[1].current!;
      const firstFlagValues = firstFlag.getValues();

      if (!firstFlagValues.flag) {
        setScriptFlags((prevScriptFlags) => prevScriptFlags.slice(0, 1));
        setScriptFlagsRowsRefs((prevFlagsRowsRefs) =>
          prevFlagsRowsRefs.slice(0, 1)
        );
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getValues: () => {
      return {
        scriptPath: scriptFileRef.current?.files?.[0]?.path,
        scriptExecutable: scriptExecutableRef.current?.value,
        scriptFlags: scriptFlagsRowsRefs.map((flagRowRef) =>
          flagRowRef.current?.getValues()
        ),
      };
    },
  }));

  const handleAddFlag = () => {
    setScriptFlagsRowsRefs((prevFlagsRowsRefs) => [
      ...prevFlagsRowsRefs,
      createRef<FlagsRowRefs>(),
    ]);

    setScriptFlags((prevScriptFlags) => [
      ...prevScriptFlags,
      { flag: '', description: '', required: false },
    ]);
  };

  const handleRemoveFlag = (index: number) => {
    if (scriptFlagsRowsRefs.length > 0) {
      setScriptFlags((prevScriptFlags) =>
        prevScriptFlags.filter((_, flagIndex) => flagIndex !== index)
      );

      setScriptFlagsRowsRefs((prevFlagsRowsRefs) => {
        for (let i = index; i < prevFlagsRowsRefs.length - 1; i++) {
          const flagsRowRef = prevFlagsRowsRefs[i].current!;
          const nextFlagsRowRefValues =
            prevFlagsRowsRefs[i + 1].current?.getValues();

          flagsRowRef.setValues(
            nextFlagsRowRefValues?.flag || '',
            nextFlagsRowRefValues?.description || ''
          );
        }

        return prevFlagsRowsRefs.slice(0, -1);
      });
    }
  };

  const handleToggleRequiredFlag = (index: number) => {
    setScriptFlags((prev) => {
      const updatedFlags = prev.map((flag, i) => {
        if (i === index) {
          return { ...flag, required: !flag.required };
        } else {
          return flag;
        }
      });

      return updatedFlags;
    });
  };

  return (
    <>
      <p className='import-steps-title mb-1'>Make it start</p>
      <p className='import-steps-p mb-3'>
        Provide the flags and the path to the script
      </p>
      <div className='input-group'>
        <label className='input-group-text' htmlFor='script-location'>
          Script Path
        </label>
        <input
          required={true}
          ref={scriptFileRef}
          type='file'
          className='form-control'
          id='script-location'
        />
      </div>
      {scriptPath && (
        <div className='mt-3'>
          <AttentionText text='The script file was saved but it cannot be shown due to security reasons.' />
        </div>
      )}
      <div className='mt-4 mb-4'>
        <FloatingLabelInput
          helpText='Provide the executable name that will prefix the script name.'
          defaultValue={`${scriptExecutable ? scriptExecutable : ''}`}
          label={'Script Executable'}
          type={'text'}
          name={'script-executable'}
          required={true}
          ref={scriptExecutableRef}
        />
      </div>
      <div className='mt-4 mb-4'>
        <div className='d-flex mb-1'>
          <div className='flag-container ps-1'>
            <p className=''>Flag</p>
          </div>
          <div className='ps-1 mb-2'>
            <p className=''>Input Description</p>
          </div>
        </div>
        {scriptFlagsRowsRefs.map((scriptFlagsRowRefs, index) => (
          <FlagRow
            key={index}
            index={index}
            ref={scriptFlagsRowRefs}
            handleRemoveFlag={handleRemoveFlag}
            handleToggleRequiredFlag={handleToggleRequiredFlag}
          />
        ))}
        <div className='d-flex mt-2 align-items-center'>
          <button
            className={`me-3 btn btn-info github-arrow d-flex align-items-center justify-content-center flag-icon-button-add`}
            onClick={handleAddFlag}
          >
            <Icon className='flag-icon-add' icon='ic:round-plus' />
          </button>
          <AttentionText text='The asterix button sets a flag as required.' />
        </div>
      </div>
    </>
  );
});

export default ScriptsImportPageTwo;
