import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion } from 'framer-motion';
import carsHero from '../assets/cars_hero.png';

const Cars: React.FC = () => {
  const handleSearchClick = () => {
    window.open('https://www.rentalcars.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="cars-page">
      <Navbar />

      <main className="cars-main">
        <section className="cars-hero-section">
          <div className="container">
            <div className="cars-content-grid">
              <motion.div
                className="cars-text-card"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="glass-effect">
                  <motion.span
                    className="cars-badge"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Premium Rentals
                  </motion.span>
                  <h2 className="cars-subtitle-cursive">Car Hire</h2>
                  <h1 className="cars-title-premium">
                    Search, <br />
                    <span>Compare & Save</span>
                  </h1>
                  <p className="cars-description">
                    Unlock the best deals from top global brands. Whether it's a weekend getaway or a long-distance road trip, we've got you covered.
                  </p>
                  <motion.button
                    className="premium-search-btn"
                    onClick={handleSearchClick}
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(58, 134, 255, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Search Cars</span>
                    <div className="btn-glow"></div>
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className="cars-visual-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <img src={carsHero} alt="Premium Cars" className="hero-cars-img" />
                <div className="floating-badge">
                  <span className="badge-number">2M+</span>
                  <span className="badge-text">Cars Worldwide</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="cars-features-section">
          <div className="container">
            <div className="features-grid">
              {[
                { icon: '🛡️', title: 'Fully Insured', desc: 'Comprehensive coverage for absolute peace of mind.' },
                { icon: '📍', title: 'Global Access', desc: 'Thousands of pick-up points across 160 countries.' },
                { icon: '💎', title: 'Elite Fleet', desc: 'Exquisite selection of luxury and economy vehicles.' }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="feature-card-premium"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="feature-icon-wrapper">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />

      <style>{`
        .cars-page {
          background-color: #fff;
          min-height: 100vh;
        }

        .cars-main {
          padding-top: 135px;
        }
          @media (max-width: 992px) {
          .cars-main {
            padding-top: 10px !important;
          }
        }

        .cars-hero-section {
          padding: 80px 0;
          background: radial-gradient(circle at top right, #f2f7ff, #ffffff);
          position: relative;
        }

        .cars-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
        }

        .cars-text-card {
          position: relative;
          z-index: 2;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          padding: 50px;
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 30px 60px rgba(0,0,0,0.05);
        }

        .cars-badge {
          display: inline-block;
          background: var(--secondary);
          color: white;
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .cars-subtitle-cursive {
          font-family: var(--subtitlefont);
          font-size: 2.5rem;
          color: var(--secondary);
          margin-bottom: 5px;
          font-weight: 400;
        }

        .cars-title-premium {
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          font-weight: 900;
          color: #1a1a1a;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .cars-title-premium span {
          background: linear-gradient(90deg, var(--secondary), #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cars-description {
          font-size: 1.1rem;
          color: #4b5563;
          margin-bottom: 35px;
          line-height: 1.6;
        }

        .premium-search-btn {
          position: relative;
          background: #1a1a1a;
          color: white;
          padding: 20px 45px;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 700;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .premium-search-btn:hover .btn-glow {
          transform: translateX(100%);
        }

        .cars-visual-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .hero-cars-img {
          width: 100%;
          max-width: 600px;
          height: auto;
          filter: drop-shadow(0 40px 80px rgba(0,0,0,0.12));
          transition: transform 0.5s ease;
        }

        .cars-visual-wrapper:hover .hero-cars-img {
          transform: scale(1.05) rotate(-2deg);
        }

        .floating-badge {
          position: absolute;
          bottom: 20px;
          right: 40px;
          background: white;
          padding: 20px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #f0f0f0;
        }

        .badge-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--secondary);
        }

        .badge-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #6b7280;
        }

        .cars-features-section {
          padding: 100px 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .feature-card-premium {
          padding: 40px;
          background: #fff;
          border-radius: 30px;
          border: 1px solid #f0f0f0;
          transition: all 0.4s ease;
        }

        .feature-card-premium:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.06);
          border-color: var(--secondary);
        }

        .feature-icon-wrapper {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        .feature-card-premium h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .feature-card-premium p {
          color: #6b7280;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .cars-content-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .glass-effect {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default Cars;
