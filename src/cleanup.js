import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBAWySZuXFEJVCxLr-AzX4AvYFhAb0eNrY",
  authDomain: "hall-allocation-c720d.firebaseapp.com",
  projectId: "hall-allocation-c720d",
  storageBucket: "hall-allocation-c720d.appspot.com",
  messagingSenderId: "791800414601",
  appId: "1:791800414601:web:62b5aa8a208e925f666158",
  measurementId: "G-GG773MRH0F"
};

(async () => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    const now = new Date();

    // Reference to the "bookings" collection in Firestore
    const bookingsCollection = collection(db, 'bookings');
    const bookingsQuery = query(bookingsCollection);

    // Get all bookings
    const snapshot = await getDocs(bookingsQuery);

    let deletedCount = 0;
    let skippedCount = 0;

    snapshot.forEach(async (doc) => {
      const booking = doc.data();
      const bookingEndTime = new Date(booking.date + "T" + booking.endTime);

      if (bookingEndTime <= now) {
        // Delete expired booking
        await deleteDoc(doc.ref);
        console.log("Deleted expired booking:", doc.id);
        deletedCount++;
      } else {
        console.log("Skipped booking (not expired):", doc.id);
        skippedCount++;
      }
    });

    if (deletedCount > 0) {
      console.log("Expired bookings cleaned up successfully.");
    } else if (skippedCount > 0) {
      console.log("No expired bookings found.");
    }
  } catch (error) {
    console.error("Error cleaning up expired bookings:", error);
  }
})();
