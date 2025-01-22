import React, { useState, useEffect } from "react";

// Sample data for a single room's schedule
const roomSchedule = [
    { day: "Monday", course: "Math 101", startTime: "7:00 AM", endTime: "9:00 AM" },
    { day: "Monday", course: "Physics", startTime: "9:00 AM", endTime: "11:00 AM" },
    { day: "Tuesday", course: "History", startTime: "8:00 AM", endTime: "10:00 AM" },
    { day: "Wednesday", course: "Chem 101", startTime: "10:30 AM", endTime: "12:00 PM" },
    { day: "Friday", course: "Biology", startTime: "1:00 PM", endTime: "3:00 PM" },
    { day: "Friday", course: "English", startTime: "3:00 PM", endTime: "5:00 PM" },
    { day: "Thursday", course: "PE", startTime: "4:00 PM", endTime: "6:00 PM" },
  ];
  
  // Days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  // Generate time slots dynamically based on range
  const generateTimeSlots = (startHour, endHour) => {
    const start = new Date();
    start.setHours(startHour, 0, 0); // Start time
  
    const end = new Date();
    end.setHours(endHour, 0, 0); // End time
  
    const timeSlots = [];
    while (start <= end) {
      const hours = start.getHours();
      const minutes = start.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const formattedTime = `${((hours + 11) % 12 + 1)}:${
        minutes === 0 ? "00" : minutes
      } ${period}`;
      timeSlots.push(formattedTime);
      start.setMinutes(start.getMinutes() + 30); // Increment by 30 minutes
    }
    return timeSlots;
  };

const AvailabilityVisual = () => {

    const [roomData, setRoomData] = useState([]);

    const fetchRoom = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/room?room=COMLAB%201');
            if (!response.ok) {
                throw new Error('Failed to fetch room');
            }
            const data = await response.json();
            setRoomData(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRoom();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    useEffect(() => {
        // This will log roomData whenever it gets updated
        console.log(roomData);
    }, [roomData]); // Logs whenever roomData is updated


    const [timeRange, setTimeRange] = useState("morning"); // Default to morning view

    // Time slots for morning and afternoon
    const timeSlots =
      timeRange === "morning"
        ? generateTimeSlots(7, 14) // 7:00 AM to 2:00 PM
        : generateTimeSlots(14, 21); // 2:00 PM to 9:30 PM
  
    // Function to check if a given time is within the occupied range for a course
    const isOccupied = (day, time) => {
      // Find all courses on the specific day
      const coursesOnDay = roomSchedule.filter((slot) => slot.day === day);
  
      // Check each course's start and end time
      for (let course of coursesOnDay) {
        const start = new Date(`1970-01-01T${convertTo24Hour(course.startTime)}:00`);
        const end = new Date(`1970-01-01T${convertTo24Hour(course.endTime)}:00`);
        const currentTime = new Date(`1970-01-01T${convertTo24Hour(time)}:00`);
  
        // Check if the current time is between the course start and end times
        if (currentTime >= start && currentTime < end) {
          return course; // Return the course object if it's occupied
        }
      }
      return null; // Time is available
    };
  
    // Convert time from 12-hour format to 24-hour format
    const convertTo24Hour = (time) => {
      const [hour, minute, period] = time.split(/[: ]/);
      const hour24 = period === "PM" && hour !== "12" ? parseInt(hour) + 12 : hour === "12" && period === "AM" ? 0 : hour;
      return `${hour24}:${minute}`;
    };
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Room Availability: Room 101
          </h1>
    
          {/* Toggle Buttons */}
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => setTimeRange("morning")}
              className={`px-4 py-2 mx-2 rounded-lg font-medium ${
                timeRange === "morning"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              7:00 AM - 2:00 PM
            </button>
            <button
              onClick={() => setTimeRange("afternoon")}
              className={`px-4 py-2 mx-2 rounded-lg font-medium ${
                timeRange === "afternoon"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              2:00 PM - 9:30 PM
            </button>
          </div>
    
          {/* Schedule Table */}
          <div className="overflow-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Time</th>
                  {daysOfWeek.map((day, index) => (
                    <th key={index} className="py-3 px-6 text-center">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {timeSlots.map((time) => (
                  <tr
                    key={time}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    {/* Time Slot */}
                    <td className="py-3 px-6 text-left font-medium">{time}</td>
                    {/* Day Columns */}
                    {daysOfWeek.map((day) => {
                      const occupiedCourse = isOccupied(day, time);
                      return (
                        <td
                          key={day}
                          className={`py-3 px-6 text-center ${
                            occupiedCourse
                              ? "bg-red-500 text-white font-semibold"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {occupiedCourse ? occupiedCourse.course : "Available"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
};


export default AvailabilityVisual;

