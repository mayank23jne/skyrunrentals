import React from 'react';
import { Star, MapPin, Users, Bath, BedDouble, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  id?: number;
  image?: string;
  images?: string[];
  title: string;
  location: string;
  price: string;
  rating: number;
  beds: number;
  baths: number;
  guests: number;
  propertyDescription?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id, image, images = [], title, location, price, rating, beds, baths, guests, propertyDescription
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const fallbackImages = [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800"
  ];
  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackImage = fallbackImages[hash % fallbackImages.length];

  const displayImages = images.length > 0 ? images : (image ? [image] : [fallbackImage]);
  const currentImage = displayImages[currentImageIndex] || fallbackImage;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-border group"
    >
      <div className="relative h-64 overflow-hidden card-image-box cursor-pointer" onClick={() => id && window.open(`/property/${id}`, '_blank')}>
        <img
          src={currentImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="slider-btn slider-btn-left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              className="slider-btn slider-btn-right"
            >
              <ChevronRight size={18} />
            </button>
            <div className="slider-dots">
              {displayImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`slider-dot ${idx === currentImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
        {/* <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center gap-1">
          <Star size={14} className="fill-accent text-accent" />
          <span className="text-xs font-bold text-primary">{rating}</span>
        </div> */}
        <div className="absolute bottom-4 left-4 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
          {price}<span className="text-white/70 font-normal">/night</span>
        </div>
      </div>

      <div className="p-6 cursor-pointer" onClick={() => id && window.open(`/property/${id}`, '_blank')}>
        <div className="flex items-center gap-1 text-accent mb-2">
          <MapPin size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">{location}</span>
        </div>
        <h3 className={`text-xl font-bold text-primary ${propertyDescription ? 'mb-2' : 'mb-4'} truncate`}>{title}</h3>
        {propertyDescription && (
          <p
            className="text-sm text-text-muted mb-4 line-clamp-2"
            title={propertyDescription.replace(/<[^>]+>/g, '')}
            dangerouslySetInnerHTML={{ __html: propertyDescription }}
          />
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-text-muted">
              <BedDouble size={18} />
              <span className="text-xs font-medium">{beds}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-muted">
              <Bath size={18} />
              <span className="text-xs font-medium">{baths}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-muted">
              <Users size={18} />
              <span className="text-xs font-medium">{guests}</span>
            </div>
          </div>
          <button
            onClick={() => id && window.open(`/property/${id}`, '_blank')}
            className="text-primary font-bold text-sm hover:text-accent transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      <style>{`
        .bg-white { background-color: white; }
        .bg-primary { background-color: #0f172a; }
        .rounded-\[2rem\] { border-radius: 2rem; }
        .overflow-hidden { overflow: hidden; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .border { border: 1px solid var(--border); }
        .relative { position: relative; }
        .h-64 { height: 16rem; }
        .w-full { width: 100%; }
        .h-full { height: 100%; }
        .object-cover { object-fit: cover; }
        .transition-transform { transition-property: transform; }
        .duration-500 { transition-duration: 500ms; }
        .absolute { position: absolute; }
        .top-4 { top: 1rem; }
        .right-4 { right: 1rem; }
        .bottom-4 { bottom: 1rem; }
        .left-4 { left: 1rem; }
        .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px); }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        .rounded-xl { border-radius: 0.75rem; }
        .flex { display: flex; }
        .items-center { display: flex; align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-1 { gap: 0.25rem; }
        .gap-1\.5 { gap: 0.375rem; }
        .gap-4 { gap: 1rem; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xl { font-size: 1.25rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .font-normal { font-weight: 400; }
        .text-primary { color: var(--primary); }
        .text-accent { color: var(--accent); }
        .text-white { color: white; }
        .text-white\/70 { color: rgba(255, 255, 255, 0.7); }
        .text-text-muted { color: var(--text-muted); }
        .uppercase { text-transform: uppercase; }
        .tracking-wider { letter-spacing: 0.05em; }
        .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .p-6 { padding: 1.5rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .pt-4 { padding-top: 1rem; }
        .border-t { border-top: 1px solid var(--border); }
        .group:hover .group-hover\:scale-110 { transform: scale(1.1); }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Hover Overlay */
        .card-image-box::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          transition: background 0.3s ease;
          pointer-events: none;
          z-index: 5;
        }
        .card-image-box:hover::after {
          background: rgba(0, 0, 0, 0.35);
        }
        
        /* Slider Styles */
        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.8);
          color: var(--primary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 20;
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slider-btn:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }
        .card-image-box:hover .slider-btn {
          opacity: 1 !important;
        }
        .slider-btn-left {
          left: 8px;
        }
        .slider-btn-right {
          right: 8px;
        }
        
        .slider-dots {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        .slider-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }
        .slider-dot.active {
          background: white;
          transform: scale(1.25);
        }
      `}</style>
    </motion.div>
  );
};

export default PropertyCard;
