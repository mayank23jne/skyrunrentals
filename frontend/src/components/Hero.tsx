import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import local assets
import hero1 from '../assets/hero-1.jpg';
import hero2 from '../assets/hero-2.jpg';
import airplaneBig from '../assets/airplane-big.png';

const slides = [
  {
    subtitle: "The Perfect Choice for Family",
    title: "Begin Your Next \n Adventure Today !",
    description: "",
    image: hero1
  },
  {
    subtitle: "Best Choice for Family",
    title: "Discover Your Next \n Adventure Today !",
    description: "",
    image: hero2
  }
];
import SearchBar from './SearchBar';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);


  return (
    <section className="hero-section">
      {/* Background Images with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="hero-bg"
        >
          <img
            src={slides[currentSlide].image}
            alt="Hero Background"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Decorative Airplane */}
      <img src={airplaneBig} alt="Plane Icon" className='plane-icon' />

      <div className="container hero-content">
        <div className="hero-text-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
            >
              <p className="hero-subtitle">{slides[currentSlide].subtitle}</p>
              <h1 className="hero-title">
                {slides[currentSlide].title.split('\n').map((line, i) => (
                  <React.Fragment key={i}>{line}<br /></React.Fragment>
                ))}
              </h1>
              <p className="hero-description">
                {slides[currentSlide].description.split('\n').map((line, i) => (
                  <React.Fragment key={i}>{line}<br /></React.Fragment>
                ))}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="explore-btn"
                onClick={() => navigate('/list-property')}
              >
                Explore More <span className="arrow">→</span>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Arrows */}
        <button className="carousel-arrow left" onClick={prevSlide}>
          <ChevronLeft size={32} />
        </button>
        <button className="carousel-arrow right" onClick={nextSlide}>
          <ChevronRight size={32} />
        </button>

        {/* Search Bar at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-search-wrapper"
        >
          <div>
            <SearchBar className="hero-search-bar" />
          </div>
        </motion.div>
      </div>

      <style>{`
        .hero-section { position: relative; height: 100vh; min-height: 950px; display: flex; align-items: center; justify-content: center; background: #000; padding-bottom: 100px; z-index: 20; }
        .hero-bg { position: absolute; inset: 0; z-index: 1; }
        .hero-bg img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); z-index: 1; }
        .hero-content { position: relative; z-index: 99; text-align: center; width: 100%; }
        
        /* Airplane Decoration */
        .plane-icon { width: 225px; position: absolute; bottom: 110px; left: 0; z-index: 1; }
        
        .hero-text-wrapper { margin-bottom: 40px; margin-top: -100px; }
        .hero-subtitle { color: var(--accent); font-family: var(--subtitlefont); font-size: 23px; font-weight: 400; margin-bottom: 22px; letter-spacing: 1px; }
        .hero-title { font-size: 60px; font-weight: 900; color: white; line-height: 1.1; margin-bottom: 28px; letter-spacing: -2px; text-shadow: 0 10px 40px rgba(0,0,0,0.4); }
        .hero-description { color: white; font-size: 17px; font-weight: 500; line-height: 1.7; margin-bottom: 50px; opacity: 0.95; max-width: 800px; margin-left: auto; margin-right: auto; }
        .explore-btn { background: var(--accent); color: white; padding: 24px 54px; border-radius: 9999px; font-size: 19px; font-weight: 900; display: inline-flex; align-items: center; gap: 10px; transition: all 0.3s ease; box-shadow: 0 10px 30px rgba(255, 156, 69, 0.4); border: none; cursor: pointer; }
        .explore-btn:hover { background: white; color: #1a1a1a; transform: translateY(-5px); }
        
        .carousel-arrow { position: absolute; top: 50%; width: 75px; height: 75px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--secondary); border: none; transition: all 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.1); cursor: pointer; z-index: 20; }
        .carousel-arrow:hover { background: var(--accent); color: white; }
        .carousel-arrow.left { left: 40px; }
        .carousel-arrow.right { right: 40px; }
        
        /* Search Filter Styling */
        .hero-search-wrapper { position: absolute; bottom: -59%; left: 50%; transform: translate(-50%, 45px) !important; width: 95%; max-width: 1100px; z-index: 1005; }
        .hero-search-bar { border-radius: 12px; }
        
        @media (max-width: 1024px) {
          .hero-title { font-size: 40px; }
          .hero-subtitle { font-size: 20px; }
          .carousel-arrow, .airplane-decoration { display: none; }
          .hero-search-wrapper { position: relative; transform: none !important; left: auto; bottom: auto; margin-top: 40px; }
        }
        @media (max-width: 768px) {
          .hero-section { min-height: 800px; padding-bottom: 50px; }
          .hero-text-wrapper { margin-top: -50px; padding: 0 15px; }
          .hero-title { font-size: 32px; letter-spacing: -1px; }
          .hero-subtitle { font-size: 16px; margin-bottom: 12px; }
          .hero-description { font-size: 14px; margin-bottom: 30px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; padding: 0 10px; }
          .explore-btn { padding: 16px 32px; font-size: 16px; }
          .hero-search-wrapper { width: 100%; padding: 0 10px; margin-top: 20px; }
          .plane-icon { display: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
