const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [300, 'Description cannot be more than 300 characters']
  },
  icon: {
    type: String,
    default: 'fas fa-home'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', ServiceSchema);