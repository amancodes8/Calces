import React, { useState, useEffect } from "react";
import E1Timetable from "./E1Timetable";
import TE16Timetable from "./E16Timetable";
import E15Timetable from "./E15Timetable";

const Timetable = () => {
    // Initialize the selectedBatch state based on localStorage or default to 'TE16'
    const [selectedBatch, setSelectedBatch] = useState(() => {
        const savedBatch = localStorage.getItem("selectedBatch");
        return savedBatch || "TE16";
    });

    const handleBatchChange = (batch) => {
        setSelectedBatch(batch);
        localStorage.setItem("selectedBatch", batch); // Save the selected batch to localStorage
    };

    useEffect(() => {
        // Ensure the selected batch is stored when the component mounts
        localStorage.setItem("selectedBatch", selectedBatch);
    }, [selectedBatch]);

    return (
        <div className="p-4">
            <h1 className="text-xl w-screen flex justify-center sm:text-3xl font-bold mb-4">Select Batch</h1>
            
            {/* Button Group for Batch Selection */}
            <div className="mb-4 flex justify-center space-x-4">
                <button
                    onClick={() => handleBatchChange("E1")}
                    className={`p-2 w-20 rounded-3xl flex justify-center items-center h-10 text-black border ${selectedBatch === "E1" ? "bg-blue-600 text-black" : "bg-gray-200"}`}
                >
                    E1
                </button>
                <button
                    onClick={() => handleBatchChange("TE16")}
                    className={`p-2 w-20 rounded-3xl flex justify-center items-center h-10 text-black border ${selectedBatch === "TE16" ? "bg-blue-600 text-black" : "bg-gray-200"}`}
                >
                    E16
                </button>
                <button
                    onClick={() => handleBatchChange("E15")}
                    className={`p-2 w-20 rounded-3xl flex justify-center items-center h-10 text-black border ${selectedBatch === "E15" ? "bg-blue-600 text-black" : "bg-gray-200"}`}
                >
                    E15
                </button>
            </div>

            {/* Conditional rendering of timetables with transition */}
            <div className="transition-all duration-500 ease-in-out">
                {selectedBatch === "E1" && <E1Timetable />}
                {selectedBatch === "TE16" && <TE16Timetable />}
                {selectedBatch === "E15" && <E15Timetable />}
            </div>
        </div>
    );
};

export default Timetable;
