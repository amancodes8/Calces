import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const E1Timetable = () => {
    const [timetableData, setTimetableData] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [days, setDays] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const fetchTimetableData = async () => {
        try {
            const savedTimetable = localStorage.getItem("e1Timetable");
            if (savedTimetable) {
                setTimetableData(JSON.parse(savedTimetable));
                const availableDays = Object.keys(JSON.parse(savedTimetable));
                setDays(availableDays);
                const today = new Date().toLocaleString("en-US", { weekday: "long" });
                setSelectedDay(today in JSON.parse(savedTimetable) ? today : availableDays[0]);
            } else {
                const response = await fetch(`/e1time.json`);
                const data = await response.json();
                if (data.batches && data.batches.E1) {
                    setTimetableData(data.batches.E1);
                    const availableDays = Object.keys(data.batches.E1);
                    setDays(availableDays);
                    const today = new Date().toLocaleString("en-US", { weekday: "long" });
                    setSelectedDay(today in data.batches.E1 ? today : availableDays[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching E1 timetable data:", error);
        }
    };

    useEffect(() => {
        fetchTimetableData();
    }, []);

    const handleDayChange = (event) => setSelectedDay(event.target.value);

    const handleEditChange = (day, idx, field, value) => {
        setTimetableData((prev) => {
            const updatedDay = [...prev[day]];
            updatedDay[idx] = { ...updatedDay[idx], [field]: value };
            return { ...prev, [day]: updatedDay };
        });
    };

    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
        if (!isEditing && timetableData) {
            localStorage.setItem("e1Timetable", JSON.stringify(timetableData)); // Save changes to localStorage
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            <h1 className="sm:text-4xl text-xl font-bold mb-6 text-blue-600">E1 Timetable</h1>

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
                                className="p-4 bg-white text-black dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: idx * 0.1 }}
                            >
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={session.time}
                                            onChange={(e) =>
                                                handleEditChange(selectedDay, idx, "time", e.target.value)
                                            }
                                            className="p-2 bg-gray-100 rounded mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={session.subject}
                                            onChange={(e) =>
                                                handleEditChange(selectedDay, idx, "subject", e.target.value)
                                            }
                                            className="p-2 bg-gray-100 rounded mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={session.room}
                                            onChange={(e) =>
                                                handleEditChange(selectedDay, idx, "room", e.target.value)
                                            }
                                            className="p-2 bg-gray-100 rounded mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={session.teacher}
                                            onChange={(e) =>
                                                handleEditChange(selectedDay, idx, "teacher", e.target.value)
                                            }
                                            className="p-2 bg-gray-100 rounded"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold text-lg text-blue-600">{session.time}</p>
                                        <p className="font-bold text-lg text-gray-700 dark:text-gray-400 mt-2">{session.subject}</p>
                                        <p className="font-extrabold text-xl text-gray-500 dark:text-gray-400 mt-1">Room: {session.room}</p>
                                    </>
                                )}
                                <p className="text-gray-600 dark:text-gray-400 mt-4">Teacher: {session.teacher}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">No timetable data available for the selected day.</p>
            )}

            <div className="flex space-x-4 mt-6 text-black">
                <button
                    onClick={toggleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                    {isEditing ? "Save Changes" : "Edit Timetable"}
                </button>
            </div>
        </div>
    );
};

export default E1Timetable;
