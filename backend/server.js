const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lectures', require('./routes/lectureRoutes'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lecture-scheduler')
.then(async () => {
    console.log('MongoDB connected');
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (!adminExists) {
        await User.create({ name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'ADMIN' });
        console.log('Default admin seeded.');
    }
})
.catch(err => console.error('DB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
