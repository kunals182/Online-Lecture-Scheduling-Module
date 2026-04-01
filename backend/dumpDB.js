const mongoose = require('mongoose');
const fs = require('fs');


const User = require('./models/User');
const Course = require('./models/Course');
const Lecture = require('./models/Lecture');

async function dumpDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/lecture-scheduler');
    console.log('Connected to MongoDB. Starting dump...');

    const users = await User.find({});
    const courses = await Course.find({});
    const lectures = await Lecture.find({});

    const dump = {
      users,
      courses,
      lectures
    };

    fs.writeFileSync('../database-dump.json', JSON.stringify(dump, null, 2));
    console.log('Successfully created database-dump.json in the project root folder!');

    process.exit(0);
  } catch (err) {
    console.error('Error dumping database:', err);
    process.exit(1);
  }
}

dumpDatabase();
