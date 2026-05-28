import React from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import newsImg from "../assets/newsletter1.jpg";
import airplaneImg from "../assets/airplane.png";
import travelersImg from "../assets/nesletter.png";

const Newsletter: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/list-property');
  };
  return (
    <section className="newsletter-section" style={{ marginTop: '220px' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="newsletter-box"
        >
          {/* Decorative Elements */}
          <div className="decor-airplane">
            <img src={airplaneImg} alt="Airplane" className="arch-plan-img" />
          </div>

          <div className="decor-image-arch">
            <img src={travelersImg} alt="Travelers" className="arch-img" />
          </div>

          <div className="newsletter-content">
            <h2 className="newsletter-title">Sign Up Your Newsletter</h2>

            <div className="newsletter-form-container">
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe <Send size={18} strokeWidth={2.5} />
                </button>
              </form>
            </div>

            <p className="newsletter-footer-text">
              You agree to SkyRunRentals Terms and Conditions, Privacy Policy
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .newsletter-section {
          padding: 0;
          background: transparent;
          margin-bottom: -150px;
          position: relative;
          z-index: 11;
          transform: translateY(-50%);
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .newsletter-box {
          background-color: #2e80ec;
          background-image: 
            url("data:image/svg+xml,%3Csvg width='1000' height='1000' viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 200c100-50 200 50 300 0s200-150 300-100 200 100 300 50v2H0v-2z' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1.5'/%3E%3Cpath d='M0 400c150-100 300 100 450 0s300-200 450-100 150 150 300 100v2H0v-2z' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1.5'/%3E%3Cpath d='M0 600c200-150 400 150 600 0s400-300 600-150 200 200 400 150v2H0v-2z' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='2'/%3E%3Cpath d='M0 800c250-200 500 200 750 0s500-400 750-200v2H0v-2z' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1.5'/%3E%3C/svg%3E"),
            linear-gradient(rgba(46, 128, 236, 0.88), rgba(46, 128, 236, 0.88)), 
            url(${newsImg});
          border-radius: 25px;
          padding: 80px 40px;
          position: relative;
          z-index: 1;
          overflow: hidden;
          text-align: center;
          background-size: cover;
          background-position: center;
          box-shadow: 0 20px 60px rgba(46, 128, 236, 0.2);
        }

        .decor-airplane {
          position: absolute;
          left: 5%;
          top: 45%;
          transform: translateY(-50%) rotate(-10deg);
          z-index: 1;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }

        .decor-image-arch {
          position: absolute;
          right: 3%;
          bottom: -10px;
          width: 320px;
          height: auto;
          z-index: 1;
        }

        .arch-img {
          width: 267px;
          height: auto;
          display: block;
          position: absolute;
          right: 45px;
          bottom: 0;
        }
        
        .arch-plan-img{
            position: absolute;
            top: 36%;
            left: 95px;
            width: 116px;
            height: auto;
            display: block;
        }

        .newsletter-content {
          position: relative;
          z-index: 5;
          max-width: 650px;
          margin: 0 auto;
        }

        .newsletter-title {
          color: #ffffff;
          font-size: 38px;
          font-weight: 700;
          margin-bottom: 35px;
          font-family: var(--titlefont);
          letter-spacing: -0.5px;
        }

        .newsletter-form-container {
          background: #ffffff;
          padding: 6px;
          border-radius: 99px;
          display: block;
          width: 100%;
          max-width: 580px;
          margin: 0 auto 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .newsletter-form {
          display: flex;
          align-items: center;
        }

        .newsletter-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 15px 30px;
          font-size: 16px;
          font-family: var(--titlefont);
          color: #1e293b;
          background: transparent;
        }

        .newsletter-btn {
          background: #fe9d3d;
          color: #ffffff;
          padding: 12px 35px;
          border-radius: 99px;
          font-weight: 600;
          font-size: 17px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .newsletter-btn:hover {
          background: #e68a30;
          transform: translateY(-1px);
        }

        .newsletter-footer-text {
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
          opacity: 0.9;
          font-family: var(--titlefont);
        }

        @media (max-width: 992px) {
          .decor-airplane, .decor-image-arch { display: none; }
          .newsletter-title { font-size: 32px; }
        }

        @media (max-width: 576px) {
          .newsletter-box { padding: 60px 20px; }
          .newsletter-form { flex-direction: column; gap: 15px; }
          .newsletter-form-container { border-radius: 20px; padding: 20px; }
          .newsletter-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default Newsletter;
