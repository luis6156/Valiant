import React, { useEffect, useState } from 'react';
import GithubCard from './GithubCard';
import { Icon } from '@iconify/react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { start } from 'repl';

const FETCH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const ipcRenderer = window.ipcRenderer;

interface Repository {
  full_name: string;
  description: string;
  html_url: string;
  topics: string[];
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
    return window.innerWidth >= 1600 ? 4 : 3;
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h5 className='header-main'>New GitHub Scripts from last month!</h5>
        <div className='d-flex align-items-center me-3'>
          <button className='btn btn-info filters d-flex align-items-center'>
            <Icon className='filters-icon' icon='fluent:filter-16-filled' />
            <div className='filters-text'>Filters</div>
          </button>
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
                className={`${numCardsToShow === 3 ? 'col-md-4' : 'col-md-3'}`}
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
                  className={`d-flex justify-content-center ${
                    numCardsToShow === 3 ? 'col-md-4' : 'col-md-3'
                  }`}
                  key={index}
                >
                  <GithubCard
                    title={repository.full_name}
                    description={repository.description}
                    url={repository.html_url}
                    tags={repository.topics}
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
