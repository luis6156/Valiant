import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: Props) => {
  const [error, setError] = useState('');
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
      <div className='row'>
        <div className='col-md-6'>
          <h4 className='header-main mb-1'>Dashboard</h4>
          <p className='welcome-description'>
            Welcome to your feed for OSINT recommendations
          </p>
        </div>
        <div className='col-md-6 d-flex justify-content-end align-items-center'>
          <p className='me-3'>{currentUser?.email}</p>
          <Link className='me-3' to='/update-profile'>Update Profile</Link>
          <button className='btn btn-secondary' onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Header;
