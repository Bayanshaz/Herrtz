import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';

const Works = () => {
  const { projects } = useData();
  
  // Get the 8 most recent projects
  const recentProjects = projects.slice(0, 8);

  return (
    <section className="works">
      <div className="container">
        <h2 className="section-title">Our Latest Projects</h2>
        
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
                <img 
                  src={project.mainImage} 
                  alt={project.title}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                />
                <div className="work-overlay">
                  <h3>{project.title}</h3>
                  <p>{project.location}</p>
                  <span className={`category-badge ${project.category}`}>{project.category}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center" style={{ marginTop: '40px' }}>
          <Link to="/gallery" className="btn-view-all">View All Projects</Link>
        </div>
      </div>
    </section>
  );
};

export default Works;