const Message = require('../models/Message');

exports.submitMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message'
      });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone: phone || '',
      message
    });

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully!'
    });
  } catch (err) {
    console.error('Error submitting message:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to send message'
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch messages'
    });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (err) {
    console.error('Error updating message status:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update message status'
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete message'
    });
  }
};