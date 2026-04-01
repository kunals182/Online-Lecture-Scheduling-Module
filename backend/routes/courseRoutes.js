const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (err) {
    console.log("Error fetching course list", err);
    res.status(500).json({ message: "Failed to retrieve courses" });
  }
});

router.post('/', async (req, res) => {
  const { name, level, description, image } = req.body;
  try {
    const course = new Course({ name, level, description, image });
    await course.save();
    return res.status(201).json(course);
  } catch (err) {
    console.warn("Failed to create new course:", err.message);
    res.status(400).send({ message: "Invalid course data provided" });
  }
});

module.exports = router;
