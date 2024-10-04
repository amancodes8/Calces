import React, { useEffect, useState } from "react";

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
        <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 flex flex-col items-center`}>
            <div className="min-h-screen">

                {/* Top Navigation Bar */}
                <div className="w-full flex justify-center space-x-4 mb-8 max-w-5xl">
                    {["exams", "holidays", "events"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-2 rounded-full text-lg transition-all ${activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Semester Toggle */}
                <div className="flex justify-center mb-8">
                    <label className="inline-flex items-center cursor-pointer">
                        <span className="mr-2 text-lg font-semibold text-gray-700 dark:text-gray-300">Odd Semester</span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={!isOddSemester}
                                onChange={toggleSemester}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-blue-600"></div>
                            <div className="absolute top-0.5 left-[4px] peer-checked:left-[28px] bg-white w-5 h-5 rounded-full transition-all"></div>
                        </div>
                        <span className="ml-2 text-lg font-semibold text-gray-700 dark:text-gray-300">Even Semester</span>
                    </label>
                </div>

                {/* Display Based on Active Tab */}
                {activeTab === "exams" && (
                    <div className="max-w-4xl w-full">
                        {/* Exam Type Toggle */}
                        <div className="flex justify-center space-x-4 mb-6">
                            {["t1_exam", "t2_exam", "end_semester_exam"].map((examType) => (
                                <button
                                    key={examType}
                                    onClick={() => toggleExam(examType)}
                                    className={`px-4 py-2 rounded-full text-lg transition-all ${selectedExam === examType ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"}`}
                                >
                                    {examType.replace(/_/g, " ").toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Exams Section */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Examinations</h2>
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
                        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Holidays</h2>
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
                        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {semesterData.events.map((event, index) => (
                                <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all hover:shadow-lg">
                                    <span className="font-medium">{event.name}:</span> {event.date}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default AcademicCalendar;
