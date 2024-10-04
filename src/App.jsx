import React, { useState } from "react";
import AcademicCalendar from "./AcademicCalendar";
import Timetable from "./Timetable";

const App = () => {
  const [activePage, setActivePage] = useState("timetable");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Handle page switch
  const handlePageChange = (page) => {
    setActivePage(page);
  };

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6 max-w-5xl">
          <h1 className="text-3xl font-bold text-center">Academic Information</h1>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-800 p-3 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="mb-6 w-full max-w-5xl flex justify-center">
          <select
            className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-3 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
            value={activePage}
            onChange={(e) => handlePageChange(e.target.value)}
          >
            <option value="calendar">Academic Calendar</option>
            <option value="timetable">Timetable</option>
          </select>
        </div>

        {activePage === "calendar" ? <AcademicCalendar /> : <Timetable />}
      </div>
    </div>
  );
};

export default App;
