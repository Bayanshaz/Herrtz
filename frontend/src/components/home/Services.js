import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';

const Services = () => {
  const { services } = useData();
  const [expandedServices, setExpandedServices] = useState({});

  if (!services || services.length === 0) {
    return (
      <section className="services" id="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="text-center">No services added yet.</p>
        </div>
      </section>
    );
  }

  const toggleReadMore = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  // Function to split description into paragraphs
  const getParagraphs = (text) => {
    // Split by periods, question marks, or exclamation marks followed by space
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    // Group sentences into paragraphs (approximately 2-3 sentences per paragraph)
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 2) {
      paragraphs.push(sentences.slice(i, i + 2).join(' '));
    }
    return paragraphs;
  };

  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        
        <div className="services-grid-2col">
          {services.map((service, index) => {
            const paragraphs = getParagraphs(service.description);
            const isExpanded = expandedServices[service._id];
            const displayParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 2);
            const hasMore = paragraphs.length > 2;

            return (
              <motion.div 
                key={service._id}
                className="service-card-detailed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="service-header">
                  <div className="service-icon-circle">
                    <i className={service.icon}></i>
                  </div>
                  <h3>{service.title}</h3>
                </div>
                
                <div className="service-paragraphs">
                  {displayParagraphs.map((para, idx) => (
                    <p key={idx} className="service-paragraph">
                      {para}
                    </p>
                  ))}
                </div>

                {hasMore && (
                  <button 
                    className="read-more-btn"
                    onClick={() => toggleReadMore(service._id)}
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;