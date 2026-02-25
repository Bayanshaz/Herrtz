const express = require('express');
const {
  submitMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', submitMessage);

router.get('/', protect, getMessages);
router.put('/:id', protect, updateMessageStatus);
router.delete('/:id', protect, deleteMessage);

module.exports = router;