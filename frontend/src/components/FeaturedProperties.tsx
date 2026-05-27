import React from 'react';
import PropertyCard from './PropertyCard';
import prop1 from '../assets/prop1.png';
import prop2 from '../assets/prop2.png';
import { ArrowRight } from 'lucide-react';

const FeaturedProperties: React.FC = () => {
  const properties = [
    {
      id: 1,
      image: prop1,
      title: "Oceanfront Glass Villa",
      location: "Santorini, Greece",
      price: "$850",
      rating: 4.9,
      beds: 4,
      baths: 3,
      guests: 8
    },
    {
      id: 2,
      image: prop2,
      title: "Modern Alpine Chalet",
      location: "Aspen, Colorado",
      price: "$1,200",
      rating: 5.0,
      beds: 5,
      baths: 4,
      guests: 10
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
      title: "Sunset Palm Mansion",
      location: "Marbella, Spain",
      price: "$950",
      rating: 4.8,
      beds: 6,
      baths: 5,
      guests: 12
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Featured Escapes</h2>
            <p className="text-text-muted max-w-lg">
              Hand-picked properties that offer exceptional design, location, and luxury services.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
            View All Properties <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>

      <style>{`
        .py-24 { padding-top: 6rem; padding-bottom: 6rem; }
        .bg-white { background-color: var(--bg-main); }
        .mb-4 { margin-bottom: 1rem; }
        .mb-12 { margin-bottom: 3rem; }
        .text-3xl { font-size: 1.875rem; }
        .text-4xl { font-size: 2.25rem; }
        .font-bold { font-weight: 700; }
        .text-primary { color: var(--primary); }
        .text-text-muted { color: var(--text-muted); }
        .max-w-lg { max-width: 32rem; }
        .flex { display: flex; }
        .items-end { align-items: flex-end; }
        .justify-between { justify-content: space-between; }
        .hidden { display: none; }
        .gap-2 { gap: 0.5rem; }
        .gap-8 { gap: 2rem; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        @media (min-width: 768px) {
          .md\:flex { display: flex; }
          .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        .transition-colors { transition-property: color; transition-duration: 300ms; }
      `}</style>
    </section>
  );
};

export default FeaturedProperties;
