import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import VideoPlayer from '../components/common/VideoPlayer';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import Loading from '../components/common/Loading';
import { FiImage, FiPlay } from 'react-icons/fi';

const GalleryPage = () => {
  const { projects, videos, loading } = useData();
  const [filter, setFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (loading) return <Loading />;

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <>
      <Header />
      
      <section className="gallery-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Our Gallery</h1>
            <p>Explore our portfolio of exceptional construction projects across Kerala.</p>
          </motion.div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <h2 className="section-title">Project Photos</h2>
          
          <div className="gallery-filter">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Projects
            </button>
            <button 
              className={`filter-btn ${filter === 'residential' ? 'active' : ''}`}
              onClick={() => setFilter('residential')}
            >
              Residential
            </button>
            <button 
              className={`filter-btn ${filter === 'commercial' ? 'active' : ''}`}
              onClick={() => setFilter('commercial')}
            >
              Commercial
            </button>
            <button 
              className={`filter-btn ${filter === 'renovation' ? 'active' : ''}`}
              onClick={() => setFilter('renovation')}
            >
              Renovation
            </button>
          </div>

          <div className="gallery-grid">
            {filteredProjects.map((project, index) => (
              <motion.div 
                key={project._id}
                className="gallery-item"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/project/${project._id}`}>
                  <img src={project.mainImage || project.image} alt={project.title} />
                  <div className="gallery-overlay">
                    <h3>{project.title}</h3>
                    <p>{project.location}</p>
                    <span className={`category-badge ${project.category}`}>
                      {project.category}
                    </span>
                    {project.images && project.images.length > 0 && (
                      <span className="photo-count">
                        <FiImage /> {project.images.length + 1}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {videos.length > 0 && (
        <section className="video-gallery">
          <div className="container">
            <h2 className="section-title">Project Videos</h2>
            <p className="section-subtitle">Click on any video to watch it directly on our website</p>
            
            <div className="videos-grid">
              {videos.map((video, index) => {
                const videoId = getYoutubeVideoId(video.url);
                const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
                const fallbackThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
                
                return (
                  <motion.div 
                    key={video._id}
                    className="video-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="video-thumbnail">
                      <img 
                        src={thumbnail} 
                        alt={video.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackThumbnail;
                        }}
                      />
                      <div className="play-button">
                        <FiPlay />
                      </div>
                    </div>
                    <div className="video-info">
                      <h3>{video.title}</h3>
                      {video.description && <p>{video.description}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="cta">
        <div className="container">
          <h2>Ready to Start Your Construction Project?</h2>
          <p>Let's bring your vision to life with our expertise in construction and design.</p>
          <Link to="/#contact" className="btn">Contact Us Today</Link>
        </div>
      </section>

      {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo.url}
          videoTitle={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      <Footer />
    </>
  );
};

export default GalleryPage;