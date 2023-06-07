import { Icon } from '@iconify/react';
import React from 'react';

import '../../src/styles/sidebar.scss';

const Sidebar = () => {
  return (
    <>
      <div className='mt-5 d-flex flex-column align-items-center justify-content-center position-relative'>
        <div className='sidebar-btn classic-btn'>
          <Icon
            className='icon-lg'
            icon='material-symbols:dashboard-rounded'
          />
        </div>
        <div className='sidebar-btn mt-4 smart-btn position-relative'>
          <Icon className='icon-lg' icon='mdi:script' />
          {/* <div className='btn-circle'></div> */}
          <div className='btn-overlay'></div>
        </div>
        <div id='movable-div' className='sidebar-btn mt-4 smart-btn position-relative'>
          <Icon className='icon-lg' icon='eos-icons:pipeline' />
          {/* <div className='btn-circle'></div> */}
          <div className='btn-overlay'></div>
        </div>
        <div id='movable-div' className='sidebar-btn classic-btn mt-4'>
          <Icon
            className='icon-lg'
            icon='tabler:arrows-diff'
          />
        </div>
        <div className='sidebar-btn classic-btn settings-icons-margin'>
          <Icon
            className='icon-lg'
            icon='mingcute:settings-2-line'
          />
        </div>
        <div className='sidebar-btn classic-btn mt-4'>
          <Icon
            className='icon-lg'
            icon='fluent:info-24-filled'
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
