const admin = require("firebase-admin");
const path = require("path");

// Replace the following path with the correct path to your key.json file
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

// Create a query for bookings with "endTime" less than or equal to the current time
const endTimeQuery = bookingsRef.where("endTime", "<=", now.toTimeString().split(" ")[0]);

// Perform the query
endTimeQuery.get()
  .then((endTimeSnapshot) => {
    // Delete only the expired bookings
    const batch = db.batch();
    if (endTimeSnapshot.size > 0) {
      endTimeSnapshot.forEach((doc) => {
        const bookingEndTime = new Date(doc.data().date + "T" + doc.data().endTime);
        if (bookingEndTime <= now) {
          batch.delete(doc.ref);
          console.log("Deleted expired booking:", doc.id);
        }
      });
      return batch.commit();
    } else {
      console.log("No expired bookings found.");
      return Promise.resolve();
    }
  })
  .then(() => {
    console.log("Expired bookings cleaned up successfully.");
  })
  .catch((error) => {
    console.error("Error cleaning up expired bookings:", error);
  });
