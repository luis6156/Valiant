import AttentionText from '@/components/AttentionText';
import {
  ScriptFlagFormat,
  ScriptVisualizerFormat,
} from '@/contexts/ImportScriptContext';
import { Icon } from '@iconify/react';

interface Props {
  name: string;
  description: string;
  flags: ScriptFlagFormat[];
  speed: string;
  successRate: string;
  visualizers: ScriptVisualizerFormat[];
  handleGoBack: () => void;
}

const ScriptRun = ({
  name,
  description,
  flags,
  speed,
  successRate,
  visualizers,
  handleGoBack,
}: Props) => {
  return (
    <div className='row w-100'>
      <div className='col-7'>
        <div className='d-flex align-items-center mb-2'>
          <button
            className='btn btn-info github-arrow d-flex align-items-center me-3'
            onClick={handleGoBack}
          >
            <Icon icon='ic:round-arrow-left' />
          </button>
          <h5 className='script-name m-0'>{name}</h5>
        </div>
        <p className='mb-3 script-description'>{description}</p>
        <div className='mb-4'>
          <p>Execution Name</p>
          <input
            className='mb-2 form-control'
            type='text'
            required={true}
          ></input>
          <AttentionText text='Name is required as it will be used to quickly identify this run in the status page.' />
        </div>
        {flags
          .filter((flag) => flag.type === 'argument' || flag.type === 'flag')
          .map((flag, index) => (
            <div key={index} className='mb-3'>
              <p className='mb-1'>{`${flag.description
                .charAt(0)
                .toUpperCase()}${flag.description.slice(1)}`}</p>
              <div className='d-flex align-items-center mb-2'>
                <input
                  className='form-control'
                  type='text'
                  required={flag.required}
                ></input>
              </div>
              {flag.required && <AttentionText text='Flag is required.' />}
            </div>
          ))}
        <div className='mt-4'>
          <p className='mb-3'>Select all flags that you require:</p>
          {flags
            .filter((flag) => flag.type === 'checkbox')
            .map((flag, index) => (
              <div key={index} className='mb-2'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id={flag.name}
                />
                <label className='ms-2 form-check-label' htmlFor={flag.name}>
                  {`${flag.description
                    .charAt(0)
                    .toUpperCase()}${flag.description.slice(1)}`}
                </label>
                {flag.required && <AttentionText text='Flag is required.' />}
              </div>
            ))}
        </div>

        <div className='mt-4'>
          <button className='w-100 btn btn-primary'>Run Script</button>
        </div>
      </div>
      <div className='col'>
        <div className='script-container-right'>
          <p className='mb-2 script-card-tags'>Script Speed</p>
          <div className='script-card-bg-slide-special'>
            <div className={`script-card-slide-${speed}`}></div>
          </div>
        </div>
        <div className='mt-3'>
          <p className='mb-2 script-card-tags'>Script Success Rate</p>
          <div className='script-card-bg-slide-special'>
            <div className={`script-card-slide-${successRate}`}></div>
          </div>
        </div>
        <div className='mt-4'>
          <p className='mb-2 script-output'>Visualizers:</p>
          {visualizers.map((visualizer, index) => (
            <div key={index} className='mb-2 d-flex'>
              {visualizer.type === 'table' ? (
                <div className='d-flex justify-content-items align-items-center'>
                  <Icon
                    className='script-output-item'
                    icon='ph:table-fill'
                    width={20}
                    height={20}
                  />
                  <p className='ms-1 me-2 script-output-item'>Table:</p>
                </div>
              ) : visualizer.type === 'line-chart' ? (
                <div className='d-flex justify-content-items align-items-center'>
                  <Icon
                    className='script-output-item'
                    icon='lucide:line-chart'
                    width={20}
                    height={20}
                  />
                  <p className='ms-1 me-2 script-output-item'>Line Chart:</p>
                </div>
              ) : visualizer.type === 'scatter-chart' ? (
                <div className='d-flex justify-content-items align-items-center'>
                  <Icon
                    className='script-output-item'
                    icon='icon-park-outline:chart-scatter'
                    width={20}
                    height={20}
                  />
                  <p className='ms-1 me-2 script-output-item'>Scatter Chart:</p>
                </div>
              ) : visualizer.type === 'bar-chart' ? (
                <div className='d-flex justify-content-items align-items-center'>
                  <Icon
                    className='script-output-item'
                    icon='charm:chart-bar'
                    width={20}
                    height={20}
                  />
                  <p className='ms-1 me-2 script-output-item'>Bar Chart:</p>
                </div>
              ) : (
                <div className='d-flex justify-content-items align-items-center'>
                  <Icon
                    className='script-output-item'
                    icon='ic:round-pie-chart'
                    width={20}
                    height={20}
                  />
                  <p className='ms-1 me-2 script-output-item'>Pie Chart:</p>
                </div>
              )}
              {visualizer.type === 'table' ? (
                <p>All columns</p>
              ) : visualizer.type === 'line-chart' ||
                visualizer.type === 'bar-chart' ||
                visualizer.type === 'pie-chart' ? (
                <p>{`${visualizer.labelXColumn}, ${visualizer.labelYColumn}`}</p>
              ) : (
                <p>{`${visualizer.labelXColumn}, ${visualizer.labelYColumn}, ${visualizer.labelZColumn}`}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScriptRun;
