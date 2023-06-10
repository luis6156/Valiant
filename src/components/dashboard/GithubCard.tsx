import { Icon } from '@iconify/react';

import '../../styles/card.scss';
import ExternalLink from '../ExternalLink';
import { useEffect, useState } from 'react';

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
  const [numTags, setNumTags] = useState(4);
  const limitedDescription =
    description && description.length > 100
      ? `${description.substring(0, 100)}...`
      : description || 'No description provided, please visit the GitHub page.';

  useEffect(() => {
    const handleResize = () => {
      setNumTags(getNumTagsToShow());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function getNumTagsToShow() {
    if (window.innerWidth < 850) {
      return 3;
    } else {
      return 4;
    }
  }

  return (
    <div className='welcome-banner github-card position-relative'>
      <div className='github-padding'>
        <div className='d-flex justify-content-between'>
          <div className='github-title'>
            {title.split('/').map((part, index) => (
              <ExternalLink href={url} underline={false} key={index}>
                {index > 0 && (
                  <>
                    /
                    <br />
                    <strong>
                      {part.length > 20 ? `${part.slice(0, 20)}...` : part}
                    </strong>
                  </>
                )}
                {index === 0 && part}
              </ExternalLink>
            ))}
          </div>

          <div className='d-flex flex-column align-items-end mt-1'>
            <div className='d-flex align-items-center'>
              <Icon className='github-icon' icon='octicon:star-16' />
              <div className='github-description github-stats m-0'>
                {stars > 1000 ? `${Number(stars / 1000).toFixed(1)}k` : stars}
              </div>
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
            .slice(0, numTags)
            .map((tag, index) => (
              <div key={index} className='github-tag'>
                {tag.length > 7 ? `${tag.slice(0, 7)}...` : tag}
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
