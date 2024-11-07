import { all } from 'axios';
import React, { useState, useEffect } from 'react';

// Sample data
const courses = [
	{
		name: 'Set A',
		yearLevel: '1st Year',
		course: 'Computer Science',
		courses: [
			{
				name: 'Introduction to Programming',
				room: 'Room 101',
				timeslot: {
					day: 'Mon',
					startTime: 800,
					endTime: 1000,
				},
			},
			{
				name: 'Data Structures',
				room: 'Room 102',
				timeslot: {
					day: 'Tue',
					startTime: 1000,
					endTime: 1130,
				},
			},
			{
				name: 'Calculus I',
				room: 'Room 103',
				timeslot: {
					day: 'Wed',
					startTime: 1300,
					endTime: 1430,
				},
			},
			{
				name: 'Introduction to Programming',
				room: 'Room 101',
				timeslot: {
					day: 'Tue',
					startTime: 800,
					endTime: 1000,
				},
			},
		],
	},
];



const mergeDuplicate = (courseParam) => {
	let newCourses = []

	courseParam.forEach(e => {
		for (let i = 0; i < e.courses.length; i++) {
			let currCourse = e.courses[i];
			let duplicateCurr
			let duplicatePrev
	
			for (let j = 0; j < i; j++) {
				let prevCourse = e.courses[j];
				if (prevCourse.name === currCourse.name && prevCourse.room === currCourse.room) {
					console.log(`Duplicate course found: ${currCourse.name} room: ${currCourse.room}`);
					
					const mergeCourses = {
						name: currCourse.name,
						room: currCourse.room,
						timeslot: {
							day: [...new Set([currCourse.timeslot.day, prevCourse.timeslot.day])], // Avoid duplicates in days
							startTime: currCourse.timeslot.startTime,
							endTime: currCourse.timeslot.endTime,
						}
					};
					newCourses.push(mergeCourses);
	
					duplicateCurr = currCourse
					duplicatePrev = prevCourse
	   
				}else if(currCourse !== duplicateCurr && currCourse !== duplicatePrev){
					newCourses.push(currCourse);
					break;
				}
			
			}
		}
	});

	return newCourses;
}
console.log()






	


const fullTimeSlots = [
	{ startTime: 800, endTime: 830 },
	{ startTime: 830, endTime: 900 },
	{ startTime: 900, endTime: 930 },
	{ startTime: 930, endTime: 1000 },
	{ startTime: 1000, endTime: 1030 },
	{ startTime: 1030, endTime: 1100 },
	{ startTime: 1100, endTime: 1130 },
	{ startTime: 1130, endTime: 1200 },
	{ startTime: 1200, endTime: 1230 },
	{ startTime: 1230, endTime: 1300 },
	{ startTime: 1300, endTime: 1330 },
	{ startTime: 1330, endTime: 1400 },
	{ startTime: 1400, endTime: 1430 },
	{ startTime: 1430, endTime: 1500 },
	{ startTime: 1500, endTime: 1530 },
	{ startTime: 1530, endTime: 1600 },
	{ startTime: 1600, endTime: 1630 },
	{ startTime: 1630, endTime: 1700 },
	{ startTime: 1700, endTime: 1730 },
	{ startTime: 1730, endTime: 1800 },
	{ startTime: 1800, endTime: 1830 },
	{ startTime: 1830, endTime: 1900 },
	{ startTime: 1900, endTime: 1930 },
	{ startTime: 1930, endTime: 2000 },
	{ startTime: 2000, endTime: 2030 },
	{ startTime: 2030, endTime: 2100 },
	{ startTime: 2100, endTime: 2130 },
];

