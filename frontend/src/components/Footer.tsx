import React from 'react';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Newsletter from './Newsletter';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <Newsletter />
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <img src={logo} alt="Logo" style={{ width: '170px', height: '170px' }} />
              {/* <div className="logo-icon"> */}
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
                </svg> */}
              {/* </div> */}
              {/* <span className="logo-text">SkyRunRentals</span> */}
            </div>
            {/* <p className="footer-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis imperdiet tortor sodales vulputate.
            </p> */}
            <div className="social-links">
              <h4 className="social-title">Connect with us</h4>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="#" className="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                </a>
                <a href="#" className="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href="#" className="social-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: About SkyRunRentals */}
          <div className="footer-col" style={{ marginTop: '25px' }}>
            <h4 className="footer-title">About SkyRunRentals</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ's</Link></li>
              <li><Link to="/list-property">List Your Property</Link></li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="footer-col" style={{ marginTop: '25px' }}>
            <h4 className="footer-title">Useful Links</h4>
            <ul className="footer-links">
              <li><Link to="/flights">Flights</Link></li>
              <li><Link to="/cars">Car Rentals</Link></li>
              <li><Link to="/liability-insurance">Liability Insurance</Link></li>
              <li><Link to="/privacy-policy">Privacy & Policy</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Tour Gallery */}
          {/* <div className="footer-col">
            <h4 className="footer-title">Tour Gallery</h4>
            <div className="tour-gallery">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="gallery-item">
                  <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&q=80&w=150`} alt="Gallery" />
                </div>
              ))}
            </div>
          </div> */}

          {/* Column 5: Quick Contact */}
          <div className="footer-col" style={{ marginTop: '25px' }}>
            <h4 className="footer-title">Quick Contact</h4>
            <ul className="contact-list">
              <li>
                <MapPin size={20} className="contact-icon" />
                <span>19 Woodville St, Roxbury,MA, 02119, USA</span>
              </li>
              <li>
                <Phone size={20} className="contact-icon" />
                <span>(+1) - 603-333-8490</span>
              </li>
              <li>
                <Mail size={20} className="contact-icon" />
                <span>info@skyrunrentals.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">Copyright © {new Date().getFullYear()} <span className="highlight">SkyRunRentals</span> All Right Reserved.</p>
        </div>
      </div>

      {/* Floating Back to Top */}
      <button className="back-to-top" onClick={scrollToTop}>
        <ArrowUp size={24} />
      </button>

      <style>{`
        .footer-section {
          background: #081d27;
          color: #ffffff;
          padding: 0 0 30px;
          position: relative;
          font-family: 'Outfit', sans-serif;
          margin-top: 10%;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 0.8fr 1fr;
          gap: 40px;
          margin: 0 auto 80px auto;
          max-width: 1050px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          // margin-bottom: 20px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: #f97316;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .footer-desc {
          color: #94a3b8;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .social-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
          margin-left: 60px;
        }

        .social-icons {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background: #3b82f6;
          border-color: #3b82f6;
          transform: translateY(-3px);
        }

        .footer-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 30px;
          position: relative;
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 15px;
        }

        .footer-links a {
          color: #94a3b8;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: #3b82f6;
          padding-left: 5px;
        }

        .tour-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .gallery-item {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .gallery-item:hover img {
          transform: scale(1.1);
        }

        .contact-list {
          list-style: none;
        }

        .contact-list li {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          color: #94a3b8;
          font-size: 16px;
          line-height: 1.4;
        }

        .contact-icon {
          color: #3b82f6;
          flex-shrink: 0;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 30px;
          text-align: center;
        }

        .copyright {
          color: #94a3b8;
          font-size: 16px;
          font-weight: 500;
        }

        .highlight {
          color: #3b82f6;
          font-weight: 700;
        }

        .back-to-top {
          position: fixed;
          right: 30px;
          bottom: 30px;
          width: 50px;
          height: 50px;
          background: transparent;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: inset 0 0 0 2px rgba(0, 0, 0, .1);
          // border: 2px solid rgba(255,255,255,0.1);
          // box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
          z-index: 100;
        }

        .back-to-top:hover {
          transform: translateY(-5px);
          background: #2563eb;
        }

        @media (max-width: 1200px) {
          .footer-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
          .brand-col { grid-column: span 2; }
        }

        @media (max-width: 576px) {
          .footer-grid { grid-template-columns: 1fr; }
          .brand-col { grid-column: span 1; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
