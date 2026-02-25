import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiEye, FiImage } from 'react-icons/fi';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

const ProjectsManager = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'residential',
    location: '',
    description: '',
    featured: false,
    area: '',
    duration: '',
    completedDate: ''
  });
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  });

  const { getRootProps: getAdditionalRootProps, getInputProps: getAdditionalInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setAdditionalImages([...additionalImages, ...acceptedFiles]);
      const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
      setAdditionalPreviews([...additionalPreviews, ...newPreviews]);
    }
  });

  const removeAdditionalImage = (index) => {
    const newImages = [...additionalImages];
    const newPreviews = [...additionalPreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setAdditionalImages(newImages);
    setAdditionalPreviews(newPreviews);
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        location: project.location,
        description: project.description || '',
        featured: project.featured || false,
        area: project.area || '',
        duration: project.duration || '',
        completedDate: project.completedDate ? project.completedDate.split('T')[0] : ''
      });
      setMainImagePreview(project.mainImage || project.image);
      setAdditionalPreviews(project.images || []);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category: 'residential',
        location: '',
        description: '',
        featured: false,
        area: '',
        duration: '',
        completedDate: ''
      });
      setMainImage(null);
      setMainImagePreview(null);
      setAdditionalImages([]);
      setAdditionalPreviews([]);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingProject(null);
    setMainImage(null);
    setMainImagePreview(null);
    setAdditionalImages([]);
    setAdditionalPreviews([]);
  };

  const openViewModal = (project) => {
    setViewingProject(project);
    setViewModalIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!mainImagePreview && !editingProject) {
      toast.error('Please select a main image');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('featured', formData.featured);
    formDataToSend.append('area', formData.area);
    formDataToSend.append('duration', formData.duration);
    formDataToSend.append('completedDate', formData.completedDate);
    
    if (mainImage) {
      formDataToSend.append('mainImage', mainImage);
    }

    additionalImages.forEach(image => {
      formDataToSend.append('images', image);
    });

    let result;
    if (editingProject) {
      result = await updateProject(editingProject._id, formDataToSend, token);
    } else {
      result = await addProject(formDataToSend, token);
    }

    setLoading(false);

    if (result?.success) {
      closeModal();
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
        <button onClick={() => openModal()} className="btn-primary">
          <FiPlus /> Add New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects && projects.length > 0 ? (
          projects.map(project => (
            <div key={project._id} className="project-card">
              <img src={project.mainImage || project.image} alt={project.title} />
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.location}</p>
                <span className={`category-badge ${project.category}`}>
                  {project.category}
                </span>
                {project.featured && <span className="featured-badge">Featured</span>}
                {project.images && project.images.length > 0 && (
                  <span className="photo-count">
                    <FiImage /> {project.images.length + 1}
                  </span>
                )}
              </div>
              <div className="card-actions">
                <button onClick={() => openViewModal(project)} className="view-btn" title="View">
                  <FiEye />
                </button>
                <button onClick={() => openModal(project)} className="edit-btn" title="Edit">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(project._id)} className="delete-btn" title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No projects yet. Click "Add New Project" to create one.</p>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="admin-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
          <button onClick={closeModal} className="close-btn">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="renovation">Renovation</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Area (sq.ft)</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
                placeholder="e.g., 2500 sq.ft"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g., 6 months"
              />
            </div>

            <div className="form-group">
              <label>Completed Date</label>
              <input
                type="date"
                value={formData.completedDate}
                onChange={(e) => setFormData({...formData, completedDate: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              />
              Featured Project
            </label>
          </div>

          <div className="form-group">
            <label>Main Image (1024x768 recommended) *</label>
            <div {...getMainRootProps()} className="dropzone">
              <input {...getMainInputProps()} />
              {mainImagePreview ? (
                <div className="image-preview">
                  <img src={mainImagePreview} alt="Main preview" />
                  <p>Click or drag to change main image</p>
                </div>
              ) : (
                <p>Drag & drop main image here, or click to select</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Additional Images (up to 10)</label>
            <div {...getAdditionalRootProps()} className="dropzone">
              <input {...getAdditionalInputProps()} />
              <p>Drag & drop additional images here, or click to select</p>
            </div>

            {additionalPreviews.length > 0 && (
              <div className="additional-previews">
                <h4>Additional Images ({additionalPreviews.length})</h4>
                <div className="preview-grid">
                  {additionalPreviews.map((preview, index) => (
                    <div key={index} className="preview-item">
                      <img src={preview} alt={`Additional ${index + 1}`} />
                      <button 
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="remove-image"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (editingProject ? 'Update' : 'Add') + ' Project'}
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
        {viewingProject && (
          <>
            <div className="modal-header">
              <h3>{viewingProject.title}</h3>
              <button onClick={() => setViewModalIsOpen(false)} className="close-btn">
                <FiX />
              </button>
            </div>
            <div className="view-content">
              <img 
                src={viewingProject.mainImage || viewingProject.image} 
                alt={viewingProject.title} 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
              
              {viewingProject.images && viewingProject.images.length > 0 && (
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