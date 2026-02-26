import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';
import PhotoViewer from '../components/common/PhotoViewer';
import { FiArrowLeft, FiCalendar, FiMapPin, FiMaximize2, FiEye } from 'react-icons/fi';
import { getOptimizedImage, getSrcSet, PLACEHOLDER_IMAGE, imageDimensions } from '../utils/imageUtils';
import API from '../api';
import toast from 'react-hot-toast';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/projects/${id}`);
      setProject(res.data.data);
    } catch (err) {
      toast.error('Failed to load project details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const openViewer = (index) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

  const handleImageError = (imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  if (loading) return <Loading />;
  if (!project) return <div>Project not found</div>;

  const mainImageUrl = imageErrors['main'] 
    ? PLACEHOLDER_IMAGE 
    : (project.mainImage || project.image);

  const allImages = [mainImageUrl, ...(project.images || [])];

  const handlePrev = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <Header />
      
      <section className="project-detail">
        <div className="container">
          <Link to="/gallery" className="back-btn">
            <FiArrowLeft /> Back to Gallery
          </Link>

          <motion.div 
            className="project-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>{project.title}</h1>
            <div className="project-meta">
              <span><FiMapPin /> {project.location}</span>
              <span className={`category-badge ${project.category}`}>
                {project.category}
              </span>
              {project.area && <span><FiMaximize2 /> {project.area}</span>}
              {project.completedDate && (
                <span><FiCalendar /> {new Date(project.completedDate).toLocaleDateString()}</span>
              )}
            </div>
          </motion.div>

          <div className="project-gallery">
            {/* Main Image */}
            <motion.div 
              className="main-image-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="main-image-wrapper">
                <img 
                  src={getOptimizedImage(mainImageUrl, imageDimensions.projectMain)} 
                  srcSet={getSrcSet(mainImageUrl)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                  alt={project.title} 
                  className="main-image"
                  onError={() => handleImageError('main')}
                />
                <button 
                  className="view-photos-btn"
                  onClick={() => openViewer(0)}
                >
                  <FiEye /> View Photos ({allImages.length})
                </button>
              </div>
            </motion.div>

            {/* Additional Images Grid */}
            {project.images && project.images.length > 0 && (
              <div className="additional-images-section">
                <h3>More Photos ({project.images.length})</h3>
                <div className="image-grid">
                  {project.images.map((img, index) => {
                    const imgUrl = imageErrors[`additional-${index}`] 
                      ? PLACEHOLDER_IMAGE 
                      : img;
                    
                    return (
                      <motion.div 
                        key={index}
                        className="grid-image-wrapper"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => openViewer(index + 1)}
                      >
                        <img 
                          src={getOptimizedImage(imgUrl, imageDimensions.projectGrid)} 
                          srcSet={getSrcSet(imgUrl)}
                          sizes="(max-width: 768px) 50vw, 300px"
                          alt={`${project.title} - ${index + 1}`}
                          className="grid-image"
                          onError={() => handleImageError(`additional-${index}`)}
                          loading="lazy"
                        />
                        <div className="image-overlay">
                          <FiEye />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <motion.div 
            className="project-description"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>Project Details</h2>
            <p>{project.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Photo Viewer Modal */}
      {viewerOpen && (
        <PhotoViewer
          images={allImages}
          currentIndex={currentImageIndex}
          onClose={() => setViewerOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      <Footer />
    </>
  );
};

export default ProjectDetailPage;