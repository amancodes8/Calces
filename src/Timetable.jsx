import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Timetable = () => {
    const [timetableData, setTimetableData] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [days, setDays] = useState([]);
    const [currentClass, setCurrentClass] = useState(null);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        // Fetch the timetable data
        fetch("/timetable.json")
            .then((response) => response.json())
            .then((data) => {
                setTimetableData(data.batches.TE16);
                const availableDays = Object.keys(data.batches.TE16);
                setDays(availableDays); // Set available days for the dropdown

                // Get the current day (e.g., "Monday")
                const today = new Date().toLocaleString("en-US", { weekday: "long" });
                setSelectedDay(today in data.batches.TE16 ? today : availableDays[0]); // Set default selected day
            })
            .catch((error) => console.error("Error fetching timetable data:", error));
    }, []);

    useEffect(() => {
        if (timetableData && selectedDay) {
            // Get the current time and determine the current class
            const currentHour = new Date().getHours();
            const currentMinute = new Date().getMinutes();
            const currentTimeString = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;
            setCurrentTime(currentTimeString);

            const sessions = timetableData[selectedDay];
            const currentClassSession = sessions.find(session => {
                const [startTime, endTime] = session.time.split(" - ").map(time => {
                    const [hour, minute] = time.split(":");
                    return new Date().setHours(hour, minute);
                });
                return new Date() >= startTime && new Date() < endTime;
            });
            setCurrentClass(currentClassSession);
        }
    }, [timetableData, selectedDay]);

    if (!timetableData) {
        return <div>Loading...</div>;
    }

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-6 flex flex-col items-center dark:bg-gray-900 dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-6">E16 Batch Timetable</h1>

            {/* Dropdown for selecting days */}
            <div className="mb-6">
                <select
                    value={selectedDay}
                    onChange={handleDayChange}
                    className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                >
                    {days.map((day, index) => (
                        <option key={index} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display current time and class */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Current Class</h2>
                {currentClass ? (
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <p className="font-semibold text-xl">Subject: {currentClass.subject}</p>
                        <p className="text-gray-600 dark:text-gray-400">Time: {currentClass.time}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Room: {currentClass.room}</p>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">No current class.</p>
                )}
                <p className="text-gray-500 dark:text-gray-400">Current Time: {currentTime}</p>
            </div>

            {/* Render timetable for the selected day */}
            <div className="mb-8 w-full max-w-6xl">
                <h2 className="text-2xl font-semibold mb-4">{selectedDay}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timetableData[selectedDay].map((session, idx) => (
                        <motion.div
                            key={idx}
                            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col justify-between"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                        >
                            <div>
                                <p className="font-semibold text-xl">{session.time}</p>
                                <p className="text-gray-600 dark:text-gray-400">{session.subject}</p>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Room: {session.room}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timetable;
