const Message = require('../models/Message');

exports.submitMessage = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message'
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      phone,
      message
    });

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully!'
    });
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMessageStatus = async (req, res, next) => {
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
    next(err);
  }
};

exports.deleteMessage = async (req, res, next) => {
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
      data: {}
    });
  } catch (err) {
    next(err);
  }
};