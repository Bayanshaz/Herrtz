const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { uploadFields } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProject);

router.post('/', protect, uploadFields, createProject);
router.put('/:id', protect, uploadFields, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;