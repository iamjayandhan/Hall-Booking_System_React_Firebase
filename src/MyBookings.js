import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState(null);

  const username = Cookies.get('username');

  useEffect(() => {
    if (username) {
      const fetchMyBookings = async () => {
        try {
          const bookingsCollectionRef = collection(db, 'bookings');
          const myBookingsQuery = query(bookingsCollectionRef, where('loggedin', '==', username));
          const querySnapshot = await getDocs(myBookingsQuery);

          const myBookings = [];
          querySnapshot.forEach((doc) => {
            myBookings.push({ id: doc.id, ...doc.data() });
          });

          setBookings(myBookings);
        } catch (error) {
          console.error('Error fetching user bookings:', error);
        }
      };

      fetchMyBookings();
    }
  }, [username]);

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setUpdatedBooking({ ...booking }); // Initialize with the selected booking data
  };

  const handleUpdateBooking = async () => {
    try {
      const bookingDocRef = doc(db, 'bookings', editingBooking.id);
      const { hallName, date, startTime, endTime } = updatedBooking;

      await updateDoc(bookingDocRef, { hallName, date, startTime, endTime });

      setBookings((bookings) =>
        bookings.map((booking) =>
          booking.id === editingBooking.id ? { ...booking, ...updatedBooking } : booking
        )
      );

      setEditingBooking(null);
      setUpdatedBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmation = window.confirm('Are you sure you want to cancel this booking?');
  
    if (confirmation) {
      try {
        const bookingDocRef = doc(db, 'bookings', bookingId);
        await deleteDoc(bookingDocRef);
  
        setBookings((bookings) => bookings.filter((booking) => booking.id !== bookingId));
      } catch (error) {
        console.error('Error canceling booking:', error);
      }
    }
  };
  

  return (
    <div>
      <h1>My Bookings for {username}</h1>
      <table>
        <thead>
          <tr>
            <th>Hall Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Edit</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.hallName}</td>
              <td>
                {editingBooking && editingBooking.id === booking.id ? (
                  <input
                    type="date"
                    value={updatedBooking.date}
                    onChange={(e) =>
                      setUpdatedBooking({ ...updatedBooking, date: e.target.value })
                    }
                  />
                ) : (
                  booking.date
                )}
              </td>
              <td>
                {editingBooking && editingBooking.id === booking.id ? (
                  <input
                    type="time"
                    value={updatedBooking.startTime}
                    onChange={(e) =>
                      setUpdatedBooking({ ...updatedBooking, startTime: e.target.value })
                    }
                  />
                ) : (
                  booking.startTime
                )}
              </td>
              <td>
                {editingBooking && editingBooking.id === booking.id ? (
                  <input
                    type="time"
                    value={updatedBooking.endTime}
                    onChange={(e) =>
                      setUpdatedBooking({ ...updatedBooking, endTime: e.target.value })
                    }
                  />
                ) : (
                  booking.endTime
                )}
              </td>
              <td>
                {editingBooking && editingBooking.id === booking.id ? (
                  <button onClick={handleUpdateBooking}>Save</button>
                ) : (
                  <button onClick={() => handleEditBooking(booking)}>Edit</button>
                )}
              </td>
              <td>
                <button onClick={() => handleCancelBooking(booking.id)}>Cancel</button>
              </td>
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

export default MyBookings;
