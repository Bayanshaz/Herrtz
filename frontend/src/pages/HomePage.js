import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';
import Works from '../components/home/Works';
import Team from '../components/home/Team';
import Services from '../components/home/Services';
import Process from '../components/home/Process';
import CTA from '../components/home/CTA';
import Contact from '../components/home/Contact';
import { useData } from '../context/DataContext';
import Loading from '../components/common/Loading';

const HomePage = () => {
  const { loading } = useData();
  if (loading) return <Loading />;
  return (
    <>
      <Header />
      <Hero />
      <Works />
      <Team />
      <Services />
      <Process />
      <CTA />
      <Contact />
      <Footer />
    </>
  );
};

export default HomePage;