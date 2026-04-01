const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const path = require('path');

// routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lectures', require('./routes/lectureRoutes'));

// Serve Frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lecture-scheduler')
.then(async () => {
  console.log('MongoDB connected successfully');
  const User = require('./models/User');
  await User.findOneAndUpdate(
    { email: 'admin@test.com' },
    { name: 'Admin User', password: 'password123', role: 'ADMIN' },
    { upsert: true, returnDocument: 'after' }
  );
  console.log('Secure Admin credentials verified.');
}).catch(function(err) {
  console.error('MongoDB connection error:', err);
});

app.listen(PORT, function() {
  console.log('Server is running on port ' + PORT);
});
