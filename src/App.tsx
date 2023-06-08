import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthProvider from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './pages/Auth/UpdateProfile';
import ContextProvider from './contexts/ContextProvider';
import Toolbar from './components/Toolbar';
import WelcomeBanner from './components/WelcomeBanner';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContextProvider>
          <Toolbar />
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='/update-profile' element={<UpdateProfile />} />
            </Route>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </ContextProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
