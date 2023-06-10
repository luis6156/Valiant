import { useEffect, useState } from 'react';
import GithubCard from './GithubCard';
import { Icon } from '@iconify/react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import FloatingLabelInput from '../FloatingLabelInput';
import AttentionText from '../AttentionText';
import FloatingLabelTextarea from '../FloatingLabelTextarea';

const FETCH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const ipcRenderer = window.ipcRenderer;

interface Repository {
  full_name: string;
  description: string;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  language: string;
}

const GithubCardsSection = () => {
  const [cards, setCards] = useState<Repository[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [numCardsToShow, setNumCardsToShow] = useState(getNumCardsToShow());

  useEffect(() => {
    const fetchData = async () => {
      try {
        let repositories = [];
        let existsFile = false;

        const lastFetchTimestamp = localStorage.getItem('lastFetchTimestamp');
        const currentTime = Date.now();

        const existsFilePromise = new Promise<boolean>((resolve) => {
          ipcRenderer.send('fs-exists-sync-github-monthly', {});
          ipcRenderer.on('fs-exists-sync-github-monthly-reply', (data) => {
            resolve(data);
          });
        });

        existsFile = await existsFilePromise;

        if (
          !lastFetchTimestamp ||
          currentTime - Number(lastFetchTimestamp) > FETCH_INTERVAL ||
          !existsFile
        ) {
          // Fetch data from github api
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so adding 1
          const lastMonthStart = `${currentYear}-${(currentMonth - 1)
            .toString()
            .padStart(2, '0')}-01`;
          const lastMonthEnd = `${currentYear}-${currentMonth
            .toString()
            .padStart(2, '0')}-01`;
          const url = `https://api.github.com/search/repositories?q=created:${lastMonthStart}..${lastMonthEnd}+osint+python`;

          const response = await fetch(url);

          const data = await response.json();
          repositories = data.items;

          console.log(
            `fetched data from github api for github monthly cards ${url}`
          );

          ipcRenderer.send('fs-writefile-sync-github-monthly', {
            data: JSON.stringify(repositories),
          });

          localStorage.setItem('lastFetchTimestamp', String(currentTime));
        } else {
          console.log('reading from local file');
          const readFilePromise = new Promise<string>((resolve) => {
            ipcRenderer.send('fs-readfile-sync-github-monthly', {});
            ipcRenderer.on('fs-readfile-sync-github-monthly-reply', (data) => {
              resolve(data);
            });
          });
          repositories = JSON.parse(await readFilePromise);
        }

        setCards(repositories);
      } catch (error) {}

      setIsLoading(false);
    };

    fetchData();
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

  const handleRightArrowClick = () => {
    setStartIndex((prev) => prev + 1);
  };

  const handleLeftArrowClick = () => {
    setStartIndex((prev) => prev - 1);
  };

  function getNumCardsToShow() {
    if (window.innerWidth < 1200) {
      return 2;
    } else if (window.innerWidth < 1600) {
      return 3;
    } else {
      return 4;
    }
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h5 className='header-main'>New GitHub Scripts from last month</h5>
        <div className='d-flex align-items-center me-3'>
          <button
            data-bs-toggle='dropdown'
            aria-expanded='false'
            data-bs-auto-close='outside'
            className='btn btn-info dropdown-toggle dropdown-toggle-no-caret filters d-flex align-items-center'
          >
            <Icon className='filters-icon' icon='fluent:filter-16-filled' />
            <div className='filters-text'>Filters</div>
          </button>
          <div className='dropdown-menu dropdown-menu-end dropdown-filters-cards p-3'>
            <form>
              <div className='mt-3 mb-3'>
                <FloatingLabelInput
                  required={false}
                  ref={null}
                  name='start-date'
                  type='text'
                  label='Start Date'
                />
              </div>
              <div className='mb-3'>
                <FloatingLabelInput
                  required={false}
                  ref={null}
                  name='end-date'
                  type='text'
                  label='End Date'
                />
              </div>
              <div className='mb-3 github-tags-filter-container'>
                <FloatingLabelInput
                  required={false}
                  ref={null}
                  name='topics'
                  type='text'
                  label='Topics'
                  createPills={true}
                />
              </div>
              <div className='mb-3'>
                <AttentionText text='Date format is YYYY-MM-DD' />
              </div>
              <button className='mb-1 btn btn-primary w-100'>Apply</button>
            </form>
          </div>
        </div>
      </div>
      <div className='d-flex align-items-center'>
        <button
          className={`btn btn-info me-2 github-arrow d-flex align-items-center ${
            startIndex === 0 || isLoading ? 'disabled' : ''
          }`}
          onClick={handleLeftArrowClick}
        >
          <Icon icon='ic:round-arrow-left' />
        </button>

        <div className='row justify-content-center w-100'>
          {isLoading ? (
            Array.from({ length: numCardsToShow }).map((_, index) => (
              <div
                className={`d-flex justify-content-center col-md-${
                  numCardsToShow === 3 ? '4' : numCardsToShow === 2 ? '6' : '3'
                }`}
                key={index}
              >
                <Skeleton className='github-card-skeleton' />
              </div>
            ))
          ) : cards.length === 0 ? (
            <div className='col'>
              <div className='github-card-none'>
                <div className='github-title'>No repositories found.</div>
                <div className='github-description m-0'>
                  Please try other filters.
                </div>
              </div>
            </div>
          ) : (
            cards
              .slice(startIndex, startIndex + numCardsToShow)
              .map((repository, index) => (
                <div
                  className={`d-flex justify-content-center
                    col-md-${
                      numCardsToShow === 3
                        ? '4'
                        : numCardsToShow === 2
                        ? '6'
                        : '3'
                    }`}
                  key={index}
                >
                  <GithubCard
                    title={repository.full_name}
                    description={repository.description}
                    url={repository.html_url}
                    tags={repository.topics}
                    stars={repository.stargazers_count}
                    language={repository.language}
                  />
                </div>
              ))
          )}
        </div>

        <button
          className={`btn btn-info ms-2 github-arrow d-flex align-items-center ${
            startIndex + numCardsToShow >= cards.length ||
            isLoading ||
            cards.length === 0
              ? 'disabled'
              : ''
          }`}
          onClick={handleRightArrowClick}
        >
          <Icon icon='ic:round-arrow-right' />
        </button>
      </div>
    </>
  );
};

export default GithubCardsSection;
