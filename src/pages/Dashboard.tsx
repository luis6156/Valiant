import Sidebar from '@/components/Sidebar';
import Home from './Home';
import { useSidebar } from '@/contexts/SidebarContext';
import ImportScriptProvider from '@/contexts/ImportScriptContext';
import ScriptsImport from './ScriptsImport/ScriptsImport';

import '../styles/dashboard.scss';

const Dashboard = () => {
  const { activeIcon } = useSidebar();

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='sidebar-margin col-md-1 col-sidebar'>
            <Sidebar />
          </div>
          <div className='dashboard-margin col-md ps-0 pe-3'>
            {activeIcon === 'dashboard' ? (
              <Home />
            ) : activeIcon === 'scripts-import' ? (
              <ImportScriptProvider>
                <ScriptsImport />
              </ImportScriptProvider>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
