export async function handler(event, context, callback) {
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
  
      // Create two separate queries for "date" and "endTime" filters
      const dateQuery = bookingsRef.where("date", "<=", now.toISOString().split("T")[0]);
      const endTimeQuery = bookingsRef.where("endTime", "<=", now.toTimeString().split(" ")[0]);
  
      // Perform the queries
      const [dateSnapshot, endTimeSnapshot] = await Promise.all([
        dateQuery.get(),
        endTimeQuery.get(),
      ]);
  
      // Combine the results of the two queries
      const expiredBookings = new Set();
  
      dateSnapshot.forEach((doc) => {
        if (endTimeSnapshot.docs.some((endTimeDoc) => endTimeDoc.id === doc.id)) {
          expiredBookings.add(doc.id);
        }
      });
  
      if (expiredBookings.size > 0) {
        const batch = db.batch();
  
        expiredBookings.forEach((bookingId) => {
          const bookingRef = bookingsRef.doc(bookingId);
          batch.delete(bookingRef);
          console.log("Deleted expired booking:", bookingId);
        });
  
        await batch.commit();
        console.log("Expired bookings cleaned up successfully.");
      } else {
        console.log("No expired bookings found.");
      }
  
      // Send a response to the callback function
      callback(null, {
        statusCode: 200,
        body: "Cleanup completed.",
      });
    } catch (error) {
      // Handle any errors and send an error response to the callback function
      console.error("Error cleaning up expired bookings:", error);
      callback(null, {
        statusCode: 500,
        body: "Cleanup failed.",
      });
    }
  }
  