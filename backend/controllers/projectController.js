const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    let query = {};

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';

    const projects = await Project.find(query).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    console.log('📸 Files received:', req.files);
    console.log('📝 Body received:', req.body);
    
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a main image'
      });
    }

    // Get Cloudinary URLs from uploaded files
    const mainImageUrl = req.files.mainImage[0].path; // This is the FULL Cloudinary URL
    console.log('✅ Main image Cloudinary URL:', mainImageUrl);

    const additionalImageUrls = req.files.images 
      ? req.files.images.map(file => {
          console.log('✅ Additional image Cloudinary URL:', file.path);
          return file.path;
        })
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

    console.log('📦 Saving project with mainImage:', projectData.mainImage);

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error('❌ Error creating project:', err);
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
      console.log('🔄 Updating main image for project:', project.title);
      
      // Delete old image from Cloudinary
      if (project.cloudinaryIds?.main) {
        console.log('🗑️ Deleting old main image from Cloudinary:', project.cloudinaryIds.main);
        await cloudinary.uploader.destroy(project.cloudinaryIds.main);
      }
      
      projectData.mainImage = req.files.mainImage[0].path;
      projectData.image = req.files.mainImage[0].path; // For backward compatibility
      projectData.cloudinaryIds = {
        ...project.cloudinaryIds,
        main: req.files.mainImage[0].filename
      };
      console.log('✅ New main image URL:', projectData.mainImage);
    }

    // Handle additional images update
    if (req.files && req.files.images) {
      console.log('🔄 Updating additional images for project:', project.title);
      
      // Delete old additional images from Cloudinary
      if (project.cloudinaryIds?.additional?.length > 0) {
        for (const id of project.cloudinaryIds.additional) {
          console.log('🗑️ Deleting old additional image from Cloudinary:', id);
          await cloudinary.uploader.destroy(id);
        }
      }
      
      projectData.images = req.files.images.map(file => file.path);
      projectData.cloudinaryIds = {
        ...project.cloudinaryIds,
        additional: req.files.images.map(f => f.filename)
      };
      console.log('✅ New additional image URLs:', projectData.images);
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
    console.error('❌ Error updating project:', err);
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
        console.log('🗑️ Deleting main image from Cloudinary:', project.cloudinaryIds.main);
        await cloudinary.uploader.destroy(project.cloudinaryIds.main);
      }
      
      // Delete additional images
      if (project.cloudinaryIds.additional?.length > 0) {
        for (const id of project.cloudinaryIds.additional) {
          console.log('🗑️ Deleting additional image from Cloudinary:', id);
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
    console.error('❌ Error deleting project:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete project'
    });
  }
};