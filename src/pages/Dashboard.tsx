import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import { useActiveIcon } from '@/hooks/useActiveIcon';

import '../styles/dashboard.scss';
import GithubCardsSection from '@/components/dashboard/GithubCardsSection';

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
                subtitle='Welcome to your feed for everything OSINT'
              />
            </div>
            <WelcomeBanner handleIconClick={handleIconClick} />
            <div className='mt-4'>
              <GithubCardsSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
