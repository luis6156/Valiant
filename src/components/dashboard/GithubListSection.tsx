import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import FloatingLabelInput from '../FloatingLabelInput';
import AttentionText from '../AttentionText';
import { useGithubFilters } from '@/contexts/GithubFiltersContext';
import { Repository, useFetchGithubData } from '@/utils/githubApiUtils';
import GithubRowItem from './GithubRowItem';

const GITHUB_CARDS_FILE = 'github-list.json';
const STD_CARD_TAGS = ['osint'];
const NUM_ROWS_TO_SHOW = '2';
const STD_SORT_BY = 'stars-desc';
const START_PAGE = 0;

const GithubListSection = () => {
  const [numRowsToShow, setNumRowsToShow] = useState(NUM_ROWS_TO_SHOW);
  const [sortOrder, setSortOrder] = useState(STD_SORT_BY);
  const [startIndex, setStartIndex] = useState(START_PAGE);
  const [language, setLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [repositories, setRepositories] = useState<Repository[]>([]);
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
  const languageRef = useRef<HTMLInputElement | null>(null);
  const itemsPerPageRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const { handleFilterListSubmit, handleResetFilters, fetchDataGithub } =
    useFetchGithubData({
      fileName: GITHUB_CARDS_FILE,
      defaultTags: STD_CARD_TAGS,
      isFilterApplied,
      setCards: setRepositories,
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
      consoleMessage: 'fetched data from github api for github top list',
      sortOrder,
      itemsPerPageRef,
      languageRef,
      setNumRowsToShow,
      setLanguage,
      page: startIndex,
      standardItemsPerPage: NUM_ROWS_TO_SHOW,
      standardSortOrder: STD_SORT_BY,
    });

  const handleRightArrowClick = async (event: any) => {
    event.preventDefault();

    try {
      const newRepositories = await fetchDataGithub(
        sortOrder,
        numRowsToShow,
        startIndex + 1,
        language,
        startDateCards,
        endDateCards,
        tagsCards,
        isFilterApplied,
        true
      );

      console.log(startIndex + 1);
      setStartIndex((prev) => prev + 1);
      setRepositories(newRepositories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeftArrowClick = async (event: any) => {
    event.preventDefault();

    try {
      const newRepositories = await fetchDataGithub(
        sortOrder,
        numRowsToShow,
        startIndex - 1,
        language,
        startDateCards,
        endDateCards,
        tagsCards,
        isFilterApplied,
        true
      );

      setStartIndex((prev) => prev - 1);
      setRepositories(newRepositories);
      console.log(startIndex - 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSortOrder(selectedValue);
  };

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        {isFilterApplied ? (
          <h5 className='header-main'>Top GitHub Scripts custom filters</h5>
        ) : (
          <h5 className='header-main'>Top GitHub Scripts</h5>
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
            <form onSubmit={handleFilterListSubmit}>
              <div className='mt-3 mb-3'>
                <select
                  className='form-select'
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  key={sortOrder}
                >
                  <option value='stars-desc'>Stars Descending</option>
                  <option value='stars-asc'>Stars Ascending</option>
                  <option value='updated-desc'>Updated Descending</option>
                </select>
              </div>
              <div className='mt-3 mb-3'>
                <FloatingLabelInput
                  required={true}
                  ref={itemsPerPageRef}
                  name='items-per-page'
                  type='text'
                  label='Items per page'
                  maxLength={2}
                  defaultValue={numRowsToShow}
                />
              </div>
              <div className='mt-3 mb-3'>
                <FloatingLabelInput
                  required={false}
                  ref={languageRef}
                  name='language'
                  type='text'
                  label='Script Language'
                  maxLength={15}
                  defaultValue={language}
                />
              </div>
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
      <div>
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div className='mb-3' key={index}>
              <Skeleton className='github-row-skeleton' />
            </div>
          ))
        ) : repositories.length === 0 ? (
          <div className='github-row mb-3'>
            <div className='github-row-title-error pt-3 px-4'>
              No repositories found.
            </div>
            <div className='github-row-description px-4'>
              Please try other filters or apply the default top filter to reset.
            </div>
          </div>
        ) : (
          repositories.map((repository, index) => (
            <div className='mb-3' key={index}>
              <GithubRowItem
                title={repository.name}
                description={repository.description}
                author={repository.owner.login}
                stars={repository.stargazers_count}
                lastUpdated={repository.updated_at}
                tags={repository.topics}
                language={repository.language}
                url={repository.html_url}
              />
            </div>
          ))
        )}

        <div className='d-flex me-3 justify-content-end mb-3'>
          <button
            className={`btn btn-info me-2 github-arrow d-flex align-items-center ${
              startIndex === 0 || isLoading ? 'disabled' : ''
            }`}
            onClick={handleLeftArrowClick}
          >
            <Icon icon='ic:round-arrow-left' />
          </button>
          <button
            className={`btn btn-info ms-2 github-arrow d-flex align-items-center ${
              Number(numRowsToShow) > repositories.length || isLoading
                ? 'disabled'
                : ''
            }`}
            onClick={handleRightArrowClick}
          >
            <Icon icon='ic:round-arrow-right' />
          </button>
        </div>
      </div>
    </>
  );
};

export default GithubListSection;
