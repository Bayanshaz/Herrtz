const Video = require('../models/Video');

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch videos'
    });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const { title, url, description } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and video URL'
      });
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid YouTube URL'
      });
    }

    const videoData = {
      title,
      url,
      description: description || ''
    };

    const video = await Video.create(videoData);

    res.status(201).json({
      success: true,
      data: video
    });
  } catch (err) {
    console.error('Error creating video:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create video'
    });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const { title, url, description } = req.body;

    const updateData = {
      title: title || video.title,
      url: url || video.url,
      description: description !== undefined ? description : video.description
    };

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedVideo
    });
  } catch (err) {
    console.error('Error updating video:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update video'
    });
  }
};

exports.deleteVideo = async (req, res) => {
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
      message: 'Video deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete video'
    });
  }
};