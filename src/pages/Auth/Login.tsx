import { useState } from 'react';

import '../../styles/auth/auth.scss';
import LoginCard from './LoginCard';
import LoginForm from './LoginForm';
import ForgotPassword from './ForgotPassword';

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPasswordOrLoginClick = () => {
    setShowForgotPassword((showForgotPassword) => !showForgotPassword);
  };

  return (
    <>
      <div className='container-fluid h-100'>
        <div className='row h-100'>
          <div className='col'>
            {showForgotPassword ? (
              <ForgotPassword onLoginClick={handleForgotPasswordOrLoginClick} />
            ) : (
              <LoginForm
                onForgotPasswordClick={handleForgotPasswordOrLoginClick}
              />
            )}
          </div>
          <div className='col p-0'>
            <LoginCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
