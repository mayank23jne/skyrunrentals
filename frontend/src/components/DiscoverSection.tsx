import React from 'react';
import { motion } from 'framer-motion';
import { Map, Users } from 'lucide-react';
import discoverImg from '../assets/discover-travel.png';

const DiscoverSection: React.FC = () => {
  return (
    <section className="discover-section">
      <div className="container">
        <div className="discover-grid">

          {/* Left Content */}
          <div className="discover-content">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="section-header" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                <span className="section-subtitle">About Company</span>
                <h2 className="section-title" style={{ margin: '0' }}>
                  Discover Best Travel <br />
                  Destinations
                </h2>
              </div>
              <p className="section-desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rutrum imperdiet rhoncus. Duis iaculis suscipit auctor. Aliquam vehicula, magna a elementum viverra.
              </p>

              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon-box">
                    <Map size={24} color="#ff9c45" />
                  </div>
                  <div className="feature-text">
                    <h4>Best Services</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-box">
                    <Users size={24} color="#ff9c45" />
                  </div>
                  <div className="feature-text">
                    <h4>Tour Guide</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                </div>
              </div>

              <button className="btn-discover">
                Discover More
              </button>
            </motion.div>
          </div>

          {/* Right Image */}
          <div className="discover-image-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="image-wrapper"
            >
              <img src={discoverImg} alt="Discover Travel" className="main-image" />

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="experience-badge"
              >
                <div className="badge-circle">
                  <span className="years">25</span>
                  <span className="plus">+</span>
                </div>
                <div className="badge-text">
                  <span>Years</span>
                  <strong>Experience</strong>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="decor-circle"></div>
            </motion.div>
          </div>

        </div>
      </div>

      <style>{`
        .discover-section {
          padding: 100px 0;
          background: #ffffff;
          overflow: hidden;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .discover-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 80px;
        }


        .section-desc {
          color: #64748b;
          font-size: 17px;
          line-height: 1.7;
          margin-bottom: 40px;
          max-width: 500px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 25px;
          margin-bottom: 45px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 20px;
          background: #ffffff;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
          transform: translateX(10px);
        }

        .feature-icon-box {
          width: 60px;
          height: 60px;
          background: #fff4ec;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-text h4 {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 5px 0;
        }

        .feature-text p {
          font-size: 15px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .btn-discover {
          background: #ff9c45;
          color: white;
          padding: 18px 45px;
          border-radius: 99px;
          font-size: 18px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(255, 156, 69, 0.2);
        }

        .btn-discover:hover {
          background: #1a1a1a;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        /* Image Styling */
        .discover-image-container {
          position: relative;
        }

        .image-wrapper {
          position: relative;
          z-index: 2;
        }

        .main-image {
          width: 100%;
          height: auto;
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
          display: block;
        }

        .experience-badge {
          position: absolute;
          bottom: 40px;
          left: -30px;
          background: #ffffff;
          padding: 20px 30px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          z-index: 10;
        }

        .badge-circle {
          width: 65px;
          height: 65px;
          background: #ff9c45;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
        }

        .badge-circle .years {
          font-size: 28px;
          font-weight: 900;
        }

        .badge-circle .plus {
          font-size: 18px;
          font-weight: 700;
          position: absolute;
          top: 15px;
          right: 12px;
        }

        .badge-text {
          display: flex;
          flex-direction: column;
          color: #1a1a1a;
        }

        .badge-text span {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .badge-text strong {
          font-size: 20px;
          font-weight: 800;
        }

        .decor-circle {
          position: absolute;
          top: -40px;
          right: -40px;
          width: 200px;
          height: 200px;
          border: 40px solid #f8fafc;
          border-radius: 50%;
          z-index: -1;
        }

        @media (max-width: 1100px) {
          .discover-grid { gap: 40px; }
          .section-title { font-size: 38px; }
          .experience-badge { left: 0; bottom: 20px; }
        }

        @media (max-width: 992px) {
          .discover-grid { grid-template-columns: 1fr; }
          .discover-content { order: 2; text-align: center; }
          .section-desc { margin-left: auto; margin-right: auto; }
          .discover-image-container { order: 1; max-width: 600px; margin: 0 auto; }
          .feature-item { text-align: left; }
        }

        @media (max-width: 576px) {
          .section-title { font-size: 32px; }
          .experience-badge { padding: 15px 20px; }
          .badge-circle { width: 50px; height: 50px; }
          .badge-circle .years { font-size: 22px; }
          .badge-text strong { font-size: 16px; }
        }
      `}</style>
    </section>
  );
};

export default DiscoverSection;
