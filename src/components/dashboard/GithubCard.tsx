import { Icon } from '@iconify/react';

import '../../styles/card.scss';
import ExternalLink from '../ExternalLink';

interface Props {
  title: string;
  description: string;
  tags: string[];
  url: string;
  stars: number;
  language: string;
}

const GithubCard = ({
  title,
  description,
  tags,
  url,
  stars,
  language,
}: Props) => {
  const limitedDescription =
    description && description.length > 100
      ? `${description.substring(0, 100)}...`
      : description || 'No description provided, please visit the GitHub page.';
  const limitedTitle =
    title && title.length > 22 ? `${title.substring(0, 22)}...` : title;

  return (
    <div className='welcome-banner github-card position-relative'>
      <div className='github-padding'>
        <div className='d-flex justify-content-between'>
          <div className='github-title'>
            {limitedTitle.split('/').map((part, index) => (
              <ExternalLink href={url} underline={false} key={index}>
                {index > 0 && (
                  <>
                    /
                    <br />
                    <strong>{part}</strong>
                  </>
                )}
                {index === 0 && part}
              </ExternalLink>
            ))}
          </div>

          <div className='d-flex flex-column align-items-end mt-1'>
            <div className='d-flex align-items-center'>
              <Icon className='github-icon' icon='octicon:star-16' />
              <div className='github-description github-stats m-0'>{stars}</div>
            </div>
            <div className='github-language-wrapper d-flex align-items-center'>
              {language && (
                <>
                  <div
                    className={`github-language ${
                      language === 'Python'
                        ? 'github-language-primary'
                        : 'github-language-secondary'
                    }`}
                  ></div>
                  <div className='github-description github-stats m-0'>
                    {language}
                  </div>
                </>
              )}
            </div>
          </div>
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
          {/* <div className='github-icon-pos'>
            <ExternalLink href={url}>
              <Icon
                className='github-icon github-icon-blink'
                icon='bi:github'
              />
            </ExternalLink>
          </div> */}
        </div>
        <div className='d-flex'>
          <div className='github-color-big'></div>
          <div className='github-color-medium'></div>
          <div className='github-color-small'></div>
        </div>
      </div>
    </div>
  );
};

export default GithubCard;
