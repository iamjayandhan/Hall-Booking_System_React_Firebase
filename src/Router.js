import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import Registration from './Registration';
import Login from './Login';
import MainPage from './MainPage';
import ViewAllBookings from './ViewAllBookings';
import MyBookings from './MyBookings';

import './styles.css';

const AppRouter = () => {
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customDialogTitle, setCustomDialogTitle] = useState('');
  const [customDialogMessage, setCustomDialogMessage] = useState('');
  const [customDialogButtonName, setCustomDialogButtonName] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const username = Cookies.get('username');
      const currentPath = location.pathname;

      // Allow access to login page
      if (currentPath === '/login' && username) {
        navigate('/MainPage'); // Redirect to MainPage if user is already logged in
      }

      // Redirect unauthorized users to login page
      if (!username && currentPath !== '/login' && currentPath !== '/registration' && currentPath !== '/') {
        navigate('/login');
        // Show custom dialog popup
        setCustomDialogTitle('Unauthorized Access');
        setCustomDialogMessage('You need to log in to access this page.');
        setCustomDialogButtonName('OK');
        setCustomDialogOpen(true);
      }
    };

    checkAuth(); // Check authentication when component mounts
  }, [navigate, location]);

  const handleDialogClose = () => {
    setCustomDialogOpen(false);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/ViewAllBookings" element={<ViewAllBookings />} />
        <Route path="/MyBookings" element={<MyBookings />} />
      </Routes>
      {customDialogOpen && (
        <div className="custom-dialog-overlay">
          <div className="custom-dialog">
            <h2>{customDialogTitle}</h2>
            <p>{customDialogMessage}</p>
            <button onClick={handleDialogClose}>{customDialogButtonName}</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AppRouter;
