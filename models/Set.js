import mongoose from "mongoose";

const CourseScheduleSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        trim: true
    },
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    courseUnit: {
        type: Number,
        required: true,
        trim: true
    },
    day: {
        type: [String], // changed from String to [String]
        required: true,
        trim: true
    },
    room: {
        type: String,
        required: true,
        trim: true
    },
    startTime: {
        type: Number,
        required: true,
        trim: true
    },
    endTime: {
        type: Number,
        required: true,
        trim: true
    },
})

const CourseSchedule = mongoose.model('CourseSchedule', CourseScheduleSchema)

const SetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    yearLevel: {
        type: String,
        required: true,
        trim: true
    },
    semester: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CourseSchedule'
        }
    ]
})

const Set = mongoose.model('Set', SetSchema)

export { Set, CourseSchedule };