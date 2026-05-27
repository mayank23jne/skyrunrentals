import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Map, Compass, Camera } from 'lucide-react';

const serviceList = [
  { icon: <Coffee size={40} />, title: 'Affordable Prices', desc: 'Best deals guaranteed' },
  { icon: <Map size={40} />, title: 'Smart Search', desc: 'Find your way easily' },
  { icon: <Compass size={40} />, title: 'Best Guide', desc: 'Expert local guides' },
  { icon: <Camera size={40} />, title: 'Nice Photography', desc: 'Capture every moment' },
];

const Services: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {serviceList.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-40 h-40 rounded-full border-2 border-dashed border-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-500 relative">
                <div className="absolute inset-2 rounded-full border border-accent opacity-20" />
                <div className="text-accent group-hover:text-white transition-colors">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-black text-primary mb-2 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-text-muted font-medium italic">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .py-24 { padding: 6rem 0; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (min-width: 1024px) {
          .lg:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        .gap-12 { gap: 3rem; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .text-center { text-align: center; }
        .w-40 { width: 10rem; }
        .h-40 { height: 10rem; }
        .rounded-full { border-radius: 9999px; }
        .border-2 { border-width: 2px; }
        .border-dashed { border-style: dashed; }
        .border-accent { border-color: var(--accent); }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .text-primary { color: var(--primary); }
        .text-accent { color: var(--accent); }
        .text-text-muted { color: var(--text-muted); }
        .text-xl { font-size: 1.25rem; }
        .font-black { font-weight: 900; }
        .font-medium { font-weight: 500; }
        .italic { font-style: italic; }
        .transition-all { transition: all 0.3s ease; }
        .transition-colors { transition: color 0.3s ease; }
        .duration-500 { transition-duration: 500ms; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .inset-2 { top: 0.5rem; right: 0.5rem; bottom: 0.5rem; left: 0.5rem; }
        .opacity-20 { opacity: 0.2; }
      `}</style>
    </section>
  );
};

export default Services;
