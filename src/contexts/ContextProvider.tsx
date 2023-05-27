import React, { ChangeEvent, createContext, useContext, useState } from 'react';

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
  currentColor: string;
  currentMode: string;
  themeSettings: boolean;
  setThemeSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: (e: ChangeEvent<HTMLInputElement>) => void;
  setColor: (mode: string) => void;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  setCurrentMode: React.Dispatch<React.SetStateAction<string>>;
  initialState: ContextStateMinor;
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
  const [currentColor, setCurrentColor] = useState('#03c9d7');
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);

  const setMode = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (target) {
      setCurrentMode(target.value);
      localStorage.setItem('themeMode', target.value);
    }
  };

  const setColor = (mode: string) => {
    setCurrentColor(mode);
    localStorage.setItem('colorMode', mode);
  };

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
        setScreenSize,
        currentColor,
        currentMode,
        themeSettings,
        setThemeSettings,
        setMode,
        setColor,
        setCurrentColor,
        setCurrentMode,
        initialState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
