import { FormEvent, useEffect, useRef, useState } from 'react';
import GithubCard from './GithubCard';
import { Icon } from '@iconify/react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import FloatingLabelInput from '../FloatingLabelInput';
import AttentionText from '../AttentionText';
import { useGithubFilters } from '@/contexts/GithubFiltersContext';
import useFetchOnThreshold from '@/hooks/useFetchOnThreshold';

const FETCH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const GITHUB_CARDS_FILE = 'github-cards.json';
const STD_CARD_TAGS = ['osint'];

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
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const {
    startDateCards,
    setStartDateCards,
    endDateCards,
    setEndDateCards,
    tagsCards,
    setTagsCards,
  } = useGithubFilters();
  const [lastFetchTsCards, setLastFetchTsCards] = useState(Date.now());
  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');

  const fetchDataGithub = async (
    startDate: string,
    endDate: string,
    tags: string[],
    isFilterApplied: boolean
  ) => {
    // Fetch data from github api
    const lastFetchTimestamp = Date.now();
    let query =
      startDate === '' && endDate === ''
        ? ''
        : `created:${startDate}..${endDate}`;

    if (tags.length > 0) {
      const queryTags = tags.join('+');
      query += `+${queryTags}`;
    }

    const url = `https://api.github.com/search/repositories?q=${query}`;

    const response = await fetch(url);

    const data = await response.json();
    const repositories = data.items;

    console.log(`fetched data from github api for github monthly cards ${url}`);

    // Set custom cards to false and write to file
    ipcRenderer.send('fs-writefile-sync', {
      data: JSON.stringify({
        isFilterApplied,
        lastFetchTimestamp,
        startDate,
        endDate,
        tags,
        repositories,
      }),
      fileName: GITHUB_CARDS_FILE,
    });

    setStartDateCards(startDate);
    setEndDateCards(endDate);
    setTagsCards(tags);
    setIsFilterApplied(isFilterApplied);

    setLastFetchTsCards(lastFetchTimestamp);

    return repositories;
  };

  useFetchOnThreshold({
    threshold: FETCH_INTERVAL,
    fetchFunction: async () => {
      if (!isFilterApplied) {
        const { lastMonthStart, lastMonthEnd } = computeLastMonth();
        const repositories = await fetchDataGithub(
          lastMonthStart,
          lastMonthEnd,
          STD_CARD_TAGS,
          false
        );
        setCards(repositories);
      }
    },
    lastFetchTime: lastFetchTsCards,
  });

  const computeLastMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so adding 1
    const lastMonthStart = `${currentYear}-${(currentMonth - 1)
      .toString()
      .padStart(2, '0')}-01`;
    const lastMonthEnd = `${currentYear}-${currentMonth
      .toString()
      .padStart(2, '0')}-01`;

    return { lastMonthStart, lastMonthEnd };
  };

  useEffect(() => {
    const updateRepositories = async () => {
      try {
        let repositories: Repository[] = [];
        let existsFile = false;

        const existsFilePromise = new Promise<boolean>((resolve) => {
          ipcRenderer.send('fs-exists-sync', { fileName: GITHUB_CARDS_FILE });
          ipcRenderer.on('fs-exists-sync-reply', (data) => {
            resolve(data);
          });
        });

        existsFile = await existsFilePromise;

        // Check file does not exist
        if (!existsFile) {
          // Compute last month
          const { lastMonthStart, lastMonthEnd } = computeLastMonth();

          // Get data from github api
          repositories = await fetchDataGithub(
            lastMonthStart,
            lastMonthEnd,
            STD_CARD_TAGS,
            false
          );
        } else {
          // Read file
          console.log('reading from local file');
          const readFilePromise = new Promise<string>((resolve) => {
            ipcRenderer.send('fs-readfile-sync', {
              fileName: GITHUB_CARDS_FILE,
            });
            ipcRenderer.on('fs-readfile-sync-reply', (data) => {
              resolve(data);
            });
          });

          const fileData = await readFilePromise;

          const {
            isFilterApplied: isFilterAppliedFile,
            lastFetchTimestamp,
            startDate: startDateFile,
            endDate: endDateFile,
            tags: tagsFile,
            repositories: repositoriesFile,
          } = JSON.parse(fileData);

          if (
            (!tagsFile && !startDateFile && !endDateFile) ||
            !lastFetchTimestamp ||
            !repositoriesFile
          ) {
            throw new Error('Invalid data in file');
          }

          // Check if data is stale or not timestamped
          if (
            !lastFetchTimestamp ||
            Date.now() - Number(lastFetchTimestamp) > FETCH_INTERVAL
          ) {
            let startDate = '';
            let endDate = '';

            // If not custom cards, recompute dates as last month
            if (!isFilterAppliedFile) {
              // Compute last month
              const { lastMonthStart, lastMonthEnd } = computeLastMonth();

              startDate = lastMonthStart;
              endDate = lastMonthEnd;
            } else {
              startDate = startDateFile;
              endDate = endDateFile;
            }

            // Refetch data
            repositories = await fetchDataGithub(
              startDate,
              endDate,
              tagsFile,
              true
            );
          } else {
            setStartDateCards(startDateFile);
            setEndDateCards(endDateFile);
            setTagsCards(tagsFile);
            setIsFilterApplied(isFilterAppliedFile);
            setLastFetchTsCards(lastFetchTimestamp);

            repositories = repositoriesFile;
          }
        }

        // Set repositories
        setCards(repositories);
      } catch (error) {
        console.log(error);
        setCards([]);
      }

      setIsLoading(false);
    };

    updateRepositories();
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

  const handleFilterCardsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('applying filter cards');

    if (
      (!startDateRef.current &&
        !endDateRef.current &&
        tagsCards.length === 0) ||
      (!startDateRef.current?.value &&
        !endDateRef.current?.value &&
        tagsCards.length === 0)
    ) {
      setError('Please fill in at least one field');
      return;
    }

    const newStartDate = startDateRef.current?.value || '';
    let newEndDate = '';

    // If no end date, set it to today or nothing if no start date
    if (!endDateRef.current || endDateRef.current.value === '') {
      if (newStartDate === '') {
        // No start, no end date
        newEndDate = '';
      } else {
        // No end date, but start date
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        newEndDate = `${year}-${month}-${day}`;
      }
    } else {
      newEndDate = endDateRef.current?.value;
    }

    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (newStartDate !== '') {
      if (!dateFormatRegex.test(newStartDate)) {
        setError('Start date format is invalid');
        return;
      }
    }

    if (newEndDate !== '') {
      if (!dateFormatRegex.test(newEndDate)) {
        setError('End date format is invalid');
        return;
      }
    }

    setIsLoading(true);
    setStartIndex(0);
    setError('');

    // Fetch data
    try {
      const repositories = await fetchDataGithub(
        newStartDate,
        newEndDate,
        tagsCards,
        true
      );

      if (!repositories) {
        throw new Error('No repositories found');
      }

      setCards(repositories);
    } catch (error) {
      console.log(error);
      setCards([]);
    }

    setIsLoading(false);
  };

  const handleResetFilters = async () => {
    setIsLoading(true);
    setStartIndex(0);
    setError('');

    const { lastMonthStart, lastMonthEnd } = computeLastMonth();

    try {
      const repositories = await fetchDataGithub(
        lastMonthStart,
        lastMonthEnd,
        STD_CARD_TAGS,
        false
      );

      if (!repositories) {
        throw new Error('No repositories found');
      }

      setCards(repositories);
    } catch (error) {
      console.log(error);
      setCards([]);
    }

    setIsLoading(false);
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
        {isFilterApplied ? (
          <h5 className='header-main'>GitHub Scripts custom filters</h5>
        ) : (
          <h5 className='header-main'>New GitHub Scripts from last month</h5>
        )}
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
            <form onSubmit={handleFilterCardsSubmit}>
              <div className='mt-3 mb-3'>
                <FloatingLabelInput
                  required={false}
                  ref={startDateRef}
                  name='start-date'
                  type='text'
                  label='Start Date'
                  defaultValue={startDateCards}
                  maxLength={10}
                />
              </div>
              <div className='mb-3'>
                <FloatingLabelInput
                  required={false}
                  ref={endDateRef}
                  name='end-date'
                  type='text'
                  label='End Date'
                  defaultValue={endDateCards}
                  maxLength={10}
                />
              </div>
              <div className='mb-3 github-tags-filter-container'>
                <FloatingLabelInput
                  required={false}
                  name='topics'
                  type='text'
                  label='Topics'
                  maxLength={15}
                  pillValues={tagsCards}
                  setPillValues={setTagsCards}
                />
              </div>
              <div className='mb-3'>
                <AttentionText
                  danger={error}
                  text='Date format is YYYY-MM-DD'
                />
              </div>
              <button className='mb-3 btn btn-primary w-100'>Apply</button>
              <button
                onClick={handleResetFilters}
                className='mb-1 btn btn-secondary w-100'
              >
                Restore
              </button>
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
                  Please try other filters or apply the default monthly filter
                  to reset.
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
