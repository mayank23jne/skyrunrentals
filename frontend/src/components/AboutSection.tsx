import React from 'react';
import { Gem, Award, ConciergeBell, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    icon: <Gem size={26} />,
    title: 'Holiday Homes'
  },
  {
    icon: <Award size={26} />,
    title: 'Trusted Experience'
  },
  {
    icon: <ConciergeBell size={26} />,
    title: 'Unparalleled Service'
  },
  {
    icon: <ShieldCheck size={26} />,
    title: 'Secure Payments'
  },
];

const AboutSection: React.FC = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-wrapper">

          {/* Left Side: Overlapping Image Gallery */}
          <div className="about-gallery">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="gallery-main"
            >
              <img
                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=800"
                alt="Traveler"
                className="img-primary"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="gallery-inset"
            >
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600"
                alt="Mountain View"
                className="img-inset"
              />
              <div className="discount-badge">
                <span className="discount-val">50%</span>
                <span className="discount-label">Discount</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="gallery-bottom"
            >
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600"
                alt="Coastal View"
                className="img-bottom"
              />
            </motion.div>
          </div>

          {/* Right Side: Content */}
          <div className="about-content">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="section-header" style={{ textAlign: 'left', alignItems: 'flex-start', marginBottom: '25px' }}>
                <span className="cursive-subtitle">Are you ready to travel?</span>
                <h2 className="section-title" style={{ margin: '10px 0 0 0', fontSize: '36px', lineHeight: '1.25' }}>
                  Holiday Haven Homes is a <br />
                  World Leading Online <br />
                  Booking Platform
                </h2>
              </div>

              <p className="about-desc">
                We connect property owners and travelers directly to ensure a seamless booking experience.
                With our curated selection of properties and trusted services, your next dream vacation is just a few clicks away.
              </p>

              {/* Service Grid */}
              <div className="service-grid">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="service-card"
                  >
                    <div className="service-icon">
                      {service.icon}
                    </div>
                    <h4 className="service-title">{service.title}</h4>
                  </motion.div>
                ))}
              </div>

              {/* <button className="discover-btn">
                Discover More
              </button> */}
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

        .about-section { padding: 100px 0; background: white; overflow: hidden; }
        .container { max-width: 1320px; margin: 0 auto; padding: 0 20px; }
        .about-wrapper { display: flex; align-items: center; gap: 80px; }
        
        /* Gallery Styling */
        .about-gallery { flex: 1; position: relative; height: 600px; }
        .img-primary { width: 380px; height: 480px; border-radius: 30px; object-fit: cover; }
        
        .gallery-inset { position: absolute; top: 110px; left: 160px; z-index: 5; }
        .img-inset { width: 320px; height: 350px; border-radius: 30px; border: 10px solid white; object-fit: cover; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        
        .discount-badge { position: absolute; top: 40px; right: -40px; width: 110px; height: 110px; background: var(--accent); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border: 8px solid white; box-shadow: 0 10px 20px rgba(255, 156, 69, 0.3); }
        .discount-val { font-size: 28px; font-weight: 900; line-height: 1; }
        .discount-label { font-size: 14px; font-weight: 700; font-family: serif; font-style: italic; }
        
        .gallery-bottom { position: absolute; bottom: 0; left: 80px; z-index: 10; }
        .img-bottom { width: 320px; height: 210px; border-radius: 30px; border: 10px solid white; object-fit: cover; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        
        /* Content Styling */
        .about-content { flex: 1; }
        
        .cursive-subtitle {
          font-family: 'Caveat', 'Dancing Script', 'Brush Script MT', cursive;
          font-size: 28px;
          color: #3b82f6;
          font-weight: 700;
        }

        .about-desc { color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        
        .service-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 20px; 
          margin-bottom: 35px; 
        }
        
        .service-card { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center;
          padding: 25px 15px; 
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          border-color: #3b82f6;
        }
        
        .service-icon { 
          width: 55px; 
          height: 55px; 
          background: rgba(59, 130, 246, 0.1); 
          color: #3b82f6; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin-bottom: 15px;
          transition: all 0.3s ease;
        }
        
        .service-card:hover .service-icon {
          background: #3b82f6;
          color: #ffffff;
        }
        
        .service-title { 
          font-size: 16px; 
          font-weight: 800; 
          color: #1e293b; 
          margin: 0; 
          line-height: 1.3;
        }
        
        .discover-btn { background: var(--accent); color: white; padding: 18px 45px; border-radius: 99px; font-size: 16px; font-weight: 800; border: none; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(255, 156, 69, 0.2); }
        .discover-btn:hover { background: #1e293b; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
        
        @media (max-width: 1200px) {
          .about-wrapper { gap: 40px; }
          .img-primary { width: 320px; height: 420px; }
          .img-inset { width: 280px; height: 310px; }
          .img-bottom { width: 280px; height: 180px; }
          .about-gallery { height: 550px; }
        }
        @media (max-width: 992px) {
          .about-wrapper { flex-direction: column; }
          .about-gallery { width: 100%; max-width: 500px; margin: 0 auto 100px; }
          .about-content { width: 100%; text-align: center; }
          .about-gallery { left: -50px; } /* Center correction for the stack */
          .cursive-subtitle { font-size: 26px; }
          .section-title { font-size: 30px !important; }
        }
        @media (max-width: 576px) {
          .service-grid { grid-template-columns: 1fr; }
          .about-gallery { transform: scale(0.8); left: -80px; }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
