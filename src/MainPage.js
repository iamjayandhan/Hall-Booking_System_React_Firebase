import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainPage = ({ location }) => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [date, setDate] = useState('1');
  const [time, setTime] = useState('1.00 - 2.00 AM');
  const [roomType, setRoomType] = useState('boardroom');
  const [availabilityStatus, setAvailabilityStatus] = useState('');

  useEffect(() => {
    // Function to populate the date dropdown based on the selected year and month
    const populateDates = () => {
      const lastDay = new Date(year, month, 0).getDate();
      const dates = Array.from({ length: lastDay }, (_, i) => (i + 1).toString());
      setDate(dates[0]); // Set the default date to the first available date
    };

    // Function to populate the time dropdown
    const populateTimes = () => {
      // Define the time range
      const timeRanges = [
        "1.00 - 2.00 AM", "2.00 - 3.00 AM", "3.00 - 4.00 AM", "4.00 - 5.00 AM",
        "5.00 - 6.00 AM", "6.00 - 7.00 AM", "7.00 - 8.00 AM", "8.00 - 9.00 AM",
        "9.00 - 10.00 AM", "10.00 - 11.00 AM", "11.00 - 12.00 PM", "12.00 - 1.00 PM",
        "1.00 - 2.00 PM", "2.00 - 3.00 PM", "3.00 - 4.00 PM", "4.00 - 5.00 PM",
        "5.00 - 6.00 PM", "6.00 - 7.00 PM", "7.00 - 8.00 PM", "8.00 - 9.00 PM",
        "9.00 - 10.00 PM", "10.00 - 11.00 PM", "11.00 - 12.00 AM", "12.00 - 1.00 AM"
      ];
      setTime(timeRanges[0]); // Set the default time to the first available time
    };

    // Populate dates and times when year or month changes
    populateDates();
    populateTimes();
  }, [year, month]);

  // Function to check availability
  const checkAvailability = () => {
    // Here, you can implement the logic to check availability based on the selected options
    // You can make an AJAX request to the server or perform any other checks as needed

    // For demonstration purposes, let's assume availabilityStatus is either "Available" or "Unavailable"
    const availabilityStatus = "Available";

    // Set the availability status
    setAvailabilityStatus(`Availability Status for ${year}-${month}-${date} at ${time} in ${roomType}: ${availabilityStatus}`);
    
  };

  return (
    <div className="container">
      <h1>Hall Booking System</h1>
      <form>
        <label htmlFor="year">Select Year:</label>
        <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>

        <label htmlFor="month">Select Month:</label>
        <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <label htmlFor="date">Select Date:</label>
        <select id="date" value={date} onChange={(e) => setDate(e.target.value)}>
          {/* Populate date options dynamically */}
          {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <label htmlFor="time">Select Time:</label>
        <select id="time" value={time} onChange={(e) => setTime(e.target.value)}>
          {/* Populate time options dynamically */}
          {[
            "1.00 - 2.00 AM", "2.00 - 3.00 AM", "3.00 - 4.00 AM", "4.00 - 5.00 AM",
            "5.00 - 6.00 AM", "6.00 - 7.00 AM", "7.00 - 8.00 AM", "8.00 - 9.00 AM",
            "9.00 - 10.00 AM", "10.00 - 11.00 AM", "11.00 - 12.00 PM", "12.00 - 1.00 PM",
            "1.00 - 2.00 PM", "2.00 - 3.00 PM", "3.00 - 4.00 PM", "4.00 - 5.00 PM",
            "5.00 - 6.00 PM", "6.00 - 7.00 PM", "7.00 - 8.00 PM", "8.00 - 9.00 PM",
            "9.00 - 10.00 PM", "10.00 - 11.00 PM", "11.00 - 12.00 AM", "12.00 - 1.00 AM"
          ].map((timeOption) => (
            <option key={timeOption} value={timeOption}>
              {timeOption}
            </option>
          ))}
        </select>

        <label htmlFor="roomType">Select Hall/Room Type:</label>
        <select id="roomType" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="boardroom">Boardroom</option>
          <option value="labs">Lab</option>
        </select>

        {/* <button className='logregbtn' type="button" id="checkAvailability" onClick={checkAvailability}>Check Availability</button> */}
        <Link className='logregbtn' onClick={checkAvailability} to="/Availability">Go to Booking Page</Link>
        {/* Display the availability status */}
        <div id="availabilityStatus">{availabilityStatus}</div>
      </form>
    </div>
  );
};

export default MainPage;
