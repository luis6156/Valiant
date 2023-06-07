import { useAuth } from '@/contexts/AuthContext';
import { Icon } from '@iconify/react';
import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Props {
  onForgotPasswordClick: () => void;
}

const LoginForm = ({ onForgotPasswordClick }: Props) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailRef.current || !passwordRef.current) {
      setError('Fields cannot be empty');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (error) {
      console.log(error);
      setError('Failed to login');
    }

    setLoading(false);
  }

  return (
    <>
      <div className='d-flex justify-content-center margin-login'>
        <div>
          <h1>Sign In</h1>
          <p>Continue with Google or enter your details</p>
          <button className='btn btn-google btn-primary w-100 mt-4'>
            <Icon height='25' width='25' icon='flat-color-icons:google' />
            <span className='ms-2 btn-google-text'>Log in with Google</span>
          </button>
          <div className='d-flex align-items-center mt-4'>
            <hr className='custom-hr my-0' />
            <p className='mx-1 my-0'>or</p>
            <hr className='custom-hr my-0' />
          </div>
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
            <div className='mb-3'>
              <input
                className='form-control'
                ref={passwordRef}
                type='password'
                name='password'
                id='password'
                placeholder='Password'
                required
              />
            </div>
            <div className='mb-4 d-flex justify-content-between align-items-center'>
              <div className='form-check'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id='remember'
                />
                <label className='form-check-label' htmlFor='remember'>
                  Remember Me
                </label>
              </div>
              <div>
                <Link to='#' onClick={onForgotPasswordClick}>
                  Forgot password
                </Link>
              </div>
            </div>
            <div>
              <button
                className='btn btn-primary w-100'
                disabled={loading}
                type='submit'
              >
                Login
              </button>
            </div>
          </form>
          <div className='mt-4 d-flex align-items-center mt-2'>
            <p className='me-2'>Don't have an account?</p>
            <Link to='/register'>Sign up now</Link>
          </div>
          {error && <div className='mt-4'>{error}</div>}
        </div>
      </div>
    </>
  );
};

export default LoginForm;
