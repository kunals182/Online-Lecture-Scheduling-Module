const express = require('express');
const router = express.Router();
const Lecture = require('../models/Lecture');

router.get('/:instructorId', async (req, res) => {
  try {
    const lectures = await Lecture.find({ instructorId: req.params.instructorId })
      .populate('courseId', 'name level');
    return res.status(200).json(lectures);
  } catch (err) {
    console.log("Could not load instructor schedule", err);
    res.status(500).json({ message: "Internal schedule error" });
  }
});

router.post('/', async (req, res) => {
  const { courseId, instructorId, date } = req.body;
  try {
    const conflict = await Lecture.findOne({ instructorId, date });
    if (conflict) {
      console.log("Blocking assignment: Conflict on", date);
      return res.status(400).json({ 
        message: 'This instructor already has a lecture on ' + date 
      });
    }

    const lecture = new Lecture({ courseId, instructorId, date });
    await lecture.save();
    
    const populated = await Lecture.findById(lecture._id).populate('courseId', 'name level');
    return res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ message: 'Conflict: Instructor booked on ' + date });
    }
    console.error("Assignment error:", err.message);
    res.status(400).json({ message: "Failed to allocate lecture" });
  }
});

router.get('/all/lectures', async (req, res) => {
  try {
    const allSessions = await Lecture.find().populate('courseId').populate('instructorId');
    res.status(200).json(allSessions);
  } catch (e) {
    console.warn("Global fetch fail", e);
    res.status(500).send({ error: "Could not fetch all lectures" });
  }
});

module.exports = router;
