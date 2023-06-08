import { useState } from 'react';

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

export const useActiveIcon = () => {
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

  return { activeIcon, topOffset, handleIconClick };
};
