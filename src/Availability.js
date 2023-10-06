import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import your CSS file

function Availability() {
  const [selectedRoomType] = useState('labs');
  const [username, setUsername] = useState('');

  // Example data for labs and halls
  const labsData = {
    "Floor I": ["213", "210", "217D/D1", "217B2"],
    "Floor II": ["310A1/b"],
    "Floor III": ["410A/B1", "417A/B"],
    "Floor IV": ["510A1/B1", "522/523", "524/525", "526/527"],
    "Floor V": ["610", "612", "619C", "619D/E"],
  };

  const hallsData = {
    "Floor II": ["Placement/CV Raman Hall", "CDIO Hall"],
    "Floor III": ["Yoga Hall"],
    "Floor I": ["Board Room", "IQAC Room"],
  };

  // React state to store available rooms
  const [availableRooms, setAvailableRooms] = useState([]);

  // Function to display available rooms based on room type
  function displayAvailableRooms() {
    let roomsData = [];

    if (selectedRoomType === "labs") {
      // Get the list of floors and sort them
      const floors = Object.keys(labsData).sort();

      // Display labs by sorted floors
      floors.forEach(floor => {
        const labs = labsData[floor];
        labs.forEach(labName => {
          roomsData.push({
            floor,
            type: 'Labs',
            name: labName,
            availability: 'Available',
          });
        });
      });
    } else if (selectedRoomType === "boardroom") {
      // Get the list of floors and sort them
      const floors = Object.keys(hallsData).sort();

      // Display board rooms by sorted floors
      floors.forEach(floor => {
        const boardRooms = hallsData[floor];
        boardRooms.forEach(roomName => {
          roomsData.push({
            floor,
            type: 'Halls',
            name: roomName,
            availability: 'Available',
          });
        });
      });
    }

    setAvailableRooms(roomsData);
  }

  // Function to handle registration for a board room
  function registerRoom(roomName) {
    const mentorName = prompt("Please enter your mentor's name:");
    if (mentorName !== null) {
      // Implement registration logic as needed
      // You can use AJAX to send the registration data to a server, for example

      // Inform the user that registration was successful
      alert("Registration Successful!");
    }
  }

  // Function to handle registration for a lab
  function registerLab(labName) {
    const mentorName = prompt("Please enter your mentor's name:");
    if (mentorName !== null) {
      // Implement registration logic as needed
      // You can use AJAX to send the registration data to a server, for example

      // Inform the user that registration was successful
      alert("Registration Successful!");
    }
  }

  // Function to retrieve a query parameter by name
  function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Retrieve the username from the URL query parameter
  useEffect(() => {
    const usernameParam = getParameterByName('username');
    // Set the username in the state
    setUsername(usernameParam);

    // Call the function to display available rooms based on room type
    displayAvailableRooms();
  }, []);

  // Function to log out the user
  function logout() {
    // Handle logout logic here
    // You can navigate to the login page or clear user data
    alert("Logged out successfully");
  }

  // JSX for rendering available rooms
  const roomsList = availableRooms.map((room, index) => (
    <tr key={index}>
      <td>{room.floor}</td>
      <td>{room.type}</td>
      <td>{room.name}</td>
      <td className="availability available">{room.availability}</td>
      <td>
        <button onClick={() => registerRoom(room.name)}>Book Now</button>
      </td>
    </tr>
  ));

  return (
    <div>
      <div id="usernameElement">{`Welcome, ${username}!`}</div>
      <h1>Room and Hall Availability</h1>
      <table>
        <thead>
          <tr>
            <th>Floor</th>
            <th>Name</th>
            <th>Hall Name or Room Number</th>
            <th>Availability</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roomsList}
        </tbody>
      </table>
      <div id="availabilityStatus">
        {/* Availability status will be displayed here */}
      </div>
      <div className="goBackContainer">
        <Link to="/MainPage" className="goBack">Go Back</Link>
      </div>
      <div className="logoutContainer">
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Availability;
