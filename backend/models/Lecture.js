const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

lectureSchema.index({ instructorId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Lecture', lectureSchema);
