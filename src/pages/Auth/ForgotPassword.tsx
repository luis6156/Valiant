import React, { useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
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
      <h1>Password Reset</h1>
      {message && <div>{message}</div>}
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input ref={emailRef} type='email' name='email' id='email' required />
        </div>
        <div>
          <button disabled={loading} type='submit'>Reset Password</button>
        </div>
      </form>
      <div>
        Need an account? <Link to='/register'>Sign Up</Link>
      </div>
      <div>
        Login? <Link to='/login'>Login</Link>
      </div>
      <div>
        Dashboard? <Link to='/'>Dashboard</Link>
      </div>
    </>
  );
};

export default ForgotPassword;
