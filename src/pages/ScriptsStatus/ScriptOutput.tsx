import { Icon } from '@iconify/react';
import React from 'react';

interface Props {
  executionName: string;
  scriptName: string;
  output: string;
  handleGoBack: () => void;
}

const ScriptOutput = ({ executionName, scriptName, output, handleGoBack }: Props) => {
  return (
    <>
      <div className='d-flex align-items-center mb-2'>
        <button
          className='btn btn-info github-arrow d-flex align-items-center me-3'
          onClick={handleGoBack}
        >
          <Icon icon='ic:round-arrow-left' />
        </button>
        <h5 className='script-name m-0'>{executionName} ➜⇢→ {scriptName}</h5>
      </div>
      <p>{output}</p>
    </>
  );
};

export default ScriptOutput;
