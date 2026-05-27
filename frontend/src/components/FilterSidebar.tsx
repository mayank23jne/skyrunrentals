import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    priceRange: [number, number];
    cities: string[];
    propertyTypes: string[];
    viewTypes: number[];
    bedrooms: number[];
    sleeps: number[];
  };
  setFilters: React.Dispatch<React.SetStateAction<FilterSidebarProps['filters']>>;
  availableFilters: {
    cities: { id: number; name: string }[];
    propertyTypes: { id: number; propertyName: string }[];
    viewTypes: { id: number; name: string }[];
  };
  hideCityFilter?: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, availableFilters, hideCityFilter }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    city: true,
    propertyType: true,
    viewTypes: false,
    bedrooms: false,
    sleeps: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      cities: [],
      propertyTypes: [],
      viewTypes: [],
      bedrooms: [],
      sleeps: [],
    });
  };

  const handleCheckboxChange = (category: keyof FilterSidebarProps['filters'], value: any) => {
    setFilters(prev => {
      const currentValues = prev[category] as any[];
      if (currentValues.includes(value)) {
        return { ...prev, [category]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...currentValues, value] };
      }
    });
  };

  // Standard max value
  const maxAllowedPrice = 1000;
  console.log('availableFilters', availableFilters);


  return (
    <div className="filter-sidebar" style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
          <Search size={16} color="#eab308" />
          Filter By :
        </h3>
        <button
          onClick={handleClearFilters}
          style={{ background: '#475569', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
        >
          Clear Filters
        </button>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>Price Range</h4>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
            ${filters.priceRange[0]} - ${filters.priceRange[1] === maxAllowedPrice ? '1000+' : filters.priceRange[1]}
          </span>
        </div>

        <div style={{ padding: '0 8px', marginTop: '10px' }}>
          <div style={{ position: 'relative', height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
            {/* Active Track */}
            <div
              style={{
                position: 'absolute',
                height: '100%',
                background: '#0f172a',
                borderRadius: '2px',
                left: `calc(10px + ${(filters.priceRange[0] / maxAllowedPrice)} * (100% - 20px))`,
                right: `calc(10px + ${(1 - filters.priceRange[1] / maxAllowedPrice)} * (100% - 20px))`,
                transition: 'left 0.1s, right 0.1s'
              }}
            />
            
            {/* Elegant Tick Marks */}
            {[0, 250, 500, 750, 1000].map((point) => {
              const isActive = filters.priceRange[0] <= point && point <= filters.priceRange[1];
              return (
                <div
                  key={point}
                  onClick={() => {
                    const distToMin = Math.abs(filters.priceRange[0] - point);
                    const distToMax = Math.abs(filters.priceRange[1] - point);
                    if (distToMin <= distToMax) {
                      setFilters(prev => ({ ...prev, priceRange: [Math.min(point, prev.priceRange[1] - 10), prev.priceRange[1]] }));
                    } else {
                      setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Math.max(point, prev.priceRange[0] + 10)] }));
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `calc(10px + ${(point / maxAllowedPrice)} * (100% - 20px))`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '6px',
                    height: '6px',
                    backgroundColor: isActive ? '#0f172a' : '#cbd5e1',
                    borderRadius: '50%',
                    zIndex: 20,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: '14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isActive ? '#0f172a' : '#94a3b8',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer',
                    padding: '4px'
                  }}>
                    {point === 1000 ? '1k+' : point}
                  </span>
                </div>
              );
            })}

            <input
              type="range"
              min="0"
              max={maxAllowedPrice}
              step="10"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), filters.priceRange[1] - 10);
                setFilters(prev => ({ ...prev, priceRange: [val, prev.priceRange[1]] }));
              }}
              style={{ position: 'absolute', width: '100%', top: '-8px', appearance: 'none', background: 'transparent', pointerEvents: 'none', zIndex: 10 }}
              className="premium-range"
            />
            <input
              type="range"
              min="0"
              max={maxAllowedPrice}
              step="10"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), filters.priceRange[0] + 10);
                setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], val] }));
              }}
              style={{ position: 'absolute', width: '100%', top: '-8px', appearance: 'none', background: 'transparent', pointerEvents: 'none', zIndex: 11 }}
              className="premium-range"
            />
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
            .premium-range::-webkit-slider-thumb {
              pointer-events: auto;
              width: 20px;
              height: 20px;
              background: #ffffff;
              border: 2px solid #0f172a;
              border-radius: 50%;
              cursor: grab;
              -webkit-appearance: none;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
              transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .premium-range::-webkit-slider-thumb:hover {
              transform: scale(1.2);
            }
            .premium-range::-webkit-slider-thumb:active {
              cursor: grabbing;
              transform: scale(1.1);
              background: #f8fafc;
            }
          `}} />
        </div>
      </div>

      {/* City */}
      {!hideCityFilter && (
        <FilterSection
          title="City :"
          isOpen={openSections.city}
          onToggle={() => toggleSection('city')}
        >
          <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
            {availableFilters.cities.map(city => (
              <CheckboxItem
                key={city.id}
                label={city.name.toUpperCase()}
                checked={filters.cities.includes(city.name)}
                onChange={() => handleCheckboxChange('cities', city.name)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Property Type */}
      <FilterSection
        title="Property Type :"
        isOpen={openSections.propertyType}
        onToggle={() => toggleSection('propertyType')}
      >
        <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
          {availableFilters.propertyTypes.map(type => (
            <CheckboxItem
              key={type.id}
              label={type.propertyName?.toUpperCase()}
              checked={filters.propertyTypes.includes(String(type.id))}
              onChange={() => handleCheckboxChange('propertyTypes', String(type.id))}
            />
          ))}
        </div>
      </FilterSection>

      {/* View Types */}
      <FilterSection
        title="View Types :"
        isOpen={openSections.viewTypes}
        onToggle={() => toggleSection('viewTypes')}
      >
        <div style={{ maxHeight: '150px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
          {availableFilters.viewTypes.map(view => (
            <CheckboxItem
              key={view.id}
              label={view.name?.toUpperCase()}
              checked={filters.viewTypes.includes(view.id)}
              onChange={() => handleCheckboxChange('viewTypes', view.id)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection
        title="Bedrooms :"
        isOpen={openSections.bedrooms}
        onToggle={() => toggleSection('bedrooms')}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(num => (
            <CheckboxItem
              key={num}
              label={`${num} ${num === 1 ? 'Bedroom' : 'Bedrooms'}`}
              checked={filters.bedrooms.includes(num)}
              onChange={() => handleCheckboxChange('bedrooms', num)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Sleeps */}
      <FilterSection
        title="Sleeps :"
        isOpen={openSections.sleeps}
        onToggle={() => toggleSection('sleeps')}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map(num => (
            <CheckboxItem
              key={num}
              label={`Up to ${num}`}
              checked={filters.sleeps.includes(num)}
              onChange={() => handleCheckboxChange('sleeps', num)}
            />
          ))}
        </div>
      </FilterSection>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
};

const FilterSection: React.FC<{ title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 0' }}
      >
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>{title}</h4>
        {isOpen ? <ChevronUp size={18} color="#0f172a" /> : <ChevronDown size={18} color="#0f172a" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '12px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CheckboxItem: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          appearance: 'none',
          width: '16px',
          height: '16px',
          border: '1px solid #cbd5e1',
          borderRadius: '3px',
          outline: 'none',
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: checked ? '#0f172a' : 'transparent',
          transition: 'all 0.2s'
        }}
      />
      {checked && (
        <svg style={{ position: 'absolute', width: '10px', height: '10px', left: '3px', top: '3px', pointerEvents: 'none' }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>{label}</span>
    </label>
  );
};

export default FilterSidebar;
