const Team = require('../models/Team');

exports.getTeam = async (req, res) => {
  try {
    const team = await Team.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: team.length,
      data: team
    });
  } catch (err) {
    console.error('Error fetching team:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch team'
    });
  }
};

exports.createTeamMember = async (req, res) => {
  try {
    const { name, position, bio, isCEO, image } = req.body;

    if (!name || !position || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, position, and image URL'
      });
    }

    const urlPattern = /^https?:\/\/.+\/.+$/;
    if (!urlPattern.test(image)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid image URL'
      });
    }

    const memberData = {
      name,
      position,
      bio: bio || '',
      isCEO: isCEO === 'true' || isCEO === true,
      image
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

exports.updateTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const { name, position, bio, isCEO, image } = req.body;

    const updateData = {
      name: name || member.name,
      position: position || member.position,
      bio: bio !== undefined ? bio : member.bio,
      isCEO: isCEO !== undefined ? (isCEO === 'true' || isCEO === true) : member.isCEO,
      image: image || member.image
    };

    const updatedMember = await Team.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedMember
    });
  } catch (err) {
    console.error('Error updating team member:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update team member'
    });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await member.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting team member:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete team member'
    });
  }
};