export default async function handler(req, res) {
    try {
      // Initialize Firebase Admin SDK
      const admin = require("firebase-admin");
      const path = require("path");
      const serviceAccount = require(path.resolve(__dirname, "../../key.json"));    
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://hall-allocation-c720d.firebaseio.com",
      });
  
      const now = new Date();
  
      // Reference to the "bookings" collection in Firestore
      const db = admin.firestore();
      const bookingsRef = db.collection("bookings");
  
      console.log("Cleanup function started at", now.toISOString());
  
      // Query bookings that have ended
      const expiredBookingsQuery = bookingsRef
        .where("date", "<=", now.toISOString().split("T")[0])
        .where("endTime", "<=", now.toTimeString().split(" ")[0]);
  
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
  
      // Send a response with a 200 status code
      res.statusCode = 200;
      res.end("Cleanup completed.");
    } catch (error) {
      // Handle any errors and send a response with a 500 status code
      console.error("Error cleaning up expired bookings:", error);
      res.statusCode = 500;
      res.end("Cleanup failed.");
    }
  }
  