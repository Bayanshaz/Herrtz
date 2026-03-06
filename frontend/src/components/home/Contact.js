import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import API from '../../api';  // Make sure this import is correct
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Using API instance - this will use REACT_APP_API_URL
      const res = await API.post('/messages', formData);
      
      if (res.data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      console.error('Error details:', err);
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Get In Touch</h3>
            <div className="contact-details">
              <div className="contact-item">
                <FiMapPin />
                <div>
                  <h4>Location</h4>
                  <p>Pandalam , Pathanamthitta, Kerala</p>
                </div>
              </div>
              <div className="contact-item">
                <FiPhone />
                <div>
                  <h4>Phone</h4>
                  <p>+91 8281621295</p>
                </div>
              </div>
              <div className="contact-item">
                <FiMail />
                <div>
                  <h4>Email</h4>
                  <p>harrtzconcepts@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
              <textarea 
                placeholder="Your Message" 
                rows="5" 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})} 
                required
              />
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;