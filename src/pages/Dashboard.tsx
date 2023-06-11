import Sidebar from '@/components/Sidebar';
import Home from './Home';
import ScriptsImport from './ScriptsImport';

import '../styles/dashboard.scss';
import { useSidebar } from '@/contexts/SidebarContext';

const Dashboard = () => {
  const { activeIcon } = useSidebar();

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-1 col-sidebar'>
            <Sidebar />
          </div>
          <div className='col-md ps-0 pe-3'>
            {activeIcon === 'dashboard' ? (
              <Home />
            ) : activeIcon === 'scripts-import' ? (
              <ScriptsImport />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
