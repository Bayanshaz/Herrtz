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

  // Function to extract YouTube video ID from various URL formats
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    
    // Regular expressions for different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?%#]+)/i,
      /^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
      /youtube\.com\/shorts\/([^&?%#]+)/i
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        return match[1];
      }
      if (match && match[2] && match[2].length === 11) {
        return match[2];
      }
    }
    
    // Try to extract from query string as fallback
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      if (videoId && videoId.length === 11) return videoId;
    } catch (e) {
      // Invalid URL, ignore
    }
    
    console.warn('Could not extract YouTube ID from:', url);
    return null;
  };

  // Function to get high-quality thumbnail
  const getYoutubeThumbnail = (videoId, quality = 'maxresdefault') => {
    if (!videoId) return null;
    
    // Different thumbnail qualities available:
    // maxresdefault.jpg (HD - 1280x720)
    // sddefault.jpg (640x480)
    // hqdefault.jpg (480x360)
    // mqdefault.jpg (320x180)
    // default.jpg (120x90)
    
    const thumbnailUrls = [
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, // HD
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,     // SD
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,     // High quality
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,     // Medium quality
      `https://img.youtube.com/vi/${videoId}/default.jpg`        // Default
    ];
    
    return thumbnailUrls;
  };

  return (
    <>
      <Header />
      <section className="gallery-hero">
        <div className="container">
          <h1>Our Gallery</h1>
          <p>Explore our portfolio of exceptional construction projects.</p>
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
              All
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
                  <img 
                    src={project.mainImage} 
                    alt={project.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className="gallery-overlay">
                    <h3>{project.title}</h3>
                    <p>{project.location}</p>
                    <span className={`category-badge ${project.category}`}>{project.category}</span>
                    {project.images?.length > 0 && (
                      <span className="photo-count"><FiImage /> {project.images.length + 1}</span>
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
            <div className="videos-grid">
              {videos.map((video, index) => {
                const videoId = getYoutubeVideoId(video.url);
                const thumbnailUrls = videoId ? getYoutubeThumbnail(videoId) : [];
                
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
                      {videoId ? (
                        <img 
                          src={thumbnailUrls[0]} // Try HD first
                          alt={video.title}
                          onError={(e) => {
                            // Try next quality if HD fails
                            const currentSrc = e.target.src;
                            const nextIndex = thumbnailUrls.indexOf(currentSrc) + 1;
                            if (nextIndex < thumbnailUrls.length) {
                              e.target.src = thumbnailUrls[nextIndex];
                            } else {
                              // If all thumbnails fail, show fallback
                              e.target.src = 'https://via.placeholder.com/320x180?text=Video+Preview';
                            }
                          }}
                        />
                      ) : (
                        <img 
                          src="https://via.placeholder.com/320x180?text=Invalid+URL" 
                          alt="Invalid video URL"
                        />
                      )}
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
          <h2>Ready to Start Your Project?</h2>
          <Link to="/#contact" className="btn">Contact Us</Link>
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