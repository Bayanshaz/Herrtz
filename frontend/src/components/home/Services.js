import React from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';

const Services = () => {
  const { services } = useData();

  return (
    <section className="services" id="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div 
              key={service._id}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;