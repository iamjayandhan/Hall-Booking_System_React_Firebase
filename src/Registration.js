import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from 'react-router-dom'
import './index.css';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const navigate = useNavigate(); // Use the useNavigate hook to access navigation

  const handleRegistration = (e) => {
    e.preventDefault();

    // Check if the username is available (you can use local storage)
    if (!localStorage.getItem(username)) {
      // Store the user's credentials in local storage
      localStorage.setItem(username, password);

      // Display a success message with a "Login Now" button
    //   setRegistrationMessage(
    //     <p>
    //       Registration successful! You can now{' '}
    //       <Link to="/login">Login Now</Link>.
    //     </p>
    //   );

        setRegistrationMessage('Registration successful! You can now proceed to login. Processing...');
      // Clear the form fields
      setUsername('');
      setPassword('');

      // Route to the login page
      setTimeout(() => {
        // Route to the login page
        navigate('/login');
      }, 3000); // Wait for 3 seconds (adjust the time as needed)
    } else {
      // Display an error message if the username is already taken
      setRegistrationMessage('Username already exists. Please choose a different one.');
    }
  };

  return (
    <div className='container'>
      <h1>User Registration</h1>
      <form onSubmit={handleRegistration}>
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
        <button type="submit">Register</button>
      </form>

      <div id="registrationMessage" className={registrationMessage ? 'visible' : 'hidden'}>
  {registrationMessage}
</div>




      {/* Add a button to navigate to the login page */}
      <Link className='logregbtn' to="/login">Login</Link>
    </div>
  );
};

export default Registration;
