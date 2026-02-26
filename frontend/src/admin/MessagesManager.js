import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiPhone, FiUser, FiTrash2, FiCheck, FiClock, FiX } from 'react-icons/fi';
import API from '../api';
import toast from 'react-hot-toast';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState(null);
  const { token } = useAuth();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.get('/messages', config);
      
      // Ensure messages is always an array
      setMessages(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load messages');
      setMessages([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id, status) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.put(`/messages/${id}`, { status }, config);
      setMessages(messages.map(m => m._id === id ? res.data.data : m));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await API.delete(`/messages/${id}`, config);
      setMessages(messages.filter(m => m._id !== id));
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const openViewModal = (message) => {
    setViewingMessage(message);
    setViewModalIsOpen(true);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'unread': return <FiClock style={{ color: '#f39c12' }} />;
      case 'read': return <FiCheck style={{ color: '#3498db' }} />;
      case 'replied': return <FiCheck style={{ color: '#27ae60' }} />;
      default: return <FiClock style={{ color: '#999' }} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Safe check for messages array
  const hasMessages = messages && Array.isArray(messages) && messages.length > 0;

  if (loading) return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Contact Messages</h2>
      </div>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loader"></div>
        <p>Loading messages...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Contact Messages</h2>
      </div>

      <div className="messages-list">
        {!hasMessages ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: '#f9f9f9', 
            borderRadius: '8px',
            color: '#666'
          }}>
            <FiMail size={48} style={{ color: '#ccc', marginBottom: '15px' }} />
            <h3>No Messages Yet</h3>
            <p>When users submit the contact form, their messages will appear here.</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message._id} className={`message-item ${message.status || 'unread'}`}>
              <div className="message-header">
                <div className="message-sender" onClick={() => openViewModal(message)}>
                  <FiUser /> {message.name || 'Unknown'}
                </div>
                <div className="message-email">
                  <FiMail /> {message.email || 'No email'}
                </div>
                {message.phone && (
                  <div className="message-phone">
                    <FiPhone /> {message.phone}
                  </div>
                )}
                <div className="message-status">
                  <button 
                    onClick={() => updateStatus(message._id, 'read')}
                    className={`status-btn ${message.status === 'read' ? 'active' : ''}`}
                    title="Mark as read"
                  >
                    <FiCheck />
                  </button>
                  <button 
                    onClick={() => updateStatus(message._id, 'replied')}
                    className={`status-btn ${message.status === 'replied' ? 'active' : ''}`}
                    title="Mark as replied"
                  >
                    <FiCheck style={{ color: '#27ae60' }} />
                  </button>
                  <span className="status-indicator">
                    {getStatusIcon(message.status)}
                  </span>
                </div>
                <button 
                  onClick={() => deleteMessage(message._id)}
                  className="delete-btn"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="message-body" onClick={() => openViewModal(message)}>
                <p>{message.message ? message.message.substring(0, 100) : 'No content'}...</p>
              </div>
              <div className="message-footer">
                <small>
                  Received: {formatDate(message.createdAt)}
                </small>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={() => setViewModalIsOpen(false)}
        className="view-modal"
        overlayClassName="modal-overlay"
      >
        {viewingMessage && (
          <>
            <div className="modal-header">
              <h3>Message from {viewingMessage.name || 'Unknown'}</h3>
              <button onClick={() => setViewModalIsOpen(false)} className="close-btn">
                <FiX />
              </button>
            </div>
            <div className="view-content">
              <div className="message-details">
                <p><strong>Name:</strong> {viewingMessage.name || 'N/A'}</p>
                <p><strong>Email:</strong> {viewingMessage.email || 'N/A'}</p>
                {viewingMessage.phone && <p><strong>Phone:</strong> {viewingMessage.phone}</p>}
                <p><strong>Received:</strong> {formatDate(viewingMessage.createdAt)}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${viewingMessage.status || 'unread'}`}>
                    {viewingMessage.status || 'unread'}
                  </span>
                </p>
                <div className="message-content">
                  <h4>Message:</h4>
                  <p>{viewingMessage.message || 'No message content'}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>

      <style jsx>{`
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message-item {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 15px;
          border-left: 4px solid #ddd;
          transition: all 0.3s ease;
        }

        .message-item.unread {
          border-left-color: #f39c12;
          background: #fff8e7;
        }

        .message-item.read {
          border-left-color: #3498db;
        }

        .message-item.replied {
          border-left-color: #27ae60;
        }

        .message-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .message-sender {
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .message-sender:hover {
          color: #c8a97e;
        }

        .message-email,
        .message-phone {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          font-size: 14px;
        }

        .message-status {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-left: auto;
        }

        .status-btn {
          background: transparent;
          border: none;
          font-size: 16px;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .status-btn:hover {
          background: rgba(0,0,0,0.1);
        }

        .status-btn.active {
          background: #c8a97e;
          color: white;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          margin-left: 5px;
        }

        .message-body {
          cursor: pointer;
          margin-bottom: 10px;
        }

        .message-body p {
          color: #666;
          margin: 0;
        }

        .message-footer {
          font-size: 12px;
          color: #999;
          text-align: right;
        }

        .message-details {
          padding: 20px;
        }

        .message-details p {
          margin-bottom: 10px;
        }

        .message-content {
          margin-top: 20px;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 5px;
        }

        .message-content h4 {
          margin-bottom: 10px;
          color: #333;
        }

        .message-content p {
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .status-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 500;
          margin-left: 10px;
          text-transform: capitalize;
        }

        .status-badge.unread {
          background: #f39c12;
          color: white;
        }

        .status-badge.read {
          background: #3498db;
          color: white;
        }

        .status-badge.replied {
          background: #27ae60;
          color: white;
        }

        @media (max-width: 768px) {
          .message-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .message-status {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MessagesManager;