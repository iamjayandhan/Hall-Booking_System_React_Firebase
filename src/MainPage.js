  import React, { useState } from 'react';
  import './MainPage.css';
  import { db } from './firebase';
  import { addDoc,collection, getDocs, query, where } from 'firebase/firestore';
  import { cleanupExpiredBookings } from './cleanup';
  import { Link } from 'react-router-dom';
  import Cookies from 'js-cookie'; // Import the Cookies library


  const MainPage = () => {
    const username = Cookies.get('username');
        
    const handleRefresh = async () => {
      try {
        await cleanupExpiredBookings(); // Call the cleanup function
        alert('Cleanup function executed successfully');
      } catch (error) {
        console.error('Error executing cleanup function:', error);
        alert('Error executing cleanup function');
      }
    };
    
    const handleLogout = () => {
      // Delete the username cookie
      Cookies.remove('username');
  
      // Navigate to the Login page
      window.location.href = '/login'; // You can replace with your actual Login page route
    };

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
    
      // if (username === bookingUsername) {
      //   alert('You cannot make the same booking as the currently logged-in user.');
      //   return;
      // }

      // Check if endTime is less than or equal to startTime
      if (bookingTimeTo <= bookingTimeFrom) {
        alert('End time cannot be earlier than or equal to the start time.');
        return;
      }

    
      const newBooking = {
        hallName: selectedHall.name,
        date: bookingDate,
        startTime: bookingTimeFrom,
        endTime: bookingTimeTo,
        username: bookingUsername,
        loggedin: username, // User currently logged in
      };
    
      const bookingsCollectionRef = collection(db, 'bookings');
    
      // Check if the selected hall is already booked for the same date
      const hallQuery = query(
        bookingsCollectionRef,
        where('hallName', '==', selectedHall.name),
        where('date', '==', bookingDate),
      );
    
      const querySnapshot = await getDocs(hallQuery);
    
      // Check for conflicts with the new booking
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
          alert('This hall is already booked for the selected time. Please choose another time.');
          return true; // Conflict
        }
    
        return false; // No conflict
      });
    
      if (!conflicts) {
        try {
          await addDoc(bookingsCollectionRef, newBooking);
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
      }
    };
    
    
    const currentdate = new Date().toISOString().split('T')[0];
    
    

    return (
      <div className="Main">
      <div className="MainPage">
        
        <h1>Welcome, {username}!</h1>

        <div className="button-container">

        {/* <div className="type-selector"> */}
        <button className="button" onClick={() => setSelectedType('hall')}>Hall</button>
        <button className="button" onClick={() => setSelectedType('lab')}>Lab</button>
        {/* </div> */}

        <button className="button" onClick={handleRefresh}>Refresh</button>
  
        <Link to="/ViewAllBookings">
          <button className="button" style={{ width: '200px' }}>View All Bookings</button>
        </Link>

        
        <Link to={{ pathname: '/MyBookings', state: { username } }}>
         <button className="button">My Bookings</button>
        </Link>
      
        <button className="button" onClick={handleLogout}>Logout</button>

        </div>

        <h1>Available {selectedType === 'hall' ? 'Hall' : 'Lab'} Details</h1>

        

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
                  min={currentdate}
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
                <label>Handler:</label>
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
        
        {/* Refresh Button */}

        
        </div>
        </div>
    );
  };

  export default MainPage;
