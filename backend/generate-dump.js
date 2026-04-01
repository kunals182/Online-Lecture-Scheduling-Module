const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Lecture = require('./models/Lecture');

async function dumpDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas...');

    const users = await User.find({});
    const courses = await Course.find({});
    const lectures = await Lecture.find({});

    const dump = {
      timestamp: new Date().toISOString(),
      collections: {
        users,
        courses,
        lectures
      }
    };

    fs.writeFileSync('database-dump.json', JSON.stringify(dump, null, 2));
    console.log('Successfully generated database-dump.json');
    process.exit(0);
  } catch (error) {
    console.error('Error generating dump:', error);
    process.exit(1);
  }
}

dumpDatabase();
