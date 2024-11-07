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
				{ courseId: '', courseName: '', courseUnit: '', day: [], startTime: '', endTime: '', room: '' }
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
		<div>
			<h2>Edit Set</h2>
			<form onSubmit={handleSubmit} className='text-black'>
				<div>
					<label>Name:</label>
					<input
						className='border border-red-500'
						type="text"
						name="name"
						value={editedSet.name || ''}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label>Year Level:</label>
					<input
						className='border border-red-500'
						type="text"
						name="yearLevel"
						value={editedSet.yearLevel || ''}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label>Semester:</label>
					<input
						className='border border-red-500'
						type="text"
						name="semester"
						value={editedSet.semester || ''}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label>Department:</label>
					<input
						className='border border-red-500'
						type="text"
						name="department"
						value={editedSet.department || ''}
						onChange={handleChange}
					/>
				</div>

				{/* Course List Section */}
				<div>
					<h3>Courses</h3>
					{(editedSet.courses || []).map((course, index) => (
						<div key={index} className="flex gap-2 items-center mb-4">
							<div className="flex flex-col">
								<label>Course ID:</label>
								<input
									type="text"
									name="courseId"
									value={course.courseId}
									onChange={(e) => handleCourseChange(index, e)}
									className='border border-red-500'
								/>
							</div>

							<div className="flex flex-col">
								<label>Course Name:</label>
								<input
									type="text"
									name="courseName"
									value={course.courseName}
									onChange={(e) => handleCourseChange(index, e)}
									className='border border-red-500'
								/>
							</div>

							<div className="flex flex-col">
								<label>Course Unit:</label>
								<input
									type="number"
									name="courseUnit"
									value={course.courseUnit}
									onChange={(e) => handleCourseChange(index, e)}
									className='border border-red-500'
								/>
							</div>

							<div className="flex flex-col">
								<label>Days:</label>
								<div className="flex gap-2">
									{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
										<label key={day}>
											<input
												type="checkbox"
												checked={course.day.includes(day)}
												onChange={() => handleCourseDaysChange(index, day)}
											/>
											{day}
										</label>
									))}
								</div>
							</div>

							<div className="flex flex-col">
								<label>Start Time:</label>
								<input
									type="time"
									name="startTime"
									value={course.startTime}
									onChange={(e) => handleCourseChange(index, e)}
									className='border border-red-500'
								/>
							</div>

							<div className="flex flex-col">
								<label>End Time:</label>
								<input
									type="time"
									name="endTime"
									value={course.endTime}
									onChange={(e) => handleCourseChange(index, e)}
									className='border border-red-500'
								/>
							</div>

							<div className="flex flex-col">
								<label>Room:</label>
								<input
									type="text"
									name="room"
									value={course.room}
									onChange={(e) => handleCourseChange(index, e)}
									className='border border-red-500'
								/>
							</div>

							<button
								type="button"
								onClick={() => handleRemoveCourse(index)}
								className="bg-red-500 text-white px-2 py-1 rounded-md mt-2">
								Delete Course
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={handleAddCourse}
						className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md">
						Add Course
					</button>
				</div>

				<button type="submit">Save Changes</button>
			</form>
		</div>
	);
};

export default EditSet;
