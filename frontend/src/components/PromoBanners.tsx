import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api, { API_BASE_URL } from '../services/api';

const destinations = [
  {
    name: 'Arizona',
    subtitle: 'Exotic Canyon',
    bgImage: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800',
    brushImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    theme: 'dark-theme',
    parachuteColor: '#fe9d3d',
    parachuteStroke: '#d97706'
  },
  {
    name: 'California',
    subtitle: 'Pacific Coast',
    bgImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
    brushImage: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=800',
    theme: 'gradient-orange-blue',
    parachuteColor: '#ffffff',
    parachuteStroke: '#cbd5e1'
  },
  {
    name: 'Florida',
    subtitle: 'Sunny Palms',
    bgImage: 'https://images.unsplash.com/photo-1533727409240-279c656360a4?auto=format&fit=crop&q=80&w=800',
    brushImage: 'https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?auto=format&fit=crop&q=80&w=800',
    theme: 'gradient-purple-indigo',
    parachuteColor: '#c084fc',
    parachuteStroke: '#7e22ce'
  },
  {
    name: 'New Mexico',
    subtitle: 'Historic City',
    bgImage: 'https://images.unsplash.com/photo-1566838387310-b1012f6909bd?auto=format&fit=crop&q=80&w=800',
    brushImage: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=800',
    theme: 'gradient-emerald-green',
    parachuteColor: '#34d399',
    parachuteStroke: '#047857'
  },
  {
    name: 'New York',
    subtitle: 'Skyline Lights',
    bgImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800',
    brushImage: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80&w=800',
    theme: 'gradient-yellow-amber',
    parachuteColor: '#fbbf24',
    parachuteStroke: '#b45309'
  }
];

// Framer Motion spring transition variants for staggered organic entrance
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 80,
      damping: 15,
      delay: i * 0.12,
      staggerChildren: 0.12,
      delayChildren: i * 0.12 + 0.15
    }
  })
};

const textVariants = {
  hidden: { opacity: 0, x: 25 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 14 }
  }
};

const brushVariants = {
  hidden: { opacity: 0, scale: 0.65, rotate: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -3,
    transition: { type: 'spring' as const, stiffness: 70, damping: 11 }
  }
};

const parachuteVariants = {
  hidden: { opacity: 0, scale: 0.4, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 60, damping: 10, delay: 0.4 }
  }
};

const airplaneVariants = {
  hidden: { opacity: 0, x: -30, y: 20 },
  visible: {
    opacity: 0.75,
    x: 0,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 50, damping: 12, delay: 0.6 }
  }
};

