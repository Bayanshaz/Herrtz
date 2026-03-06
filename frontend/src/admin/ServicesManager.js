import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiEye } from 'react-icons/fi';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ServicesManager = () => {
  const { services, addService, updateService, deleteService } = useData();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false); // Fixed: Added = sign
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'fas fa-home'
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const iconOptions = [
    { value: 'fas fa-home', label: 'Home', icon: '🏠' },
    { value: 'fas fa-building', label: 'Building', icon: '🏢' },
    { value: 'fas fa-drafting-compass', label: 'Drafting', icon: '📐' },
    { value: 'fas fa-tools', label: 'Tools', icon: '🔧' },
    { value: 'fas fa-leaf', label: 'Leaf', icon: '🍃' },
    { value: 'fas fa-paint-roller', label: 'Paint Roller', icon: '🎨' },
    { value: 'fas fa-file-contract', label: 'Contract', icon: '📄' },
    { value: 'fas fa-hammer', label: 'Hammer', icon: '🔨' },
    { value: 'fas fa-hard-hat', label: 'Hard Hat', icon: '⛑️' },
    { value: 'fas fa-ruler-combined', label: 'Ruler', icon: '📏' }
  ];

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'fas fa-home'
    });
    setModalIsOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon
    });
    setModalIsOpen(true);
  };

  const openViewModal = (service) => {
    setViewingService(service);
    setViewModalIsOpen(true);
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

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteService(id, token);
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Services Management</h2>
        <button onClick={openAddModal} className="btn-primary">
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
                <p style={{ 
                  fontSize: '1rem', 
                  lineHeight: '1.8',
                  minHeight: '100px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  padding: '5px',
                  color: 'var(--gray-600)'
                }}>
                  {service.description.length > 250 
                    ? service.description.substring(0, 250) + '...' 
                    : service.description}
                </p>
              </div>
              <div className="card-actions">
                <button 
                  onClick={() => openViewModal(service)} 
                  className="view-btn" 
                  title="View"
                >
                  <FiEye />
                </button>
                <button 
                  onClick={() => openEditModal(service)} 
                  className="edit-btn" 
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
                <button 
                  onClick={() => handleDelete(service._id, service.title)} 
                  className="delete-btn" 
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No services yet. Click "Add Service" to create one.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
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
              placeholder="e.g., Residential Construction"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="6"
              required
              placeholder="Describe the service in detail... (up to 2000 characters)"
              style={{
                minHeight: '150px',
                fontSize: '15px',
                lineHeight: '1.6',
                fontFamily: 'inherit'
              }}
            />
            <small style={{ 
              display: 'block', 
              marginTop: '5px', 
              color: '#666',
              textAlign: 'right'
            }}>
              {formData.description.length} / 2000 characters
            </small>
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
                  {icon.icon} {icon.label}
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

      {/* View Modal */}
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={() => setViewModalIsOpen(false)}
        className="view-modal"
        overlayClassName="modal-overlay"
      >
        {viewingService && (
          <>
            <div className="modal-header">
              <h3>{viewingService.title}</h3>
              <button onClick={() => setViewModalIsOpen(false)} className="close-btn">
                <FiX />
              </button>
            </div>
            <div className="view-content">
              <div className="view-icon">
                <i className={viewingService.icon}></i>
              </div>
              <div className="view-details">
                <p><strong>Title:</strong> {viewingService.title}</p>
                <p><strong>Description:</strong></p>
                <p className="view-description" style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  padding: '20px',
                  background: '#f5f5f5',
                  borderRadius: '5px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {viewingService.description}
                </p>
                <p style={{ marginTop: '15px' }}>
                  <strong>Created:</strong> {new Date(viewingService.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ServicesManager;