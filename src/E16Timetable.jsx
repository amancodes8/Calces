import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const E16Timetable = () => {
    const [timetableData, setTimetableData] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [days, setDays] = useState([]);
    const [currentTime, setCurrentTime] = useState("");

    const fetchTimetableData = async () => {
        try {
            const response = await fetch(`/te16time.json`);
            const data = await response.json();

            if (data.batches && data.batches.TE16) {
                setTimetableData(data.batches.TE16);
                const availableDays = Object.keys(data.batches.TE16);
                setDays(availableDays);
                const today = new Date().toLocaleString("en-US", { weekday: "long" });
                setSelectedDay(today in data.batches.TE16 ? today : availableDays[0]);
            }
        } catch (error) {
            console.error("Error fetching TE16 timetable data:", error);
        }
    };

    useEffect(() => {
        fetchTimetableData();
        const interval = setInterval(() => {
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            setCurrentTime(`${hour}:${minute < 10 ? "0" + minute : minute}`);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleDayChange = (event) => setSelectedDay(event.target.value);

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            <h1 className="text-4xl font-bold mb-6 text-blue-600">TE16 Timetable</h1>

            {/* Dropdown for selecting days */}
            <div className="mb-6">
                <select
                    value={selectedDay}
                    onChange={handleDayChange}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
                >
                    {days.map((day, index) => (
                        <option key={index} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </div>

            {/* Render timetable for the selected day */}
            {timetableData && timetableData[selectedDay] ? (
                <div className="mb-8 w-full max-w-6xl">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-500">{selectedDay}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {timetableData[selectedDay].map((session, idx) => (
                            <motion.div
                                key={idx}
                                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div>
                                    <p className="font-bold text-lg text-blue-600">{session.time}</p>
                                    <p className="text-gray-700 dark:text-gray-400 mt-2">{session.subject}</p>
                                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">Room: {session.room}</p>
                                </div>
                                    <p className="text-gray-600 dark:text-gray-400 mt-4">Teacher: {session.teacher}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">No timetable data available for the selected day.</p>
            )}
        </div>
    );
};

export default E16Timetable;
