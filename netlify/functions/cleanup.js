export default async function handler(req, res) {
    // Initialize Firebase Admin SDK
    const admin = require("firebase-admin");
    admin.initializeApp();
  
    const now = new Date();
  
    // Reference to the "bookings" collection in Firestore
    const db = admin.firestore();
    const bookingsRef = db.collection("bookings");
  
    console.log("Cleanup function started at", now.toISOString());
  
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
          console.log("Deleted expired booking:", doc.id);
        });
  
        await batch.commit();
        console.log("Expired bookings cleaned up successfully.");
      } else {
        console.log("No expired bookings found.");
      }
  
      res.status(200).end("Cleanup completed.");
    } catch (error) {
      console.error("Error cleaning up expired bookings:", error);
      res.status(500).end("Cleanup failed.");
    }
  }
  