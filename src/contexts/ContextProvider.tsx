import React, { createContext, useContext, useState } from 'react';

// Define the type for the context value
interface PagePathContextValue {
  pagePath: string;
  setPagePath: React.Dispatch<React.SetStateAction<string>>;
}

// Create a new context
const PagePathContext = createContext<PagePathContextValue>({
  pagePath: '/',
  setPagePath: () => {},
});

export function useContextProvider() {
  return useContext(PagePathContext);
}

// Create a ContextProvider component
const ContextProvider = ({ children }: any) => {
  // State to store the current page path
  const [pagePath, setPagePath] = useState('');

  return (
    // Provide the pagePath state value to the consuming components
    <PagePathContext.Provider value={{ pagePath, setPagePath }}>
      {children}
    </PagePathContext.Provider>
  );
};

export default ContextProvider;
