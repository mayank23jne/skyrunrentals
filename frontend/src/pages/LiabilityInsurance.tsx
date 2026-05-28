import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Home, Key, Globe, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import unexpectedImg from '../assets/about_hero_family.png';
import heroBg from '../assets/insurance_hero.png';

const LiabilityInsurance: React.FC = () => {
  return (
    <div className="insurance-page">
      <Navbar />

      <main className="insurance-main">
        {/* Elegant Hero Banner */}
        <section
          className="insurance-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(14, 30, 44, 0.8), rgba(6, 18, 27, 0.9)), url(${heroBg})`
          }}
        >
          <div className="hero-shapes-bg">
            <div className="mesh-blob-blue" />
            <div className="mesh-blob-orange" />
          </div>
          <div className="container hero-container">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShieldCheck size={16} className="badge-icon" />
              <span>Complimentary Protection Plan</span>
            </motion.div>
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              $1M Liability Insurance
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Automatic primary liability coverage for vacation rentals processed online through Skyrunrentals.
            </motion.p>
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/list-property" className="hero-cta-btn">
                <span>Get Protected Today</span>
                <ChevronRight size={18} />
              </Link>
            </motion.div> */}
          </div>
        </section>

        {/* Keeping you ready for the unexpected */}
        <section className="unexpected-section">
          <div className="container">
            <div className="unexpected-grid">

              {/* Left Side: Styled Image Frame */}
              <motion.div
                className="unexpected-media-frame"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="circle-image-wrapper">
                  <img src={unexpectedImg} alt="Ready for the unexpected" className="unexpected-circle-img" />
                  <div className="circle-decor-border" />
                  <div className="glass-floating-shield">
                    <Shield size={28} className="shield-icon-floating" />
                  </div>
                </div>
              </motion.div>

              {/* Right Side: Content Description */}
              <motion.div
                className="unexpected-content"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="section-mini-tag">Owner Peace of Mind</span>
                <h2 className="section-title">Keeping you ready for the unexpected</h2>
                <div className="accent-bar" />

                <p className="unexpected-lead-text">
                  <strong>$1M Liability Insurance</strong> provides owners and property managers with liability protection for all stays processed online through the <em>skyrunrentals.com</em> checkout, giving you <strong>$1,000,000</strong> in primary liability coverage — at no additional cost to you.
                </p>

                <p className="unexpected-body-text">
                  This means that if you don't already have a liability policy, this policy responds first if someone makes a claim against you. If you already have a liability policy for your vacation rental, then consider this to be matching additional coverage that you have. It will respond at the same time as your current policy and both policies will contribute if a claim is made against you.
                </p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* How you're protected */}
        <section className="protected-section">
          <div className="container">
            <div className="section-header-centered">
              <span className="section-mini-tag light">Security Breakdown</span>
              <h2 className="section-title text-white">How you're protected</h2>
              <div className="accent-bar centered" />
            </div>

            <div className="protected-grid">

              {/* Card 1 */}
              <motion.div
                className="protected-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="card-icon-wrapper">
                  <ShieldAlert size={28} />
                </div>
                <h3 className="card-heading">Traveler injury claims made against you</h3>
                <p className="card-description">
                  If a traveler is accidentally injured while staying in your rental property, this program may provide coverage for claims made against you.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="protected-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="card-icon-wrapper">
                  <Home size={28} />
                </div>
                <h3 className="card-heading">Property damage claims made against you</h3>
                <p className="card-description">
                  If a traveler accidentally damages the property of a third party (such as a neighbor) while staying in your rental property, that third party may sue you for that damage. The program may provide coverage for these types of claims.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                className="protected-card highlight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="card-icon-wrapper">
                  <Eye size={28} />
                </div>
                <h3 className="card-heading">Looking ahead</h3>
                <p className="card-description">
                  Skyrunrentals will continue to look at options to further protect owners against the unexpected challenges with managing a vacation rental.
                  <span className="exclusion-note"><strong>Please note:</strong> $1M Liability Insurance does not cover damage caused by a traveler to your own property.</span>
                </p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="works-section">
          <div className="container">
            <div className="section-header-centered">
              <span className="section-mini-tag">Operational Details</span>
              <h2 className="section-title">How it works</h2>
              <div className="accent-bar centered" />
            </div>

            <div className="works-grid">

              {/* Work Item 1 */}
              <motion.div
                className="works-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="works-icon-circle">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="works-title">Primary coverage for eligible claims</h3>
                <p className="works-text">
                  If you don't have liability insurance for your rental, this program provides that protection. If you do have liability insurance for your rental, this program works with your current provider and gives you $1,000,000 in added protection for all reservations processed online through Skyrunrentals checkout. If you haven't already, enable online booking to get Liability Insurance at no extra cost.
                </p>
              </motion.div>

              {/* Work Item 2 */}
              <motion.div
                className="works-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="works-icon-circle">
                  <Key size={24} />
                </div>
                <h3 className="works-title">Liability protection for vacation rentals</h3>
                <p className="works-text">
                  Typical homeowners policies may not provide liability protection when your property is used as a vacation rental. This program can provide that necessary coverage for when you are held liable for an accident during a stay at your property (subject to certain conditions, limitations, and exclusions - Policy Summary).
                </p>
              </motion.div>

              {/* Work Item 3 */}
              <motion.div
                className="works-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="works-icon-circle">
                  <Globe size={24} />
                </div>
                <h3 className="works-title">Global reach</h3>
                <p className="works-text">
                  This program provides protection for every reservation processed through Skyrunrentals checkout, no matter where in the world your property is located. Reservations processed through Skyrunrentals checkout are automatically protected, there's nothing more you need to do!
                </p>
              </motion.div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />

      <style>{`
        .insurance-page {
          background: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: #334155;
          overflow-x: hidden;
        }

        /* 1. Hero Section */
        .insurance-hero {
          position: relative;
          padding: 180px 0 130px;
          background-size: cover;
          background-position: center;
          color: #ffffff;
          text-align: center;
          overflow: hidden;
        }

        .hero-shapes-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .mesh-blob-blue {
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(59, 130, 246, 0.15);
          filter: blur(120px);
          top: 10%;
          left: 15%;
          border-radius: 50%;
        }

        .mesh-blob-orange {
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(249, 115, 22, 0.1);
          filter: blur(120px);
          bottom: 10%;
          right: 15%;
          border-radius: 50%;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #93c5fd;
          margin-bottom: 25px;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 1.1;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #ffffff 60%, #93c5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin-bottom: 35px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #ffffff;
          padding: 16px 32px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3),
                      0 0 0 0px rgba(37, 99, 235, 0.2);
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .hero-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(37, 99, 235, 0.4),
                      0 0 0 6px rgba(37, 99, 235, 0.15);
        }

        /* Common Elements */
        .section-mini-tag {
          font-size: 0.8rem;
          font-weight: 800;
          color: #3b82f6;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          display: block;
          margin-bottom: 12px;
        }

        .section-mini-tag.light {
          color: #60a5fa;
        }

        .section-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -1px;
          line-height: 1.2;
          margin-bottom: 15px;
        }

        .section-title.text-white {
          color: #ffffff;
        }

        .accent-bar {
          width: 50px;
          height: 4px;
          background: #f97316;
          border-radius: 10px;
          margin-bottom: 25px;
        }

        .accent-bar.centered {
          margin-left: auto;
          margin-right: auto;
        }

        /* 2. Unexpected Section */
        .unexpected-section {
          padding: 100px 0;
          background: #ffffff;
        }

        .unexpected-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .unexpected-media-frame {
          display: flex;
          justify-content: center;
        }

        .circle-image-wrapper {
          position: relative;
          width: 380px;
          height: 380px;
        }

        .unexpected-circle-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
          border: 6px solid #ffffff;
        }

        .circle-decor-border {
          position: absolute;
          inset: -12px;
          border: 2px dashed rgba(59, 130, 246, 0.25);
          border-radius: 50%;
          pointer-events: none;
          animation: spinCircular 30s linear infinite;
        }

        .glass-floating-shield {
          position: absolute;
          bottom: 25px;
          right: 25px;
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.8);
          animation: floatFloating 4s ease-in-out infinite;
        }

        .shield-icon-floating {
          color: #f97316;
        }

        .unexpected-content {
          padding-left: 20px;
        }

        .unexpected-lead-text {
          font-size: 1.15rem;
          line-height: 1.7;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .unexpected-body-text {
          font-size: 1rem;
          line-height: 1.75;
          color: #64748b;
        }

        /* 3. How you're protected */
        .protected-section {
          padding: 100px 0;
          background: #0e1e2c; /* Theme Slate Blue */
          position: relative;
          overflow: hidden;
        }

        .section-header-centered {
          text-align: center;
          margin-bottom: 60px;
        }

        .protected-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 30px;
        }

        .protected-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 40px 35px;
          border-radius: 24px;
          color: #ffffff;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .protected-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .protected-card.highlight {
          background: rgba(59, 130, 246, 0.06);
          border-color: rgba(59, 130, 246, 0.2);
        }

        .protected-card.highlight:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.4);
        }

        .card-icon-wrapper {
          width: 56px;
          height: 56px;
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
        }

        .protected-card.highlight .card-icon-wrapper {
          background: rgba(249, 115, 22, 0.15);
          color: #fb923c;
        }

        .card-heading {
          font-size: 1.15rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 15px;
          color: #ffffff;
        }

        .card-description {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #94a3b8;
        }

        .exclusion-note {
          display: block;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px dashed rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
        }

        /* 4. How it works */
        .works-section {
          padding: 100px 0;
          background: #f8fafc;
        }

        .works-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
        }

        .works-item {
          text-align: center;
          padding: 20px 10px;
        }

        .works-icon-circle {
          width: 64px;
          height: 64px;
          background: #ffffff;
          color: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .works-item:hover .works-icon-circle {
          background: #3b82f6;
          color: #ffffff;
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
          border-color: #3b82f6;
        }

        .works-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 15px;
        }

        .works-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #64748b;
        }

        /* Keyframes */
        @keyframes spinCircular {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes floatFloating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        /* Responsive Layouts */
        @media (max-width: 1024px) {
          .protected-grid {
            grid-template-columns: 1fr;
            gap: 25px;
            max-width: 600px;
            margin: 0 auto;
          }
          .works-grid {
            grid-template-columns: 1fr;
            gap: 35px;
            max-width: 600px;
            margin: 0 auto;
          }
          .unexpected-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .unexpected-content {
            padding-left: 0;
            text-align: center;
          }
          .accent-bar {
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (max-width: 768px) {
          .insurance-hero {
            padding: 140px 0 90px;
          }
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 1.05rem;
          }
          .circle-image-wrapper {
            width: 290px;
            height: 290px;
          }
        }
      `}</style>
    </div>
  );
};

export default LiabilityInsurance;
