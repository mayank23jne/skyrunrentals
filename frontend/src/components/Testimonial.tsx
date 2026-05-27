import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

import { API_BASE_URL } from '../services/api';

const API_BASE = `${API_BASE_URL}/api`;
const UPLOADS_BASE = `${API_BASE_URL}/uploads/feedback/`;

interface Feedback {
  id: number;
  name: string;
  feedbackMessage: string;
  userImage: string;
  rating: string;
}

const Testimonial: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Feedback[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[index];

  if (loading) return null;
  if (testimonials.length === 0) return null;

  return (
    <section className="testimonial-section">
      {/* Decorative Background Patterns */}
      <div className="decor-patterns">
        <div className="pattern pattern-1"></div> {/* Concentric semi-circles top left */}
        <div className="pattern pattern-2"></div> {/* Geometric squares center left */}
        <div className="pattern pattern-3"></div> {/* Wireframe cube center right */}
        <div className="pattern pattern-4"></div> {/* Wavy lines bottom right */}
        <div className="pattern pattern-5"></div> {/* Dots pattern */}
      </div>

      <div className="container">
        <div className="section-header">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="section-subtitle"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Our Valuable Customer Says
          </motion.h2>
        </div>

        <div className="testimonial-grid">
          {/* Content Side */}
          <div className="testimonial-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="stars-row">
                  {[...Array(Math.round(parseFloat(t.rating)))].map((_, i) => (
                    <Star key={i} size={18} fill="#f97316" color="#f97316" />
                  ))}
                </div>

                <div
                  className="testimonial-text"
                  dangerouslySetInnerHTML={{ __html: t.feedbackMessage }}
                />

                <div className="author-info">
                  <h4 className="author-name">{t.name}</h4>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="quote-icon-box">
              <Quote size={32} fill="white" color="white" />
            </div>

            {/* Navigation Buttons */}
            <div className="nav-buttons">
              <button className="nav-btn" onClick={prev}><ChevronLeft size={20} /></button>
              <button className="nav-btn" onClick={next}><ChevronRight size={20} /></button>
            </div>
          </div>

          {/* Image Side */}
          <div className="testimonial-image-box">
            <div className="image-wrapper">
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.id}
                  className="img-circle-container"
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  // exit={{ opacity: 0, scale: 0.8, x: -50 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <img
                    src={t.userImage}
                    alt={t.name}
                    className="traveler-img"
                  />
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Pagination Dots */}
            <div className="pagination-dots">
              {testimonials.map((_, i) => (
                <div key={i} className={`dot ${i === index ? 'active' : ''}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .testimonial-section {
          padding: 120px 0;
          background: #fdfdfd;
          position: relative;
          overflow: hidden;
        }

        /* Complex Decorative Patterns */
        .decor-patterns .pattern {
          position: absolute;
          pointer-events: none;
          opacity: 0.1;
        }

        .pattern-1 {
          top: 0;
          left: 0;
          width: 300px;
          height: 300px;
          background-image: radial-gradient(circle at 0 0, transparent 40%, #cbd5e1 41%, #cbd5e1 42%, transparent 43%);
          background-size: 40px 40px;
        }

        .pattern-2 {
          top: 40%;
          left: 10%;
          width: 150px;
          height: 150px;
          background: repeating-linear-gradient(45deg, #cbd5e1, #cbd5e1 2px, transparent 2px, transparent 15px);
        }

        .pattern-3 {
          top: 20%;
          right: 5%;
          width: 250px;
          height: 250px;
          border: 1px solid #cbd5e1;
          transform: perspective(500px) rotateY(45deg) rotateX(10deg);
        }

        .pattern-4 {
          bottom: 50px;
          right: 10%;
          width: 200px;
          height: 100px;
          background-image: radial-gradient(circle at 10px 10px, #cbd5e1 2px, transparent 0);
          background-size: 20px 20px;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }


        .testimonial-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 60px;
        }

        .testimonial-content {
          position: relative;
          padding-right: 40px;
        }

        .stars-row {
          display: flex;
          gap: 6px;
          margin-bottom: 30px;
        }

        .testimonial-text {
          font-size: 22px;
          font-weight: 600;
          color: #475569;
          line-height: 1.7;
          font-style: italic;
          margin-bottom: 45px;
          font-family: 'Outfit', sans-serif;
          max-width: 700px;
        }

        .author-info {
          margin-bottom: 20px;
        }

        .author-name {
          font-size: 18px;
          font-weight: 800;
          color: #3b82f6;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }

        .author-role {
          font-size: 15px;
          color: #94a3b8;
          font-weight: 600;
        }

        .quote-icon-box {
          position: absolute;
          right: 15%;
          bottom: 10%;
          width: 70px;
          height: 70px;
          background: #f97316;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 30px rgba(249, 115, 22, 0.25);
        }

        .nav-buttons {
          display: flex;
          gap: 20px;
          margin-top: 50px;
        }

        .nav-btn {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: white;
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }

        .nav-btn:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        /* Image Side Refining */
        .testimonial-image-box {
          display: flex;
          justify-content: center;
          position: relative;
        }

        .image-wrapper {
          position: relative;
          width: 296px;
          height: 440px;
        }

        .img-circle-container {
          width: 100%;
          height: 100%;
          border-radius: 220px 220px 0 220px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0,0,0,0.12);
        }

        .traveler-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .location-badge {
          position: absolute;
          top: 30px;
          left: -30px;
          background: #ffffff;
          padding: 12px 26px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          font-weight: 700;
          color: #f97316;
          font-size: 15px;
          z-index: 10;
        }

        .pagination-dots {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 30px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3b82f6;
          opacity: 0.1;
        }

        .dot.active {
          opacity: 1;
        }

        @media (max-width: 1100px) {
          .testimonial-grid { gap: 40px; }
          .image-wrapper { width: 340px; height: 340px; }
          .testimonial-text { font-size: 19px; }
          .header-title { font-size: 38px; }
        }

        @media (max-width: 992px) {
          .testimonial-grid { grid-template-columns: 1fr; gap: 60px; }
          .testimonial-image-box { order: 1; }
          .testimonial-content { order: 2; text-align: center; padding-right: 0; }
          .stars-row { justify-content: center; }
          .nav-buttons { justify-content: center; }
          .quote-icon-box { display: none; }
          .location-badge { left: 50%; transform: translateX(-50%); top: -15px; }
          .testimonial-text { margin-left: auto; margin-right: auto; }
        }

        @media (max-width: 576px) {
          .image-wrapper { width: 260px; height: 260px; }
          .header-title { font-size: 32px; }
        }
      `}</style>
    </section>
  );
};

export default Testimonial;
