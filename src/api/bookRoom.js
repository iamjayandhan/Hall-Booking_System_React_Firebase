const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  const { year, month, date, time, roomType, username, mentorName } = req.body;

  try {
    // Implement your database query here to insert the booking record
    // Example: await sql`INSERT INTO bookings (date, time, room_type, username, mentor_name) VALUES (${date}, ${time}, ${roomType}, ${username}, ${mentorName})`;
    
    // Return a success message in the response
    res.status(200).json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Error booking room:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
