const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['residential', 'commercial', 'renovation']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  mainImage: {
    type: String,
    required: [true, 'Please add a main image']
  },
  image: {
    type: String // For backward compatibility
  },
  images: [{
    type: String
  }],
  cloudinaryIds: {
    main: String,
    additional: [String]
  },
  featured: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date
  },
  area: {
    type: String
  },
  duration: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);