const Filter = () => {
	const [yearLevel, setYearLevel] = useState('1stYear');
	const [semester, setSemester] = useState('1stSemester');
	const [allCourse, setAllCourse] = useState([]);
	const displayCourse = [];

	const [setData, setSetData] = useState({
		setName: '',
		yearLevel: '',
		degree: '',
		courses: [],
	});

	const [courseData, setCourseData] = useState({
		courseId: '',
		courseName: '',
		courseUnit: '',
		room: '',
		timeslot: {
			day: '',
			startTime: 0,
			endTime: 0,
		},
	});

	const handleTimeSelect = (event) => {
		if (event.target.name === 'startTime') {
			setSelectedStartTime(event.target.value);
		}
		setSelectedEndTime(event.target.value);
	};

	//Formats Time
	const formatTime = (num) => {
		const parseNum = parseInt(num);
		const isPM = parseNum >= 1200;
		const hour = Math.floor(parseNum / 100);
		const minute = parseNum % 100;

		let formattedHour = hour % 12 || 12; // Convert 24-hour format to 12-hour format, treating 0 as 12
		let formattedMinute = minute.toString().padStart(2, '0'); // Ensure minutes are two digits

		return `${formattedHour}:${formattedMinute} ${isPM ? 'PM' : 'AM'}`;
	};

	useEffect(() => {
		if (yearLevel && semester) {
			fetch(`../courses/BSCS/${yearLevel}Course.json`)
				.then((response) => response.json())
				.then((data) => setAllCourse(data[`${yearLevel}`][`${semester}`]))
				.catch((error) => console.error('Error fetching course data:', error));
		}
	}, [yearLevel, semester]);

	// Filtering function
	const getAvailableTimeSlots = () => {
		// Get the occupied time slots for the specific room and day
		const courseList = courses[0].courses;
		const occupiedTimeSlots = courseList
			.filter(
				(course) =>
					course.room === courseData.room && // Ensure it matches the room
					course.timeslot.day === courseData.timeslot.day // Ensure it matches the day
			)
			.map((course) => ({
				startTime: course.timeslot.startTime,
				endTime: course.timeslot.endTime,
			}));

		// Filter out the occupied time slots from fullTimeSlots
		return fullTimeSlots.filter(
			(slot) =>
				!occupiedTimeSlots.some(
					(occupied) =>
						(slot.startTime >= occupied.startTime &&
							slot.startTime < occupied.endTime) ||
						(slot.endTime > occupied.startTime &&
							slot.endTime <= occupied.endTime) ||
						(slot.startTime <= occupied.startTime &&
							slot.endTime >= occupied.endTime)
				)
		);
	};

	const handleCourseData = (e) => {
		const { name, value } = e.target;

		if (name === 'courseName') {
			const selectedCourse = allCourse.find((course) => course.name === value);
			if (selectedCourse) {
				setCourseData((prev) => ({
					...prev,
					courseId: selectedCourse.code,
					courseUnit: selectedCourse.units,
					courseName: selectedCourse.name, // Ensure courseName is also updated
				}));
			}
		} else if (['day', 'startTime', 'endTime'].includes(name)) {
			setCourseData((prev) => ({
				...prev,
				timeslot: {
					...prev.timeslot,
					[name]: value,
				},
			}));
		} else {
			setCourseData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const result = allCourse.filter(
		(course) => course.name === courseData.courseName
	)[0];

	const addOrUpdateCourse = (newCourse) => {
		setSetData((prevData) => {
			return {
				...prevData,
				courses: [...prevData.courses, newCourse],
			};
		});
	};

	const courseSubmit = (e) => {
		if (
			courseData.courseName === '' ||
			courseData.room === '' ||
			courseData.day === ''
		) {
			return;
		}
		addOrUpdateCourse(courseData);
		courses[0].courses.push(courseData);
		console.log(setData.courses);
		console.log(courses[0])
		displayCourse.push(mergeDuplicate(courses))
		console.log(displayCourse);
		setCourseData({
			courseId: '',
			courseName: '',
			courseUnit: '',
			room: '',
			timeslot: {
				day: '',
				startTime: 0,
				endTime: 0,
			},
		});
	};

	

	return (
		<div>
			<select
				value={yearLevel}
				onChange={(e) => setYearLevel(e.target.value)}
				id="">
				<option value="1stYear">1st Year</option>
				<option value="2ndYear">2nd Year</option>
				<option value="3rdYear">3rd Year</option>
				<option value="4thYear">4th Year</option>
			</select>
			<select value={semester} onChange={(e) => setSemester(e.target.value)}>
				<option value="1stSemester">1st Semester</option>
				<option value="2ndSemester">2nd Semester</option>
			</select>

			<div className="container w-1/3 flex flex-col mx-auto border border-zinc-200 p-6 rounded-xl shadow-sm gap-4">
				<div className="flex w-full gap-4 items-center justify-between">
					<p className="border p-2 rounded w-40 max-w-fit text-sm font-medium">
						{result?.code || 'Code'}
					</p>
					<select
						name="courseName"
						id=""
						value={courseData.courseName}
						onChange={handleCourseData}
						className="w-full bg-white border border-zinc-200 text-gray-900 rounded-md focus:border-black block text-sm p-2 font-medium pl-3">
						<option value="" disabled>
							Select Course
						</option>
						{allCourse.map((course, index) => (
							<option key={index}>{course.name}</option>
						))}
					</select>
					<p className="border p-2 rounded min-w-12 text-center text-sm font-medium">
						{result?.units || 'Unit'}
					</p>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<select
						onChange={handleCourseData}
						value={courseData.day}
						name="day"
						className="w-full bg-white border border-zinc-200 shadow-sm text-gray-900 rounded-md focus:border-black block text-sm p-2 font-medium pl-3">
						<option value="">Select Day</option>
						<option value="Mon">Monday</option>
						<option value="Tue">Tuesday</option>
						<option value="Wed">Wednesday</option>
						<option value="Thu">Thursday</option>
						<option value="Fri">Friday</option>
						<option value="Sat">Saturday</option>
					</select>

					<select
						onChange={handleCourseData}
						value={courseData.room}
						name="room"
						className="w-full bg-white border border-zinc-200 shadow-sm text-gray-900 rounded-md focus:border-black block text-sm p-2 font-medium pl-3">
						<option value="">Select Room</option>
						<option value="Room 101">Room 101</option>
						<option value="Room 102">Room 102</option>
						<option value="Room 103">Room 103</option>
						{/* Add more rooms as needed */}
					</select>

					<select
						onChange={handleCourseData}
						value={courseData.startTime}
						name="startTime"
						id=""
						className="w-full bg-white border border-zinc-200 shadow-sm text-gray-900 rounded-md focus:border-black block text-sm p-2 font-medium pl-3">
						<option value="">Select Start Time</option>
						{getAvailableTimeSlots().map((slot, index) => (
							<option key={index} value={slot.startTime}>
								{formatTime(slot.startTime)}
							</option>
						))}
					</select>

					<select
						name="endTime"
						onChange={handleCourseData}
						value={courseData.endTime}
						className="w-full bg-white border border-zinc-200 shadow-sm text-gray-900 rounded-md focus:border-black block text-sm p-2 font-medium pl-3">
						<option value="">Select End Time</option>
						{getAvailableTimeSlots().map((slot, index) => (
							<option key={index} value={slot.endTime}>
								{formatTime(slot.endTime)}
							</option>
						))}
					</select>
				</div>
				<button
					className="text-center w-full border text-sm p-2 bg-zinc-900 text-white rounded-lg"
					onClick={courseSubmit}>
					Create
				</button>
			</div>
			<div className="mx-auto flex flex-row gap-4 border border-red-500 w-1/2">
				{setData.courses.map((course, index) => (
					<div
						key={index}
						className="border border-zinc-200 rounded-lg shadow-sm w-fit text-center text-sm font-medium flex flex-col justify-center p-4 gap-1">
						<div className="flex flex-col w-full justify-between">
							<p>{course.courseId}</p>
							<p>{course.courseName}</p>
							{/* <p>{course.courseUnit}</p> */}
						</div>
						<div className="grid grid-cols-2 items-center w-full text-center gap-1">
							<p className=" col-span-2">
								{formatTime(course.timeslot.startTime)}-{formatTime(course.timeslot.endTime)}
							</p>
							<p>{course.timeslot.day}</p>
							<p>{course.room}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Filter;
