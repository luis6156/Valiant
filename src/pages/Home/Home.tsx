import Header from '@/components/Header';
import GithubCardsSection from '@/components/Dashboard/GithubCardsSection';
import GithubListSection from '@/components/Dashboard/GithubListSection';
import WelcomeBanner from '@/components/Dashboard/WelcomeBanner';
import GithubFiltersProvider from '@/contexts/GithubFiltersContext';

const Home = () => {
  return (
    <>
      <div className='mt-3 mb-3'>
        <Header
          title='Dashboard'
          subtitle='Welcome to your feed for everything OSINT'
        />
      </div>
      <WelcomeBanner />
      <GithubFiltersProvider>
        <div className='mt-4'>
          <GithubCardsSection />
        </div>
        <div className='mt-4'>
          <GithubListSection />
        </div>
      </GithubFiltersProvider>
    </>
  );
};

export default Home;
