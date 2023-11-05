  import React, { useState } from 'react';
  import './MainPage.css';
  import { db } from './firebase';
  import { addDoc,collection, getDocs, query, where } from 'firebase/firestore';
  import { cleanupExpiredBookings } from './cleanup';
  import { Link } from 'react-router-dom';
  import Cookies from 'js-cookie';
  import { debounce } from 'lodash'; // Import the debounce function from the lodash library
  import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
  
  const MainPage = () => {
    const username = Cookies.get('username');

    //popup
    const [customDialogOpen, setCustomDialogOpen] = useState(false);
    const [customDialogTitle, setCustomDialogTitle] = useState('');
    const [customDialogMessage, setCustomDialogMessage] = useState('');
    const [customDialogButtonName, setCustomDialogButtonName] = useState('');


    const CustomDialog = ({ open, onClose, title, message, buttonName }) => {
      return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <p>{message}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary" autoFocus>
              {buttonName}
            </Button>
          </DialogActions>
        </Dialog>
      );
    };

    // Function to open the custom dialog
    const openCustomDialog = (title, message, buttonName) => {
      setCustomDialogTitle(title);
      setCustomDialogMessage(message);
      setCustomDialogButtonName(buttonName);
      setCustomDialogOpen(true);
    };

    // Function to close the custom dialog
    const closeCustomDialog = () => {
      setCustomDialogTitle('');
      setCustomDialogMessage('');
      setCustomDialogButtonName('');
      setCustomDialogOpen(false);
    };

    const [searchInput, setSearchInput] = useState('');
    const [filteredHalls, setFilteredHalls] = useState([]);

    // Define a debounced version of the filterHalls function
      const debouncedFilterHalls = debounce((lowercaseSearch) => {
        const hallsToDisplay = hallAndLabDetails
          .find((item) => item.type === selectedType)
          .data.filter((hall) => {
            // Check if the hall name, venue, or seating capacity contains the search input
            return (
              hall.name.toLowerCase().includes(lowercaseSearch) ||
              hall.venue.toLowerCase().includes(lowercaseSearch) ||
              hall.seating.toString().includes(searchInput)
            );
          });
        setFilteredHalls(hallsToDisplay);
      }, 300); // Adjust the debounce delay as needed (e.g., 300 milliseconds)

      // Modify the search input onChange event to call the debounced function
      const handleSearchInputChange = (e) => {
        const lowercaseSearch = e.target.value.toLowerCase();
        setSearchInput(lowercaseSearch);
        debouncedFilterHalls(lowercaseSearch);
      };

    const handleRefresh = async () => {
      try {
        await cleanupExpiredBookings(); // Call the cleanup function
        openCustomDialog("Refresh Status","Database is Up to date! Please proceed.","Done");

      } catch (error) {
        console.error('Error executing cleanup function:', error);
        openCustomDialog("Refresh Status","Unable to Refresh Database: "+error,"Ok");
      }
    };
    
    const copyToClipboard = (e, hall) => {
      e.preventDefault(); // Prevent the default button behavior (form submission, etc.)
      const textToCopy = `Hall Name: ${hall.name}\nVenue: ${hall.venue}\nSeating Capacity: ${hall.seating}`;
    
      const copyButton = e.currentTarget; // Reference to the clicked button
      const originalButtonText = copyButton.textContent;
    
      // Check if the Clipboard API is available
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            copyButton.textContent = "Copied!";
            setTimeout(() => {
              copyButton.textContent = originalButtonText;
            }, 2000); // Revert back to "Copy" after 2 seconds
          })
          .catch((error) => {
            console.error('Failed to copy to clipboard:', error);
            openCustomDialog("Copy Status", "Failed to copy: " + error, "Ok");
          });
      } else {
        // Fallback for browsers that do not support Clipboard API
        try {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          copyButton.textContent = "Copied!";
          setTimeout(() => {
            copyButton.textContent = originalButtonText;
          }, 2000); // Revert back to "Copy" after 2 seconds
        } catch (error) {
          console.error('Copying to clipboard is not supported:', error);
          openCustomDialog("Copy Status","An Unexpected error occured: "+error,"Done");
        }
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
        openCustomDialog("Warning!","Please fill in all booking details","Ok");
        return;
      }

      // Check if endTime is less than or equal to startTime
      if (bookingTimeTo <= bookingTimeFrom) {
        openCustomDialog("Warning!", "End time cannot be earlier than or equal to the start time","Done");
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
          openCustomDialog("Booking Failed!","This hall is already booked for the selected time. Please choose another time","Done");
          return true; // Conflict
        }
    
        return false; // No conflict
      });
    
      if (!conflicts) {
        try {
          await addDoc(bookingsCollectionRef, newBooking);
          openCustomDialog("Booking Successful!","Your booking was successful. Enjoy your time!","Done");
          setBookingDate('');
          setBookingTimeFrom('');
          setBookingTimeTo('');
          setBookingUsername('');
          setBookingModalVisible(false);
        } catch (error) {
          console.error('Error adding booking to Firestore: ', error);
          openCustomDialog("Error!","Error adding booking to Firestore: "+error,"Done");
        }
      }
    };
    
    
    const currentdate = new Date().toISOString().split('T')[0];
    
    

    return (
      <div className="Main">
        <div className="MainPage">
          <h1 className="greet">Welcome, {username}!</h1>
  
          <div className="button-container">
            <button className="button" onClick={() => setSelectedType('hall')}>
              Hall
            </button>
            <button className="button" onClick={() => setSelectedType('lab')}>
              Lab
            </button>
            <button className="button" onClick={handleRefresh} style={{ marginBottom: '0px' }}>
              Refresh
            </button>
            <Link to="/ViewAllBookings">
              <button className="button3">View All Bookings</button>
            </Link>
            <Link to={{ pathname: '/MyBookings', state: { username } }}>
              <button className="button">My Bookings</button>
            </Link>
            <button className="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
  
          <h1>Available {selectedType === 'hall' ? 'Hall' : 'Lab'} Details</h1>
  
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => {
              handleSearchInputChange(e);
            }}
            style={{ width: '15rem' }}
          />

          
      <CustomDialog
        open={customDialogOpen}
        onClose={closeCustomDialog}
        title={customDialogTitle}
        message={customDialogMessage}
        buttonName={customDialogButtonName}
      />


       {/* Booking Modal */}
          <Dialog open={isBookingModalVisible} onClose={closeBookingModal}>
          <DialogTitle className="dialog-title">Book {selectedType === 'hall' ? `Hall ${selectedHall?.name}` : `Lab ${selectedHall?.name}`}</DialogTitle>
  <DialogContent>
    <form>
      <div className="form-group">
        <label className="form-label">Date:</label>
        <input
          type="date"
          value={bookingDate}
          min={currentdate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Time From:</label>
        <input
          type="time"
          value={bookingTimeFrom}
          onChange={(e) => setBookingTimeFrom(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Time To:</label>
        <input
          type="time"
          value={bookingTimeTo}
          onChange={(e) => setBookingTimeTo(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Handler:</label>
        <input
          type="text"
          value={bookingUsername}
          onChange={(e) => setBookingUsername(e.target.value)}
          className="form-input"
        />
      </div>
      <DialogActions className="dialog-actions">
        <Button onClick={handleBookNow} color="primary" variant="contained" className="action-button">
          Confirm
        </Button>
        <Button onClick={closeBookingModal} color="primary" variant="contained" className="action-button">
          Cancel
        </Button>
      </DialogActions>
    </form>
  </DialogContent>
</Dialog>

  
          <div className="hall-cards">
            {(searchInput === ''
              ? hallAndLabDetails.find((item) => item.type === selectedType).data
              : filteredHalls
            ).map((hall) => (
              <div className="hall-card" key={hall.id}>
                <h2>{hall.name}</h2>
                <p>Venue: {hall.venue}</p>
                <p>Seating Capacity: {hall.seating}</p>
                <button className="view-button" onClick={() => openBookingModal(hall)}>
                  Book Now
                </button>
                <button className="copy-button" onClick={(e) => copyToClipboard(e, hall)}>
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default MainPage;
