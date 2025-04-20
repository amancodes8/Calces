import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

const E16Timetable = () => {
    const [timetableData, setTimetableData] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [days, setDays] = useState([]);
    const [isEditing, setIsEditing] = useState(false);


    // data fetching
    const fetchTimetableData = () => {
        const savedTimetable = localStorage.getItem("e16Timetable");
        if (savedTimetable) {
            const parsedData = JSON.parse(savedTimetable);
            setTimetableData(parsedData);
            setDays(Object.keys(parsedData));
            setSelectedDay(Object.keys(parsedData)[0]);
        } else {
            fetch(`/te16time.json`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.batches && data.batches.TE16) {
                        setTimetableData(data.batches.TE16);
                        const availableDays = Object.keys(data.batches.TE16);
                        setDays(availableDays);
                        const today = new Date().toLocaleString("en-US", { weekday: "long" });
                        setSelectedDay(today in data.batches.TE16 ? today : availableDays[0]);                    }
                })
                .catch((error) => console.error("Error fetching timetable:", error));
        }
    };

    useEffect(() => {
        fetchTimetableData();
    }, []);

    // Save timetable to localStorage whenever it updates
    useEffect(() => {
        if (timetableData) {
            localStorage.setItem("e16Timetable", JSON.stringify(timetableData));
        }
    }, [timetableData]);

    // Handle changes to the timetable
    const handleEditChange = (day, idx, field, value) => {
        setTimetableData((prev) => {
            const updatedDay = [...prev[day]];
            updatedDay[idx] = { ...updatedDay[idx], [field]: value };
            return { ...prev, [day]: updatedDay };
        });
    };

    // Download timetable as PDF
    const downloadAsPDF = () => {
        const doc = new jsPDF();
        const title = "E16 Timetable";
        const lineHeight = 8;
        let yPosition = 20;

        doc.setFontSize(18);
        doc.text(title, 105, yPosition, { align: "center" });
        yPosition += 10;

        // Loop through the days and generate timetable data for each
        days.forEach((day, i) => {
            // Add day title
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20; // Reset vertical position after page break
            }

            doc.setFontSize(14);
            doc.text(day, 10, yPosition);
            yPosition += 10;

            // Add each session for the day
            timetableData[day].forEach((session, j) => {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20; // Reset vertical position after page break
                }

                doc.setFontSize(12);
                doc.text(
                    `${session.time} - ${session.subject} - Room: ${session.room} - Teacher: ${session.teacher}`,
                    20,
                    yPosition
                );
                yPosition += lineHeight;
            });

            yPosition += 10; // Add some space between days
        });

        doc.save("E16_Timetable_Week.pdf");
    };

    const toggleEdit = () => setIsEditing((prev) => !prev);

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center text-gray-800 dark:bg-gray-900 dark:text-gray-100">
            <h1 className="sm:text-4xl text-xl font-bold mb-6 text-blue-600">E16 Timetable</h1>
            {/* Days Dropdown */}
            <div className="mb-6">
                <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600"
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
                                className="p-4 bg-white text-black dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
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
                                        <p className="font-bold text-xl text-gray-700 dark:text-gray-400 mt-2">
                                            {session.subject}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                                            Room: {session.room}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 mt-4">
                                            Teacher: {session.teacher}
                                        </p>
                                    </>
                                )}
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
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-blue-500"
                >
                    {isEditing ? "Save Changes" : "Edit Timetable"}
                </button>
                <button
                    onClick={downloadAsPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-green-500"
                >
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default E16Timetable;
