const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['ADMIN', 'INSTRUCTOR'],
    default: 'INSTRUCTOR'
  }
});

module.exports = mongoose.model('User', userSchema);
