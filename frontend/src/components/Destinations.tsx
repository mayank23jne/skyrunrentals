import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Dream Stay = Vacation Rentals',
    description: 'If there is a definition of a dream yet budget stay, it is "Vacation Rentals." Be it a day or a month; your vacation stay is incredible when you book at Holiday Haven Homes.',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'No Extra Charges',
    description: 'Booking vacation rentals at Holiday Haven Homes means to stay at a nominal price as we charge no extra fee in the fake names of commission such as booking fees, service fees, etc.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Every Promise Matters',
    description: 'From connecting directly with the property owner to making sure of a memorable stay, we leave no stone unturned to see the wide smile of our clients whenever they think of us.',
    image: 'https://holidayhavenhomes.com/assets/haven/images/services-1.jpg'
  }
];

const Destinations: React.FC = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div
                className="feature-bg-image"
                style={{ backgroundImage: `url(${feature.image})` }}
              />
              <div className="feature-overlay" />
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .features-section { padding: 60px 0; background: #f9fbfd; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        
        .feature-card { 
          position: relative;
          height: 420px;
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
          cursor: pointer;
        }
        
        .feature-bg-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s ease;
        }
        
        .feature-card:hover .feature-bg-image {
          transform: scale(1.1);
        }
        
        .feature-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%);
          transition: background 0.3s ease;
        }
        
        .feature-card:hover .feature-overlay {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.4) 100%);
        }
        
        .feature-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 30px;
          text-align: center;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;
        }
        
        .feature-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 15px;
          line-height: 1.3;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .feature-description {
          color: #e2e8f0;
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        
        @media (max-width: 992px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; }
          .feature-card { height: 350px; }
        }
      `}</style>
    </section>
  );
};

export default Destinations;
