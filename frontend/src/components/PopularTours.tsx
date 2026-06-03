import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Percent, BarChart3, Plus, BedDouble, Bath, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api, { API_BASE_URL } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800";


const PopularPropertyCard = ({ property, fallbackImage, navigate, formatPrice }: any) => {
  const [imgIndex, setImgIndex] = useState(0);
  const candidates = property.imageCandidates || [property.image || fallbackImage];
  const currentImage = candidates[imgIndex];

  return (
    <div
      className="property-card group"
      onClick={() => navigate(`/property/${property.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-image-box">
        <img
          src={currentImage}
          alt={property.title}
          className="property-img"
          onError={(e) => {
            if (imgIndex < candidates.length - 1) {
              setImgIndex(imgIndex + 1);
            } else {
              (e.target as HTMLImageElement).src = fallbackImage;
            }
          }}
        />
        <span className="card-badge featured">FEATURED</span>
      </div>

      <div className="card-content">
        {/* 5 Golden Stars */}
        {/* <div className="property-rating-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={15} fill="#f97316" color="#f97316" />
          ))}
        </div> */}

        <h3 className="property-title" title={property.title}>{property.title}</h3>

        <div className="property-price-row">
          <span className="price-val">{formatPrice(property.price)}</span>
          <span className="price-label">/ Night</span>
        </div>
      </div>

      {/* Features bar at bottom */}
      <div className="property-features-bar">
        <div className="feature-item">
          <BedDouble size={16} />
          <span>{property.beds} Beds</span>
        </div>
        <div className="feature-item">
          <Bath size={16} />
          <span>{property.baths} Baths</span>
        </div>
        <div className="feature-item">
          <Users size={16} />
          <span>{property.guests} Guests</span>
        </div>
      </div>
    </div>
  );
};

const PopularTours: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { formatPrice } = useCurrency();
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['popular-tours'],
    queryFn: async () => {
      const response = await api.get('/properties/listing?recommended=1');
      if (response.data && response.data.properties && response.data.properties.length > 0) {
        return response.data.properties.map((p: any, index: number) => {
          const originalUrl = p.photos?.find((photo: any) => photo.defaultImage === 1)?.imageName || p.photos?.[0]?.imageName || '';
          const fileName = originalUrl.split('/').pop();
          const match = originalUrl.match(/^(.*\/images\/)/);
          const baseUrl = match ? match[1] : '';

          let imageCandidates = [DEFAULT_IMAGE];
          if (fileName && baseUrl) {
            imageCandidates = [
              `${baseUrl}uploaded_filesT/${fileName}`,
              `${baseUrl}uploaded_files/${fileName}`,
              `${baseUrl}uploads/property/thumbnail/${fileName}`,
              DEFAULT_IMAGE
            ];
          } else if (originalUrl) {
            imageCandidates = [originalUrl, DEFAULT_IMAGE];
          }

          return {
            id: p.id,
            image: originalUrl || DEFAULT_IMAGE,
            imageCandidates: imageCandidates,
            images: p.photos?.map((photo: any) => photo.imageName) || [],
            title: p.propertyHeadline || 'Premium Retreat',
            location: `${p.city || ''}, ${p.country || ''}`.replace(/^, | , $/g, '') || 'Global Escape',
            price: p.rates?.[0]?.nightly ? Number(p.rates[0].nightly) : '',
            rating: 5,
            beds: p.bedroom || '',
            baths: p.bathroom || '',
            guests: p.sleeps || ''
          };
        });
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  // Make visibleCardsCount dynamic based on window size
  const [visibleCardsCount, setVisibleCardsCount] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleCardsCount(1);
      else if (window.innerWidth < 1024) setVisibleCardsCount(2);
      else setVisibleCardsCount(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log(properties, 'properties');

  const maxIndex = Math.max(0, properties.length - visibleCardsCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  if (!isLoading && properties.length === 0) {
    return null;
  }

  return (
    <section className="popular-tours-section">
      <div className="container">

        <div className="section-header-row">
          <div className="section-header-left">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="section-subtitle"
            >
              Special Escapes
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="section-title"
            >
              Featured Properties
            </motion.h2>
          </div>
        </div>



        {/* Slider Properties Layout */}
        <div className="slider-wrapper">
          {/* Centered Left Arrow */}
          <button onClick={prevSlide} className="slider-nav-btn btn-left" aria-label="Previous Properties">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Centered Right Arrow */}
          <button onClick={nextSlide} className="slider-nav-btn btn-right" aria-label="Next Properties">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="slider-container">
            <motion.div
              className="slider-track"
              animate={{ x: `-${currentIndex * (100 / visibleCardsCount)}%` }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
            >
              {properties.map((property: any, idx: number) => {
                const isVisible = idx >= currentIndex && idx < currentIndex + visibleCardsCount;

                return (
                  <motion.div
                    key={property.id}
                    className="slider-item"
                    style={{ flex: `0 0 calc(100% / ${visibleCardsCount})`, maxWidth: `calc(100% / ${visibleCardsCount})` }}
                    animate={{
                      opacity: isVisible ? 1 : 0.15,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <PopularPropertyCard property={property} fallbackImage={DEFAULT_IMAGE} navigate={navigate} formatPrice={formatPrice} />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

      </div>

      <style>{`
        .popular-tours-section {
          padding: 100px 0;
          background: #ffffff;
          overflow: hidden;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .section-subtitle {
          font-size: 16px;
          color: var(--secondary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          display: block;
        }

        .section-title {
          font-size: 42px;
          color: #0f172a;
          font-weight: 900;
          font-family: 'Outfit', sans-serif;
          margin: 0;
        }

        /* Centered Slider Nav Buttons */
        .slider-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          z-index: 20;
        }

        .slider-nav-btn:hover {
          background: var(--accent);
          color: #ffffff;
          border-color: var(--accent);
          box-shadow: 0 10px 25px rgba(255, 156, 69, 0.4);
          transform: translateY(-50%) scale(1.05);
        }

        .btn-left {
          left: -28px;
        }

        .btn-right {
          right: -28px;
        }

        @media (max-width: 1280px) {
          .btn-left {
            left: 10px;
          }
          .btn-right {
            right: 10px;
          }
        }

        /* Filter Tabs Styling */
        .filter-tabs-container {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }

        .filter-tabs {
          background: #fff;
          padding: 8px;
          border-radius: 99px;
          
          display: flex;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          border-radius: 99px;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .filter-btn.active {
          background: var(--accent);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 156, 69, 0.2);
        }

        .btn-icon {
          display: flex;
          align-items: center;
        }

        /* Slider Track and Containers */
        .slider-wrapper {
          position: relative;
          width: 100%;
        }

        .slider-container {
          overflow: hidden; /* Hide overflow to prevent visual glitching on sides */
          width: 100%;
          padding: 40px 0 50px 0; 
        }

        .slider-track {
          display: flex;
          width: 100%;
          gap: 0 !important;
        }

        .slider-item {
          padding: 0 20px;
          box-sizing: border-box;
        }

        /* Card Styling */
        .property-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #f1f5f9;
          box-shadow: 0 10px 25px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* High Featured Center Card Styling */
        .middle-featured-card {
          border-color: rgba(255, 156, 69, 0.35) !important;
          box-shadow: 0 25px 60px -15px rgba(255, 156, 69, 0.22) !important;
        }

        .property-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: #e2e8f0;
        }

        .card-image-box {
          position: relative;
          height: 250px;
          overflow: hidden;
          margin: 12px;
          border-radius: 20px;
        }

        .property-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .property-card:hover .property-img {
          transform: scale(1.1);
        }

        .card-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          padding: 6px 16px;
          border-radius: 6px;
          color: white;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          background: var(--accent);
          box-shadow: 0 4px 10px rgba(255, 156, 69, 0.3);
          z-index: 10;
        }

        /* Slider Navigation Arrows */
        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(4px);
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .card-image-box:hover .slider-arrow {
          opacity: 0.8;
        }

        .slider-arrow:hover {
          background: rgba(255, 255, 255, 0.4);
          opacity: 1 !important;
          transform: translateY(-50%) scale(1.05);
        }

        .arrow-left {
          left: 15px;
        }

        .arrow-right {
          right: 15px;
        }

        .card-content {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-grow: 1;
        }

        .property-rating-stars {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .property-title {
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.4;
          font-family: 'Outfit', sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
          min-height: 50px;
        }

        .property-price-row {
          display: flex;
          align-items: baseline;
        }

        .price-val {
          font-size: 24px;
          font-weight: 800;
          color: var(--secondary);
          font-family: 'Outfit', sans-serif;
        }

        .price-label {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 600;
          margin-left: 4px;
        }

        /* Features Bar at bottom */
        .property-features-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #edf4ff;
          padding: 14px 24px;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .section-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .section-title { font-size: 30px; }
          .filter-btn { padding: 10px 20px; font-size: 14px; }
          .card-image-box { height: 200px; margin: 8px; }
          .property-features-bar { flex-wrap: wrap; padding: 10px 15px; gap: 8px; justify-content: flex-start; }
          .feature-item { font-size: 10px; }
          .slider-nav-btn { width: 40px; height: 40px; }
          .btn-left { left: -10px; }
          .btn-right { right: -10px; }
          .popular-tours-section { padding: 60px 0; }
          .slider-container { padding: 20px 0 30px 0; }
        }
      `}</style>
    </section>
  );
};

export default PopularTours;