const PromoBanners: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { data: dynamicDestinations = destinations } = useQuery({
    queryKey: ['destinations-states'],
    queryFn: async () => {
      const res = await api.get('/properties/states?stunning=1');
      if (res.data && res.data.length > 0) {
        return res.data.map((state: any, idx: number) => {
          const fallback = destinations[idx % destinations.length];
          return {
            id: state.id,
            name: state.name || fallback.name,
            subtitle: 'Exotic Location',
            bgImage: state.image || fallback.bgImage,
            brushImage: fallback.brushImage,
            theme: fallback.theme,
            parachuteColor: fallback.parachuteColor,
            parachuteStroke: fallback.parachuteStroke,
          };
        });
      }
      return destinations;
    },
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setVisibleCount(1);
      } else {
        setVisibleCount(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure index remains in bounds when screen resizes
  const maxIndex = Math.max(0, dynamicDestinations.length - visibleCount);
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <section ref={sectionRef} className="promo-banners-section">
      {/* SVG Clip Path Definition for Splatter Paint Brush Mask */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="brush-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.2,0.15 
                     C 0.35,0.06 0.65,0.02 0.8,0.12 
                     C 0.92,0.22 0.95,0.4 0.92,0.58 
                     C 0.88,0.76 0.82,0.92 0.68,0.96 
                     C 0.52,1.0 0.32,0.95 0.22,0.85 
                     C 0.12,0.75 0.05,0.55 0.08,0.35 
                     C 0.1,0.2 0.12,0.22 0.2,0.15 Z" />
            <circle cx="0.12" cy="0.18" r="0.025" />
            <circle cx="0.04" cy="0.45" r="0.015" />
            <circle cx="0.15" cy="0.88" r="0.02" />
            <circle cx="0.75" cy="0.08" r="0.018" />
            <circle cx="0.94" cy="0.32" r="0.022" />
            <circle cx="0.88" cy="0.82" r="0.015" />
          </clipPath>
        </defs>
      </svg>

      <div className="container compact-container">

        {/* Centered Heading */}
        <div className="dest-section-header">
          <p className="dest-section-subtitle">DISCOVER VILLAS</p>
          <h2 className="dest-section-title">Exotic Destinations</h2>
        </div>

        {/* Relative Slider Container */}
        <div className="slider-container-relative">

          {/* Navigation Controls */}
          <button
            className="control-btn prev-btn"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous destination"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className="control-btn next-btn"
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            aria-label="Next destination"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slider Window */}
          <div className="slider-track-wrapper">
            <motion.div
              className="slider-track"
              animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.8 }}
            >
              {dynamicDestinations.map((dest: any, index: number) => {
                const isActive = index >= currentIndex && index < currentIndex + visibleCount;
                return (
                  <motion.div
                    key={index}
                    onClick={() => dest.id ? navigate(`/listing/states/${dest.id}`) : null}
                    custom={index - currentIndex}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isSectionInView && isActive ? "visible" : "hidden"}
                    whileHover={{ y: -8, scale: 1.015, zIndex: 10 }}
                    whileTap={{ scale: 0.985 }}
                    className="promo-card"
                  >
                    {/* Background Image */}
                    <div className="card-bg-image-wrapper">
                      <img
                        src={dest.bgImage}
                        alt={`${dest.name} background`}
                        className="bg-blurred-img"
                      />
                      <div className={`bg-overlay ${dest.theme}`} />
                    </div>

                    {/* Split Content Wrapper */}
                    <div className="promo-split-wrapper">

                      {/* Left: Brush Masked Image & Parachute */}
                      <div className="promo-image-side">
                        <motion.div variants={brushVariants} className="brush-masked-container">
                          <img
                            src={dest.bgImage}
                            alt={`${dest.name} travel spotlight`}
                            className="brush-img"
                          />
                        </motion.div>

                        {/* Floating Parachute Icon */}
                        <motion.div variants={parachuteVariants} className="floating-parachute">
                          <svg viewBox="0 0 64 64" width="44" height="44" className="parachute-svg">
                            <line x1="32" y1="52" x2="16" y2="32" stroke={dest.parachuteColor} strokeWidth="1.5" opacity="0.8" />
                            <line x1="32" y1="52" x2="24" y2="32" stroke={dest.parachuteColor} strokeWidth="1.5" opacity="0.8" />
                            <line x1="32" y1="52" x2="40" y2="32" stroke={dest.parachuteColor} strokeWidth="1.5" opacity="0.8" />
                            <line x1="32" y1="52" x2="48" y2="32" stroke={dest.parachuteColor} strokeWidth="1.5" opacity="0.8" />
                            <path d="M 12 32 C 12 16, 52 16, 52 32 C 46 32, 44 26, 38 28 C 34 30, 30 30, 26 28 C 20 26, 18 32, 12 32 Z" fill={dest.parachuteColor} stroke={dest.parachuteStroke} strokeWidth="1.5" />
                            <rect x="30" y="50" width="4" height="4" rx="1" fill={dest.parachuteStroke} />
                          </svg>
                        </motion.div>
                      </div>

                      {/* Right: State/Country Label */}
                      <div className="promo-text-side">
                        <motion.span variants={textVariants} className="promo-script cursive-white">{dest.subtitle}</motion.span>
                        <motion.h2 variants={textVariants} className="promo-dest-name">{dest.name}</motion.h2>
                      </div>

                    </div>

                    {/* Flying Paper Airplane Decoration */}
                    <motion.div variants={airplaneVariants} className="decoration-airplane-wrapper">
                      <svg viewBox="0 0 150 100" className="airplane-svg" width="100" height="68">
                        <path
                          d="M 10 90 C 35 85, 50 50, 70 50 C 90 50, 95 75, 110 75 C 125 75, 130 45, 138 35"
                          fill="none"
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <g transform="translate(134, 30) rotate(-25) scale(0.6)">
                          <polygon points="0,0 20,-10 10,-3" fill="#ffffff" />
                          <polygon points="10,-3 20,-10 12,-12" fill="#cbd5e1" />
                          <polygon points="0,0 10,-3 8,-1" fill="#94a3b8" />
                        </g>
                      </svg>
                    </motion.div>

                  </motion.div>
                )
              })}
            </motion.div>
          </div>

        </div>

        {/* Expanding Pill Indicators */}
        <div className="slider-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`dot-btn ${currentIndex === i ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

        .promo-banners-section { 
          padding: 80px 0; 
          background: #ffffff; 
          position: relative;
        }
        
        .compact-container { 
          max-width: 1100px; 
          margin: 0 auto; 
          padding: 0 20px; 
        }

        .dest-section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .dest-section-title {
          font-size: 36px;
          font-weight: 500;
          color: #0f172a;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .dest-section-subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0;
        }

        /* SLIDER CONTAINER */
        .slider-container-relative {
          position: relative;
          width: 100%;
        }

        .slider-track-wrapper {
          overflow: hidden;
          width: 100%;
          border-radius: 28px;
          padding: 10px 0;
        }

        .slider-track {
          display: flex;
          gap: 24px;
        }

        /* CARDS */
        .promo-card { 
          flex-shrink: 0;
          width: calc(50% - 12px); /* 2 cards side by side on desktop minus gap */
          position: relative; 
          height: 280px; 
          border-radius: 24px; 
          overflow: hidden; 
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
          border: 1px solid #f1f5f9;
          cursor: pointer;
          transition: box-shadow 0.3s ease;
        }

        .promo-card:hover {
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
        }

        /* BACKGROUNDS */
        .card-bg-image-wrapper {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .bg-blurred-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(5px) scale(1.05);
        }

        .bg-overlay {
          position: absolute;
          inset: 0;
          transition: opacity 0.3s ease;
        }

        .bg-overlay.dark-theme {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%);
        }

        .bg-overlay.gradient-orange-blue {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.78) 0%, rgba(59, 130, 246, 0.78) 100%);
          mix-blend-mode: multiply;
        }

        .bg-overlay.gradient-purple-indigo {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.78) 0%, rgba(99, 102, 241, 0.78) 100%);
          mix-blend-mode: multiply;
        }

        .bg-overlay.gradient-emerald-green {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.78) 0%, rgba(6, 78, 59, 0.78) 100%);
          mix-blend-mode: multiply;
        }

        .bg-overlay.gradient-yellow-amber {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.78) 0%, rgba(180, 83, 9, 0.78) 100%);
          mix-blend-mode: multiply;
        }

        /* SPLIT CONTENT WRAPPER */
        .promo-split-wrapper {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          padding: 0 45px;
        }

        /* IMAGE SIDE (LEFT) */
        .promo-image-side {
          flex: 1;
          position: relative;
          height: 80%;
          display: flex;
          align-items: center;
        }

        .brush-masked-container {
          width: 100%;
          height: 100%;
          max-width: 170px;
          overflow: hidden;
          clip-path: url(#brush-clip);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .brush-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.08);
          transition: transform 0.5s ease;
        }

        .promo-card:hover .brush-img {
          transform: scale(1.15);
        }

        /* FLOATING PARACHUTE */
        .floating-parachute {
          position: absolute;
          bottom: -5px;
          right: 15px;
          z-index: 3;
          animation: floatParachute 4s infinite alternate ease-in-out;
          transform-origin: center;
        }

        @keyframes floatParachute {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-6px) rotate(5deg); }
        }

        /* TEXT SIDE (RIGHT) */
        .promo-text-side {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-left: 25px;
        }

        .promo-script {
          font-family: 'Caveat', 'Dancing Script', 'Brush Script MT', cursive;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 5px;
          display: block;
        }

        .cursive-white {
          color: #ffffff;
          opacity: 0.9;
        }

        .promo-dest-name {
          font-size: 38px;
          font-weight: 900;
          color: #ffffff;
          margin: 0;
          position: relative;
          display: inline-block;
          padding-bottom: 5px;
          letter-spacing: -0.5px;
        }

        /* Hover animation line below the country text */
        .promo-dest-name::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 3px;
          background-color: #ffffff;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease-in-out;
        }

        .promo-card:hover .promo-dest-name::after {
          transform: scaleX(1);
        }

        /* AIRPLANE DECORATION */
        .decoration-airplane-wrapper {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 2;
          pointer-events: none;
        }

        .airplane-svg {
          display: block;
        }

        /* NAVIGATION BUTTONS */
        .control-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          cursor: pointer;
          z-index: 10;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .control-btn:hover:not(:disabled) {
          background: #ffffff;
          color: #3b82f6;
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.15);
        }

        .control-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          box-shadow: none;
        }

        .prev-btn {
          left: -24px;
        }

        .next-btn {
          right: -24px;
        }

        /* EXPANDING PILL DOTS */
        .slider-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 35px;
        }

        .dot-btn {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e2e8f0;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .dot-btn.active {
          background: #3b82f6;
          width: 24px;
          border-radius: 4px;
        }

        /* RESPONSIVENESS */
        @media (max-width: 992px) {
          .promo-card { 
            width: 100%; /* Show 1 card on tablet/mobile */
          }
          .prev-btn { left: -10px; }
          .next-btn { right: -10px; }
        }
        
        @media (max-width: 576px) {
          .promo-split-wrapper { 
            flex-direction: column; 
            padding: 25px 20px;
            justify-content: center;
            gap: 15px;
          }
          .promo-image-side { 
            display: none; 
          }
          .promo-text-side {
            align-items: center;
            text-align: center;
            padding-left: 0;
          }
          .control-btn {
            width: 40px;
            height: 40px;
          }
          .prev-btn { left: 0; }
          .next-btn { right: 0; }
        }
      `}</style>
    </section>
  );
};

export default PromoBanners;
