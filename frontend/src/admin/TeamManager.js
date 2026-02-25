import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiEye } from 'react-icons/fi';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

const TeamManager = () => {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useData();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    isCEO: false
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  });

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        position: member.position,
        bio: member.bio || '',
        isCEO: member.isCEO || false
      });
      setImagePreview(member.image);
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        position: '',
        bio: '',
        isCEO: false
      });
      setImage(null);
      setImagePreview(null);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingMember(null);
    setImage(null);
    setImagePreview(null);
  };

  const openViewModal = (member) => {
    setViewingMember(member);
    setViewModalIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!imagePreview && !editingMember) {
      toast.error('Please select an image');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('isCEO', formData.isCEO);
    
    if (image) {
      formDataToSend.append('image', image);
    }

    let result;
    if (editingMember) {
      result = await updateTeamMember(editingMember._id, formDataToSend, token);
    } else {
      result = await addTeamMember(formDataToSend, token);
    }

    setLoading(false);

    if (result?.success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      await deleteTeamMember(id, token);
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Team Management</h2>
        <button onClick={() => openModal()} className="btn-primary">
          <FiPlus /> Add Team Member
        </button>
      </div>

      <div className="team-grid">
        {team && team.length > 0 ? (
          team.map(member => (
            <div key={member._id} className="team-card">
              <img src={member.image} alt={member.name} />
              <div className="team-info">
                <h3>{member.name}</h3>
                <p>{member.position}</p>
                {member.isCEO && <span className="ceo-badge">CEO</span>}
              </div>
              <div className="card-actions">
                <button onClick={() => openViewModal(member)} className="view-btn" title="View">
                  <FiEye />
                </button>
                <button onClick={() => openModal(member)} className="edit-btn" title="Edit">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(member._id)} className="delete-btn" title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No team members yet. Click "Add Team Member" to create one.</p>
        )}
      </div>

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
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows="3"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isCEO}
                onChange={(e) => setFormData({...formData, isCEO: e.target.checked})}
              />
              CEO / Founder
            </label>
          </div>

          <div className="form-group">
            <label>Profile Image *</label>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <p>Click or drag to change</p>
                </div>
              ) : (
                <p>Drag & drop an image here, or click to select</p>
              )}
            </div>
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
              <img src={viewingMember.image} alt={viewingMember.name} />
              <div className="view-details">
                <p><strong>Position:</strong> {viewingMember.position}</p>
                <p><strong>Bio:</strong> {viewingMember.bio || 'No bio available'}</p>
                {viewingMember.isCEO && <p className="featured">👑 Founder & CEO</p>}
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default TeamManager;