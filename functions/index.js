const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Define a Firebase scheduled function
exports.cleanupExpiredBookings = functions.pubsub.schedule('every 2 minutes').timeZone('Asia/Kolkata').onRun((context) => {
  const now = new Date();

  // Reference to the "bookings" collection in Firestore
  const bookingsRef = admin.firestore().collection('bookings');

  // Query bookings that have ended
  const expiredBookingsQuery = bookingsRef.where('endTime', '<', now);

  // Delete expired bookings
  return expiredBookingsQuery.get()
    .then((querySnapshot) => {
      const batch = admin.firestore().batch();
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    })
    .then(() => {
      console.log('Expired bookings cleaned up successfully.');
      return null;
    })
    .catch((error) => {
      console.error('Error cleaning up expired bookings:', error);
    });
});
