import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useSidebar } from '@/contexts/SidebarContext';

interface Props {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: Props) => {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { handleIconClick } = useSidebar();

  async function handleLogout() {
    setError('');

    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to logout');
    }
  }

  const handleEditProfile = () => {
    handleIconClick('settings');
  };

  return (
    <>
      <div className='row'>
        <div className='col-md-6'>
          <h4 className='header-main mb-1'>{title}</h4>
          <p className='welcome-description'>{subtitle}</p>
        </div>
        <div className='col-md-6 d-flex justify-content-end align-items-center'>
          {/* <div className='dropdown'>
            <button
              className='btn btn-info dropdown-toggle dropdown-toggle-no-caret filters'
              type='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              <Icon
                className='notifications'
                icon='iconamoon:notification-fill'
              />
            </button>
            <ul className='dropdown-menu dropdown-menu-end'>
              <li>
                <p className='dropdown-item disabled'>None</p>
              </li>
            </ul>
          </div> */}
          <div className='dropdown'>
            <button
              className='btn btn-info dropdown-toggle filters'
              type='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              Profile{' '}
            </button>
            <ul className='dropdown-menu'>
              <li>
                <button className='dropdown-item' onClick={handleEditProfile}>
                  Edit Profile
                </button>
              </li>
              <li>
                <hr className='dropdown-divider' />
              </li>
              <li>
                <button className='dropdown-item' onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
