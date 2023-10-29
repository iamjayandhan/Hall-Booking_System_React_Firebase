import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Cookies from 'js-cookie';
import eyeOpen from './eye_open.png';
import eyeClosed from './eye_closed.png';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   const usersCollectionRef = collection(db, 'users');
  //   const q = query(usersCollectionRef, where('username', '==', username));

  //   try {
  //     // Query the Firestore collection to find the user by username
  //     const querySnapshot = await getDocs(q);

  //     if (!querySnapshot.empty) {
  //       // User with the provided username exists, now check the password
  //       const userDoc = querySnapshot.docs[0].data(); // Get the user document

  //       if (userDoc.password === password) {
  //         setLoginMessage('Authenticating...');
  //         Cookies.set('username', username);

  //         // Simulate a delay of 3 seconds before navigating to MainPage.js
  //         setTimeout(() => {
  //           setLoginMessage('');
            
  //           // navigate('/MainPage');
  //           // Inside the handleLogin function after successful authentication:
  //           navigate('/MainPage', { state: { username } });

  //         }, 3000);
  //       } else {
  //         setLoginMessage('Invalid credentials. please try again.');
  //       }
  //     } else {
  //       setLoginMessage('Invalid credentials or user not registered. please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     setLoginMessage('An error occurred during login. Please try again later.');
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const usersCollectionRef = collection(db, 'users');
    const lowerCaseUsername = username.toLowerCase(); // Convert the input username to lowercase
    const q = query(usersCollectionRef, where('username', '==', lowerCaseUsername));
  
    try {
      // Query the Firestore collection to find the user by username
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // User with the provided username exists, now check the password
        const userDoc = querySnapshot.docs[0].data(); // Get the user document
  
        if (userDoc.password === password) {
          setLoginMessage('Authenticating...');
          Cookies.set('username', lowerCaseUsername); // Store the lowercase username
  
          // Simulate a delay of 3 seconds before navigating to MainPage.js
          setTimeout(() => {
            setLoginMessage('');
            
            // navigate('/MainPage');
            // Inside the handleLogin function after successful authentication:
            navigate('/MainPage', { state: { username: lowerCaseUsername } });
  
          }, 3000);
        } else {
          setLoginMessage('Invalid credentials. Please try again.');
        }
      } else {
        setLoginMessage('Invalid credentials or user not registered. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginMessage('An error occurred during login. Please try again later.');
    }
  };
  

  return (
    <div className='container'>
      <h1>User Login</h1>
      <form onSubmit={handleLogin} >
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
        {/* <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> */}

      <div style={{ position: 'relative' }}>
        <input
          type={passwordVisible ? 'text' : 'password'}
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          style={{
            position: 'absolute',
            top: '39%',
            right: '30px',
            transform: 'translateY(-50%)',
          }}
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          <img
            src={passwordVisible ? eyeOpen : eyeClosed}
            alt="Toggle Password"
            style={{
              maxWidth: '24px',
              height: 'auto',
              cursor: 'pointer',
            }}
          />
        </span>
      </div>

        <br />
        <button type="submit" style={{ marginTop: '-30px' }}>Login</button>
      </form>

      {loginMessage && <div id="loginMessage">{loginMessage}</div>}

      <Link className='logregbtn' to="/registration">Register</Link>
    </div>
  );
};

export default Login;
