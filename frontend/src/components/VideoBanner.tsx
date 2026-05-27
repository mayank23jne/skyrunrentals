import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoBanner: React.FC = () => {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative h-[600px] rounded-[3.5rem] overflow-hidden group shadow-2xl"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000)' }}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-24 h-24 bg-accent text-white rounded-full flex items-center justify-center shadow-2xl mb-10 relative"
            >
              <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-25" />
              <Play size={32} fill="currentColor" />
            </motion.button>
            <h2 className="text-4xl md:text-6xl font-black text-white max-w-3xl leading-tight">
              Ready For Your <br /> Next Memory?
            </h2>
            <p className="text-white/80 text-xl mt-6 max-w-xl">
              Watch our latest travel film and get inspired for your next big adventure.
            </p>
          </div>

          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
            <div className="text-left">
              <span className="text-accent font-black uppercase tracking-widest text-sm">Location</span>
              <p className="text-white font-bold text-lg mt-1">Santorini, Greece</p>
            </div>
            <div className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .py-24 { padding: 6rem 0; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .items-end { align-items: flex-end; }
        .justify-between { justify-content: space-between; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .max-w-3xl { max-width: 48rem; }
        .max-w-xl { max-width: 36rem; }
        .h-[600px] { height: 600px; }
        .w-24 { width: 6rem; }
        .h-24 { height: 6rem; }
        .w-1.5 { width: 0.375rem; }
        .h-1.5 { height: 0.375rem; }
        .rounded-full { border-radius: 9999px; }
        .rounded-[3.5rem] { border-radius: 3.5rem; }
        .overflow-hidden { overflow: hidden; }
        .bg-accent { background-color: var(--accent); }
        .text-white { color: white; }
        .text-accent { color: var(--accent); }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .text-xl { font-size: 1.25rem; }
        .text-4xl { font-size: 2.25rem; }
        .text-6xl { font-size: 3.75rem; }
        .font-black { font-weight: 900; }
        .font-bold { font-weight: 700; }
        .mt-1 { margin-top: 0.25rem; }
        .mt-6 { margin-top: 1.5rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .bottom-12 { bottom: 3rem; }
        .left-12 { left: 3rem; }
        .right-12 { right: 3rem; }
        .gap-4 { gap: 1rem; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .leading-tight { line-height: 1.25; }
        .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default VideoBanner;
