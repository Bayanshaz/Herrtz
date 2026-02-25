import React from 'react';
import { FiX, FiMaximize2 } from 'react-icons/fi';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const VideoPlayer = ({ videoUrl, videoTitle, onClose }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeVideoId(videoUrl);
  
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0`;

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className={`video-modal ${isFullscreen ? 'fullscreen' : ''}`}
      overlayClassName="video-modal-overlay"
    >
      <div className="video-modal-content">
        <div className="video-modal-header">
          <h3>{videoTitle}</h3>
          <div className="video-controls">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="fullscreen-btn">
              <FiMaximize2 />
            </button>
            <button onClick={onClose} className="close-btn">
              <FiX />
            </button>
          </div>
        </div>
        
        <div className="video-wrapper">
          <iframe
            src={embedUrl}
            title={videoTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Modal>
  );
};

export default VideoPlayer;