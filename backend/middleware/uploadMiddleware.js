const multer = require('multer');
const { projectStorage, additionalImagesStorage, teamStorage } = require('../config/cloudinary');

// For single file upload (team members)
const uploadSingle = multer({ storage: teamStorage }).single('image');

// For multiple file uploads with different fields (projects)
const uploadFields = multer({
  storage: projectStorage
}).fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

// Generic upload for any single file
const upload = multer({ storage: teamStorage });

module.exports = {
  uploadSingle,
  uploadFields,
  upload
};