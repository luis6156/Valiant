import React, { useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

import '../../styles/auth/auth.scss';

const Register = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !emailRef.current ||
      !passwordRef.current ||
      !passwordConfirmRef.current
    ) {
      setError('Fields cannot be empty');
      return;
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signUp(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (error) {
      console.log(error);
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  return (
    <>
      <div className='container-fluid h-100'>
        <div className='row h-100'>
        <div className='col auth-card register-auth-card d-flex flex-column align-items-center mb-0 overflow-hidden position-relative h-100'>
            <p className='p-quote'>Equip yourself with the basics, learn how <b className='accent-color'>OSINT</b> and <b className='accent-color'>Pentesting</b> may help you and your business. Thank you for choosing us!</p>
            <p className='p-quote-author'>- Data Pilots Team</p>
            <img
              className='img-cloud-front'
              src='/images/cloud_1.svg'
              alt='cloud'
            />
            <img
              className='img-cloud-back'
              src='/images/cloud_2.svg'
              alt='cloud'
            />
          </div>
          <div className='col d-flex justify-content-center margin-signup'>
            <div>
              <h1>Sign Up</h1>
              <p>Continue with Google or enter your details</p>
              <button className='btn btn-google btn-primary w-100 mt-4'>
                <Icon height='25' width='25' icon='flat-color-icons:google' />
                <span className='ms-2 btn-google-text'>
                  Sign up with Google
                </span>
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
                <div className='mb-4'>
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
                <div className='mb-5'>
                  <input
                    className='form-control'
                    ref={passwordConfirmRef}
                    type='password'
                    name='passwordConfirm'
                    id='passwordConfirm'
                    placeholder='Confirm Password'
                    required
                  />
                </div>
                <div>
                  <button
                    className='btn btn-primary w-100'
                    disabled={loading}
                    type='submit'
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <div className='mt-4 d-flex align-items-center mt-2'>
                <p className='me-2'>Already have an account?</p>
                <Link to='/login'>Log in now</Link>
              </div>
              {error && <div className='mt-4'>{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
