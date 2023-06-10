import { Icon } from '@iconify/react';
import React from 'react';

interface Props {
  pillValues: string[];
  handleTagClick: (index: number) => void;
}

const PillTag = ({ pillValues, handleTagClick }: Props) => {
  return (
    <div className='d-flex flex-wrap justify-content-center'>
      {pillValues.map((pillValue, index) => (
        <div
          onClick={() => handleTagClick(index)}
          className='github-tag cursor-pointer d-flex align-items-center mt-1'
        >
          {pillValue}
          <div className='ms-1 github-close-circle d-flex align-items-center justify-content-center'>
            <Icon className='github-close' icon='ic:round-close' />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PillTag;
