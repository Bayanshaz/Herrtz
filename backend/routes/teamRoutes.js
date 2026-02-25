const express = require('express');
const {
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const { protect } =require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getTeam);

router.post('/', protect, uploadSingle, createTeamMember);
router.put('/:id', protect, uploadSingle, updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

module.exports = router;