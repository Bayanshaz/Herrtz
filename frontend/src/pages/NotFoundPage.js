import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const NotFoundPage = () => {
  return (
    <>
      <Header />
      <section className="not-found" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '120px', color: 'var(--secondary)', marginBottom: '20px' }}>404</h1>
          <h2 style={{ marginBottom: '20px' }}>Page Not Found</h2>
          <p style={{ marginBottom: '30px' }}>The page you are looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn">Go Back Home</Link>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default NotFoundPage;