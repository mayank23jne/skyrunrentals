import React from 'react';

const partners = [
  {
    id: 1,
    name: (
      <span className="brand-name">
        Rentalcars<span className="brand-sub">.com</span>
      </span>
    ),
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="8" r="2.5" fill="#3b82f6" />
        <circle cx="16" cy="8" r="2.5" fill="#3b82f6" />
        <path d="M5 14C5 11.8 6.8 10 9 10H15C17.2 10 19 11.8 19 14C19 16.2 17.2 18 15 18H9C6.8 18 5 16.2 5 14Z" fill="#2563eb" />
        <circle cx="12" cy="14" r="1.5" fill="#ffffff" />
      </svg>
    )
  },
  {
    id: 2,
    name: <span className="brand-name lowercase">sedgwick</span>,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.5" stroke="#475569" strokeWidth="2" />
        <path d="M12 2.5C14.5 5.5 15.5 8.5 15.5 12C15.5 15.5 14.5 18.5 12 21.5C9.5 18.5 8.5 15.5 8.5 12C8.5 8.5 9.5 5.5 12 2.5Z" stroke="#64748b" strokeWidth="1.5" />
        <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#64748b" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 3,
    name: <span className="brand-name lowercase">trivago</span>,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ overflow: 'visible' }}>
        <circle cx="8" cy="12" r="5.5" fill="#f97316" fillOpacity="0.85" />
        <circle cx="16" cy="10" r="5.5" fill="#3b82f6" fillOpacity="0.85" />
        <circle cx="13" cy="14" r="5.5" fill="#10b981" fillOpacity="0.85" />
      </svg>
    )
  },
  {
    id: 4,
    name: (
      <div className="brand-column">
        <span className="brand-name uppercase">NOMAD</span>
        <span className="brand-desc uppercase">TEMPORARY HOUSING</span>
      </div>
    ),
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="12" r="1.5" fill="#64748b" />
        <circle cx="9" cy="8" r="1.5" fill="#64748b" />
        <circle cx="9" cy="16" r="1.5" fill="#64748b" />
        <circle cx="12" cy="5" r="1.5" fill="#3b82f6" />
        <circle cx="12" cy="12" r="2.5" fill="#2563eb" />
        <circle cx="12" cy="19" r="1.5" fill="#3b82f6" />
        <circle cx="15" cy="8" r="1.5" fill="#64748b" />
        <circle cx="15" cy="16" r="1.5" fill="#64748b" />
        <circle cx="18" cy="12" r="1.5" fill="#64748b" />
      </svg>
    )
  },
  {
    id: 5,
    name: (
      <span className="brand-name lowercase">
        ale <span className="divider">|</span> <span className="brand-light">solutions</span>
      </span>
    ),
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M8 8H12C14.2 8 16 9.8 16 12C16 14.2 14.2 16 12 16H8C5.8 16 4 14.2 4 12C4 9.8 5.8 8 8 8Z" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 16H12C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8H16C18.2 8 20 9.8 20 12C20 14.2 18.2 16 16 16Z" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
];

// Duplicate once to make endless loop
const duplicatedPartners = [...partners, ...partners];

