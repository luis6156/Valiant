import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import AuthProvider from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/Auth/ForgotPassword';
import UpdateProfile from './pages/Auth/UpdateProfile';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <section>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='/update-profile' element={<UpdateProfile />} />
            </Route>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
          </Routes>
        </section>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
