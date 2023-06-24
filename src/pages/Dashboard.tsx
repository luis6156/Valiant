import Sidebar from '@/components/Sidebar';
import Home from './Home/Home';
import { useSidebar } from '@/contexts/SidebarContext';
import ImportScriptProvider from '@/contexts/ImportScriptContext';
import ScriptsImport from './ScriptsImport/ScriptsImport';

import '../styles/Dashboard/Dashboard.scss';
import ScriptsSearch from './ScriptsSearch/ScriptsSearch';
import ScriptsStatus from './ScriptsStatus/ScriptsStatus';
import useScriptsStatusListener from '@/hooks/useScriptsStatusListener';
import ImportExport from './ImportExport/ImportExport';
import Settings from './Settings/Settings';

const Dashboard = () => {
  const { activeIcon } = useSidebar();
  const scriptsStatusData = useScriptsStatusListener();

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
            ) : activeIcon === 'scripts-search' ? (
              <ScriptsSearch />
            ) : activeIcon === 'scripts-status' ? (
              <ScriptsStatus data={scriptsStatusData} />
            ) : activeIcon === 'import-export' ? (
              <ImportExport />
            ) : activeIcon === 'settings' ? (
              <Settings />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
