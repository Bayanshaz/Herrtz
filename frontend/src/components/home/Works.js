import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import VideoPlayer from '../common/VideoPlayer';
import { FiPlay, FiEye } from 'react-icons/fi';
import { useState } from 'react';

const Works = () => {
  const { projects, videos } = useData();
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Get the 3 most recently added projects (newest first)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Get first 3 videos for display
  const recentVideos = videos.slice(0, 3);

  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <section className="works">
      <div className="container">
        <h2 className="section-title">Our Latest Projects</h2>
        
        {/* 3 Most Recent Projects */}
        <div className="works-grid">
          {recentProjects.map((project, index) => (
            <motion.div 
              key={project._id}
              className="work-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/project/${project._id}`}>
                <img src={project.mainImage || project.image} alt={project.title} />
                <div className="work-overlay">
                  <h3>{project.title}</h3>
                  <p>{project.location}</p>
                  <span className={`category-badge ${project.category}`}>
                    {project.category}
                  </span>
                  <span className="view-details">
                    <FiEye /> View Details
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <Link to="/gallery" className="btn btn-small">
            View All Projects
          </Link>
        </div>

        {/* Project Videos Section */}
        {recentVideos.length > 0 && (
          <>
            <h2 className="section-title" style={{ marginTop: '40px' }}>Project Videos</h2>
            <div className="videos-grid-home">
              {recentVideos.map((video, index) => {
                const videoId = getYoutubeVideoId(video.url);
                const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
                const fallbackThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
                
                return (
                  <motion.div 
                    key={video._id}
                    className="video-card-home"
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
          </>
        )}

        {/* Video Player Modal */}
        {selectedVideo && (
          <VideoPlayer
            videoUrl={selectedVideo.url}
            videoTitle={selectedVideo.title}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Works;