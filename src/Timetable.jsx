import React from "react";
import TE16Timetable from "./E16Timetable";

const Timetable = () => {
    return (
        <div className="p-4">
            <h1 className="text-xl w-screen flex justify-center sm:text-3xl font-bold mb-4">
                📅 Timetable Viewer
            </h1>
            <div className="transition-all duration-500 ease-in-out">
                <TE16Timetable />
            </div>
        </div>
    );
};

export default Timetable;
