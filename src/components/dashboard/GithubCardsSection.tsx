import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import FloatingLabelInput from '../FloatingLabelInput';
import AttentionText from '../AttentionText';
import { Repository, useFetchGithubData } from '@/utils/githubApiUtils';
import { useGithubFilters } from '@/contexts/GithubFiltersContext';
import GithubCard from './GithubCard';

const GITHUB_CARDS_FILE = 'github-cards.json';
const STD_CARD_TAGS = ['osint'];

const GithubCardsSection = () => {
  const [numCardsToShow, setNumCardsToShow] = useState(getNumCardsToShow());
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<Repository[]>([]);
  const {
    startDateCards,
    setStartDateCards,
    endDateCards,
    setEndDateCards,
    tagsCards,
    setTagsCards,
  } = useGithubFilters();
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [lastFetchTsCards, setLastFetchTsCards] = useState(Date.now());
  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const { handleFilterCardsSubmit, handleResetFilters } = useFetchGithubData({
    fileName: GITHUB_CARDS_FILE,
    defaultTags: STD_CARD_TAGS,
    isFilterApplied,
    setCards,
    lastFetchTsCards,
    setStartDateCards,
    setEndDateCards,
    setTagsCards,
    setIsFilterApplied,
    setLastFetchTsCards,
    setIsLoading,
    startDateRef,
    endDateRef,
    tagsCards,
    setError,
    setStartIndex,
    consoleMessage: 'fetched data from github api for github monthly cards',
  });

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
        {isFilterApplied ? (
          <h5 className='header-main'>New GitHub Scripts custom filters</h5>
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
              <button className='mb-2 btn btn-primary w-100'>Apply</button>
            </form>
            <button
              onClick={handleResetFilters}
              className='mb-1 btn btn-secondary w-100'
            >
              Restore
            </button>
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
