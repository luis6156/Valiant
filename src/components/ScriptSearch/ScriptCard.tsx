import { Icon } from '@iconify/react';
import React from 'react';
import ExternalLink from '../ExternalLink';

interface Props {
  url?: string;
  name: string;
  description: string;
  inputTags: string[];
  outputTags: string[];
  speed: string;
  successRate: string;
}

const ScriptCard = ({
  url,
  name,
  description,
  inputTags,
  outputTags,
  speed,
  successRate,
}: Props) => {
  return (
    <>
      <div className='script-card-bg'>
        <div className='mx-3'>
          <div className='pt-2 d-flex justify-content-between align-items-center'>
            <p className='script-card-name'>{name}</p>
            <ExternalLink href={url || ''} underline={false}>
              <Icon className='github-row-icon-brand' icon='bi:github' />
            </ExternalLink>
          </div>
          <div className='mt-3'>
            <p className='script-card-desc'>{description}</p>
          </div>
          <div className='mt-3'>
            <p className='script-card-tags'>Input Tags</p>
            {inputTags
              .sort((a, b) => a.length - b.length)
              .slice(0, 5)
              .map((tag, index) => (
                <div key={index} className='github-tag mt-2'>
                  {tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
                </div>
              ))}
          </div>
          <div className='mt-3'>
            <p className='script-card-tags'>Output Tags</p>
            {outputTags
              .sort((a, b) => a.length - b.length)
              .slice(0, 5)
              .map((tag, index) => (
                <div key={index} className='github-tag mt-2'>
                  {tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
                </div>
              ))}
          </div>
          <div className='mt-3'>
            <p className='mb-2 script-card-tags'>Script Speed</p>
            <div className='script-card-bg-slide'>
              <div className={`script-card-slide-${speed}`}></div>
            </div>
          </div>
          <div className='mt-3'>
            <p className='mb-2 script-card-tags'>Script Success Rate</p>
            <div className='script-card-bg-slide'>
              <div className={`script-card-slide-${successRate}`}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScriptCard;
