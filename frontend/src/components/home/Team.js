import React from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';

const Team = () => {
  const { team } = useData();
  const ceo = team.find(m => m.isCEO);
  const members = team.filter(m => !m.isCEO);

  return (
    <section className="team" id="team">
      <div className="container">
        <h2 className="section-title">Our Team</h2>
        
        <div className="team-content">
          {ceo && (
            <motion.div 
              className="ceo-section"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="ceo-image">
                <img src={ceo.image} alt={ceo.name} />
              </div>
              <div className="ceo-info">
                <h3>{ceo.name}</h3>
                <p className="position">{ceo.position}</p>
                <p className="bio">{ceo.bio}</p>
              </div>
            </motion.div>
          )}
          
          <div className="team-grid">
            <h3>Our Experts</h3>
            <div className="team-members">
              {members.map((member, index) => (
                <motion.div 
                  key={member._id}
                  className="team-member"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="member-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p>{member.position}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;