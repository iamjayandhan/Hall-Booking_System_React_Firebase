import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './ViewAllBookings.css';
import { Link } from 'react-router-dom';

const ViewAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByStartTime, setSortByStartTime] = useState(false);

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

        // Initially sort the bookings by date
        bookingsData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const sortBookingsByDate = () => {
    const sortedBookings = [...bookings];
    sortedBookings.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortByDate ? dateA - dateB : dateB - dateA;
    });
    setSortByDate(!sortByDate);
    setBookings(sortedBookings);
  };

  const sortBookingsByStartTime = () => {
    const sortedBookings = [...bookings];
    sortedBookings.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.startTime}`);
      const timeB = new Date(`1970-01-01T${b.startTime}`);
      return sortByStartTime ? timeA - timeB : timeB - timeA;
    });
    setSortByStartTime(!sortByStartTime);
    setBookings(sortedBookings);
  };

  return (
    <div>
      <h1>All Bookings</h1>
      <table>
        <thead>
          <tr>
            <th>Hall Name</th>
            <th>
              Date
              <button className={sortByDate ? "up-arrow" : "down-arrow"} onClick={sortBookingsByDate} />
            </th>
            <th>
              Start Time
              <button className={sortByStartTime ? "up-arrow" : "down-arrow"} onClick={sortBookingsByStartTime} />
            </th>


            <th>End Time</th>
            <th>Handler Name</th>
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
      <Link to="/MainPage">
        <button className="button1">Back</button>
      </Link>
    </div>
  );
};

export default ViewAllBookings;
