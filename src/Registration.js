import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './index.css';
import Cookies from 'js-cookie';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();

    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('username', '==', username));

    try {
      // Check if there are any documents with the same username
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingUsernames = querySnapshot.docs.map((doc) => doc.data().username);
        if (existingUsernames.some((u) => u.toLowerCase() === username.toLowerCase())) {
          setRegistrationMessage('Username already exists. Please choose a different one.');
          return;
         }
      }

      // If the username is available, add the user to Firestore
      await addDoc(usersCollectionRef, {
        username:username.toLowerCase(),
        password,
      });

      Cookies.set('username', username);

      setRegistrationMessage('Registration successful! Redirecting...');
      setUsername('');
      setPassword('');

      setTimeout(() => {
        navigate('/MainPage');
      }, 3000);
    } catch (error) {
      console.error('Error during registration:', error);
      setRegistrationMessage('An error occurred during registration. Please try again later.');
    }
  };

  return (
    <div className='container'>
      <h1>User Registration</h1>
      <form className="form" onSubmit={handleRegistration}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
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

      {registrationMessage && <div id="registrationMessage">{registrationMessage}</div>}

      <Link className='logregbtn' to="/login">Login</Link>
    </div>
  );
};

export default Registration;
