import React, { useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
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
      <h1>Login</h1>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input ref={emailRef} type='email' name='email' id='email' required />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            ref={passwordRef}
            type='password'
            name='password'
            id='password'
            required
          />
        </div>
        <div>
          <button disabled={loading} type='submit'>Login</button>
        </div>
      </form>
      <div>
        Need an account? <Link to='/register'>Sign Up</Link>
      </div>
      <div>
        Forgot password? <Link to='/forgot-password'>Sign Up</Link>
      </div>
      <div>
        Dashboard? <Link to='/'>Dashboard</Link>
      </div>
    </>
  );
};

export default Login;
