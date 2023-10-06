import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(''); // Initialize with an empty string
  const [showAuthenticatingMessage, setShowAuthenticatingMessage] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const storedPassword = localStorage.getItem(username);

    if (password === storedPassword) {
      // Set the "Authenticating..." message
      setLoginMessage('Authenticating...');
      setShowAuthenticatingMessage(true);

      // Simulate a delay of 3 seconds before navigating to MainPage.js
      setTimeout(() => {
        // Clear the "Authenticating..." message and navigate
        setShowAuthenticatingMessage(false);
        navigate('/MainPage');
      }, 3000); // 3000 milliseconds (3 seconds)

    } else {
      // Display an error message for invalid credentials
      setLoginMessage('Invalid credentials, please try again.'); // Update the error message here
    }
  };

  return (
    <div className='container'>
      <h1>User Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>

      {/* Conditionally render the login message container */}
      {loginMessage && <div id="loginMessage">{loginMessage}</div>}

      {/* Add a button to redirect to the registration page */}
      <Link className='logregbtn' to="/registration">Register</Link>
    </div>
  );
};

export default Login;
