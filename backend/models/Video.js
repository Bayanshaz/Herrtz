const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a video title'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Please add a YouTube URL']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', VideoSchema);