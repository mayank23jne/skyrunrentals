import React from 'react';
import { motion } from 'framer-motion';
import { useAuthModal } from '../context/AuthModalContext';
import { useAuth } from '../context/AuthContext';

const RegisterCTA: React.FC = () => {
  const { openAuthModal } = useAuthModal();
  const { isLoggedIn } = useAuth();

  const handleRegisterClick = () => {
    if (isLoggedIn) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      openAuthModal('register');
    }
  };
  return (
    <section className="register-cta-section">
      <div className="container">

        {/* Floating Glossy Glass Card with Ambient Glows */}
        <motion.div
          className="cta-card-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: 'spring' as const, stiffness: 80, damping: 15 }}
          whileHover={{ y: -4 }}
        >
          {/* Animated Background Geometric Vector Lines & Blobs */}
          <div className="cta-shapes-bg">
            <div className="gradient-blob-1" />
            <div className="gradient-blob-2" />
            <div className="diagonal-grid" />
            <div className="light-glow" />
          </div>

          <div className="cta-content-grid">

            {/* LEFT: Animated Chat Bubble Badge */}
            <div className="cta-icon-column">
              <div className="outer-pulse-ring">
                <div className="inner-glow-circle">
                  <div className="chat-bubble-container">
                    {/* Double Chat Bubble Custom SVG */}
                    <svg viewBox="0 0 100 100" className="chat-bubble-svg" width="68" height="68">
                      {/* Dark back bubble */}
                      <path
                        d="M 68 62 C 68 68, 60 74, 50 74 C 47 74, 44 73, 41 71.5 L 31 75.5 L 34 66 C 29.5 61.5, 27.5 55.5, 29.5 50.5 M 50 25 C 67.5 25, 80 34.5, 80 47.5 C 80 54, 76 60, 68 62"
                        fill="none"
                        stroke="#1e3a8a"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="bg-bubble"
                      />
                      {/* Front white glowing bubble */}
                      <path
                        d="M 20 42.5 C 20 29.5, 32.5 20, 50 20 C 67.5 20, 80 29.5, 80 42.5 C 80 55.5, 67.5 65, 50 65 C 45 65, 40 63.8, 35.5 61.5 L 20 66.5 L 24.5 52.5 C 21.5 49.5, 20 46, 20 42.5 Z"
                        fill="#ffffff"
                        className="front-bubble"
                        filter="drop-shadow(0 4px 12px rgba(255,255,255,0.15))"
                      />

                      {/* Staggered Pulsing Chat Dots */}
                      <circle cx="38" cy="42.5" r="3.5" fill="#3b82f6" className="chat-dot dot-1" />
                      <circle cx="50" cy="42.5" r="3.5" fill="#2563eb" className="chat-dot dot-2" />
                      <circle cx="62" cy="42.5" r="3.5" fill="#1d4ed8" className="chat-dot dot-3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* MIDDLE: Text Copy Area */}
            <div className="cta-text-column">
              <span className="cta-handwritten">Start hosting today</span>
              <h2 className="cta-title">Register To Holiday Haven</h2>
              <p className="cta-description">
                At home, at a small business, or a large property—your hosting business runs better
                when we automatically distribute, manage, and optimize your listings across all channels.
              </p>
            </div>

            {/* RIGHT: Register CTA Button Area */}
            <div className="cta-button-column">
              <motion.button
                className="cta-register-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRegisterClick}
              >
                <span className="btn-glow-layer" />
                <span className="btn-text">Register Now</span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" className="arrow-icon">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.button>
            </div>

          </div>
        </motion.div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

        .register-cta-section {
          padding: 30px 0 80px 0;
          background: #ffffff;
          overflow: hidden;
          position: relative;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* CARD CONTAINER */
        .cta-card-wrapper {
          background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          padding: 35px 45px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15), 
                      0 0 80px rgba(37, 99, 235, 0.1) inset;
          transition: border-color 0.3s ease;
        }

        .cta-card-wrapper:hover {
          border-color: rgba(59, 130, 246, 0.25);
        }

        /* VECTOR SHAPES BACKGROUND */
        .cta-shapes-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          pointer-events: none;
        }

        .gradient-blob-1 {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
          top: -150px;
          left: -100px;
          filter: blur(30px);
        }

        .gradient-blob-2 {
          position: absolute;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%);
          bottom: -120px;
          right: 15%;
          filter: blur(25px);
        }

        .light-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.02), transparent);
        }

        /* Geometric diagonal shards from screenshot 1 */
        .diagonal-grid {
          position: absolute;
          top: 0;
          right: 0;
          width: 35%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                      linear-gradient(225deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%);
          background-size: 40px 40px;
          opacity: 0.85;
          mask-image: linear-gradient(to left, black, transparent);
          -webkit-mask-image: linear-gradient(to left, black, transparent);
        }

        /* CONTENT GRID */
        .cta-content-grid {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 35px;
          position: relative;
          z-index: 1;
        }

        /* ICON COLUMN (LEFT) */
        .cta-icon-column {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .outer-pulse-ring {
          width: 90px;
          height: 90px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
        }

        .inner-glow-circle {
          width: 76px;
          height: 76px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(30, 58, 138, 0.5) 100%);
          border-radius: 50%;
          border: 1.5px solid rgba(59, 130, 246, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .chat-bubble-container {
          position: relative;
          transform: translateY(2px);
        }

        .chat-bubble-svg {
          overflow: visible;
        }

        .bg-bubble {
          opacity: 0.35;
        }

        /* Animated Staggered Blinking Dots */
        .chat-dot {
          animation: blinkDot 1.4s infinite ease-in-out;
          transform-origin: center;
        }

        .dot-1 { animation-delay: 0s; }
        .dot-2 { animation-delay: 0.2s; }
        .dot-3 { animation-delay: 0.4s; }

        @keyframes blinkDot {
          0%, 100% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.25); opacity: 1; fill: #60a5fa; }
        }

        /* TEXT COLUMN (MIDDLE) */
        .cta-text-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .cta-handwritten {
          font-family: 'Caveat', cursive;
          font-size: 22px;
          font-weight: 700;
          color: #f97316; /* Bright Warm Orange */
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }

        .cta-title {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px 0;
          letter-spacing: -0.5px;
          font-family: 'Inter', sans-serif;
        }

        .cta-description {
          font-size: 14.5px;
          line-height: 1.5;
          color: #93c5fd; /* Soft Blue */
          margin: 0;
          max-width: 550px;
          font-weight: 400;
        }

        /* BUTTON COLUMN (RIGHT) */
        .cta-button-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .cta-register-btn {
          background: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15),
                      0 4px 12px rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-glow-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .btn-text, .arrow-icon {
          position: relative;
          z-index: 1;
        }

        .arrow-icon {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cta-register-btn:hover {
          color: #ffffff;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.3),
                      0 0 15px rgba(37, 99, 235, 0.2);
        }

        .cta-register-btn:hover .btn-glow-layer {
          opacity: 1;
        }

        .cta-register-btn:hover .arrow-icon {
          transform: translateX(4px);
        }

        .btn-helper-text {
          font-size: 11px;
          font-weight: 600;
          color: #60a5fa;
          letter-spacing: 0.2px;
        }

        /* RESPONSIVE LAYOUT */
        @media (max-width: 992px) {
          .cta-content-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 24px;
          }

          .cta-icon-column, .cta-text-column, .cta-button-column {
            align-items: center;
            text-align: center;
          }

          .cta-description {
            max-width: 100%;
          }

          .diagonal-grid {
            width: 100%;
            mask-image: radial-gradient(circle, black, transparent);
            -webkit-mask-image: radial-gradient(circle, black, transparent);
          }
        }

        @media (max-width: 576px) {
          .cta-card-wrapper {
            padding: 25px 20px;
          }
          .cta-title {
            font-size: 24px;
          }
          .cta-register-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default RegisterCTA;
