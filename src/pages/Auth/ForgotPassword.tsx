import React, { useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Props {
  onLoginClick: () => void;
}

const ForgotPassword = ({ onLoginClick }: Props) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const { resetPassword } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailRef.current) {
      setError('Fields cannot be empty');
      return;
    }

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions');
    } catch (error) {
      console.log(error);
      setError('Failed to reset password');
    }

    setLoading(false);
  }

  return (
    <>
      <div className='d-flex justify-content-center margin-login'>
        <div>
          <h1>Password Reset</h1>
          <form className='mt-4' onSubmit={handleSubmit}>
            <div className='mb-4'>
              <input
                className='form-control'
                ref={emailRef}
                type='email'
                name='email'
                id='email'
                placeholder='Email'
                required
              />
            </div>
            <div>
              <button
                className='btn btn-primary w-100'
                disabled={loading}
                type='submit'
              >
                Send Reset Link
              </button>
            </div>
          </form>
          <div className='mt-4 d-flex align-items-center mt-2'>
            <Link to='#' onClick={onLoginClick}>
              Go back to login
            </Link>
          </div>
          {message && <div className='mt-4'>{message}</div>}
          {error && <div className='mt-4'>{error}</div>}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
