import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiEye, FiImage } from 'react-icons/fi';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

const ProjectsManager = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'residential',
    location: '',
    description: '',
    featured: false,
    area: '',
    duration: '',
    completedDate: '',
    mainImage: '',
    images: []
  });

  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    if (!newImageUrl.match(/^https?:\/\/.+\/.+$/)) {
      toast.error('Please enter a valid URL (must start with http:// or https://)');
      return;
    }
    setFormData({
      ...formData,
      images: [...formData.images, newImageUrl.trim()]
    });
    setNewImageUrl('');
    toast.success('Image URL added');
  };

  const handleRemoveImageUrl = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'residential',
      location: '',
      description: '',
      featured: false,
      area: '',
      duration: '',
      completedDate: '',
      mainImage: '',
      images: []
    });
    setNewImageUrl('');
    setEditingProject(null);
  };

  const openNewModal = () => {
    resetForm();
    setModalIsOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      location: project.location,
      description: project.description || '',
      featured: project.featured || false,
      area: project.area || '',
      duration: project.duration || '',
      completedDate: project.completedDate ? project.completedDate.split('T')[0] : '',
      mainImage: project.mainImage || '',
      images: project.images || []
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    resetForm();
  };

  const openViewModal = (project) => {
    setViewingProject(project);
    setViewModalIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mainImage.trim()) {
      toast.error('Please enter a main image URL');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (editingProject) {
        result = await updateProject(editingProject._id, formData, token);
      } else {
        result = await addProject(formData, token);
      }
      if (result?.success) {
        toast.success(editingProject ? 'Project updated!' : 'Project created!');
        closeModal();
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id, token);
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Projects Management</h2>
        <button onClick={openNewModal} className="btn-primary">
          <FiPlus /> Add New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects && projects.length > 0 ? (
          projects.map(project => (
            <div key={project._id} className="project-card">
              <img 
                src={project.mainImage} 
                alt={project.title}
                onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
              />
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.location}</p>
                <span className={`category-badge ${project.category}`}>{project.category}</span>
                {project.featured && <span className="featured-badge">Featured</span>}
                {project.images?.length > 0 && (
                  <span className="photo-count"><FiImage /> {project.images.length + 1}</span>
                )}
              </div>
              <div className="card-actions">
                <button onClick={() => openViewModal(project)} className="view-btn"><FiEye /></button>
                <button onClick={() => openEditModal(project)} className="edit-btn"><FiEdit2 /></button>
                <button onClick={() => handleDelete(project._id)} className="delete-btn"><FiTrash2 /></button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No projects yet. Click "Add New Project" to create one.</p>
        )}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="admin-modal" overlayClassName="modal-overlay">
        <div className="modal-header">
          <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
          <button onClick={closeModal} className="close-btn"><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="renovation">Renovation</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Area (sq.ft)</label>
              <input type="text" name="area" value={formData.area} onChange={handleInputChange} placeholder="e.g., 2500 sq.ft" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g., 6 months" />
            </div>
            <div className="form-group">
              <label>Completed Date</label>
              <input type="date" name="completedDate" value={formData.completedDate} onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
              Featured Project
            </label>
          </div>

          <div className="form-group">
            <label>Main Image URL *</label>
            <input type="url" name="mainImage" value={formData.mainImage} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
            {formData.mainImage && (
              <div className="image-preview">
                <img src={formData.mainImage} alt="Preview" onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=Invalid+URL'} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Additional Image URLs</label>
            <div className="url-input-group">
              <input type="url" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="https://example.com/image2.jpg" />
              <button type="button" onClick={handleAddImageUrl} className="btn-add-url"><FiPlus /> Add</button>
            </div>

            {formData.images.length > 0 && (
              <div className="url-list">
                <h4>Added Images ({formData.images.length})</h4>
                <div className="url-items">
                  {formData.images.map((url, index) => (
                    <div key={index} className="url-item">
                      <div className="url-info">
                        <img src={url} alt={`Preview ${index + 1}`} onError={(e) => e.target.src = 'https://via.placeholder.com/50x50?text=Error'} />
                        <span className="url-text">{url.substring(0, 50)}...</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveImageUrl(index)} className="btn-remove-url"><FiX /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (editingProject ? 'Update' : 'Add') + ' Project'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={viewModalIsOpen} onRequestClose={() => setViewModalIsOpen(false)} className="view-modal" overlayClassName="modal-overlay">
        {viewingProject && (
          <>
            <div className="modal-header">
              <h3>{viewingProject.title}</h3>
              <button onClick={() => setViewModalIsOpen(false)} className="close-btn"><FiX /></button>
            </div>
            <div className="view-content">
              <img src={viewingProject.mainImage} alt={viewingProject.title} />
              {viewingProject.images?.length > 0 && (
                <div className="view-additional">
                  <h4>Additional Images ({viewingProject.images.length})</h4>
                  <div className="additional-grid">
                    {viewingProject.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Additional ${idx + 1}`} />
                    ))}
                  </div>
                </div>
              )}
              <div className="view-details">
                <p><strong>Category:</strong> {viewingProject.category}</p>
                <p><strong>Location:</strong> {viewingProject.location}</p>
                {viewingProject.area && <p><strong>Area:</strong> {viewingProject.area}</p>}
                {viewingProject.duration && <p><strong>Duration:</strong> {viewingProject.duration}</p>}
                {viewingProject.completedDate && (
                  <p><strong>Completed:</strong> {new Date(viewingProject.completedDate).toLocaleDateString()}</p>
                )}
                <p><strong>Description:</strong> {viewingProject.description || 'No description'}</p>
                {viewingProject.featured && <p className="featured">⭐ Featured Project</p>}
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProjectsManager;