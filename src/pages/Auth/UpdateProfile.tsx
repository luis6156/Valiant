import React, { useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { currentUser, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current) {
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
      console.log(error)
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  return (
    <>
      <h1>Update Profile</h1>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input ref={emailRef} defaultValue={currentUser?.email || ''} type='email' name='email' id='email' required />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            ref={passwordRef}
            placeholder='Leave blank to keep the same'
            type='password'
            name='password'
            id='password'
          />
        </div>
        <div>
          <label htmlFor='passwordConfirm'>Password Confirmation</label>
          <input
            ref={passwordConfirmRef}
            placeholder='Leave blank to keep the same'
            type='password'
            name='passwordConfirm'
            id='passwordConfirm'
          />
        </div>
        <div>
          <button disabled={loading} type='submit'>Update</button>
        </div>
      </form>
      <div>
        <Link to='/'>Cancel</Link>
      </div>
    </>
  );
};

export default UpdateProfile;
