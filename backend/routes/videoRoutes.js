const express = require('express');
const {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getVideos);

router.post('/', protect, createVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);

module.exports = router;