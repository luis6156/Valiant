import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useSidebar } from '@/contexts/SidebarContext';

import '../../styles/Dashboard/Card.scss';

const WelcomeBanner = () => {
  const { handleIconClick } = useSidebar();
  const [isSmallBtn, setIsSmallBtn] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallBtn(getBtnSizeToShow());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function getBtnSizeToShow() {
    if (window.innerWidth < 900) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className='container-fluid welcome-banner'>
      <div className='row h-100'>
        <div className='col p-0 d-flex align-items-center'>
          <div className='welcome-content px-3 position-relative'>
            <div className='mt-1'>
              <div className='d-flex align-items-center'>
                <Icon className='welcome-icon' icon='mdi:script' />
                <h4>Scripts</h4>
              </div>
              <p className='welcome-description'>
                Run special scripts that will cover the majority of the OSINT
                vulnerabilities.
              </p>
              <div className='position-absolute welcome-btn'>
                <button
                  onClick={() => handleIconClick('scripts-search')}
                  className={`btn btn-primary welcome-btn-gap ${
                    isSmallBtn && 'btn-sm'
                  }`}
                >
                  <Icon className='btn-icon' icon='majesticons:search' />
                  Explore
                </button>
                <button
                  onClick={() => handleIconClick('scripts-import')}
                  className={`btn btn-secondary ${isSmallBtn && 'btn-sm'}`}
                >
                  <Icon
                    className='btn-secondary-icon'
                    icon='gridicons:create'
                  />
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='col p-0 d-flex align-items-center'>
          <div className='welcome-content px-3 welcome-borders position-relative'>
            <div className='mt-1'>
              <div className='d-flex align-items-center'>
                <Icon className='welcome-icon' icon='eos-icons:pipeline' />
                <h4>Scenarios</h4>
              </div>
              <p className='welcome-description'>
                Utilize more scripts to better assess vulnerabilities by
                aggregation or piping, creating more data points.
              </p>
              <div className='position-absolute welcome-btn'>
                <button
                  onClick={() => handleIconClick('pipes-search')}
                  className={`btn btn-primary welcome-btn-gap ${
                    isSmallBtn && 'btn-sm'
                  }`}
                >
                  <Icon className='btn-icon' icon='majesticons:search' />
                  Explore
                </button>
                <button
                  onClick={() => handleIconClick('pipes-create')}
                  className={`btn btn-secondary ${isSmallBtn && 'btn-sm'}`}
                >
                  <Icon
                    className='btn-secondary-icon'
                    icon='gridicons:create'
                  />
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='col p-0 d-flex align-items-center'>
          <div className='welcome-content px-3 position-relative'>
            <div className='mt-1'>
              <div className='d-flex align-items-center'>
                <Icon className='welcome-icon' icon='tabler:arrows-diff' />
                <h4>Import/Export</h4>
              </div>
              <p className='welcome-description'>
                Collaboration can be made easier by sharing your dashboard
                scripts and settings with a colleague.
              </p>
              <div className='position-absolute welcome-btn'>
                <button
                  onClick={() => handleIconClick('import-export')}
                  className={`btn btn-primary ${isSmallBtn && 'btn-sm'}`}
                >
                  <Icon className='btn-icon' icon='majesticons:search' />
                  Import or Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
