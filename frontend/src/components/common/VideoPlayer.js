import React, { useState } from 'react';
import { FiX, FiMaximize2 } from 'react-icons/fi';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const VideoPlayer = ({ videoUrl, videoTitle, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match?.[2] || null;
  };

  const videoId = getYoutubeVideoId(videoUrl);
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

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
            <button onClick={() => setIsFullscreen(!isFullscreen)}><FiMaximize2 /></button>
            <button onClick={onClose}><FiX /></button>
          </div>
        </div>
        <div className="video-wrapper">
          <iframe src={embedUrl} title={videoTitle} frameBorder="0" allowFullScreen></iframe>
        </div>
      </div>
    </Modal>
  );
};

export default VideoPlayer;