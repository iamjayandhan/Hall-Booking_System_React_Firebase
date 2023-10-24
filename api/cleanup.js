export default async function handler(req, res) {
    // Initialize Firebase Admin SDK
    const admin = require("firebase-admin");
    admin.initializeApp();
  
    const now = new Date();

    // Get today's date in the same format as your Firestore data ("YYYY-MM-DD")
    const todayDateString = now.toISOString().split('T')[0];
  
    // Reference to the "bookings" collection in Firestore
    const db = admin.firestore();
    const bookingsRef = db.collection("bookings");
  
    // Query bookings that have ended for today
    const expiredBookingsQuery = bookingsRef
      .where("endTime", "<", now)
      .where("date", "==", todayDateString);
  
    try {
      const querySnapshot = await expiredBookingsQuery.get();
  
      if (!querySnapshot.empty) {
        const batch = db.batch();
        querySnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log("Expired bookings cleaned up successfully.");
      }
  
      res.status(200).end("Cleanup completed.");
    } catch (error) {
      console.error("Error cleaning up expired bookings:", error);
      res.status(500).end("Cleanup failed.");
    }
  }
