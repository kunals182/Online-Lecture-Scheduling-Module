const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/instructors', async (req, res) => {
  try {
    const instructors = await User.find({ role: 'INSTRUCTOR' });
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newUser = new User({ 
      name, 
      role: 'INSTRUCTOR' 
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
