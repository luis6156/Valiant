import AttentionText from '@/components/AttentionText';
import ExternalLink from '@/components/ExternalLink';
import {
  ScriptFlagFormat,
  ScriptVisualizerFormat,
} from '@/contexts/ImportScriptContext';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface Props {
  url?: string;
  scriptExecutable: string;
  scriptPath: string;
  name: string;
  description: string;
  flags: ScriptFlagFormat[];
  speed: string;
  successRate: string;
  visualizers: ScriptVisualizerFormat[];
  outputFile?: string;
  handleGoBack: () => void;
}

const ScriptRun = ({
  url,
  scriptExecutable,
  scriptPath,
  name,
  description,
  flags,
  speed,
  successRate,
  visualizers,
  outputFile,
  handleGoBack,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleRunScript = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    const formInputs = event.currentTarget.elements;
    const executionName = (formInputs[0] as HTMLInputElement).value;
    const args = [];

    for (let i = 1; i < formInputs.length; i++) {
      const input = formInputs[i] as HTMLInputElement;
      if (input.name === 'argument' && input.value) {
        args.push({
          value: input.value,
        });
      } else if (input.type === 'text' && input.value) {
        args.push({
          name: input.id,
          value: input.value,
        });
      } else if (input.type === 'checkbox' && input.checked) {
        args.push({
          name: input.id,
        });
      }
    }

    console.log(
      'run-script from renderer with:',
      executionName,
      scriptExecutable,
      scriptPath,
      name,
      args
    );

    setIsLoading(true);

    ipcRenderer.send('run-script', {
      executionName,
      scriptExecutable,
      scriptPath,
      scriptName: name,
      args,
      outputFile: outputFile ? outputFile : '', // TODO add variant with flag
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  function stripUrl(url: string) {
    const strippedUrl = url.replace(/^(https?:\/\/)?(www\.)?/i, '');
    return strippedUrl;
  }

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
        <form onSubmit={handleRunScript}>
          <p className='mb-3 script-description'>{description}</p>
          <div className='mb-4'>
            <p>Execution Name</p>
            <input
              id='execution-name'
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
                    id={flag.name}
                    name={flag.type}
                    className='form-control'
                    type='text'
                    required={flag.required}
                  ></input>
                </div>
                {flag.required && <AttentionText text='Flag is required.' />}
              </div>
            ))}
          <div className='mt-4'>
            <p className='mb-3'>Select all flags that you need:</p>
            {flags
              .filter((flag) => flag.type === 'checkbox')
              .map((flag, index) => (
                <div key={index} className='mb-2'>
                  <input
                    id={flag.name}
                    type='checkbox'
                    className='form-check-input'
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
            {error && (
              <div className='mb-3'>
                <AttentionText text='' danger={error} />
              </div>
            )}
            <button
              disabled={isLoading}
              type='submit'
              className='w-100 btn btn-primary'
            >
              {isLoading ? 'Script Started' : 'Run Script'}
            </button>
          </div>
        </form>
      </div>
      <div className='col'>
        <div className='script-container-right'>
          {url && (
            <div className='hover-glow d-flex justify-content-start'>
              <ExternalLink href={url} underline={false}>
                <div className='d-flex align-items-center'>
                  <Icon className='github-row-icon-brand' icon='bi:github' />
                  <h5 className='m-0 ms-2'>{stripUrl(url)}</h5>
                </div>
              </ExternalLink>
            </div>
          )}
        </div>
        <div className='mt-3'>
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
