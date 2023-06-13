import React, {
  RefObject,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FormDataType } from './ScriptsImport';
import AttentionText from '@/components/AttentionText';
import { Icon } from '@iconify/react';
import FlagRow, { FlagsRowRefs } from './FlagRow';

interface Props {
  formData: FormDataType;
  requiredFlags: boolean[];
  setRequiredFlags: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export interface RefsStepTwo {
  scriptFileRef: React.RefObject<HTMLInputElement>;
  scriptFlagsRowsRefs: React.RefObject<FlagsRowRefs>[];
}

const ScriptsImportPageThree = forwardRef<RefsStepTwo, Props>(
  ({ formData, requiredFlags, setRequiredFlags }: Props, ref) => {
    const scriptFileRef = useRef<HTMLInputElement>(null);
    const [scriptFlagsRowsRefs, setScriptFlagsRowsRefs] = useState<
      React.RefObject<FlagsRowRefs>[]
    >([createRef<FlagsRowRefs>()]);

    useEffect(() => {
      if (scriptFlagsRowsRefs.length === 1 && requiredFlags.length === 0) {
        setRequiredFlags([false]);
      } else if (formData.scriptFlags.length > 0) {
        setScriptFlagsRowsRefs(
          formData.scriptFlags.map(() => createRef<FlagsRowRefs>())
        );

        setRequiredFlags(
          formData.scriptFlags.map(
            (_, index) => formData.scriptFlags[index].required
          )
        );
      }
    }, []);

    useImperativeHandle(ref, () => ({
      scriptFileRef,
      scriptFlagsRowsRefs,
    }));

    const handleAddFlag = () => {
      setScriptFlagsRowsRefs((prevFlagsRowsRefs) => [
        ...prevFlagsRowsRefs,
        createRef<FlagsRowRefs>(),
      ]);

      setRequiredFlags((prevRequiredFlags) => [...prevRequiredFlags, false]);
    };

    const handleRemoveFlag = (index: number) => {
      if (scriptFlagsRowsRefs.length > 1) {
        setRequiredFlags((prevRequiredFlags) =>
          prevRequiredFlags.filter((_, i) => i !== index)
        );

        setScriptFlagsRowsRefs((prevFlagsRowsRefs) => {
          // Shift the values for flag rows above the removed index
          for (let i = index; i < prevFlagsRowsRefs.length - 1; i++) {
            const flagsRowRef = prevFlagsRowsRefs[i].current!;
            const nextFlagsRowRef = prevFlagsRowsRefs[i + 1].current!;

            flagsRowRef.flagRef.current!.value =
              nextFlagsRowRef.flagRef.current!.value;
            flagsRowRef.descriptionRef.current!.value =
              nextFlagsRowRef.descriptionRef.current!.value;
          }

          return prevFlagsRowsRefs.slice(0, -1); // Remove the last row
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
          <div className='d-flex mb-1'>
            <div className='flag-container ps-1'>
              <p className=''>Flag</p>
            </div>
            <div className='ps-1 mb-2'>
              <p className=''>Input Description</p>
            </div>
          </div>
          {scriptFlagsRowsRefs.map((flagsRowRefs, index) => (
            <FlagRow
              formData={formData}
              key={index}
              index={index}
              handleRemoveFlag={handleRemoveFlag}
              requiredFlags={requiredFlags}
              setRequiredFlags={setRequiredFlags}
              ref={flagsRowRefs}
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
  }
);

export default ScriptsImportPageThree;
