const Team = require('../models/Team');
const path = require('path');
const fs = require('fs');

exports.getTeam = async (req, res, next) => {
  try {
    const team = await Team.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: team.length,
      data: team
    });
  } catch (err) {
    next(err);
  }
};

exports.createTeamMember = async (req, res, next) => {
  try {
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
      image: `/uploads/${req.file.filename}`
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
      const oldImagePath = path.join(__dirname, '..', member.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      memberData.image = `/uploads/${req.file.filename}`;
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

exports.deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const imagePath = path.join(__dirname, '..', member.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
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