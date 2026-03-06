import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiEye, FiLink } from 'react-icons/fi';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

const TeamManager = () => {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useData();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    isCEO: false,
    image: ''
  });

  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      image: url
    });
    // Set preview if URL is valid
    if (url.match(/^https?:\/\/.+\/.+$/)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      bio: '',
      isCEO: false,
      image: ''
    });
    setImagePreview(null);
    setEditingMember(null);
  };

  const openNewModal = () => {
    resetForm();
    setModalIsOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio || '',
      isCEO: member.isCEO || false,
      image: member.image || ''
    });
    setImagePreview(member.image || null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    resetForm();
  };

  const openViewModal = (member) => {
    setViewingMember(member);
    setViewModalIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Please enter name');
      return;
    }
    if (!formData.position.trim()) {
      toast.error('Please enter position');
      return;
    }
    if (!formData.image.trim()) {
      toast.error('Please enter image URL');
      return;
    }

    // Validate URL format
    if (!formData.image.match(/^https?:\/\/.+\/.+$/)) {
      toast.error('Please enter a valid image URL (must start with http:// or https://)');
      return;
    }

    setLoading(true);

    try {
      let result;
      if (editingMember) {
        result = await updateTeamMember(editingMember._id, formData, token);
      } else {
        result = await addTeamMember(formData, token);
      }

      if (result?.success) {
        toast.success(editingMember ? 'Team member updated!' : 'Team member added!');
        closeModal();
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setLoading(true);
      const result = await deleteTeamMember(id, token);
      if (result?.success) {
        toast.success('Team member deleted successfully');
      }
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Team Management</h2>
        <button onClick={openNewModal} className="btn-primary">
          <FiPlus /> Add Team Member
        </button>
      </div>

      <div className="team-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {team && team.length > 0 ? (
          team.map(member => (
            <div key={member._id} className="project-card" style={{ position: 'relative' }}>
              <img 
                src={member.image} 
                alt={member.name}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x220?text=No+Image';
                }}
              />
              <div className="project-info">
                <h3>{member.name}</h3>
                <p>{member.position}</p>
                {member.isCEO && <span className="featured-badge">CEO</span>}
                {member.bio && <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>{member.bio.substring(0, 60)}...</p>}
              </div>
              <div className="card-actions">
                <button onClick={() => openViewModal(member)} className="view-btn" title="View">
                  <FiEye />
                </button>
                <button onClick={() => openEditModal(member)} className="edit-btn" title="Edit">
                  <FiEdit2 />
                </button>
                <button 
                  onClick={() => handleDelete(member._id, member.name)} 
                  className="delete-btn" 
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
            No team members yet. Click "Add Team Member" to create one.
          </p>
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
          <h3>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</h3>
          <button onClick={closeModal} className="close-btn">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Lead Architect"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
              placeholder="Brief description about the team member..."
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isCEO"
                checked={formData.isCEO}
                onChange={handleInputChange}
              />
              CEO / Founder
            </label>
          </div>

          <div className="form-group">
            <label>Image URL *</label>
            <div className="url-input-group" style={{ display: 'flex', gap: '10px' }}>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleImageUrlChange}
                placeholder="https://example.com/image.jpg"
                style={{ flex: 1 }}
                required
              />
              <FiLink size={20} style={{ alignSelf: 'center', color: '#999' }} />
            </div>
            <p className="input-hint" style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
              Enter a valid image URL (must start with http:// or https://)
            </p>
            
            {imagePreview && (
              <div className="image-preview" style={{ marginTop: '15px', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview"
                  style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '5px', border: '1px solid #ddd' }}
                  onError={() => {
                    setImagePreview(null);
                    toast.error('Invalid image URL - preview failed');
                  }}
                />
                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Image Preview</p>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (editingMember ? 'Update' : 'Add') + ' Member'}
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
        {viewingMember && (
          <>
            <div className="modal-header">
              <h3>{viewingMember.name}</h3>
              <button onClick={() => setViewModalIsOpen(false)} className="close-btn">
                <FiX />
              </button>
            </div>
            <div className="view-content">
              <img 
                src={viewingMember.image} 
                alt={viewingMember.name}
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '5px' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x300?text=No+Image';
                }}
              />
              
              <div className="view-details" style={{ padding: '20px' }}>
                <p><strong>Name:</strong> {viewingMember.name}</p>
                <p><strong>Position:</strong> {viewingMember.position}</p>
                {viewingMember.isCEO && <p><strong>Role:</strong> 👑 Founder & CEO</p>}
                {viewingMember.bio && (
                  <>
                    <p><strong>Bio:</strong></p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{viewingMember.bio}</p>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TeamManager;