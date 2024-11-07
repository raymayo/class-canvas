import React from 'react';

const EditScheduleModal = ({
    isModalOpen,
    editSchedule,
    setEditSchedule,
    updateSchedule,
    closeModal,
    fetchSchedules,
    schedules,
    fullTimeSlots,
    convertTo12Hour,
}) => {
    if (!isModalOpen || !editSchedule) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-90">
            <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                <h2 className="text-neutral-900 text-xl font-semibold mb-4">Edit Schedule</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateSchedule(editSchedule);
                    }}
                >
                    <div className="flex flex-col gap-4">
                        {/* Day Selector */}
                        <label className="text-neutral-900 text-sm font-semibold flex flex-col gap-2">
                            Day
                            <select
                                onChange={(e) =>
                                    setEditSchedule({ ...editSchedule, day: e.target.value })
                                }
                                value={editSchedule.day}
                                className="text-black w-full text-sm pl-4 border border-neutral-300 bg-transparent rounded-md shadow-sm p-2 block font-medium"
                                onClick={fetchSchedules}
                            >
                                <option value="" disabled>Select Day</option>
                                <option value="Mon">Monday</option>
                                <option value="Tue">Tuesday</option>
                                <option value="Wed">Wednesday</option>
                                <option value="Thu">Thursday</option>
                                <option value="Fri">Friday</option>
                                <option value="Sat">Saturday</option>
                            </select>
                        </label>

                        {/* Room Selector */}
                        <label className="text-neutral-900 text-sm font-semibold flex flex-col gap-2">
                            Room
                            <select
                                onChange={(e) =>
                                    setEditSchedule({ ...editSchedule, room: e.target.value })
                                }
                                value={editSchedule.room}
                                className="text-black w-full text-sm pl-4 border border-neutral-300 bg-transparent rounded-md shadow-sm p-2 block font-medium"
                                onClick={fetchSchedules}
                            >
                                <option value="" disabled>Select Room</option>
                                <option value="VTB 8">VTB 8</option>
                                <option value="VTB 9">VTB 9</option>
                                <option value="VTB 10">VTB 10</option>
                                <option value="VTB 11">VTB 11</option>
                                <option value="VTB 12">VTB 12</option>
                                <option value="COMLAB 1">COMLAB 1</option>
                                <option value="COMLAB 2">COMLAB 2</option>
                                <option value="AVR">AVR</option>
                            </select>
                        </label>

                        {/* Time Selectors */}
                        <label className="text-neutral-900 text-sm font-semibold flex flex-col gap-2">
                            Time
                            <div className="flex gap-4">
                                {/* Start Time */}
                                <select
                                    value={editSchedule.startTime}
                                    onChange={(e) =>
                                        setEditSchedule({
                                            ...editSchedule,
                                            startTime: e.target.value,
                                        })
                                    }
                                    className="text-black w-full text-sm pl-4 border border-neutral-300 bg-transparent rounded-md shadow-sm p-2 block font-medium"
                                >
                                    <option value="" disabled>Select Start Time</option>
                                    {fullTimeSlots
                                        .filter(
                                            (time) =>
                                                !schedules.some(
                                                    (f) =>
                                                        f.room === editSchedule.room &&
                                                        f.day === editSchedule.day &&
                                                        time.startTime >= f.startTime &&
                                                        time.endTime <= f.endTime
                                                )
                                        )
                                        .map((time, index) => (
                                            <option key={index} value={time.startTime}>
                                                {convertTo12Hour(time.startTime)}
                                            </option>
                                        ))}
                                </select>

                                {/* End Time */}
                                <select
                                    value={editSchedule.endTime}
                                    onChange={(e) =>
                                        setEditSchedule({
                                            ...editSchedule,
                                            endTime: e.target.value,
                                        })
                                    }
                                    className="text-black w-full text-sm pl-4 border border-neutral-300 bg-transparent rounded-md shadow-sm p-2 block font-medium"
                                >
                                    <option value="" disabled>Select End Time</option>
                                    {fullTimeSlots
                                        .filter(
                                            (time) =>
                                                !schedules.some(
                                                    (f) =>
                                                        f.room === editSchedule.room &&
                                                        f.day === editSchedule.day &&
                                                        time.startTime >= f.startTime &&
                                                        time.endTime <= f.endTime
                                                )
                                        )
                                        .map((time, index) => (
                                            <option key={index} value={time.endTime}>
                                                {convertTo12Hour(time.endTime)}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </label>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-500 mr-4 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="text-white bg-neutral-950 text-sm font-medium px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditScheduleModal;
