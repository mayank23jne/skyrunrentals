import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion } from 'framer-motion';
import { Plane, Globe, Compass, ArrowRight } from 'lucide-react';
import flightsHero from '../assets/flights_hero.png';

const Flights: React.FC = () => {
  const handleSearchClick = () => {
    window.open('https://www.delta.com/apac/en', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flights-page">
      <Navbar />

      <main className="flights-main">
        <section className="flights-hero-section">
          <div className="container">
            <div className="flights-content-grid">
              <motion.div
                className="flights-text-card"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="glass-effect">
                  <motion.span
                    className="flights-badge"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Sky-High Comfort
                  </motion.span>
                  <h2 className="flights-subtitle-cursive">Air Travel</h2>
                  <h1 className="flights-title-premium">
                    Travel <br />
                    <span>Explore World</span>
                  </h1>
                  <p className="flights-description">
                    Fly to over 300 destinations worldwide with unparalleled service. Experience the world like never before with our premium flight partners.
                  </p>
                  <motion.button
                    className="premium-search-btn"
                    onClick={handleSearchClick}
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(58, 134, 255, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Search Flights</span>
                    <div className="btn-glow"></div>
                  </motion.button>

                  <div className="partner-delta">
                    <div className="delta-logo-wrapper">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#E0202C">
                        <path d="M12 2L2 22h20L12 2z" />
                      </svg>
                      <span className="delta-text">DELTA</span>
                    </div>
                    <p className="delta-tagline">Go anywhere • Keep it simple • Travel your way</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flights-visual-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <img src={flightsHero} alt="Explore World" className="hero-flights-img" />
                <div className="floating-stat">
                  <Plane size={24} className="stat-icon" />
                  <div>
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Daily Flights</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="flights-services-section">
          <div className="container">
            <div className="services-grid">
              {[
                { icon: <Globe size={32} />, title: 'Global Network', desc: 'Reach every corner of the globe with our extensive airline partnerships.' },
                { icon: <Compass size={32} />, title: 'Smart Booking', desc: 'Find the best routes and prices with our intelligent search engine.' },
                { icon: <Plane size={32} />, title: 'Premium Cabins', desc: 'Enjoy luxury at 30,000 feet with top-tier in-flight amenities.' }
              ].map((service, i) => (
                <motion.div
                  key={i}
                  className="service-card-premium"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="service-icon-wrapper">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />

      <style>{`
        .flights-page {
          background-color: #fff;
          min-height: 100vh;
        }

        .flights-main {
          padding-top: 135px;
        }

        @media (max-width: 992px) {
          .flights-main {
            padding-top: 10px !important;
          }
        }

        .flights-hero-section {
          padding: 80px 0;
          background: radial-gradient(circle at top right, #f2f7ff, #ffffff);
          position: relative;
        }

        .flights-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 60px;
        }

        .flights-text-card {
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

        .flights-badge {
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

        .flights-subtitle-cursive {
          font-family: var(--subtitlefont);
          font-size: 2.5rem;
          color: var(--secondary);
          margin-bottom: 5px;
          font-weight: 400;
        }

        .flights-title-premium {
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          font-weight: 900;
          color: #1a1a1a;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .flights-title-premium span {
          background: linear-gradient(90deg, var(--secondary), #6366f1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .flights-description {
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
          margin-bottom: 40px;
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

        .partner-delta {
          border-top: 1px solid #eee;
          padding-top: 30px;
        }

        .delta-logo-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .delta-text {
          font-size: 1.2rem;
          font-weight: 900;
          color: #1a1a1a;
          letter-spacing: 2px;
        }

        .delta-tagline {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .flights-visual-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .hero-flights-img {
          width: 100%;
          max-width: 600px;
          height: auto;
          filter: drop-shadow(0 40px 80px rgba(0,0,0,0.12));
          transition: transform 0.5s ease;
        }

        .flights-visual-wrapper:hover .hero-flights-img {
          transform: translateY(-10px);
        }

        .floating-stat {
          position: absolute;
          top: 20px;
          right: 40px;
          background: white;
          padding: 15px 25px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid #f0f0f0;
        }

        .stat-icon {
          color: var(--secondary);
        }

        .stat-number {
          display: block;
          font-size: 1.4rem;
          font-weight: 800;
          color: #1a1a1a;
        }

        .stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #6b7280;
        }

        .flights-services-section {
          padding: 100px 0;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .service-card-premium {
          padding: 40px;
          background: #fff;
          border-radius: 30px;
          border: 1px solid #f0f0f0;
          transition: all 0.4s ease;
        }

        .service-card-premium:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.06);
          border-color: var(--secondary);
        }

        .service-icon-wrapper {
          color: var(--secondary);
          margin-bottom: 20px;
        }

        .service-card-premium h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .service-card-premium p {
          color: #6b7280;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .flights-content-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .glass-effect {
            padding: 30px;
          }
          .delta-logo-wrapper {
            justify-content: center;
          }
          .floating-stat {
            right: auto;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default Flights;
