import FloatingLabelInput from '@/components/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/FloatingLabelTextarea';
import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ScriptDataType } from './ScriptsImport';
import AttentionText from '@/components/AttentionText';
import { Icon } from '@iconify/react';

interface Props {
  formData: ScriptDataType;
  visualizerType: string;
  setVisualizerType: React.Dispatch<React.SetStateAction<string>>;
  visualizerLabelXColumn: string;
  setVisualizerLabelXColumn: React.Dispatch<React.SetStateAction<string>>;
  visualizerLabelYColumn: string;
  setVisualizerLabelYColumn: React.Dispatch<React.SetStateAction<string>>;
  visualizerLabelZColumn: string;
  setVisualizerLabelZColumn: React.Dispatch<React.SetStateAction<string>>;
  outputType: string;
  setOutputType: React.Dispatch<React.SetStateAction<string>>;
  outputName: string;
  setOutputName: React.Dispatch<React.SetStateAction<string>>;
}

const ScriptsImportPageFour = ({
  formData,
  visualizerType,
  setVisualizerType,
  visualizerLabelXColumn,
  setVisualizerLabelXColumn,
  visualizerLabelYColumn,
  setVisualizerLabelYColumn,
  visualizerLabelZColumn,
  setVisualizerLabelZColumn,
  outputType,
  setOutputType,
  outputName,
  setOutputName,
}: Props) => {
  const [numCardsToShow, setNumCardsToShow] = useState(getNumCardsToShow());
  const [showFlags, setShowFlags] = useState(false);
  const [showFilename, setShowFilename] = useState(false);

  useEffect(() => {
    setVisualizerLabelXColumn(
      formData.scriptColumns
        ? formData.scriptColumns[0]?.name
          ? formData.scriptColumns[0]?.name
          : ''
        : ''
    );
    setVisualizerLabelYColumn(
      formData.scriptColumns
        ? formData.scriptColumns[1]?.name
          ? formData.scriptColumns[1]?.name
          : ''
        : ''
    );
    setVisualizerLabelZColumn(
      formData.scriptColumns
        ? formData.scriptColumns[2]?.name
          ? formData.scriptColumns[2]?.name
          : ''
        : ''
    );

    setOutputType('stdout');
    setOutputName(
      formData.scriptFlags
        ? formData.scriptFlags[0]?.flag
          ? formData.scriptFlags[0]?.flag
          : ''
        : ''
    );

    setVisualizerType('');
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setNumCardsToShow(getNumCardsToShow());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function getNumCardsToShow() {
    if (window.innerWidth < 1200) {
      return 3;
    } else {
      return 5;
    }
  }

  const handleContainerClick = (type: string) => {
    setVisualizerType(type);
  };

  const handleLabelXChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setVisualizerLabelXColumn(selectedValue === 'none' ? '' : selectedValue);
  };

  const handleLabelYChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setVisualizerLabelYColumn(selectedValue === 'none' ? '' : selectedValue);
  };

  const handleLabelZChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setVisualizerLabelZColumn(selectedValue === 'none' ? '' : selectedValue);
  };

  const handleOutputTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    if (selectedValue === 'file') {
      setShowFlags(false);
      setShowFilename(true);

      setOutputType('file');
    } else if (selectedValue === 'output-flag') {
      setShowFilename(false);
      setShowFlags(true);

      setOutputType('output-flag');
    } else {
      setShowFilename(false);
      setShowFlags(false);

      setOutputType('stdout');
    }
  };

  const handleOutputNameFlagChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;

    setOutputName(selectedValue);
  };

  const handleOutputNameFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setOutputName(value);
  };

  return (
    <>
      <p className='import-steps-title mb-1'>Teach us what to show</p>
      <p className='import-steps-p mb-4'>
        Choose the data visualizer according to the script output data
      </p>
      <div className='container'>
        <div className='row justify-content-center'>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={() => handleContainerClick('line-chart')}
          >
            <div
              className={`${
                formData.scriptColumns.length < 2
                  ? 'visualizer-container-disabled'
                  : visualizerType === 'line-chart'
                  ? 'visualizer-container active'
                  : 'visualizer-container'
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon className='mt-3 visualizer-icon' icon='lucide:line-chart' />
              <span className='mb-3 mt-3 visualizer-text'>Line Chart</span>
            </div>
          </div>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={() => handleContainerClick('bar-chart')}
          >
            <div
              className={`${
                formData.scriptColumns.length < 2
                  ? 'visualizer-container-disabled'
                  : visualizerType === 'bar-chart'
                  ? 'visualizer-container active'
                  : 'visualizer-container'
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon className='mt-3 visualizer-icon' icon='charm:chart-bar' />
              <span className='mb-3 mt-3 visualizer-text'>Bar Chart</span>
            </div>
          </div>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={() => handleContainerClick('scatter-chart')}
          >
            <div
              className={`${
                formData.scriptColumns.length < 3
                  ? 'visualizer-container-disabled'
                  : visualizerType === 'scatter-chart'
                  ? 'visualizer-container active'
                  : 'visualizer-container'
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon
                className='mt-3 visualizer-icon'
                icon='icon-park-outline:chart-scatter'
              />
              <span className='mb-3 mt-3 visualizer-text'>Scatter Chart</span>
            </div>
          </div>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={() => handleContainerClick('pie-chart')}
          >
            <div
              className={`${
                formData.scriptColumns.length < 2
                  ? 'visualizer-container-disabled'
                  : visualizerType === 'pie-chart'
                  ? 'visualizer-container active'
                  : 'visualizer-container'
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon
                className='mt-3 visualizer-icon'
                icon='ic:round-pie-chart'
              />
              <span className='mb-3 mt-3 visualizer-text'>Pie Chart</span>
            </div>
          </div>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={() => handleContainerClick('table')}
          >
            <div
              className={`${
                visualizerType === 'table' ? 'active' : ''
              } visualizer-container d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon className='mt-3 visualizer-icon' icon='ph:table-fill' />
              <span className='mb-3 mt-3 visualizer-text'>Table</span>
            </div>
          </div>
          <div className='mt-3 mb-1 d-flex'>
            <div className='output-select-container'>
              <div className='mb-1'>
                <p className='ps-1'>Output Type</p>
              </div>
            </div>
            {showFilename ? (
              <div className='w-100'>
                <div className='ms-3 mb-1'>
                  <p className='ps-1'>Filename</p>
                </div>
              </div>
            ) : showFlags ? (
              <div className='w-100'>
                <div className='ms-3 mb-1'>
                  <p className='ps-1'>Flag</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className='mb-3 d-flex justify-content-between'>
            <div className='output-select-container'>
              <select
                defaultValue='stdout'
                className='form-select form-select-special'
                onChange={handleOutputTypeChange}
              >
                <option value='stdout'>stdout</option>
                <option value='file'>File</option>
                <option value='output-flag'>Output Flag</option>
              </select>
            </div>
            {showFilename ? (
              <div className='ps-3 w-100'>
                <input
                  placeholder='Filename'
                  type='text'
                  className='form-control form-control-special me-2'
                  onInput={handleOutputNameFileChange}
                />
              </div>
            ) : showFlags ? (
              <div className='ps-3 w-100'>
                <select
                  defaultValue={`${
                    formData.scriptFlags
                      ? formData.scriptFlags[0]?.flag
                        ? formData.scriptFlags[0]?.flag
                        : 'string'
                      : 'string'
                  }`}
                  className='form-select form-select-special'
                  aria-label='default'
                  onChange={handleOutputNameFlagChange}
                >
                  {formData.scriptFlags &&
                    formData.scriptFlags.map((flag, index) => (
                      <option key={index} value={flag.flag}>
                        {flag.flag}
                      </option>
                    ))}
                </select>
              </div>
            ) : null}
          </div>
          <div className='mb-4'>
            <AttentionText text='Output type and name are required as the visualizer needs to extract the data from a file type. Filename should be found in the exact location as the script.' />
          </div>
          {visualizerType === 'line-chart' ||
          visualizerType === 'bar-chart' ||
          visualizerType === 'scatter-chart' ||
          visualizerType === 'pie-chart' ? (
            <>
              <div className=''>
                <div className='mb-1'>
                  <p className='ps-1'>X Label</p>
                </div>
                <select
                  defaultValue={`${
                    formData.scriptColumns
                      ? formData.scriptColumns[0]?.name
                        ? formData.scriptColumns[0]?.name
                        : ''
                      : ''
                  }`}
                  className='form-select form-select-special'
                  aria-label='default'
                  onChange={handleLabelXChange}
                >
                  {formData.scriptColumns &&
                    formData.scriptColumns.map((column, index) => (
                      <option key={index} value={column.name}>
                        {column.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className='mt-3'>
                <div className='mb-1'>
                  <p className='ps-1'>Y Label</p>
                </div>
                <select
                  defaultValue={`${
                    formData.scriptColumns[1]?.name
                      ? formData.scriptColumns[1]?.name
                      : ''
                  }`}
                  className='form-select form-select-special'
                  aria-label='default'
                  onChange={handleLabelYChange}
                >
                  {formData.scriptColumns &&
                    formData.scriptColumns.map((column, index) => (
                      <option key={index} value={column.name}>
                        {column.name}
                      </option>
                    ))}
                </select>
              </div>
              {visualizerType === 'scatter-chart' && (
                <div className='mt-3'>
                  <div className='mb-1'>
                    <p className='ps-1'>Z Label</p>
                  </div>
                  <select
                    defaultValue={`${
                      formData.scriptColumns[2]?.name
                        ? formData.scriptColumns[2]?.name
                        : ''
                    }`}
                    className='form-select form-select-special'
                    aria-label='default'
                    onChange={handleLabelZChange}
                  >
                    {formData.scriptColumns &&
                      formData.scriptColumns.map((column, index) => (
                        <option key={index} value={column.name}>
                          {column.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </>
          ) : visualizerType === 'table' ? (
            <div className=''>
              <AttentionText text='This visualizer does not require any labels as all data will be displayed.' />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ScriptsImportPageFour;
