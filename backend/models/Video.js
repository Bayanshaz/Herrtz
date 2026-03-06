const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a video title'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Please add a YouTube URL'],
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
      },
      message: 'Please provide a valid YouTube URL'
    }
  },
  description: {
    type: String,
    maxlength: [300, 'Description cannot be more than 300 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', VideoSchema);