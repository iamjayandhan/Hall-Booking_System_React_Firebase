// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter as Router
import AppRouter from './Router'; // Import the correct Router component
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppRouter />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
