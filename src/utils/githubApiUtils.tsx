import { useGithubFilters } from '@/contexts/GithubFiltersContext';
import useFetchOnThreshold from '@/hooks/useFetchOnThreshold';
import { FormEvent, useEffect, useRef, useState } from 'react';

const ipcRenderer = window.ipcRenderer;

const FETCH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface Repository {
  full_name: string;
  description: string;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  language: string;
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

export const useFetchGithubData = (fileName: string, defaultTags: string[]) => {
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

  useFetchOnThreshold({
    threshold: FETCH_INTERVAL,
    fetchFunction: async () => {
      if (!isFilterApplied) {
        const { lastMonthStart, lastMonthEnd } = computeLastMonth();
        try {
          const repositories = await fetchDataGithub(
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
      fileName,
    });

    setStartDateCards(startDate);
    setEndDateCards(endDate);
    setTagsCards(tags);
    setIsFilterApplied(isFilterApplied);

    setLastFetchTsCards(lastFetchTimestamp);

    return repositories;
  };

  useEffect(() => {
    const updateRepositories = async () => {
      try {
        let repositories: Repository[] = [];
        let existsFile = false;

        const existsFilePromise = new Promise<boolean>((resolve) => {
          ipcRenderer.send('fs-exists-sync', { fileName });
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
            defaultTags,
            false
          );
        } else {
          // Read file
          console.log('reading from local file');
          const readFilePromise = new Promise<string>((resolve) => {
            ipcRenderer.send('fs-readfile-sync', {
              fileName,
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
        defaultTags,
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

  return {
    isLoading,
    setIsLoading,
    cards,
    error,
    setError,
    startDateCards,
    endDateCards,
    tagsCards,
    isFilterApplied,
    lastFetchTsCards,
    setStartIndex,
    startIndex,
    handleResetFilters,
    handleFilterCardsSubmit,
    startDateRef,
    endDateRef,
    setTagsCards,
  };
};

// export const useFileExists = (fileName) => {
//   const [exists, setExists] = useState(false);

//   useEffect(() => {
//     const existsFilePromise = new Promise((resolve) => {
//       ipcRenderer.send('fs-exists-sync', { fileName });
//       ipcRenderer.on('fs-exists-sync-reply', (data) => {
//         resolve(data);
//       });
//     });

//     existsFilePromise.then((data) => {
//       setExists(data);
//     });

//     return () => {
//       ipcRenderer.removeAllListeners('fs-exists-sync-reply');
//     };
//   }, [fileName]);

//   return exists;
// };

// export const useReadFile = (fileName) => {
//   const [fileData, setFileData] = useState('');

//   useEffect(() => {
//     const readFilePromise = new Promise((resolve) => {
//       ipcRenderer.send('fs-readfile-sync', { fileName });
//       ipcRenderer.on('fs-readfile-sync-reply', (data) => {
//         resolve(data);
//       });
//     });

//     readFilePromise.then((data) => {
//       setFileData(data);
//     });

//     return () => {
//       ipcRenderer.removeAllListeners('fs-readfile-sync-reply');
//     };
//   }, [fileName]);

//   return fileData;
// };
