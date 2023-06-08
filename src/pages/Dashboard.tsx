import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '@/components/Sidebar';

import '../styles/dashboard.scss';
import Header from '@/components/Header';

const Dashboard = () => {
  const [error, setError] = useState('');
  const [activeIcon, setActiveIcon] = useState<
    | 'dashboard'
    | 'scripts-search'
    | 'scripts-import'
    | 'scripts-status'
    | 'pipes-search'
    | 'pipes-create'
    | 'pipes-status'
    | 'import-export'
    | 'settings'
    | 'info'
  >('dashboard');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError('');

    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to logout');
    }
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-1'>
            <Sidebar setActiveIcon={setActiveIcon} activeIcon={activeIcon} />
          </div>
          <div className='col-md-11'>
            <div className='mt-3 mb-3'>
              <Header
                title='Dashboard'
                subtitle='Welcome to your feed for OSINT recommendations'
              />
            </div>
            {error && <div>{error}</div>}
            <p>
              Email:
              {currentUser?.email}
            </p>
            <Link to='/update-profile'>Update Profile</Link>
            <div>
              <button onClick={handleLogout}>Logout</button>
            </div>
            <Link to='/login'>Login</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
