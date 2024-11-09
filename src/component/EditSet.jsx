import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditSet = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { selectedSet } = location.state || {}; // Get selected set from location state

	// Local state to manage the set being edited
	const [editedSet, setEditedSet] = useState(selectedSet);

	const [definedCourse, setDefinedCourse] = useState([]);

	useEffect(() => {
		if (editedSet.yearLevel && editedSet.semester) {
			fetch(`../courses/BSCS/${editedSet.yearLevel}Course.json`)
				.then((response) => response.json())
				.then((data) =>
					setDefinedCourse(
						data[`${editedSet.yearLevel}`][`${editedSet.semester}`]
					)
				)
				.catch((error) => console.error('Error fetching course data:', error));
		}
	}, [editedSet.yearLevel, editedSet.semester]);

	// const result = definedCourse.filter(
	// 	(course) => course.name === editedSet.course.courseName
	// )[0];

	console.log(definedCourse);

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
	
		// Check if courseName is being changed
		if (name === "courseName") {
			// Find the matching course in definedCourse based on the selected courseName
			const selectedCourse = definedCourse.find(course => course.name === value);
	
			// Update courseName, courseId, and courseUnit in the state
			updatedCourses[index] = {
				...updatedCourses[index],
				courseName: value,
				courseId: selectedCourse ? selectedCourse.courseId : "",
				courseUnit: selectedCourse ? selectedCourse.courseUnit : ""
			};
		} else {
			// Update other fields normally
			updatedCourses[index] = {
				...updatedCourses[index],
				[name]: value,
			};
		}
	
		// Update the editedSet state
		setEditedSet((prevSet) => ({
			...prevSet,
			courses: updatedCourses,
		}));
		
		console.log(editedSet);
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
				className="text-black border border-red-500 w-full mx-auto grid grid-cols-4 h-full">
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
				<div className="col-span-3 w-full p-4">
					<h3>Courses</h3>
					<table className="w-full border-collapse">
						<thead>
							<tr className="text-left">
								<th className='text-sm text-neutral-500 font-normal p-2'>ID</th>
								<th className='text-sm text-neutral-500 font-normal p-2'>NAME</th>
								<th className='text-sm text-neutral-500 font-normal p-2'>UNITS</th>
								<th className='text-sm text-neutral-500 font-normal p-2'>DAYS</th>
								<th className='text-sm text-neutral-500 font-normal p-2'>ROOM</th>
								<th className='text-sm text-neutral-500 font-normal p-2'>START TIME</th>
								<th className='text-sm text-neutral-500 font-normal p-2'>END TIME</th>
								<th className='text-sm text-neutral-500 font-normal p-2'>ACTION</th>
							</tr>
						</thead>
						<tbody>
							{(editedSet.courses || []).map((course, index) => (
								<tr key={index} className="w-full h-full">
									<td className="border-b border-neutral-300 p-2">
										<input
											type="text"
											name="courseId"
											value={course.courseId}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-28 bg-transparent"
											disabled
										/>
									</td>
									<td className="border-b border-neutral-300 p-2">
										<select
											name="courseName"
											className="bg-transparent w-full border border-neutral-300 shadow-sm h-full rounded text-sm p-2 pl-4"
											value={course.courseName}
											onChange={(e) => handleCourseChange(index, e)}>
											<option value="">option</option>
											{definedCourse.map((course, index) => (
												<option key={index}>{course.name}</option>
											))}
										</select>
									</td>
									<td className="border-b border-neutral-300 p-2 text-center">
										<input
											type="text"
											name="courseUnit"
											value={course.courseUnit}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-10 bg-transparent"
											disabled
										/>
									</td>
									<td className="align-middle p-2 border-b border-neutral-300">
										<div className='flex gap-2 h-full'>
										{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
											<label key={day} className="cursor-pointer border border-neutral-300 rounded shadow-sm w-full h-full p-3 text-sm">
												<input
													type="checkbox"
													className=''
													checked={course.day.includes(day)}
													onChange={() => handleCourseDaysChange(index, day)}
												/>
												{' '}{day}
											</label>
										))}
										</div>
									</td>
									<td className="border-b border-neutral-300 p-2">
										{/* <input
											type="text"
											name="room"
											value={course.room}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-full bg-transparent w-20"
										/> */}
										<select name="room" className="bg-transparent w-full border border-neutral-300 shadow-sm h-full rounded text-sm p-2 pl-4">
											<option value="room">room</option>
										</select>
									</td>
									<td className="border-b border-neutral-300 p-2">
										{/* <input
											type="time"
											name="startTime"
											value={course.startTime}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-full bg-transparent"
										/> */}
										<select name="room" className="bg-transparent w-full border border-neutral-300 shadow-sm h-full rounded text-sm p-2 pl-4">
											<option value="room">8:00 AM</option>
										</select>
									</td>
									<td>
										{/* <input
											type="time"
											name="endTime"
											value={course.endTime}
											onChange={(e) => handleCourseChange(index, e)}
											className="p-2 text-sm w-full bg-transparent"
										/> */}
										<select name="room" className="bg-transparent w-full border border-neutral-300 shadow-sm h-full rounded text-sm p-2 pl-4">
											<option value="room">9:00 AM</option>
										</select>
									</td>
									<td>
										<button
											type="button"
											onClick={() => handleRemoveCourse(index)}
											className=" text-red-500 px-2 py-1 w-full font-semibold text-sm">
											Delete
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
