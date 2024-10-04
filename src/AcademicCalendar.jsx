import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaGraduationCap, FaPlaneDeparture } from "react-icons/fa";

const AcademicCalendar = () => {
    const [calendarData, setCalendarData] = useState(null);
    const [isOddSemester, setIsOddSemester] = useState(true);
    const [selectedExam, setSelectedExam] = useState("t2_exam");
    const [activeTab, setActiveTab] = useState("holidays");

    // Fetch the academic calendar data from the JSON file
    useEffect(() => {
        fetch("/academicCalendar.json")
            .then((response) => response.json())
            .then((data) => setCalendarData(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Handle semester toggle
    const toggleSemester = () => {
        setIsOddSemester(!isOddSemester);
    };

    // Handle exam selection toggle
    const toggleExam = (examType) => {
        setSelectedExam(examType);
    };

    // Handle tab navigation
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (!calendarData) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const semesterData = isOddSemester ? calendarData.odd_semester : calendarData.even_semester;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 p-4 md:p-6">
            {/* Hero Section */}
            <div className="w-full mb-8 bg-blue-500 dark:bg-gray-800 text-white p-6 md:p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl md:text-4xl font-bold">Academic Calendar</h1>
                <p className="text-base md:text-lg mt-2">Stay on top of your semester's schedule!</p>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Top Navigation Bar */}
                <div className="w-full flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 max-w-5xl">
                    {["exams", "holidays", "events"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-4 md:px-6 py-2 rounded-full text-base md:text-lg transition-all ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Semester Toggle */}
                <div className="flex justify-center mb-8">
                    <label className="inline-flex items-center cursor-pointer">
                        <span className="mr-2 text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">Odd Semester</span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={!isOddSemester}
                                onChange={toggleSemester}
                                className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-300 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-600"></div>
                            <div className="absolute top-0.5 left-[2px] peer-checked:left-[22px] bg-white w-4 h-4 rounded-full transition-all"></div>
                        </div>
                        <span className="ml-2 text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">Even Semester</span>
                    </label>
                </div>

                {/* Display Based on Active Tab */}
                {activeTab === "exams" && (
                    <div className="max-w-4xl w-full">
                        {/* Exam Type Toggle */}
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                            {["t1_exam", "t2_exam", "end_semester_exam"].map((examType) => (
                                <button
                                    key={examType}
                                    onClick={() => toggleExam(examType)}
                                    className={`px-4 py-2 rounded-full text-base md:text-lg transition-all ${selectedExam === examType ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
                                >
                                    {examType.replace(/_/g, " ").toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Exams Section */}
                        <section>
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                                <FaGraduationCap className="inline-block mr-2" /> Examinations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(semesterData.examinations[selectedExam]).map(([detailType, detailValue], index) => (
                                    <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all hover:shadow-lg">
                                        <span className="font-medium capitalize">{detailType.replace(/_/g, " ")}:</span> {detailValue}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Holidays Section */}
                {activeTab === "holidays" && (
                    <section className="max-w-4xl w-full">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                            <FaPlaneDeparture className="inline-block mr-2" /> Holidays
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {semesterData.holidays.map((holiday, index) => (
                                <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all hover:shadow-lg">
                                    <span className="font-medium">{holiday.name}:</span> {holiday.date}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Events Section */}
                {activeTab === "events" && (
                    <section className="max-w-4xl w-full">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                            <FaCalendarAlt className="inline-block mr-2" /> Events
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {semesterData.events.map((event, index) => (
                                <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all hover:shadow-lg">
                                    <span className="font-medium">{event.name}:</span> {event.date}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Mid-Sem and End-Sem Breaks Section */}
                <section className="max-w-4xl w-full mt-12">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                        Semester Breaks
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow-md transition-all hover:shadow-lg">
                            <span className="font-medium">Mid-Sem Break:</span> {semesterData.breaks.mid_semester_break}
                        </div>
                        <div className="p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow-md transition-all hover:shadow-lg">
                            <span className="font-medium">End-Sem Break:</span> {semesterData.breaks.end_semester_break}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AcademicCalendar;
