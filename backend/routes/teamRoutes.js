const express = require('express');
const {
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getTeam);
router.post('/', protect, createTeamMember);
router.put('/:id', protect, updateTeamMember);
router.delete('/:id', protect, deleteTeamMember);

module.exports = router;