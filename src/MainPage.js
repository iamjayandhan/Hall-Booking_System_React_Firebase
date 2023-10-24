import React, { useState } from 'react';
import './MainPage.css';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const MainPage = () => {
  const [selectedType, setSelectedType] = useState('hall'); // Default to hall
  const [hallAndLabDetails] = useState([
    {
      type: 'hall',
      data: [
        { id: 101, name: 'Hall 453', venue: 'Admission Block, 3rd Floor', seating: 70},
        { id: 102, name: 'Placement Hall / Sir CV raman Hall', venue: 'Admission Block, 2nd Floor', seating: 250 },
        { id: 103, name: 'CDIO Hall', venue: 'Admission Block, 2nd Floor', seating: 250},
        { id: 104, name: 'Yoga Hall', venue: 'Admission Block, 3rd Floor', seating: 250 },
        { id: 105, name: 'Board Room', venue: 'Admission Block, Ground Floor', seating: 15},
        { id: 106, name: 'IQAC Board Room', venue: 'Academic Block, Ground Floor', seating: 25}
      ],
    },
    {
      type: 'lab',
      data: [
        { id: 1, name: 'Hall 213', venue: 'Academic Block, 1st Floor', seating: 70  },
      { id: 2, name: 'Hall 210', venue: 'Academic Block, 1st Floor', seating: 70   },
      { id: 3, name: 'Hall 310/A1', venue: 'Academic Block, 2nd Floor', seating: 70   },
      { id: 4, name: 'Hall 310/B1', venue: 'Academic Block, 2nd Floor', seating: 70   },
      { id: 5, name: 'Hall 410/A1', venue: 'Academic Block, 3rd Floor', seating: 70  },
      { id: 6, name: 'Hall 410/B1', venue: 'Academic Block, 3rd Floor', seating: 70  },
      { id: 7, name: 'Hall 510/A1', venue: 'Academic Block, 4th Floor', seating: 70  },
      { id: 8, name: 'Hall 510/B1', venue: 'Academic Block, 4th Floor', seating: 70  },
      { id: 9, name: 'Hall 610', venue: 'Academic Block, 5th Floor', seating: 70  },
      { id: 10, name: 'Hall 612', venue: 'Academic Block, 5th Floor', seating: 70  },
      { id: 11, name: 'Hall 522', venue: 'Lab Block, 4th Floor', seating: 70  },
      { id: 12, name: 'Hall 523', venue: 'Lab Block, 4th Floor', seating: 70  },
      { id: 13, name: 'Hall 524', venue: 'Lab Block, 4th Floor', seating: 70  },
      { id: 14, name: 'Hall 525', venue: 'Lab Block, 4th Floor', seating: 70  },
      { id: 15, name: 'Hall 526', venue: 'Lab Block, 4th Floor', seating: 70  },
      { id: 16, name: 'Hall 527', venue: 'Lab Block, 4th Floor', seating: 70  },
      { id: 17, name: 'Hall 417 A', venue: 'Lab Block, 3rd Floor', seating: 70  },
      { id: 18, name: 'Hall 417 B', venue: 'Lab Block, 3rd Floor', seating: 70  },
      { id: 19, name: 'Hall 217 D', venue: 'Lab Block, 1st Floor', seating: 70  },
      { id: 20, name: 'Hall 217 D1', venue: 'Lab Block, 1st Floor', seating: 70  },
      { id: 21, name: 'Hall 217 B2', venue: 'Lab Block, 1st Floor', seating: 70  },
      { id: 22, name: 'Hall 619 C', venue: 'Lab Block, 5th Floor', seating: 70  },
      { id: 23, name: 'Hall 619 D', venue: 'Lab Block, 5th Floor', seating: 70  },
      { id: 24, name: 'Hall 619 E', venue: 'Lab Block, 5th Floor', seating: 70  },
      ],
    },
  ]);
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTimeFrom, setBookingTimeFrom] = useState('');
  const [bookingTimeTo, setBookingTimeTo] = useState('');
  const [bookingUsername, setBookingUsername] = useState('');

  const openBookingModal = (hall) => {
    setSelectedHall(hall);
    setBookingModalVisible(true);
  };

  const closeBookingModal = () => {
    setBookingModalVisible(false);
  };

  const handleBookNow = async () => {
    if (!selectedHall || !bookingDate || !bookingTimeFrom || !bookingTimeTo || !bookingUsername) {
      alert('Please fill in all booking details.');
      return;
    }
  
    const newBooking = {
      hallId: selectedHall.id,
      date: bookingDate,
      startTime: bookingTimeFrom,
      endTime: bookingTimeTo,
      username: bookingUsername,
    };
  
    const bookingsCollectionRef = collection(db, 'bookings');
  
    // Check if the selected hall is already booked for the same date
    const hallQuery = query(
      bookingsCollectionRef,
      where('hallId', '==', selectedHall.id),
      where('date', '==', bookingDate)
    );
  
    const querySnapshot = await getDocs(hallQuery);
  
    // Check for time conflicts with the new booking
    const conflicts = querySnapshot.docs.some((doc) => {
      const booking = doc.data();
      const startConflict = (
        booking.startTime <= bookingTimeFrom &&
        booking.endTime >= bookingTimeFrom
      );
      const endConflict = (
        booking.startTime <= bookingTimeTo &&
        booking.endTime >= bookingTimeTo
      );
      if (startConflict || endConflict) {
        return true;
      }
      return false;
    });
  
    if (conflicts) {
      alert('This hall is already booked for the selected time. Please choose another time.');
      return;
    }
  
    // Add the new booking to Firestore
    try {
      // const docRef = await addDoc(bookingsCollectionRef, newBooking);
      alert('Booking successfully added to Firestore!');
      setBookingDate('');
      setBookingTimeFrom('');
      setBookingTimeTo('');
      setBookingUsername('');
      setBookingModalVisible(false);
    } catch (error) {
      console.error('Error adding booking to Firestore: ', error);
      alert('Failed to add the booking. Please try again later.');
    }
  };
  
  
  

  return (
    <div className="MainPage">
      <h1>All {selectedType === 'hall' ? 'Hall' : 'Lab'} Details</h1>
      <div className="type-selector">
        <button onClick={() => setSelectedType('hall')}>Select Hall</button>
        <button onClick={() => setSelectedType('lab')}>Select Lab</button>
      </div>
      <div className="hall-cards">
        {hallAndLabDetails
          .find((item) => item.type === selectedType)
          .data.map((hall) => (
            <div className="hall-card" key={hall.id}>
              <h2>{hall.name}</h2>
              <p>Venue: {hall.venue}</p>
              <p>Seating Capacity: {hall.seating}</p>
              <button
                className="view-button"
                onClick={() => openBookingModal(hall)}
              >
                Book Now
              </button>
            </div>
          ))}
      </div>

      {/* Booking Modal */}
      {isBookingModalVisible && (
        <div className="booking-modal">
          <h2>Book {selectedType === 'hall' ? 'Hall' : 'Lab'}</h2>
          <form>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Time From:</label>
              <input
                type="time"
                value={bookingTimeFrom}
                onChange={(e) => setBookingTimeFrom(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Time To:</label>
              <input
                type="time"
                value={bookingTimeTo}
                onChange={(e) => setBookingTimeTo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={bookingUsername}
                onChange={(e) => setBookingUsername(e.target.value)}
              />
            </div>
            <button type="button" onClick={handleBookNow}>
              Confirm Booking
            </button>
            <button type="button" onClick={closeBookingModal}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MainPage;
