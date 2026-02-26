const Team = require('../models/Team');
const { cloudinary } = require('../config/cloudinary');

// @desc    Create team member
// @route   POST /api/team
// @access  Private
exports.createTeamMember = async (req, res, next) => {
  try {
    console.log('Received file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const memberData = {
      name: req.body.name,
      position: req.body.position,
      bio: req.body.bio || '',
      isCEO: req.body.isCEO === 'true',
      image: req.file.path, // Cloudinary URL
      cloudinaryId: req.file.filename
    };

    const member = await Team.create(memberData);

    res.status(201).json({
      success: true,
      data: member
    });
  } catch (err) {
    console.error('Error creating team member:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create team member'
    });
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private
exports.updateTeamMember = async (req, res, next) => {
  try {
    let member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const memberData = {
      name: req.body.name,
      position: req.body.position,
      bio: req.body.bio || '',
      isCEO: req.body.isCEO === 'true'
    };

    if (req.file) {
      // Delete old image from Cloudinary
      if (member.cloudinaryId) {
        await cloudinary.uploader.destroy(member.cloudinaryId);
      }
      
      memberData.image = req.file.path;
      memberData.cloudinaryId = req.file.filename;
    }

    member = await Team.findByIdAndUpdate(req.params.id, memberData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (err) {
    console.error('Error updating team member:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update team member'
    });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private
exports.deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Delete image from Cloudinary
    if (member.cloudinaryId) {
      await cloudinary.uploader.destroy(member.cloudinaryId);
    }

    await member.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting team member:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete team member'
    });
  }
};