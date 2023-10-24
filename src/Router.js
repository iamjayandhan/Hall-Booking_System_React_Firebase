import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Registration from './Registration';
import Login from './Login';
import MainPage from './MainPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Registration />} /> {/* Default route */}
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/MainPage" element={<MainPage />} />
    </Routes>
  );
};

export default AppRouter;
