import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '@/components/Sidebar';

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
      <Sidebar setActiveIcon={setActiveIcon} activeIcon={activeIcon} />
      <div>Dashboard</div>
      {error && <div>{error}</div>}
      <strong>Email: </strong>
      {currentUser?.email}
      <Link to='/update-profile'>Update Profile</Link>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <Link to='/login'>Login</Link>
    </>
  );
};

export default Dashboard;
