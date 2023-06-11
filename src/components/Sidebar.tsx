import { Icon } from '@iconify/react';

import '../../src/styles/sidebar.scss';

interface Props {
  activeIcon:
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
  topOffset: string;
  handleIconClick: (
    icon:
      | 'dashboard'
      | 'import-export'
      | 'settings'
      | 'info'
      | 'scripts-search'
      | 'scripts-import'
      | 'scripts-status'
      | 'pipes-search'
      | 'pipes-create'
      | 'pipes-status'
  ) => void;
}

const Sidebar = ({ activeIcon, topOffset, handleIconClick }: Props) => {
  return (
    <>
      <div className='mt-5 d-flex flex-column align-items-center justify-content-center position-relative'>
        <div className='sidebar-btn classic-btn'>
          <Icon
            onClick={() => handleIconClick('dashboard')}
            className={`icon-lg ${activeIcon === 'dashboard' && 'active-icon'}`}
            icon='material-symbols:dashboard-rounded'
          />
        </div>
        <div
          id='movable-div'
          className={`sidebar-btn mt-4 smart-btn position-relative ${
            activeIcon.includes('script') ? 'active-icon' : ''
          }`}
        >
          <Icon
            onClick={() => handleIconClick('scripts-search')}
            className='icon-lg'
            icon='mdi:script'
          />
          <div
            className={`btn-circle ${
              activeIcon.includes('script') ? topOffset : ''
            }`}
          ></div>
          <div className='d-flex flex-column icon-group'>
            <Icon
              onClick={() => handleIconClick('scripts-search')}
              className={`icon-md icon-group-item ${
                activeIcon === 'scripts-search' && 'active-icon'
              }`}
              icon='majesticons:search'
            />
            <Icon
              onClick={() => handleIconClick('scripts-import')}
              className={`icon-md icon-group-item ${
                activeIcon === 'scripts-import' && 'active-icon'
              }`}
              icon='gridicons:create'
            />
            <Icon
              onClick={() => handleIconClick('scripts-status')}
              className={`icon-md icon-group-item ${
                activeIcon === 'scripts-status' && 'active-icon'
              }`}
              icon='fluent:shifts-activity-24-filled'
            />
          </div>
          <div className='btn-overlay'></div>
        </div>
        <div
          id='movable-div'
          className={`sidebar-btn mt-4 smart-btn position-relative ${
            activeIcon.includes('pipes') ? 'active-icon' : ''
          }`}
        >
          <Icon
            onClick={() => handleIconClick('pipes-search')}
            className='icon-lg'
            icon='eos-icons:pipeline'
          />
          <div
            className={`btn-circle ${
              activeIcon.includes('pipes') ? topOffset : ''
            }`}
          ></div>
          <div className='d-flex flex-column icon-group'>
            <Icon
              onClick={() => handleIconClick('pipes-search')}
              className={`icon-group-item icon-md ${
                activeIcon === 'pipes-search' && 'active-icon'
              }`}
              icon='majesticons:search'
            />
            <Icon
              onClick={() => handleIconClick('pipes-create')}
              className={`icon-group-item icon-md ${
                activeIcon === 'pipes-create' && 'active-icon'
              }`}
              icon='gridicons:create'
            />
            <Icon
              onClick={() => handleIconClick('pipes-status')}
              className={`icon-group-item icon-md ${
                activeIcon === 'pipes-status' && 'active-icon'
              }`}
              icon='fluent:shifts-activity-24-filled'
            />
          </div>
          <div className='btn-overlay'></div>
        </div>
        <div id='movable-div' className='sidebar-btn classic-btn mt-4'>
          <Icon
            onClick={() => handleIconClick('import-export')}
            className={`icon-lg ${
              activeIcon === 'import-export' && 'active-icon'
            }`}
            icon='tabler:arrows-diff'
          />
        </div>
        <div className='sidebar-btn classic-btn settings-icons-margin'>
          <Icon
            onClick={() => handleIconClick('settings')}
            className={`icon-lg ${activeIcon === 'settings' && 'active-icon'}`}
            icon='mingcute:settings-2-line'
          />
        </div>
        <div className='sidebar-btn classic-btn mt-4'>
          <Icon
            onClick={() => handleIconClick('info')}
            className={`icon-lg ${activeIcon === 'info' && 'active-icon'}`}
            icon='fluent:info-24-filled'
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
