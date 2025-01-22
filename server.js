import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'; // Not used, consider removing
import dotenv from 'dotenv';
import { Set, CourseSchedule } from './models/Set.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SetScheduleDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

const router = express.Router();

router.post('/course-schedules', async (req, res) => {
  try {
    const courseSchedule = new CourseSchedule(req.body);
    await courseSchedule.save();
    res.status(201).json(courseSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding schedule' });
  }
});

router.post('/sets', async (req, res) => {
  try {
    const set = new Set(req.body);
    await set.save();
    res.status(201).json(set);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding set' });
  }
});

router.get('/course-schedules', async (req, res) => {
  const { day, room } = req.query; // Extract day and room from query parameters
  try {
    // Ensure day is an array (if it's a single day, convert it to an array)
    const dayArray = Array.isArray(day) ? day : [day];
    
    const schedules = await CourseSchedule.find({
      room,
      day: { $in: dayArray } // Use $in to check if the day matches any in the provided array
    });

    if (schedules.length > 0) {
      res.status(200).json(schedules); // Return found schedules
    } else {
      res.status(404).json({ message: 'No schedules found for the specified day and room' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving schedules' });
  }
});

router.get('/sets', async (req, res) => {
  try {
      // Destructure query parameters with default values of `undefined`
      const { yearLevel, department, semester } = req.query;
      
      // Build a filter object based on the query parameters provided
      const filter = {};
      if (yearLevel) filter.yearLevel = yearLevel;
      if (department) filter.department = department;
      if (semester) filter.semester = semester;

      // Fetch sets with optional filtering and populate `courses`
      const records = await Set.find(filter).populate('courses');

      if (records.length > 0) {
        res.status(200).json(records);
      } else {
        res.status(404).json({ message: 'No sets found' });
      }

  } catch (error) {
      res.status(500).json({ message: 'Error fetching records', error: error.message });
  }
});



router.get('/room', async (req, res) => {
  try {
    const { room } = req.query; // Extract room name from query parameter

    if (!room) {
      return res.status(400).json({ message: 'Room name is required.' });
    }

    const schedules = await CourseSchedule.find({ room });

    if (schedules.length === 0) {
      return res.status(404).json({ message: `No schedules found for room: ${room}` });
    }

    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});




app.use('/api', router); // Use the router under the '/api' path

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
