const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    console.log('Files received:', req.files);
    
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a main image'
      });
    }

    // Get Cloudinary URLs from uploaded files
    const mainImageUrl = req.files.mainImage[0].path; // Cloudinary URL
    const additionalImageUrls = req.files.images 
      ? req.files.images.map(file => file.path)
      : [];

    const projectData = {
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description || '',
      featured: req.body.featured === 'true',
      area: req.body.area || '',
      duration: req.body.duration || '',
      completedDate: req.body.completedDate || null,
      mainImage: mainImageUrl,
      image: mainImageUrl, // For backward compatibility
      images: additionalImageUrls,
      cloudinaryIds: {
        main: req.files.mainImage[0].filename,
        additional: req.files.images 
          ? req.files.images.map(f => f.filename)
          : []
      }
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create project'
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const projectData = { 
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description || '',
      featured: req.body.featured === 'true',
      area: req.body.area || '',
      duration: req.body.duration || '',
      completedDate: req.body.completedDate || null
    };

    // Handle main image update
    if (req.files && req.files.mainImage) {
      // Delete old image from Cloudinary
      if (project.cloudinaryIds?.main) {
        await cloudinary.uploader.destroy(project.cloudinaryIds.main);
      }
      
      projectData.mainImage = req.files.mainImage[0].path;
      projectData.image = req.files.mainImage[0].path; // For backward compatibility
      projectData.cloudinaryIds = {
        ...project.cloudinaryIds,
        main: req.files.mainImage[0].filename
      };
    }

    // Handle additional images update
    if (req.files && req.files.images) {
      // Delete old additional images from Cloudinary
      if (project.cloudinaryIds?.additional?.length > 0) {
        for (const id of project.cloudinaryIds.additional) {
          await cloudinary.uploader.destroy(id);
        }
      }
      
      projectData.images = req.files.images.map(file => file.path);
      projectData.cloudinaryIds = {
        ...project.cloudinaryIds,
        additional: req.files.images.map(f => f.filename)
      };
    }

    project = await Project.findByIdAndUpdate(req.params.id, projectData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update project'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete images from Cloudinary
    if (project.cloudinaryIds) {
      // Delete main image
      if (project.cloudinaryIds.main) {
        await cloudinary.uploader.destroy(project.cloudinaryIds.main);
      }
      
      // Delete additional images
      if (project.cloudinaryIds.additional?.length > 0) {
        for (const id of project.cloudinaryIds.additional) {
          await cloudinary.uploader.destroy(id);
        }
      }
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete project'
    });
  }
};