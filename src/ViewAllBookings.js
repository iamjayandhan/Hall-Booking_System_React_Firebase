// ViewAllBookings.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './ViewAllBookings.css';
import { Link} from 'react-router-dom';

const ViewAllBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsCollectionRef = collection(db, 'bookings');
        const querySnapshot = await getDocs(bookingsCollectionRef);
        const bookingsData = [];

        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          bookingsData.push(booking);
        });

        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1>All Bookings</h1>
      <table>
        <thead>
          <tr>
            <th>Hall Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.hallName}</td>
              <td>{booking.date}</td>
              <td>{booking.startTime}</td>
              <td>{booking.endTime}</td>
              <td>{booking.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="button-container"> */}
        <Link to="/MainPage">
          <button className="button1">Back</button>
        </Link>
        {/* </div> */}
    </div>
  );
};

export default ViewAllBookings;
