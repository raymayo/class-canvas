import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { RxPencil2, RxEyeOpen, RxTrash } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';



const SetsList = () => {
	const navigate = useNavigate();

	const handleEditClick = (set) => {
		navigate('/edit-set', { state: { selectedSet: set } });
	  };
	

	const [sets, setSets] = useState([]);
	const [yearLevel, setYearLevel] = useState('');
	const [department, setDepartment] = useState('');
	const [semester, setSemester] = useState('');

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [modalContent, setModalContent] = useState(null);
	const [modalStyle, setModalStyle] = useState('');

	const date = new Date()

	const openModal = (type, set) => {
		setModalTitle(type === 'View' ? 'View Set' : 'Edit Set');
		setModalContent(
			type === 'View' ? (
				<div className="flex flex-col gap-6 h-full">
					<div className='text-center w-full font-clash'>
						<h1 className='text-xl font-bold'>Subject Schedule</h1>
						<p className='font-medium'>for {set.semester} S.Y {date.getFullYear()}-{date.getFullYear() + 1}</p>
					</div>
					<div className="flex gap-4 font-clash w-full">
						<label className="flex flex-col text-xs font-normal w-full rounded-md shadow-sm">
							Set Name <p className="text-base font-semibold">{set.name}</p>
						</label>
						<label className="flex flex-col text-xs font-normal w-full rounded-md shadow-sm">
							Year Level{' '}
							<p className="text-base font-semibold">{set.yearLevel}</p>
						</label>
						<label className="flex flex-col text-xs font-normal w-full rounded-md shadow-sm">
							Dept<p className="text-base font-semibold">{set.department}</p>
						</label>
						<label className="flex flex-col text-xs font-normal w-full rounded-md shadow-sm">
							Sem<p className="text-base font-semibold">{set.semester}</p>
						</label>
					</div>
					<div className="h-full">{renderCourses(set.courses)}</div>
				</div>
			) : (
				<div className="flex flex-col gap-6 h-full">
				<div className='text-center w-full font-clash'>
					<h1 className='text-xl font-bold'>Subject Schedule</h1>
					<p className='font-medium'>for {set.semester} S.Y {date.getFullYear()}-{date.getFullYear() + 1}</p>
				</div>
				<div className="flex gap-4 font-clash w-full">
					<label className="flex flex-col text-xs font-normal w-full rounded-md shadow-sm">
						Set Name <p className="text-base font-semibold">{set.name}</p>
					</label>
					<label className="flex flex-col text-xs font-normal w-full rounded-md shadow-sm">
						Year Level{' '}
						<p className="text-base font-semibold">{set.yearLevel}</p>
					</label>
					<label className="flex flex-col text-xs font-normal w-full rounded-md shadow-sm">
						Dept<p className="text-base font-semibold">{set.department}</p>
					</label>
					<label className="flex flex-col text-xs font-normal w-full rounded-md shadow-sm">
						Sem<p className="text-base font-semibold">{set.semester}</p>
					</label>
				</div>
				
			</div>
			)
		);
		setModalStyle(type === 'View' ? 'w-3/5 h-4/5' : 'w-3/5 h-4/5');
		setIsModalOpen(true);
	};
	function convertTo12Hour(time24) {
		// Convert time string to a 4-digit string (e.g., 800 -> "0800")
		time24 = time24.toString().padStart(4, '0');

		// Extract hours and minutes
		let hours = parseInt(time24.slice(0, 2));
		const minutes = time24.slice(2);

		// Determine AM or PM
		const period = hours >= 12 ? 'PM' : 'AM';

		// Adjust hours for 12-hour format
		hours = hours % 12 || 12;

		return `${hours}:${minutes} ${period}`;
	}

	const fetchSets = async () => {
		try {
			const query = new URLSearchParams({
				yearLevel: yearLevel || '',
				department: department || '',
				semester: semester || '',
			}).toString();

			const response = await fetch(`http://localhost:5000/api/sets?${query}`);
			if (!response.ok) {
				throw new Error('Failed to fetch sets');
			}
			const data = await response.json();
			setSets(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchSets();
	}, [yearLevel, department, semester]);

	const renderFilter = (label, value, onChange, options) => (
		<label className="flex flex-col text-sm w-full p-2 font-clash font-semibold">
			{label}
			<select
				className="px-4 py-2 bg-transparent border border-neutral-300 rounded-md shadow font-clash font-normal mt-2"
				value={value}
				onChange={onChange}>
				<option value="">All</option>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</label>
	);

	const renderCourses = (courses) => (
		<div className="border border-neutral-300 w-5/5 mx-auto p-4 rounded-md shadow-sm font-clash h-full">
			<table className="w-full">
				<thead>
					<tr>
						<th className="text-left font-semibold">Subject Code</th>
						<th className="text-left font-semibold">Description</th>
						<th className="text-left font-semibold">Units</th>
						<th className="text-left font-semibold">Time</th>
						<th className="text-left font-semibold">Day</th>
						<th className="text-left font-semibold">Room</th>
					</tr>
				</thead>
				<tbody>
					{courses.map((course, index) => (
						<tr key={index} className="border-b border-neutral-300">
							<td className="py-2">{course.courseId}</td>
							<td className="py-2">{course.courseName}</td>
							<td className="py-2">{course.courseUnit}</td>
							<td className="py-2">
								{convertTo12Hour(course.startTime)} -{' '}
								{convertTo12Hour(course.endTime)}
							</td>
							<td className="">{course.day.join(' - ')}</td>
							<td className="">{course.room}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);



	// const mergeDuplicate = (courseParam) => {
	// 	let newSets = [];
	
	// 	// Iterate over each set in courseParam
	// 	courseParam.forEach(set => {
	// 		let courseMap = new Map();  // Map to store unique courses
	// 		let mergedCourses = [];  // Array to store merged courses for the current set
	
	// 		set.courses.forEach(currCourse => {
	// 			const courseKey = `${currCourse.courseName}-${currCourse.room}`;
	
	// 			if (courseMap.has(courseKey)) {
	// 				// Duplicate found, merge days and keep the existing start and end times
	// 				let existingCourse = courseMap.get(courseKey);
					
	// 				// Merge day without duplicates
	// 				existingCourse.day = [...new Set([...existingCourse.day, currCourse.day])];
	// 			} else {
	// 				// No duplicate, add to map and array
	// 				courseMap.set(courseKey, {
	// 					courseId: currCourse.courseId,
	// 					courseName: currCourse.courseName,
	// 					courseUnit: currCourse.courseUnit,
	// 					day: [currCourse.day],  // Store day as an array to merge later
	// 					startTime: currCourse.startTime,
	// 					endTime: currCourse.endTime,
	// 					room: currCourse.room
	// 				});
	// 				mergedCourses.push(courseMap.get(courseKey));
	// 			}
	// 		});
	
	// 		// Add the set with merged courses to the newSets array
	// 		newSets.push({
	// 			...set,
	// 			courses: mergedCourses,
	// 		});
	// 	});
	
	// 	return newSets;
	// };
	

	return (
		<div className="text-black h-full p-4 flex flex-col gap-4">
			<div className="w-1/2 mx-auto border border-neutral-300 p-4 rounded-md shadow-sm">
				<h1 className="font-clash text-2xl font-medium mb-2">Filter</h1>
				<div className="text-black flex gap-4">
					{renderFilter(
						'Year Level',
						yearLevel,
						(e) => setYearLevel(e.target.value),
						[
							{ value: '1st Year', label: '1st Year' },
							{ value: '2nd Year', label: '2nd Year' },
							{ value: '3rd Year', label: '3rd Year' },
							{ value: '4th Year', label: '4th Year' },
						]
					)}

					{renderFilter(
						'Department',
						department,
						(e) => setDepartment(e.target.value),
						[
							{ value: 'CS', label: 'Computer Science' },
							{ value: 'ENG', label: 'Engineering' },
							{ value: 'BUS', label: 'Business' },
						]
					)}

					{renderFilter(
						'Semester',
						semester,
						(e) => setSemester(e.target.value),
						[
							{ value: '1st Semester', label: '1st Semester' },
							{ value: '2nd Semester', label: '2nd Semester' },
						]
					)}
				</div>
			</div>
			{sets.length > 0 ? (
				<div className="w-1/2 mx-auto font-clash border border-neutral-300 p-4 rounded-md shadow-sm">
					<h1 className="font-clash text-2xl font-medium mb-2">Set List</h1>
					<table className="w-full bg-transparent">
						<thead>
							<tr>
								<th className="border-b border-neutral-300 px-4 py-2 text-left font-semibold">
									Set Name
								</th>
								<th className="border-b border-neutral-300 px-4 py-2 text-left font-semibold">
									Year Level
								</th>
								<th className="border-b border-neutral-300 px-4 py-2 text-left font-semibold">
									Department
								</th>
								<th className="border-b border-neutral-300 px-4 py-2 text-left font-semibold">
									Semester
								</th>
								<th className="border-b border-neutral-300 px-4 py-2 text-left font-semibold">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{sets.map((set) => (
								<tr key={set._id} className="">
									<td className="border-b border-neutral-300 px-4 py-2">
										{set.name}
									</td>
									<td className="border-b border-neutral-300 px-4 py-2">
										{set.yearLevel}
									</td>
									<td className="border-b border-neutral-300 px-4 py-2">
										{set.department}
									</td>
									<td className="border-b border-neutral-300 px-4 py-2">
										{set.semester}
									</td>
									<td className="border-b border-neutral-300 px-4 py-2">
										<div className="flex gap-2">
											{/* {renderCourses(set.courses)} */}
											<button
												onClick={(e) => openModal('View', set)}
												className="px-2 py-1 text-sm border border-neutral-300 rounded-md shadow font-medium flex items-center gap-1">
												<RxEyeOpen size={18} />
												View
											</button>
											<button
												onClick={() => handleEditClick(set)}
												className="px-2 py-1 text-sm border border-neutral-300 rounded-md shadow font-medium flex items-center gap-1">
												<RxPencil2 size={18} />
												Edit
											</button>
											<button className="px-2 py-1 text-sm rounded-md shadow bg-red-500 text-neutral-50 font-medium flex items-center gap-1">
												<RxTrash size={18} />
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p>No sets found.</p>
			)}

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={modalTitle}
				modalStyle={modalStyle} // Pass the style prop
			>
				{modalContent}
			</Modal>
		</div>
	);
};

export default SetsList;
