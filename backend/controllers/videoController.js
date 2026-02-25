const Video = require('../models/Video');

exports.getVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (err) {
    next(err);
  }
};

exports.createVideo = async (req, res, next) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({
      success: true,
      data: video
    });
  } catch (err) {
    next(err);
  }
};

exports.updateVideo = async (req, res, next) => {
  try {
    let video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    await video.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};