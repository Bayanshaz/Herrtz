import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';
import PhotoViewer from '../components/common/PhotoViewer';
import { FiArrowLeft, FiCalendar, FiMapPin, FiMaximize2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/projects/${id}`);
      setProject(res.data.data);
    } catch (err) {
      toast.error('Failed to load project details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openViewer = (index) => {
    setCurrentImageIndex(index);
    setViewerOpen(true);
  };

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

  if (loading) return <Loading />;
  if (!project) return <div>Project not found</div>;

  const allImages = [project.mainImage || project.image, ...(project.images || [])];

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
            <motion.div 
              className="main-image-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="main-image-wrapper">
                <img 
                  src={project.mainImage || project.image} 
                  alt={project.title} 
                  className="main-image"
                />
                <button 
                  className="view-photos-btn"
                  onClick={() => openViewer(0)}
                >
                  <FiEye /> View Photos
                </button>
              </div>
            </motion.div>

            {project.images && project.images.length > 0 && (
              <div className="additional-images-section">
                <h3>More Photos ({project.images.length})</h3>
                <div className="image-grid">
                  {project.images.map((img, index) => (
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
                        src={img} 
                        alt={`${project.title} - ${index + 1}`}
                        className="grid-image"
                      />
                      <div className="image-overlay">
                        <FiEye />
                      </div>
                    </motion.div>
                  ))}
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