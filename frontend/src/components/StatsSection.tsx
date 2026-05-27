import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  {
    icon: (
      <svg
        width="55"
        height="55"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circle */}
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="#F59A3D"
          strokeWidth="1.6"
        />

        {/* Eyes */}
        <circle cx="9" cy="10" r="0.9" fill="#F59A3D" />
        <circle cx="15" cy="10" r="0.9" fill="#F59A3D" />

        {/* Neutral Mouth */}
        <line
          x1="8.5"
          y1="15"
          x2="15.5"
          y2="15"
          stroke="#F59A3D"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    value: '85974+',
    label: 'Satisfied Clients'
  },
  {
    // icon: (
    //   <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="#ff9c45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    //     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    //     <line x1="4" y1="4" x2="7" y2="7" />
    //     <line x1="2" y1="7" x2="4" y2="9" />
    //     <line x1="7" y1="2" x2="9" y2="4" />
    //   </svg>
    // ),
    icon: (
      <svg
        width="55"
        height="55"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shooting Lines */}
        <line
          x1="4"
          y1="16"
          x2="8"
          y2="12"
          stroke="#F59A3D"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <line
          x1="7"
          y1="19"
          x2="11"
          y2="15"
          stroke="#F59A3D"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <line
          x1="6"
          y1="11"
          x2="8.5"
          y2="8.5"
          stroke="#F59A3D"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Star */}
        <path
          d="M16 4.2
         L17.8 7.8
         L21.8 8.4
         L18.9 11.2
         L19.6 15.1
         L16 13.2
         L12.4 15.1
         L13.1 11.2
         L10.2 8.4
         L14.2 7.8
         L16 4.2Z"
          stroke="#F59A3D"
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
    value: '9875+',
    label: 'Positive Review'
  },
  {
    icon: (
      <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="#ff9c45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22h10c0-1.76-.85-3.25-2.03-4.21-.5-.23-.97-.66-.97-1.21v-2.34" />
      </svg>
    ),
    value: '854+',
    label: 'Winning Awards'
  },
  {
    icon: (
      <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="#ff9c45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M7 8h5" />
        <path d="M7 12h3" />
        <circle cx="16" cy="14" r="3" />
        <path d="M15 17l-1 2 2-1 2 1-1-2" />
      </svg>
    ),
    value: '24+',
    label: (
      <>
        Years<br />Experience
      </>
    )
  }
];

const StatsSection: React.FC = () => {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Our Statistics</span>
          <h2 className="section-title">Some Important Facts <br /> About Our Company</h2>
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="stat-item"
            >
              <div className="stat-circle-container">
                <div className="stat-ring ring-outer"></div>
                <div className="stat-ring ring-inner"></div>
                <div className="stat-content">
                  <div className="stat-icon-wrapper">
                    {stat.icon}
                  </div>
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-section {
          padding: 120px 0;
          background: #ffffff;
        }
        
        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        
        .stat-item {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .stat-circle-container {
          position: relative;
          width: 280px;
          height: 280px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.5s ease;
        }
        
        .stat-circle-container:hover {
          transform: translateY(-10px);
        }
        
        .stat-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .ring-outer { width: 100%; height: 100%; border-color: rgba(59, 130, 246, 0.08); }
        .ring-inner { width: 90%; height: 90%; border-color: rgba(59, 130, 246, 0.12); }
        
        .stat-content {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .stat-icon-wrapper {
          margin-bottom: 15px;
        }
        
        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 62px;
          font-weight: 900;
          color: #3b82f6;
          margin: 0;
          line-height: 1;
          letter-spacing: -1.5px;
          /* Premium Hollow Blue Design */
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #3b82f6;
          filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.1));
        }
        
        .stat-label {
          font-size: 17px;
          font-weight: 700;
          color: #1e293b;
          margin-top: 15px;
          line-height: 1.2;
          font-family: 'Outfit', sans-serif;
        }
        
        @media (max-width: 1200px) {
          .stat-circle-container { width: 230px; height: 230px; }
          .stat-value { font-size: 48px; -webkit-text-stroke-width: 1.8px; }
        }
        
        @media (max-width: 992px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
        }
        
        @media (max-width: 576px) {
          .stats-grid { grid-template-columns: 1fr; }
          .stat-circle-container { width: 260px; height: 260px; }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;






