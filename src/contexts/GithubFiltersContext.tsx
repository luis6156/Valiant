import React, { createContext, useContext, useState } from 'react';

// Define the type for the context value
interface GithubFiltersContextProps {
  startDateCards: string;
  setStartDateCards: React.Dispatch<React.SetStateAction<string>>;
  endDateCards: string;
  setEndDateCards: React.Dispatch<React.SetStateAction<string>>;
  tagsCards: string[];
  setTagsCards: React.Dispatch<React.SetStateAction<string[]>>;
  startDateList: string;
  setStartDateList: React.Dispatch<React.SetStateAction<string>>;
  endDateList: string;
  setEndDateList: React.Dispatch<React.SetStateAction<string>>;
  tagsList: string[];
  setTagsList: React.Dispatch<React.SetStateAction<string[]>>;
  languageList: string[];
  setLanguageList: React.Dispatch<React.SetStateAction<string[]>>;
  orderList: string;
  setOrderList: React.Dispatch<React.SetStateAction<string>>;
}

// Create a new context
const GithubFiltersContext = createContext<GithubFiltersContextProps>(
  {} as GithubFiltersContextProps
);

export function useGithubFilters() {
  return useContext(GithubFiltersContext);
}

// Create a ContextProvider component
const GithubFiltersProvider = ({ children }: any) => {
  const [startDateCards, setStartDateCards] = useState('');
  const [endDateCards, setEndDateCards] = useState('');
  const [tagsCards, setTagsCards] = useState<string[]>([]);

  const [startDateList, setStartDateList] = useState('');
  const [endDateList, setEndDateList] = useState('');
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [languageList, setLanguageList] = useState<string[]>([]);
  const [orderList, setOrderList] = useState('');

  return (
    // Provide the pagePath state value to the consuming components
    <GithubFiltersContext.Provider
      value={{
        startDateCards,
        setStartDateCards,
        endDateCards,
        setEndDateCards,
        tagsCards,
        setTagsCards,
        startDateList,
        setStartDateList,
        endDateList,
        setEndDateList,
        tagsList,
        setTagsList,
        languageList,
        setLanguageList,
        orderList,
        setOrderList,
      }}
    >
      {children}
    </GithubFiltersContext.Provider>
  );
};

export default GithubFiltersProvider;
