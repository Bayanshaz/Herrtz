import React from 'react';

const Process = () => {
  const steps = [
    {
      title: 'Consultation & Planning',
      description: 'We start by understanding your goals, budget, and design preferences.'
    },
    {
      title: 'Design & 3D Visualization',
      description: 'Our architects create detailed 2D plans and 3D renderings.'
    },
    {
      title: 'Construction & Execution',
      description: 'Using high-quality materials and expert craftsmanship.'
    },
    {
      title: 'Final Inspection & Handover',
      description: 'Thorough quality check and finishing touch-ups.'
    }
  ];

  return (
    <section className="process">
      <div className="container">
        <h2 className="section-title">Our Process: From Concept to Completion</h2>
        
        <div className="process-steps">
          {steps.map((step, index) => (
            <div key={index} className="process-step">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;