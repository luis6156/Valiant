import { Icon } from '@iconify/react';

import '../../styles/card.scss';
import ExternalLink from '../ExternalLink';

interface Props {
  title: string;
  description: string;
  tags: string[];
  url: string;
}

const GithubCard = ({ title, description, tags, url }: Props) => {
  const limitedDescription =
    description && description.length > 110
      ? `${description.substring(0, 110)}...`
      : description || 'No description provided, please visit the GitHub page.';
  const limitedTitle =
    title && title.length > 22 ? `${title.substring(0, 22)}...` : title;

  return (
    <div className='welcome-banner github-card position-relative'>
      <div className='github-padding'>
        <div className='d-flex align-items-center justify-content-between'>
          <div className='github-title'>{limitedTitle}</div>
          <ExternalLink href={url}>
            <Icon className='github-icon' icon='bi:github' />
          </ExternalLink>
        </div>
        <div className='github-description'>{limitedDescription}</div>
        <div className='github-tags-wrapper d-flex position-absolute'>
          {tags
            .sort((a, b) => a.length - b.length)
            .slice(0, 4)
            .map((tag, index) => (
              <div key={index} className='github-tag'>
                {tag}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GithubCard;
