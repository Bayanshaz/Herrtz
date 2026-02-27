const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { 
      title, 
      category, 
      location, 
      description, 
      featured, 
      area, 
      duration, 
      completedDate,
      mainImage,
      images 
    } = req.body;

    if (!title || !category || !location || !mainImage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, location, and main image URL'
      });
    }

    const urlPattern = /^https?:\/\/.+\/.+$/;
    if (!urlPattern.test(mainImage)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid image URL'
      });
    }

    const projectData = {
      title,
      category,
      location,
      description: description || '',
      featured: featured === 'true' || featured === true,
      area: area || '',
      duration: duration || '',
      completedDate: completedDate || null,
      mainImage,
      images: images || []
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

exports.getProjects = async (req, res) => {
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
    console.error('Error fetching projects:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch projects'
    });
  }
};

exports.getProject = async (req, res) => {
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
    console.error('Error fetching project:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch project'
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const { 
      title, 
      category, 
      location, 
      description, 
      featured, 
      area, 
      duration, 
      completedDate,
      mainImage,
      images 
    } = req.body;

    const updateData = {
      title: title || project.title,
      category: category || project.category,
      location: location || project.location,
      description: description !== undefined ? description : project.description,
      featured: featured !== undefined ? (featured === 'true' || featured === true) : project.featured,
      area: area !== undefined ? area : project.area,
      duration: duration !== undefined ? duration : project.duration,
      completedDate: completedDate !== undefined ? completedDate : project.completedDate,
      mainImage: mainImage || project.mainImage,
      images: images || project.images
    };

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update project'
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete project'
    });
  }
};