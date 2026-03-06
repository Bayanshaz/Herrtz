import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const NotFoundPage = () => {
  return (
    <>
      <Header />
      <section className="not-found">
        <div className="container">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn">Go Home</Link>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default NotFoundPage;