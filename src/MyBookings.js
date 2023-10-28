import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState(null);
  const [sortByDate, setSortByDate] = useState(false);
  const [sortByStartTime, setSortByStartTime] = useState(false);

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

          myBookings.sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.startTime}`);
            const dateTimeB = new Date(`${b.date}T${b.startTime}`);

            if (dateTimeA < dateTimeB) return -1;
            if (dateTimeA > dateTimeB) return 1;

            if (a.creationOrder < b.creationOrder) return -1;
            if (a.creationOrder > b.creationOrder) return 1;
            return 0;
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
    setUpdatedBooking({ ...booking });
  };

  // const handleUpdateBooking = async () => {
  //   try {
  //     const bookingDocRef = doc(db, 'bookings', editingBooking.id);
  //     const { hallName, date, startTime, endTime } = updatedBooking;

  //     await updateDoc(bookingDocRef, { hallName, date, startTime, endTime });

  //     setBookings((bookings) =>
  //       bookings.map((booking) =>
  //         booking.id === editingBooking.id ? { ...booking, ...updatedBooking } : booking
  //       )
  //     );

  //     setEditingBooking(null);
  //     setUpdatedBooking(null);
  //   } catch (error) {
  //     console.error('Error updating booking:', error);
  //   }
  // };
  const handleUpdateBooking = async () => {
    try {
      const updatedBookings = [...bookings];
      const editingIndex = updatedBookings.findIndex((booking) => booking.id === editingBooking.id);
  
      if (editingIndex === -1) {
        console.error('Editing booking not found.');
        return;
      }
  
      const updatedBookingCopy = {
        hallName: updatedBooking.hallName,
        date: updatedBooking.date,
        startTime: updatedBooking.startTime,
        endTime: updatedBooking.endTime,
      };
  
      const hasConflict = updatedBookings.some((booking, index) => {
        if (index === editingIndex) return false;
  
        const editingDateTime = new Date(`${updatedBookingCopy.date}T${updatedBookingCopy.startTime}`);
        const editingEndDateTime = new Date(`${updatedBookingCopy.date}T${updatedBookingCopy.endTime}`);
        const existingDateTime = new Date(`${booking.date}T${booking.startTime}`);
        const existingEndDateTime = new Date(`${booking.date}T${booking.endTime}`);
  
        if (
          editingDateTime < existingEndDateTime &&
          editingEndDateTime > existingDateTime
        ) {
          return true;
        }
  
        return false;
      });
  
      if (hasConflict) {
        alert('This hall is already booked for the selected time. Please choose another time.');
        return;
      }
  
      updatedBookings[editingIndex] = updatedBookingCopy;
      setBookings(updatedBookings);
  
      setEditingBooking(null);
      setUpdatedBooking(null);
  
      const bookingDocRef = doc(db, 'bookings', editingBooking.id);
      const { hallName, date, startTime, endTime } = updatedBookingCopy;
  
      await updateDoc(bookingDocRef, { hallName, date, startTime, endTime });
  
      alert('Booking successfully edited!');
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

  const currentdate = new Date().toISOString().split('T')[0];


  return (
    <div>
      <h1>My Bookings for {username}</h1>
      <table>
        <thead>
          <tr>
            <th>Hall Name</th>
            <th>
              Date
              <button onClick={sortBookingsByDate}>
                {sortByDate ? '▼' : '▲'}
              </button>
            </th>
            <th>
              Start Time
              <button onClick={sortBookingsByStartTime}>
                {sortByStartTime ? '▼' : '▲'}
              </button>
            </th>
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
                    min={currentdate}
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
