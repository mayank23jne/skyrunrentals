import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show/hide button based on scroll position
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate scroll progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circle properties
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
    >
      <svg className="progress-circle" width="50" height="50" viewBox="0 0 50 50">
        <circle
          className="progress-bg"
          cx="25"
          cy="25"
          r={radius}
        />
        <circle
          className="progress-bar"
          cx="25"
          cy="25"
          r={radius}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      <div className="arrow-icon">
        <ArrowUp size={20} />
      </div>

      <style>{`
        .back-to-top {
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 50px;
          height: 50px;
          cursor: pointer;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back-to-top.visible {
          opacity: 1;
          visibility: visible;
        }

        .progress-circle {
          position: absolute;
          top: 0;
          left: 0;
          transform: rotate(-90deg);
        }

        .progress-bg {
          fill: transparent;
          stroke: transparent;
          stroke-width: 2;
        }

        .progress-bar {
          fill: none;
          stroke: #2e80ec;
          stroke-width: 2;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.1s linear;
        }

        .arrow-icon {
          position: relative;
          z-index: 2;
          color: #2e80ec;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .back-to-top:hover .arrow-icon {
          transform: translateY(-3px);
        }

        .back-to-top:hover {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .back-to-top {
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default BackToTop;
