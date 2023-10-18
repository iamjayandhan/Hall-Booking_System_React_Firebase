import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './MainPage.css';

function MainPage() {
  const [hallDetails, setHallDetails] = useState([]); // State to store hall details
  const hallCollectionRef = collection(db, 'hall');

  useEffect(() => {
    // Fetch all hall details when the component mounts
    const fetchAllHalls = async () => {
      try {
        const hallSnapshot = await getDocs(hallCollectionRef);

        // Create an array to store hall details
        const halls = [];

        hallSnapshot.forEach((doc) => {
          const hallData = doc.data();
          const hallId = Number(doc.id); // Convert the ID to a number
          halls.push({ id: hallId, ...hallData });
        });

        // Sort the halls by ID in ascending order
        halls.sort((a, b) => a.id - b.id);

        setHallDetails(halls);
      } catch (error) {
        console.error('Error fetching hall details:', error);
      }
    };

    fetchAllHalls();
  }, [hallCollectionRef]);

  return (
    <div className="MainPage">
      <h1>All Hall Details</h1>
      <div className="hall-cards">
        {hallDetails.map((hall) => (
          <div className="hall-card" key={hall.id}>
            <h2>{hall.name}</h2>
            <p>Seating Capacity: {hall.seating}</p>
            <p>Venue: {hall.venue}</p>
            {/* Add a "View" button that links to the booking page */}
            {/* <Link to={`/book/${hall.id}`}>
              <button className="view-button">View</button>
            </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
