import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Registration from './Registration';
import Login from './Login';
import MainPage from './MainPage';
import ViewAllBookings from './ViewAllBookings';
import MyBookings from './MyBookings';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Registration />} /> {/* Default route */}
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/MainPage" element={<MainPage />} />
      <Route path="/ViewAllBookings" element={<ViewAllBookings/>}/>
      <Route path="/MyBookings" element={<MyBookings/>}/>
    </Routes>
  );
};

export default AppRouter;
