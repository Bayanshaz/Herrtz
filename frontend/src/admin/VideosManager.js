import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiYoutube } from 'react-icons/fi';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

const VideosManager = () => {
  const { videos, addVideo, updateVideo, deleteVideo } = useData();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const openModal = (video = null) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        url: video.url,
        description: video.description || ''
      });
    } else {
      setEditingVideo(null);
      setFormData({
        title: '',
        url: '',
        description: ''
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingVideo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const videoId = getYoutubeVideoId(formData.url);
    if (!videoId) {
      toast.error('Please enter a valid YouTube URL');
      setLoading(false);
      return;
    }

    let result;
    if (editingVideo) {
      result = await updateVideo(editingVideo._id, formData, token);
    } else {
      result = await addVideo(formData, token);
    }

    setLoading(false);

    if (result?.success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      await deleteVideo(id, token);
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Videos Management</h2>
        <button onClick={() => openModal()} className="btn-primary">
          <FiPlus /> Add Video
        </button>
      </div>

      <div className="videos-grid">
        {videos && videos.length > 0 ? (
          videos.map(video => {
            const videoId = getYoutubeVideoId(video.url);
            const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
            
            return (
              <div key={video._id} className="video-card">
                <div className="video-thumbnail">
                  <img src={thumbnail} alt={video.title} />
                  <div className="video-play">
                    <FiYoutube />
                  </div>
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => openModal(video)} className="edit-btn" title="Edit">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(video._id)} className="delete-btn" title="Delete">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No videos yet. Click "Add Video" to create one.</p>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="admin-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h3>{editingVideo ? 'Edit Video' : 'Add New Video'}</h3>
          <button onClick={closeModal} className="close-btn">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Video Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>YouTube URL *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
            />
          </div>

          {formData.url && getYoutubeVideoId(formData.url) && (
            <div className="video-preview">
              <h4>Preview:</h4>
              <img 
                src={`https://img.youtube.com/vi/${getYoutubeVideoId(formData.url)}/0.jpg`} 
                alt="Video thumbnail"
                style={{ maxWidth: '100%', borderRadius: '5px' }}
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (editingVideo ? 'Update' : 'Add') + ' Video'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VideosManager;