const PartnerLogos: React.FC = () => {
  return (
    <section className="partner-logos-section">
      {/* Background Soft Glow */}
      <div className="ambient-glow" />

      <div className="container">
        
        {/* Centered Modern Highly-Polished Header */}
        <div className="partners-header">
          {/* Cursive flourish subtitle */}
          <span className="cursive-flourish">Streamline your listing distribution</span>

          {/* Premium Glowing Badge */}
          <div className="status-badge">
            <span className="pulse-dot" />
            <span className="badge-text">OUR PARTNERS</span>
          </div>

          {/* Dynamic Two-Tone Title */}
          <h2 className="partners-title">
            Tap into <span className="title-gradient">25+ channel partners</span> and boost your reach
          </h2>

          {/* Inline features row */}
          <div className="header-features-row">
            <div className="feature-pill">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" className="pill-icon green-icon">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Instant Calendar Sync</span>
            </div>
            
            <div className="feature-pill">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" className="pill-icon blue-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Double Exposure</span>
            </div>

            <div className="feature-pill">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" className="pill-icon orange-icon">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Zero Overbookings</span>
            </div>
          </div>
        </div>

        {/* Endless Seamless Marquee Carousel */}
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {duplicatedPartners.map((partner, index) => (
              <div key={`${partner.id}-${index}`} className="partner-card">
                <div className="partner-logo-icon">
                  {partner.icon}
                </div>
                <div className="partner-logo-text">
                  {partner.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

        .partner-logos-section {
          padding: 100px 0 80px 0;
          background: #ffffff;
          overflow: hidden;
          position: relative;
        }

        /* AMBIENT GLOW BACKDROP */
        .ambient-glow {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 450px;
          height: 350px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.03) 60%, transparent 100%);
          filter: blur(40px);
          z-index: 0;
          pointer-events: none;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 1;
        }

        /* HEADER */
        .partners-header {
          text-align: center;
          margin-bottom: 55px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Cursive hand-written tagline */
        .cursive-flourish {
          font-family: 'Caveat', cursive;
          font-size: 26px;
          font-weight: 700;
          color: #f97316; /* Warm Orange Accent */
          margin-bottom: 10px;
          display: block;
          transform: rotate(-1.5deg);
        }

        /* Premium Floating Badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59, 130, 246, 0.06);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 99px;
          padding: 6px 16px;
          margin-bottom: 18px;
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.04);
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background-color: #10b981; /* Premium Emerald */
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 1.6s infinite alternate;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 12px #10b981; }
        }

        .badge-text {
          font-size: 11px;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 2px;
          line-height: 1;
        }

        /* Two-tone text & Gradient text */
        .partners-title {
          font-size: 38px;
          font-weight: 800;
          color: #0f172a;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.22;
          letter-spacing: -0.8px;
        }

        .title-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Features row */
        .header-features-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(248, 250, 252, 0.7);
          backdrop-filter: blur(4px);
          border: 1px solid #e2e8f0;
          border-radius: 99px;
          padding: 6px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);
          transition: all 0.25s ease;
        }

        .feature-pill:hover {
          background: #ffffff;
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-1.5px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.08);
        }

        .pill-icon {
          flex-shrink: 0;
        }
        
        .pill-icon.green-icon { color: #10b981; }
        .pill-icon.blue-icon { color: #3b82f6; }
        .pill-icon.orange-icon { color: #f97316; }

        /* MARQUEE CAROUSEL */
        .marquee-wrapper {
          overflow: hidden;
          width: 100%;
          position: relative;
          display: flex;
          padding: 10px 0;
        }

        /* Ambient fade effect on sides */
        .marquee-wrapper::before,
        .marquee-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 2;
          pointer-events: none;
        }

        .marquee-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #ffffff, transparent);
        }

        .marquee-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #ffffff, transparent);
        }

        .marquee-track {
          display: flex;
          gap: 24px;
          animation: scrollMarquee 22s linear infinite;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        /* PARTNER CARD DESIGN FROM SS 2 */
        .partner-card {
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 12px;
          padding: 12px 28px;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
          user-select: none;
        }

        .partner-card:hover {
          background: #ffffff;
          border-color: rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.06);
        }

        .partner-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .partner-logo-text {
          display: flex;
          align-items: center;
        }

        /* BRAND TYPOGRAPHY */
        .brand-name {
          font-size: 19px;
          font-weight: 700;
          color: #1e293b;
          font-family: 'Outfit', 'Inter', sans-serif;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .brand-name.lowercase {
          text-transform: lowercase;
        }

        .brand-name.uppercase {
          text-transform: uppercase;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
        }

        .brand-sub {
          color: #64748b;
          font-weight: 500;
          font-size: 16px;
        }

        .brand-light {
          font-weight: 400;
          color: #64748b;
        }

        .divider {
          color: #cbd5e1;
          font-weight: 300;
          margin: 0 4px;
        }

        .brand-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .brand-desc {
          font-size: 9px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.8px;
          margin-top: 1px;
        }

        @keyframes scrollMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 12px)); /* Half length + half the gap */
          }
        }

        @media (max-width: 768px) {
          .partner-logos-section { padding: 70px 0 50px 0; }
          .partners-title { font-size: 28px; }
          .cursive-flourish { font-size: 22px; }
          .partner-card { padding: 10px 20px; gap: 10px; }
          .brand-name { font-size: 16px; }
          .brand-name.uppercase { font-size: 15px; }
          .header-features-row { gap: 10px; }
          .feature-pill { padding: 5px 14px; font-size: 11px; }
        }
      `}</style>
    </section>
  );
};

export default PartnerLogos;
