import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, ShieldCheck, Waves, Dumbbell, Bed, Tent, Bike, Sun, Mountain } from 'lucide-react';

const features = [
  { 
    icon: <Wifi size={24} />, 
    title: 'Use Free Wifi', 
    bgColor: '#f0f9ff', 
    iconBg: '#3b82f6', 
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
  },
  { 
    icon: <ShieldCheck size={24} />, 
    title: 'Special Security', 
    bgColor: '#fdf4ff', 
    iconBg: '#d946ef', 
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
  },
  { 
    icon: <Waves size={24} />, 
    title: 'Swimming & Fishing', 
    bgColor: '#f0fdf4', 
    iconBg: '#22c55e', 
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
  },
  { 
    icon: <Dumbbell size={24} />, 
    title: 'Gym Center', 
    bgColor: '#fff7ed', 
    iconBg: '#f97316', 
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
  },
  { 
    icon: <Bed size={24} />, 
    title: 'Luxury Room', 
    bgColor: '#f0f9ff', 
    iconBg: '#3b82f6', 
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
  },
  { 
    icon: <Tent size={24} />, 
    title: 'Night Campaign', 
    bgColor: '#fdf4ff', 
    iconBg: '#d946ef', 
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
  },
  { 
    icon: <Bike size={24} />, 
    title: 'Cycling Trips', 
    bgColor: '#f0fdf4', 
    iconBg: '#22c55e', 
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
  },
  { 
    icon: <Sun size={24} />, 
    title: 'Solar Energy System', 
    bgColor: '#fff7ed', 
    iconBg: '#f97316', 
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
  },
  { 
    icon: <Mountain size={24} />, 
    title: 'Hiking', 
    bgColor: '#f0f9ff', 
    iconBg: '#3b82f6', 
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' 
  },
];

const SpecialFeatures: React.FC = () => {
  return (
    <section className="special-features-section">
      <div className="container">
        <div className="section-header">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="section-subtitle"
          >
            Special Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Why you Should Choose Our Company
          </motion.h2>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="feature-card"
              style={{ backgroundColor: f.bgColor }}
            >
              <div className="feature-icon-box" style={{ backgroundColor: f.iconBg }}>
                {f.icon}
              </div>
              <div className="feature-text">
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .special-features-section {
          padding: 100px 0;
          background: #ffffff;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }


        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .feature-card {
          padding: 40px 30px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
        }

        .feature-icon-box {
          width: 54px;
          height: 54px;
          min-width: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .feature-text {
          flex: 1;
        }

        .feature-title {
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 8px;
          font-family: 'Outfit', sans-serif;
        }

        .feature-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        @media (max-width: 1100px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .header-title { font-size: 32px; }
          .features-grid { grid-template-columns: 1fr; }
          .feature-card { padding: 30px 20px; }
        }
      `}</style>
    </section>
  );
};

export default SpecialFeatures;
