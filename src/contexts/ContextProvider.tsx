import React, { createContext, useContext, useState } from 'react';

interface ContextState {
  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const StateContext = createContext<ContextState>({} as ContextState);

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

interface Props {
  children: React.ReactNode;
}

export const ContextProvider = ({children}: Props) => {
  const [activeMenu, setActiveMenu] = useState(true);

  return (
    <StateContext.Provider value={{activeMenu, setActiveMenu}}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);
