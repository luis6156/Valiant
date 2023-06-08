import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import WelcomeBanner from '@/components/WelcomeBanner';
import { useActiveIcon } from '@/hooks/useActiveIcon';

import '../styles/dashboard.scss';

const Dashboard = () => {
  const { activeIcon, topOffset, handleIconClick } = useActiveIcon();

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-1 col-sidebar'>
            <Sidebar
              activeIcon={activeIcon}
              topOffset={topOffset}
              handleIconClick={handleIconClick}
            />
          </div>
          <div className='col-md ps-0 pe-3'>
            <div className='mt-3 mb-3'>
              <Header
                title='Dashboard'
                subtitle='Welcome to your feed for OSINT recommendations'
              />
            </div>
            <WelcomeBanner handleIconClick={handleIconClick} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
