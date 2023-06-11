import { useState, createContext, useContext } from 'react';

type IconType =
  | 'dashboard'
  | 'scripts-search'
  | 'scripts-import'
  | 'scripts-status'
  | 'pipes-search'
  | 'pipes-create'
  | 'pipes-status'
  | 'import-export'
  | 'settings'
  | 'info';

interface SidebarContextProps {
  activeIcon: IconType;
  topOffset: string;
  handleIconClick: (icon: IconType) => void;
}

const SidebarContext = createContext<SidebarContextProps>(
  {} as SidebarContextProps
);

export function useSidebar() {
  return useContext(SidebarContext);
}

const SidebarProvider = ({ children }: any) => {
  const [activeIcon, setActiveIcon] = useState<IconType>('dashboard');
  const [topOffset, setTopOffset] = useState('');

  const handleIconClick = (icon: IconType) => {
    setActiveIcon(icon);
    console.log(icon);

    if (icon === 'scripts-search' || icon === 'pipes-search') {
      setTopOffset('btn-circle-search');
    } else if (icon === 'scripts-import' || icon === 'pipes-create') {
      setTopOffset('btn-circle-create');
    } else if (icon === 'scripts-status' || icon === 'pipes-status') {
      setTopOffset('btn-circle-status');
    }
  };

  return (
    <SidebarContext.Provider value={{ activeIcon, topOffset, handleIconClick }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
