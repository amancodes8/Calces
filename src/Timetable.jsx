import React, { useState } from "react";
import E1Timetable from "./E1Timetable";
import TE16Timetable from "./E16Timetable";
import E15Timetable from "./E15Timetable"; // Import the E15 timetable

const Timetable = () => {
    const [selectedBatch, setSelectedBatch] = useState("TE16");

    const handleBatchChange = (batch) => {
        setSelectedBatch(batch);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl self-center font-bold mb-4">Select Batch</h1>
            
            {/* Button Group for Batch Selection */}
            <div className="mb-4 flex justify-center space-x-4">
                <button
                    onClick={() => handleBatchChange("E1")}
                    className={`p-2 border rounded-lg ${selectedBatch === "E1" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    E1
                </button>
                <button
                    onClick={() => handleBatchChange("TE16")}
                    className={`p-2 border rounded-lg ${selectedBatch === "TE16" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    E16
                </button>
                <button
                    onClick={() => handleBatchChange("E15")}
                    className={`p-2 border rounded-lg ${selectedBatch === "E15" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
