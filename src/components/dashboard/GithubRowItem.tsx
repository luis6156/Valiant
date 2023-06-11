import React from 'react';

import '../../styles/rowItem.scss';
import '../../styles/card.scss';

import ExternalLink from '../ExternalLink';
import { Icon } from '@iconify/react';

interface Props {
  title: string;
  description: string;
  author: string;
  stars: number;
  lastUpdated: string;
  tags: string[];
  url: string;
  language: string;
}

const calculateDaysSinceUpdate = (lastUpdatedDate: string) => {
  const currentDate = new Date();
  const updatedDate = new Date(lastUpdatedDate);

  // Calculate the difference in milliseconds
  const timeDifference = currentDate.getTime() - updatedDate.getTime();

  // Convert the difference to days
  const days = Math.floor(timeDifference / (1000 * 3600 * 24));

  return days;
};

const GithubRowItem = ({
  title,
  description,
  author,
  stars,
  lastUpdated,
  tags,
  url,
  language,
}: Props) => {
  const limitedDescription =
    description && description.length > 100
      ? `${description.substring(0, 100)}...`
      : description || 'No description provided, please visit the GitHub page.';

  return (
    <div className='github-row me-3'>
      <div className='github-row-accent'></div>
      <div className='row ms-3'>
        <div className='col-12 mt-1'>
          <div className='d-flex justify-content-between'>
            <div className='github-row-title cursor-pointer'>
              <ExternalLink href={url} underline={false}>
                {title}
              </ExternalLink>
            </div>
            <div className='d-flex align-items-center me-4'>
              {language && (
                <div className='d-flex align-items-center mt-1'>
                  <div
                    className={`github-language ${
                      language === 'Python'
                        ? 'github-language-primary'
                        : 'github-language-secondary'
                    }`}
                  ></div>
                  <div className='github-row-icon-text github-row-icon-text-lower'>
                    {language}
                  </div>
                </div>
              )}
              <div className='ms-3'>
                <Icon className='github-row-icon-brand' icon='bi:github' />
              </div>
            </div>
          </div>
        </div>
        <div className='col-12'>
          <div className='github-row-description'>{limitedDescription}</div>
        </div>
        <div className='col-12 github-row-stats'>
          <div className='d-flex align-items-center'>
            <div className='me-3 d-flex align-items-center'>
              <Icon
                className='github-row-icon me-1'
                icon='material-symbols:person'
              />
              <span className='github-row-icon-text'>{author}</span>
            </div>
            <div className='me-3 d-flex align-items-center'>
              <Icon className='github-row-icon me-1' icon='octicon:star-16' />
              <span className='github-row-icon-text'>
                {stars > 1000 ? `${Number(stars / 1000).toFixed(1)}k` : stars}
              </span>
            </div>
            <div className='me-3 d-flex align-items-center'>
              <span className='github-row-icon-text github-row-icon-text-lower'>
                {`Last updated ${calculateDaysSinceUpdate(lastUpdated)} days ago`}
              </span>
            </div>

            <div className='d-flex ms-auto me-3'>
              {tags
                .sort((a, b) => a.length - b.length)
                .slice(0, 4)
                .map((tag, index) => (
                  <div key={index} className='github-tag'>
                    {tag.length > 7 ? `${tag.slice(0, 7)}...` : tag}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubRowItem;
