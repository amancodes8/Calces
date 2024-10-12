import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const E16Timetable = () => {
    const [timetableData, setTimetableData] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [days, setDays] = useState([]);
    const [currentClass, setCurrentClass] = useState(null);
    const [currentTime, setCurrentTime] = useState("");
    const [showExamSchedule, setShowExamSchedule] = useState(true); // For toggling exam schedule

    const examSchedule = [
        { date: "14/10", subject: "ES", startTime: "10:00 AM", endTime: "11:00 AM" },
        { date: "15/10", subject: "EVS", startTime: "10:00 AM", endTime: "11:00 AM" },
        { date: "15/10", subject: "Economics", startTime: "3:30 PM", endTime: "4:30 PM" },
        { date: "16/10", subject: "Sns", startTime: "3:30 PM", endTime: "4:30 PM" },
        { date: "17/10", subject: "DSW", startTime: "1:00 PM", endTime: "2:00 PM" },
        { date: "18/10", subject: "PRP", startTime: "1:00 PM", endTime: "2:00 PM" },
        { date: "19/10", subject: "DCD", startTime: "10:00 AM", endTime: "11:00 AM" }
    ];

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
            } else {
                setTimetableData(null);
            }
        } catch (error) {
            console.error("Error fetching TE16 timetable data:", error);
        }
    };

    const formatTime12Hour = (hour, minute) => {
        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        const minutePadded = String(minute).padStart(2, "0");
        return `${hour12}:${minutePadded} ${period}`;
    };

    useEffect(() => {
        fetchTimetableData();

        const updateTime = () => {
            const now = new Date();
            const formattedTime = formatTime12Hour(now.getHours(), now.getMinutes());
            setCurrentTime(formattedTime);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timetableData && selectedDay) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            const sessions = timetableData[selectedDay];
            const currentClassSession = sessions?.find((session) => {
                if (!session.time) return false;

                const [startTime, endTime] = session.time.split(" - ").map((time) => {
                    const [hour, minute] = time.split(":").map(Number);
                    return { hour, minute };
                });

                if (!startTime || !endTime) return false;

                const isAfterStart =
                    currentHour > startTime.hour ||
                    (currentHour === startTime.hour && currentMinute >= startTime.minute);
                const isBeforeEnd =
                    currentHour < endTime.hour ||
                    (currentHour === endTime.hour && currentMinute < endTime.minute);

                return isAfterStart && isBeforeEnd;
            });

            setCurrentClass(currentClassSession);
        }
    }, [timetableData, selectedDay]);

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    const handleToggleExamSchedule = () => {
        setShowExamSchedule(!showExamSchedule);
    };

    const today = new Date();
    const showScheduleTill19th = today <= new Date(2024, 9, 19); // Visible until October 19th

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-6 flex flex-col items-center dark:bg-gray-900 dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-6">TE16 Timetable</h1>

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

            {/* Exam Schedule Section */}
            {showScheduleTill19th && showExamSchedule && (
                <div className="mb-8 w-full max-w-6xl p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
                    <h2 className="text-2xl font-semibold mb-4">Exam Schedule</h2>
                    <button
                        onClick={handleToggleExamSchedule}
                        className="absolute top-2 right-2 text-red-500"
                    >
                        ✖
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {examSchedule.map((exam, index) => (
                            <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <p className="font-semibold">{exam.date}</p>
                                <p className="text-gray-600 dark:text-gray-400">Subject: {exam.subject}</p>
                                <p className="text-gray-600 dark:text-gray-400">Time: {exam.startTime} - {exam.endTime}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Button to show exam schedule if hidden */}
            {showScheduleTill19th && !showExamSchedule && (
                <button
                    onClick={handleToggleExamSchedule}
                    className="mb-4 p-2 bg-blue-500 text-white rounded-lg"
                >
                    Show Exam Schedule
                </button>
            )}

            {/* Render timetable for the selected day */}
            {timetableData && timetableData[selectedDay] ? (
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
                                <p className="text-sm text-gray-500 dark:text-gray-400">Room: {session.room}</p>
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
