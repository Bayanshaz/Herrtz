import React from 'react';

const Process = () => {
  const steps = [
    { title: 'Consultation & Planning', desc: 'Understanding your goals and budget.' },
    { title: 'Design & 3D Visualization', desc: 'Creating detailed plans and renderings.' },
    { title: 'Construction & Execution', desc: 'Using high-quality materials.' },
    { title: 'Final Inspection & Handover', desc: 'Quality check and finishing.' }
  ];

  return (
    <section className="process">
      <div className="container">
        <h2 className="section-title">Our Process</h2>
        <div className="process-steps">
          {steps.map((step, index) => (
            <div key={index} className="process-step">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;