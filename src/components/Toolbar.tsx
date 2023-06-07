import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';

const Toolbar = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMaximized(
        window.innerWidth === window.screen.availWidth &&
          window.innerHeight === window.screen.availHeight
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!currentUser) {
    return (
      <div
        className={`toolbar-auth ${
          isMaximized ? 'toolbar-maximized' : 'toolbar-normal'
        }`}
      ></div>
    );
  }

  return (
    <div
      className={`toolbar ${
        isMaximized ? 'toolbar-maximized' : 'toolbar-normal'
      }`}
    >
      <div className='toolbar-logo'>
        <img className='toolbar-logo-img' height={20} src='/icons/small-airplane.svg' alt='Logo' />
      </div>
    </div>
  );
};

export default Toolbar;
