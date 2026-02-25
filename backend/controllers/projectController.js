const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

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

exports.createProject = async (req, res, next) => {
  try {
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a main image'
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
      completedDate: req.body.completedDate || null,
      mainImage: `/uploads/${req.files.mainImage[0].filename}`,
      image: `/uploads/${req.files.mainImage[0].filename}`
    };

    if (req.files.images && req.files.images.length > 0) {
      projectData.images = req.files.images.map(file => `/uploads/${file.filename}`);
    }

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

    if (req.files && req.files.mainImage) {
      const oldImagePath = path.join(__dirname, '..', project.mainImage || project.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      projectData.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
      projectData.image = `/uploads/${req.files.mainImage[0].filename}`;
    }

    if (req.files && req.files.images) {
      if (project.images && project.images.length > 0) {
        project.images.forEach(imgPath => {
          const fullPath = path.join(__dirname, '..', imgPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
      
      projectData.images = req.files.images.map(file => `/uploads/${file.filename}`);
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

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const mainImagePath = path.join(__dirname, '..', project.mainImage || project.image);
    if (fs.existsSync(mainImagePath)) {
      fs.unlinkSync(mainImagePath);
    }

    if (project.images && project.images.length > 0) {
      project.images.forEach(imgPath => {
        const fullPath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
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