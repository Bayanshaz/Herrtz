const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch services'
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description'
      });
    }

    const serviceData = {
      title,
      description,
      icon: icon || 'fas fa-home'
    };

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create service'
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const { title, description, icon } = req.body;

    const updateData = {
      title: title || service.title,
      description: description || service.description,
      icon: icon || service.icon
    };

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedService
    });
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update service'
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete service'
    });
  }
};