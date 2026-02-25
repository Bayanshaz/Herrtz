import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

const ServicesManager = () => {
  const { services, addService, updateService, deleteService } = useData();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'fas fa-home'
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const iconOptions = [
    { value: 'fas fa-home', label: 'Home' },
    { value: 'fas fa-building', label: 'Building' },
    { value: 'fas fa-drafting-compass', label: 'Drafting' },
    { value: 'fas fa-tools', label: 'Tools' },
    { value: 'fas fa-leaf', label: 'Leaf' },
    { value: 'fas fa-paint-roller', label: 'Paint Roller' },
    { value: 'fas fa-file-contract', label: 'Contract' },
    { value: 'fas fa-hammer', label: 'Hammer' },
    { value: 'fas fa-hard-hat', label: 'Hard Hat' },
    { value: 'fas fa-ruler-combined', label: 'Ruler' }
  ];

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        icon: 'fas fa-home'
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (editingService) {
      result = await updateService(editingService._id, formData, token);
    } else {
      result = await addService(formData, token);
    }

    setLoading(false);

    if (result?.success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await deleteService(id, token);
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Services Management</h2>
        <button onClick={() => openModal()} className="btn-primary">
          <FiPlus /> Add Service
        </button>
      </div>

      <div className="services-grid">
        {services && services.length > 0 ? (
          services.map(service => (
            <div key={service._id} className="service-card">
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => openModal(service)} className="edit-btn" title="Edit">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(service._id)} className="delete-btn" title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No services yet. Click "Add Service" to create one.</p>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="admin-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
          <button onClick={closeModal} className="close-btn">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Service Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Icon *</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              required
            >
              {iconOptions.map(icon => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
            <div className="icon-preview">
              <i className={formData.icon}></i> Selected Icon
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (editingService ? 'Update' : 'Add') + ' Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesManager;