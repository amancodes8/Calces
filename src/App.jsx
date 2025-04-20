import React, { useState } from "react";
import AcademicCalendar from "./AcademicCalendar";
import Timetable from "./Timetable";

const App = () => {
  const [activePage, setActivePage] = useState("timetable");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle page toggle
  const togglePage = () => {
    setActivePage((prevPage) => (prevPage === "calendar" ? "timetable" : "calendar"));
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""} overflow-x-hidden`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4 max-w-5xl">
          <h1 className="text-xl sm:text-3xl font-bold">Academic Information</h1>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Toggle Switch */}
        <div className="mb-6 w-full flex justify-center">
          <label className="flex items-center cursor-pointer gap-4">
            <span className="text-sm font-medium">Timetable</span>
            <div
              className={`w-12 h-6 rounded-full p-1 ${
                activePage === "calendar" ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-800"
              }`}
              onClick={togglePage}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                  activePage === "calendar" ? "translate-x-6" : ""
                }`}
              ></div>
            </div>
            <span className="text-sm font-medium">Calendar</span>
          </label>
        </div>

        {/* Content */}
        <div className="w-full max-w-5xl">
          {activePage === "calendar" ? <AcademicCalendar /> : <Timetable />}
        </div>
      </div>
    </div>
  );
};

export default App;
