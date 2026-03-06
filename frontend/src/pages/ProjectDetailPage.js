import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';
import PhotoViewer from '../components/common/PhotoViewer';
import { FiArrowLeft, FiCalendar, FiMapPin, FiMaximize2, FiEye } from 'react-icons/fi';
import API from '../api';
import toast from 'react-hot-toast';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/projects/${id}`);
      setProject(res.data.data);
    } catch (err) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) return <Loading />;
  if (!project) return <div>Project not found</div>;

  const allImages = [project.mainImage, ...(project.images || [])];

  return (
    <>
      <Header />
      <section className="project-detail">
        <div className="container">
          <Link to="/gallery" className="back-btn"><FiArrowLeft /> Back to Gallery</Link>
          
          <motion.div 
            className="project-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>{project.title}</h1>
            <div className="project-meta">
              <span><FiMapPin /> {project.location}</span>
              <span className={`category-badge ${project.category}`}>{project.category}</span>
              {project.area && <span><FiMaximize2 /> {project.area}</span>}
              {project.completedDate && (
                <span><FiCalendar /> {new Date(project.completedDate).toLocaleDateString()}</span>
              )}
            </div>
          </motion.div>

          <div className="main-image-wrapper">
            <img 
              src={project.mainImage} 
              alt={project.title} 
              className="main-image"
              onError={(e) => e.target.src = 'https://via.placeholder.com/1024x768?text=No+Image'}
            />
            <button className="view-photos-btn" onClick={() => setViewerOpen(true)}>
              <FiEye /> View All Photos
            </button>
          </div>

          {project.images?.length > 0 && (
            <div className="additional-images">
              <h3>More Photos ({project.images.length})</h3>
              <div className="image-grid">
                {project.images.map((img, index) => (
                  <div 
                    key={index} 
                    className="grid-image"
                    onClick={() => {
                      setCurrentImageIndex(index + 1);
                      setViewerOpen(true);
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`${project.title} - ${index + 1}`}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="project-description">
            <h2>Project Details</h2>
            <p>{project.description || 'No description available.'}</p>
          </div>
        </div>
      </section>

      {viewerOpen && (
        <PhotoViewer 
          images={allImages} 
          currentIndex={currentImageIndex} 
          onClose={() => setViewerOpen(false)} 
          onPrev={() => setCurrentImageIndex(i => i === 0 ? allImages.length - 1 : i - 1)}
          onNext={() => setCurrentImageIndex(i => i === allImages.length - 1 ? 0 : i + 1)}
        />
      )}

      <Footer />
    </>
  );
};

export default ProjectDetailPage;