import React, { createContext, useContext, useState } from 'react';

interface ContextStateMinor {
  chat: boolean;
  cart: boolean;
  userProfile: boolean;
  notification: boolean;
}

interface ContextState {
  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isClicked: ContextStateMinor;
  setIsClicked: React.Dispatch<React.SetStateAction<ContextStateMinor>>;
  handleClick: (clicked: string) => void;
  screenSize: number;
  setScreenSize: React.Dispatch<React.SetStateAction<number>>;
}

const StateContext = createContext<ContextState>({} as ContextState);

const initialState: ContextStateMinor = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

interface Props {
  children: React.ReactNode;
}

export const ContextProvider = ({ children }: Props) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState({} as number);

  const handleClick = (clicked: string) => {
    setIsClicked({ ...initialState, [clicked]: true });
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        setScreenSize
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
