import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditSet = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { selectedSet } = location.state || {}; // Get selected set from location state

	// Local state to manage the set being edited
	const [editedSet, setEditedSet] = useState(selectedSet);

	useEffect(() => {
		// If there's no selected set, redirect back (optional)
		if (!selectedSet) {
			navigate('/sets'); // Redirect to the sets page or any fallback route
		}
	}, [selectedSet, navigate]);

	// Handle changes to the set's fields
	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedSet((prevSet) => ({
			...prevSet,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		// Perform update logic here, e.g., calling an API to save changes
		console.log('Updated set:', editedSet);
		navigate('/sets'); // Redirect after saving
	};

	// Handle adding a new course
	const handleAddCourse = () => {
		setEditedSet((prevSet) => ({
			...prevSet,
			courses: [
				...(prevSet.courses || []),
				{
					courseId: '',
					courseName: '',
					courseUnit: '',
					day: [],
					startTime: '',
					endTime: '',
					room: '',
				},
			], // Add an empty course object for now
		}));
	};

	// Handle changes to a specific course field
	const handleCourseChange = (index, e) => {
		const { name, value } = e.target;
		const updatedCourses = [...(editedSet.courses || [])];
		updatedCourses[index] = {
			...updatedCourses[index],
			[name]: value,
		};
		setEditedSet((prevSet) => ({
			...prevSet,
			courses: updatedCourses,
		}));
	};

	// Handle changes to days (checkboxes) for a specific course
	const handleCourseDaysChange = (index, day) => {
		const updatedCourses = [...(editedSet.courses || [])];
		const currentDays = updatedCourses[index].day || [];
		const updatedDays = currentDays.includes(day)
			? currentDays.filter((d) => d !== day) // Remove day
			: [...currentDays, day]; // Add day
		updatedCourses[index].day = updatedDays;

		setEditedSet((prevSet) => ({
			...prevSet,
			courses: updatedCourses,
		}));
	};

	// Handle removing a course
	const handleRemoveCourse = (index) => {
		const updatedCourses = editedSet.courses.filter((_, i) => i !== index);
		setEditedSet((prevSet) => ({
			...prevSet,
			courses: updatedCourses,
		}));
	};

	return (
		<div className="h-full overflow-scroll">
			<form
				onSubmit={handleSubmit}
				className="text-black border border-red-500 w-full mx-auto grid grid-cols-3 h-full">
				<div className="flex flex-col border border-red-500 w-full">
					<h2 className="text-2xl font-semibold">Edit Set</h2>
					<div>
						<label>Name:</label>
						<input
							className="border border-neutral-300 rounded-md shadow-sm p-2 text-sm pl-4 w-full bg-neutral-100"
							type="text"
							name="name"
							value={editedSet.name || ''}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label>Year Level:</label>
						<input
							className="border border-neutral-300 rounded-md shadow-sm p-2 text-sm pl-4 w-full bg-neutral-100"
							type="text"
							name="yearLevel"
							value={editedSet.yearLevel || ''}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label>Semester:</label>
						<input
							className="border border-neutral-300 rounded-md shadow-sm p-2 text-sm pl-4 w-full bg-neutral-100"
							type="text"
							name="semester"
							value={editedSet.semester || ''}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label>Department:</label>
						<input
							className="border border-neutral-300 rounded-md shadow-sm p-2 text-sm pl-4 w-full bg-neutral-100"
							type="text"
							name="department"
							value={editedSet.department || ''}
							onChange={handleChange}
						/>
					</div>
				</div>

				{/* Course List Section */}
				<div className="col-span-2 w-full">
					<h3>Courses</h3>
					<table className="border border-green-500 w-full table-auto border-collapse">
						<thead>
							<tr className='text-left'>
								<th>Course ID</th>
								<th>Course Name</th>
								<th>Course Units</th>
								<th>Days</th>
								<th>Room</th>
								<th>Start Time</th>
								<th>End Time</th>
							</tr>
						</thead>
						<tbody>
							{(editedSet.courses || []).map((course, index) => (
								<tr key={index} className="border-b border-neutral-300">
									<td className='border border-neutral-300'>
										<input
											type="text"
											name="courseId"
											value={course.courseId}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-full bg-transparent"
										/>
									</td>
									<td className='border border-neutral-300'>
										<input
											type="text"
											name="courseName"
											value={course.courseName}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-full bg-transparent"
										/>
									</td>
									<td className='border border-neutral-300'>
										<input
											type="text"
											name="courseUnit"
											value={course.courseUnit}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-full bg-transparent"
										/>
									</td>
									<td className='border border-neutral-300'>
											{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
												<label
													key={day}
													className="rounded-md cursor-pointer">
													<input
														type="checkbox"
														checked={course.day.includes(day)}
														onChange={() => handleCourseDaysChange(index, day)}
													/>
													{day}
												</label>
											))}
									</td>
									<td className='border border-neutral-300'>
										<input
											type="text"
											name="room"
											value={course.room}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-full bg-transparent"
										/>
									</td>
									<td className='border border-neutral-300'>
										<input
											type="time"
											name="startTime"
											value={course.startTime}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-full bg-transparent"
										/>
									</td>
									<td>
										<input
											type="time"
											name="endTime"
											value={course.endTime}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-full bg-transparent"
										/>
									</td>
									<td>
										<button
											type="button"
											onClick={() => handleRemoveCourse(index)}
											className="bg-red-500 text-white px-2 py-1 rounded-md w-full">
											Delete Course
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<button
						type="button"
						onClick={handleAddCourse}
						className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">
						Add Course
					</button>
					<button type="submit">Save Changes</button>
				</div>
			</form>
		</div>
	);
};

export default EditSet;
