import { useGithubFilters } from '@/contexts/GithubFiltersContext';
import useFetchOnThreshold from '@/hooks/useFetchOnThreshold';
import { FormEvent, useEffect, useRef, useState } from 'react';

const ipcRenderer = window.ipcRenderer;

const FETCH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface Repository {
  full_name: string;
  description: string;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  language: string;
  updated_at: string;
  name: string;
  owner: {
    login: string;
  };
}

export const computeLastMonth = () => {
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

interface FetchGithubDataProps {
  fileName: string;
  defaultTags: string[];
  isFilterApplied: boolean;
  setCards: React.Dispatch<React.SetStateAction<Repository[]>>;
  lastFetchTsCards: number;
  setStartDateCards: React.Dispatch<React.SetStateAction<string>>;
  setEndDateCards: React.Dispatch<React.SetStateAction<string>>;
  setTagsCards: React.Dispatch<React.SetStateAction<string[]>>;
  setIsFilterApplied: React.Dispatch<React.SetStateAction<boolean>>;
  setLastFetchTsCards: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  startDateRef: React.MutableRefObject<HTMLInputElement | null>;
  endDateRef: React.MutableRefObject<HTMLInputElement | null>;
  tagsCards: string[];
  setError: React.Dispatch<React.SetStateAction<string>>;
  setStartIndex: React.Dispatch<React.SetStateAction<number>>;
  consoleMessage: string;
  sortOrder?: string;
  setSortOrder?: React.Dispatch<React.SetStateAction<string>>;
  itemsPerPageRef?: React.MutableRefObject<HTMLInputElement | null>;
  languageRef?: React.MutableRefObject<HTMLInputElement | null>;
  setNumRowsToShow?: React.Dispatch<React.SetStateAction<string>>;
  setLanguage?: React.Dispatch<React.SetStateAction<string>>;
  standardItemsPerPage?: string;
  page?: number;
  standardLanguage?: string;
  standardSortOrder?: string;
}

export const useFetchGithubData = ({
  fileName,
  defaultTags,
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
  consoleMessage,
  setSortOrder,
  sortOrder,
  itemsPerPageRef,
  languageRef,
  setNumRowsToShow,
  setLanguage,
  standardItemsPerPage,
  page,
  standardLanguage,
  standardSortOrder,
}: FetchGithubDataProps) => {
  useFetchOnThreshold({
    threshold: FETCH_INTERVAL,
    fetchFunction: async () => {
      if (!isFilterApplied) {
        const { lastMonthStart, lastMonthEnd } = computeLastMonth();
        try {
          const repositories = await fetchDataGithub(
            sortOrder,
            itemsPerPageRef?.current?.value,
            0,
            languageRef?.current?.value,
            lastMonthStart,
            lastMonthEnd,
            defaultTags,
            false
          );
          setCards(repositories);
        } catch (error) {
          console.log(error);
          setCards([]);
        }
      }
    },
    lastFetchTime: lastFetchTsCards,
  });

  const fetchDataGithub = async (
    sortOrder: string | undefined,
    itemsPerPage: string | undefined,
    page: number | undefined,
    language: string | undefined,
    startDate: string,
    endDate: string,
    tags: string[],
    isFilterApplied: boolean,
    doNotUpdateStates?: boolean
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

    let url = `https://api.github.com/search/repositories?q=${query}`;

    // add sort order
    if (sortOrder) {
      const sortOrderSplit = sortOrder.split('-');
      const sortParam = sortOrderSplit[0];
      const orderParam = sortOrderSplit[1];

      url += `&sort=${sortParam}&order=${orderParam}`;
    }

    // Add language
    if (language) {
      url += `&language=${language}`;
    }

    // Add items per page
    if (itemsPerPage) {
      url += `&per_page=${itemsPerPage}`;
    }

    // Add page
    if (page) {
      url += `&page=${Number(page) + 1}`;
    }

    const response = await fetch(url);

    const data = await response.json();
    const repositories = data.items;

    console.log(`${consoleMessage} ${url}`);

    // Set custom cards to false and write to file
    await ipcRenderer.invoke('fs-writefile-sync', {
      data: JSON.stringify({
        sortOrder,
        itemsPerPage,
        language,
        isFilterApplied,
        lastFetchTimestamp,
        startDate,
        endDate,
        tags,
        repositories,
      }),
      fileName,
    });

    if (itemsPerPage && setNumRowsToShow) {
      setNumRowsToShow(itemsPerPage);
    }

    if (language && setLanguage) {
      setLanguage(language);
    }

    if (!doNotUpdateStates) {
      setStartDateCards(startDate);
      setEndDateCards(endDate);
      setTagsCards(tags);
      setIsFilterApplied(isFilterApplied);
    }

    setLastFetchTsCards(lastFetchTimestamp);

    return repositories;
  };

  useEffect(() => {
    const updateRepositories = async () => {
      try {
        let repositories: Repository[] = [];
        let existsFile = false;

        existsFile = await ipcRenderer.invoke('fs-exists-sync', { fileName });

        // Check file does not exist
        if (!existsFile) {
          // Compute last month
          const { lastMonthStart, lastMonthEnd } = computeLastMonth();

          // Get data from github api
          repositories = await fetchDataGithub(
            sortOrder,
            itemsPerPageRef?.current?.value,
            page,
            languageRef?.current?.value,
            lastMonthStart,
            lastMonthEnd,
            defaultTags,
            false
          );
        } else {
          // Read file
          console.log('reading from local file');

          const fileData = await ipcRenderer.invoke('fs-readfile-sync', {
            fileName,
          });

          const {
            sortOrder: sortOrderFile,
            itemsPerPage: itemsPerPageFile,
            language: languageFile,
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

          if (itemsPerPageFile && setNumRowsToShow) {
            setNumRowsToShow(itemsPerPageFile);
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
              sortOrderFile,
              itemsPerPageFile,
              0,
              languageFile,
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
        undefined,
        undefined,
        undefined,
        undefined,
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

  const handleFilterListSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('applying filter cards list');

    if (!sortOrder) {
      setError('Please select a sort order');
      return;
    }

    if (
      !itemsPerPageRef?.current ||
      !itemsPerPageRef.current.value ||
      Number(itemsPerPageRef.current.value) <= 0
    ) {
      setError('Please select a valid number of items per page');
      return;
    }

    if (!startDateRef.current || !startDateRef.current.value) {
      setError('Please select a start date');
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
        sortOrder,
        itemsPerPageRef.current.value,
        page,
        languageRef?.current?.value,
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

    console.log('resetting filters');
    const { lastMonthStart, lastMonthEnd } = computeLastMonth();

    try {
      const repositories = await fetchDataGithub(
        standardSortOrder,
        standardItemsPerPage,
        0,
        standardLanguage,
        lastMonthStart,
        lastMonthEnd,
        defaultTags,
        false
      );

      if (!repositories) {
        throw new Error('No repositories found');
      }

      if (setNumRowsToShow && standardItemsPerPage) {
        setNumRowsToShow(standardItemsPerPage);
      }

      if (setSortOrder && standardSortOrder) {
        setSortOrder(standardSortOrder);
      }

      setCards(repositories);
    } catch (error) {
      console.log(error);
      setCards([]);
    }

    setIsLoading(false);
  };

  return {
    fetchDataGithub,
    handleResetFilters,
    handleFilterCardsSubmit,
    handleFilterListSubmit,
  };
};
