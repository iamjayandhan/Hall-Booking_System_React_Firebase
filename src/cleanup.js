const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firebase Admin
admin.initializeApp(functions.config().firebase);

const cleanup = async () => {
  const now = new Date();

  // Reference to the "bookings" collection in Firestore
  const db = admin.firestore();
  const bookingsRef = db.collection('bookings');

  console.log('Cleanup function started at', now.toISOString());

  try {
    // Create a query for all bookings
    const allBookingsQuery = bookingsRef;

    // Perform the query
    const bookingsSnapshot = await allBookingsQuery.get();

    // Delete only the expired bookings
    const batch = db.batch();
    let skippedCount = 0;
    let deletedCount = 0;

    bookingsSnapshot.forEach((doc) => {
      const bookingEndTime = new Date(doc.data().date + 'T' + doc.data().endTime);
      if (bookingEndTime <= now) {
        batch.delete(doc.ref);
        console.log('Deleted expired booking:', doc.id);
        deletedCount++;
      } else {
        console.log('Skipped booking (not expired):', doc.id);
        skippedCount++;
      }
    });

    if (deletedCount > 0) {
      await batch.commit();
      console.log('Expired bookings cleaned up successfully.');
    } else if (skippedCount > 0) {
      console.log('No expired bookings found.');
    }
  } catch (error) {
    console.error('Error cleaning up expired bookings:', error);
  }
};

module.exports = functions.https.onRequest((req, res) => {
  cleanup()
    .then(() => {
      res.status(200).send('Cleanup completed successfully');
    })
    .catch((error) => {
      console.error('Cleanup failed:', error);
      res.status(500).send('Cleanup failed');
    });
});
