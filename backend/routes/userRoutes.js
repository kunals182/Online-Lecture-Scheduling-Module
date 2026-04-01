const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/instructors', async (req, res) => {
  try {
    const instructors = await User.find({ role: 'INSTRUCTOR' }).select('-password');
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ 
      name, 
      email, 
      password: password || 'instructor123', 
      role: 'INSTRUCTOR' 
    });
    await newUser.save();
    
    newUser.password = undefined;
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    res.status(400).json({ message: err.message });
  }
});

router.post('/admin', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@test.com' });
    if (existing) return res.status(200).json(existing);

    const admin = new User({ 
      name: 'Admin User', 
      email: 'admin@test.com', 
      password: 'password123', 
      role: 'ADMIN' 
    });
    await admin.save();
    res.status(201).json(admin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userData = user.toObject();
    delete userData.password;
    
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: server.error });
  }
});

module.exports = router;
