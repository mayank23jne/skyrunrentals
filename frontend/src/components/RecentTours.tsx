import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Star, Heart } from 'lucide-react';

const categories = ['All', 'Beach', 'Adventure', 'Holiday', 'Private'];

const tours = [
  {
    id: 1,
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    price: '$120',
    title: 'Sunny Beach Escape',
    location: 'Miami, Florida',
    duration: '3 Days',
    rating: 4.8,
    featured: true
  },
  {
    id: 2,
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    price: '$250',
    title: 'Mountain Trekking',
    location: 'Alps, Switzerland',
    duration: '5 Days',
    rating: 5.0,
    featured: false
  },
  {
    id: 3,
    category: 'Holiday',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    price: '$180',
    title: 'Tokyo City Lights',
    location: 'Tokyo, Japan',
    duration: '4 Days',
    rating: 4.9,
    featured: true
  },
  {
    id: 4,
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800',
    price: '$150',
    title: 'Crystal Clear Maldivian Blue',
    location: 'Male, Maldives',
    duration: '6 Days',
    rating: 4.7,
    featured: false
  },
];

const RecentTours: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTours = activeCategory === 'All' 
    ? tours 
    : tours.filter(tour => tour.category === activeCategory);

  return (
    <section className="py-24 bg-bg-soft">
      <div className="container">
        <div className="text-center mb-16">
          <span className="text-accent font-bold uppercase tracking-widest text-sm">Our Recent Tours</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary mt-2 mb-10">Experience the Extraordinary</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-accent text-white shadow-lg shadow-accent/30' 
                    : 'bg-white text-primary hover:bg-accent/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredTours.map((tour) => (
              <motion.div
                key={tour.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group border border-border/50"
              >
                <div className="relative h-[300px] overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {tour.featured && (
                    <div className="absolute top-6 left-6 bg-accent text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      Featured
                    </div>
                  )}
                  <button className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-accent transition-all">
                    <Heart size={20} />
                  </button>
                  <div className="absolute bottom-6 left-6 bg-primary text-white px-4 py-2 rounded-xl font-black shadow-lg">
                    {tour.price} <span className="text-xs font-medium text-white/70">/ person</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 text-accent mb-3">
                    <MapPin size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">{tour.location}</span>
                  </div>
                  <h3 className="text-2xl font-black text-primary mb-6 group-hover:text-accent transition-colors">
                    {tour.title}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-text-muted" />
                        <span className="text-sm font-bold text-text-muted">{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star size={16} className="text-accent fill-accent" />
                        <span className="text-sm font-bold text-primary">{tour.rating}</span>
                      </div>
                    </div>
                    <button className="text-primary font-black text-sm hover:text-accent transition-colors">
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .py-24 { padding: 6rem 0; }
        .text-center { text-align: center; }
        .flex { display: flex; }
        .flex-wrap { flex-wrap: wrap; }
        .justify-center { justify-content: center; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-1.5 { gap: 0.375rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-10 { gap: 2.5rem; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        @media (min-width: 768px) {
          .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        .bg-white { background-color: white; }
        .bg-accent { background-color: var(--accent); }
        .bg-bg-soft { background-color: var(--bg-soft); }
        .bg-primary { background-color: var(--primary); }
        .text-white { color: white; }
        .text-primary { color: var(--primary); }
        .text-accent { color: var(--accent); }
        .text-text-muted { color: var(--text-muted); }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-4xl { font-size: 2.25rem; }
        .text-5xl { font-size: 3rem; }
        .font-black { font-weight: 900; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .mt-2 { margin-top: 0.5rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .mb-16 { margin-bottom: 4rem; }
        .p-3 { padding: 0.75rem; }
        .p-8 { padding: 2rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .py-1.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-full { border-radius: 9999px; }
        .rounded-[2.5rem] { border-radius: 2.5rem; }
        .border { border-width: 1px; }
        .border-t { border-top-width: 1px; }
        .border-border { border-color: var(--border); }
        .transition-all { transition: all 0.3s ease; }
        .transition-colors { transition: color 0.3s ease; }
        .transition-transform { transition: transform 0.7s ease; }
        .duration-700 { transition-duration: 700ms; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .tracking-widest { letter-spacing: 0.1em; }
        .tracking-wider { letter-spacing: 0.05em; }
        .uppercase { text-transform: uppercase; }
        .overflow-hidden { overflow: hidden; }
        .relative { position: relative; }
        .absolute { position: absolute; }
      `}</style>
    </section>
  );
};

export default RecentTours;
