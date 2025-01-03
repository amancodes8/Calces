import React, { useState } from "react";
import E1Timetable from "./E1Timetable";
import TE16Timetable from "./E16Timetable"; 

const Timetable = () => {
    const [selectedBatch, setSelectedBatch] = useState("TE16");

    const handleBatchChange = (event) => {
        setSelectedBatch(event.target.value);
    };

    return (
        <div className="p-4"> 

            <h1 className="text-3xl font-bold mb-4">Select Batch</h1>
            
            {/* Enhanced dropdown styling */}
           <div className="w-screen flex justify-center max-w-40"> <select 
                onChange={handleBatchChange} 
                value={selectedBatch} 
                className="mb-4 p-2 border border-gray-300 rounded-lg shadow-md bg-black text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            >
                <option value="E1">E1</option>
                <option value="TE16">E16</option>
            </select></div>

            {/* Conditional rendering of timetables */}
            {selectedBatch === "E1" && <E1Timetable />}
            {selectedBatch === "TE16" && <TE16Timetable />}
        </div>
    );
};

export default Timetable;
