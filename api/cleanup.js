export default async function handler(req, res) {
    // Initialize Firebase Admin SDK
    const admin = require("firebase-admin");
    admin.initializeApp();
  
    const now = new Date();
  
    // Reference to the "bookings" collection in Firestore
    const db = admin.firestore();
    const bookingsRef = db.collection("bookings");
  
    // Query bookings that have ended
    const expiredBookingsQuery = bookingsRef
      .where("date", "<=", now.toISOString().split("T")[0])
      .where("endTime", "<", now.toTimeString().split(" ")[0]);
  
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
  
      res.statusCode = 200;
      res.end("Cleanup completed.");
    } catch (error) {
      console.error("Error cleaning up expired bookings:", error);
      res.statusCode = 500;
      res.end("Cleanup failed.");
    }
  }
  