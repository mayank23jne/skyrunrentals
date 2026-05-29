import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../services/api';

const API_BASE = `${API_BASE_URL}/api`;

interface Feedback {
  id: number;
  name: string;
  feedbackMessage: string;
  userImage: string;
  rating: string;
}

const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/public/settings/feedback`)
      .then((res) => res.json())
      .then((data: Feedback[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="testimonials-page-wrapper">
        {/* Decorative Background */}
        <div className="decor-patterns">
          <div className="pattern pattern-1"></div>
          <div className="pattern pattern-2"></div>
        </div>

        <div className="container">
          <div className="page-header">
            <button
              onClick={() => navigate(-1)}
              className="back-btn"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="header-content"
            >
              <span className="section-subtitle">Customer Voices</span>
              <h1 className="page-title">What Our Guests Say</h1>
              <p className="page-desc">
                Discover why thousands of travelers trust us to deliver unforgettable vacation experiences around the world.
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="empty-state">
              <p>No testimonials available yet.</p>
            </div>
          ) : (
            <div className="testimonials-grid">
              <AnimatePresence>
                {testimonials.map((t, idx) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="testimonial-card"
                  >
                    <div className="quote-icon">
                      <Quote size={24} fill="var(--accent)" color="var(--accent)" opacity={0.2} />
                    </div>
                    
                    <div className="card-header">
                      <div className="user-image-wrap">
                        <img src={t.userImage} alt={t.name} className="user-image" />
                      </div>
                      <div className="user-meta">
                        <h4 className="user-name">{t.name}</h4>
                        <div className="stars-row">
                          {[...Array(Math.round(parseFloat(t.rating)))].map((_, i) => (
                            <Star key={i} size={14} fill="#f97316" color="#f97316" />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className="feedback-text"
                      dangerouslySetInnerHTML={{ __html: t.feedbackMessage }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style>{`
        .testimonials-page-wrapper {
          padding: 140px 0 100px;
          background: #f8fafc;
          min-height: calc(100vh - 400px);
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }

        .decor-patterns .pattern {
          position: absolute;
          pointer-events: none;
          opacity: 0.05;
        }

        .pattern-1 {
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: var(--primary);
          filter: blur(100px);
        }

        .pattern-2 {
          bottom: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: var(--accent);
          filter: blur(120px);
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }

        .page-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
        }

        .back-btn {
          position: absolute;
          left: 0;
          top: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 50px;
          padding: 8px 20px;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }

        .back-btn:hover {
          background: #f1f5f9;
          color: var(--primary);
          border-color: #cbd5e1;
        }

        .header-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .section-subtitle {
          color: var(--accent);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 13px;
          display: block;
          margin-bottom: 12px;
        }

        .page-title {
          font-size: 42px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
        }

        .page-desc {
          font-size: 16px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }

        .testimonial-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06);
          position: relative;
          border: 1px solid #f1f5f9;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px -10px rgba(0,0,0,0.1);
        }

        .quote-icon {
          position: absolute;
          top: 25px;
          right: 30px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .user-image-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          overflow: hidden;
          background: #f1f5f9;
          flex-shrink: 0;
        }

        .user-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-name {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
        }

        .stars-row {
          display: flex;
          gap: 3px;
        }

        .feedback-text {
          font-size: 15px;
          color: #475569;
          line-height: 1.7;
          font-style: italic;
          flex-grow: 1;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 80px 0;
          color: #64748b;
          font-size: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .testimonials-page-wrapper {
            padding: 100px 0 60px;
          }
          .page-title {
            font-size: 32px;
          }
          .back-btn {
            position: relative;
            margin: 0 auto 30px;
            width: fit-content;
          }
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default TestimonialsPage;
