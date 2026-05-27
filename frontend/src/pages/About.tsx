import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion } from 'framer-motion';
import { Heart, Plane, Headphones, Plus, X } from 'lucide-react';
import aboutHero from '../assets/about_hero_family.png'; // I will copy the generated image here

const About: React.FC = () => {
  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get to know Holidayhavenhomes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Where families travel better together
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <motion.div
            className="mission-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p>Our mission is to find every family the space they need to relax, reconnect, and enjoy precious time away together.</p>
          </motion.div>
        </div>
      </section>

      {/* Beliefs Section */}
      <section className="beliefs-section">
        <div className="container">
          <div className="belief-row">
            <div className="belief-title">
              <h2>We believe in family connection</h2>
            </div>
            <div className="belief-text">
              <p>We need each other now more than ever, and we all want more quality time with the people we love. Our focus is on the importance of connection and the joy that celebrating meaningful moments together brings. That's the magic we're trying to capture. That's why we're here.</p>
            </div>
          </div>

          <div className="belief-row">
            <div className="belief-title">
              <h2>We have a place for everyone</h2>
            </div>
            <div className="belief-text">
              <p>We started pairing homeowners with families looking for places to stay in 2007, and Holiday Haven Homes was born. Since then, we've grown into a trusted global vacation brand with a unique selection of 2+ million whole homes all over the world. In other words, there's room for everyone. Holidayhavenhomes takes diversity and inclusion seriously, because we believe that family is everything. No matter how it takes shape.</p>
            </div>
          </div>

          <div className="belief-row">
            <div className="belief-title">
              <h2>We want families to travel better together</h2>
            </div>
            <div className="belief-text">
              <p>That means new features that make getting away together easier for everyone. It means filtering for preferences and highlighting destinations within driving distance. It means streamlined group planning tools. It means stays for every budget. And it means excellent customer service and flexible cancellation policies if plans change.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="help-section">
        <div className="container">
          <h2 className="help-heading">wherever you go, we're here to help you.</h2>

          <div className="help-grid">
            <motion.div
              className="help-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >

              <div className="help-icon-wrapper heart">
                <Heart size={32} />
                <Plus size={16} className="plus-icon" />
              </div>
              <h3>Health and safety is priority</h3>
              <p>Hosts are committing to enhanced COVID-19 cleaning protocols, and listings are rated for cleanliness.</p>
            </motion.div>

            <motion.div
              className="help-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="help-icon-wrapper plane">
                <Plane size={32} />
                <div className="slash"></div>
              </div>
              <h3>More cancellation options</h3>
              <p>Hosts can offer a range of flexible cancellation options which are clearly stated at the time of booking.</p>
            </motion.div>

            <motion.div
              className="help-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="help-icon-wrapper support">
                <div className="chat-bubbles">
                  <div className="bubble bubble-1"></div>
                  <div className="bubble bubble-2"></div>
                </div>
                <Headphones size={32} />
              </div>
              <h3>Support anytime, day or night</h3>
              <p>With 24/7 global customer support, we're there for you wherever you need assistance.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />

      <style>{`
        .about-page {
          background-color: #fff;
          padding-top: 135px;
          overflow-x: hidden;
        }

        @media (max-width: 992px) {
          .about-page {
            padding-top: 10px !important;
          }
        }

        .about-hero {
          position: relative;
          height: 80vh;
          min-height: 500px;
          background-image: url(${aboutHero});
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-content h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .hero-content p {
          font-size: clamp(1.2rem, 2vw, 1.8rem);
          font-weight: 500;
          opacity: 0.9;
        }

        .mission-section {
          padding: 100px 0;
          text-align: center;
        }

        .mission-card {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
        }

        .mission-card p {
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--primary);
          line-height: 1.4;
        }

        .beliefs-section {
          padding-bottom: 100px;
        }

        .belief-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
          padding: 60px 0;
          border-top: 1px solid #f0f0f0;
        }

        .belief-title h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1.2;
        }

        .belief-text p {
          font-size: 1.1rem;
          color: #4b5563;
          line-height: 1.7;
        }

        .help-section {
          background-color: #fff;
          padding: 100px 0 150px;
        }

        .help-heading {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 80px;
          text-align: left;
        }

        .help-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 60px;
        }

        .help-item {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .help-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff5a5f;
          margin-bottom: 10px;
        }

        .help-icon-wrapper.heart {
          color: #ff5a5f;
        }

        .plus-icon {
          position: absolute;
          top: 25px;
          right: 18px;
          background: white;
          border-radius: 50%;
        }

        .help-icon-wrapper.plane {
          color: #ff5a5f;
        }

        .slash {
          position: absolute;
          width: 40px;
          height: 2px;
          background: #ff5a5f;
          transform: rotate(-45deg);
        }

        .help-icon-wrapper.support {
          color: #ff5a5f;
        }

        .help-item h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary);
        }

        .help-item p {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .belief-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .mission-card p {
            font-size: 1.4rem;
          }

          .help-heading {
            font-size: 1.8rem;
            margin-bottom: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
