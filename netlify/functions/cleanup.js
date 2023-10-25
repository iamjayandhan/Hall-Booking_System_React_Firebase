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

// Create a query for outdated bookings based on the current timestamp
const expiredQuery = bookingsRef.where("endTime", "<=", now.toISOString());

expiredQuery.get().then((expiredSnapshot) => {
  const batch = db.batch();
  
  expiredSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
    console.log("Deleted expired booking:", doc.id);
  });
  
  if (expiredSnapshot.size > 0) {
    return batch.commit().then(() => {
      console.log("Expired bookings cleaned up successfully.");
    });
  } else {
    console.log("No expired bookings found.");
    return Promise.resolve();
  }
}).catch((error) => {
  console.error("Error cleaning up expired bookings:", error);
});
