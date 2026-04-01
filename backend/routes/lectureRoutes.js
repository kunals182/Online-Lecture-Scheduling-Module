const express = require('express');
const router = express.Router();
const Lecture = require('../models/Lecture');

router.get('/:instructorId', async (req, res) => {
  try {
    const lectures = await Lecture.find({ instructorId: req.params.instructorId })
      .populate('courseId', 'name level');
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { courseId, instructorId, date } = req.body;
  try {
    const existing = await Lecture.findOne({ instructorId, date });
    if (existing) {
      return res.status(400).json({ 
        message: 'Instructor is already assigned to a lecture on this date.' 
      });
    }

    const lecture = new Lecture({ courseId, instructorId, date });
    await lecture.save();
    
    const populatedLecture = await Lecture.findById(lecture._id).populate('courseId', 'name level');
    res.status(201).json(populatedLecture);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Instructor is already assigned to a lecture on this date.' });
    }
    res.status(400).json({ message: err.message });
  }
});

router.get('/all/lectures', async (req, res) => {
  try {
    const lectures = await Lecture.find().populate('courseId').populate('instructorId');
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
