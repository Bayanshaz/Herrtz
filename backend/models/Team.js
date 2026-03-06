const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Please add a position']
  },
  bio: {
    type: String,
    maxlength: [300, 'Bio cannot be more than 300 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  isCEO: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', TeamSchema);