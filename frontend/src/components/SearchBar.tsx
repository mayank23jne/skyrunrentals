import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar as CalendarIcon, Users, ChevronDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useQuery } from '@tanstack/react-query';

interface SearchBarProps {
  initialData?: {
    destination: string;
    arrive: string;
    depart: string;
    guests: string;
  };
  style?: React.CSSProperties;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialData, style, className }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchData, setSearchData] = useState({
    destination: initialData?.destination || searchParams.get('venue') || '',
    arrive: initialData?.arrive || searchParams.get('check_in') || '',
    depart: initialData?.depart || searchParams.get('check_out') || '',
    guests: initialData?.guests || searchParams.get('guest') || '1 Guest'
  });

  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [destError, setDestError] = useState('');
  const guestsOptions = Array.from({ length: 12 }, (_, i) => `${i + 1} Guest${i === 0 ? '' : 's'}`);

  const destRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await api.get('/properties/countries');
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const filteredCountries = countries?.filter((c: any) =>
    c.name.toLowerCase().includes(searchData.destination.toLowerCase())
  ) || [];

  useEffect(() => {
    setSearchData({
      destination: searchParams.get('venue') || '',
      arrive: searchParams.get('check_in') || '',
      depart: searchParams.get('check_out') || '',
      guests: searchParams.get('guest') || '1 Guest'
    });
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestDropdown(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setShowGuestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!searchData.destination.trim()) {
      setDestError("Destination or Property ID is required.");
      return;
    }
    setDestError('');

    const params = new URLSearchParams();
    if (searchData.destination) params.set('venue', searchData.destination);
    if (searchData.arrive) params.set('check_in', searchData.arrive);
    if (searchData.depart) params.set('check_out', searchData.depart);
    if (searchData.guests) params.set('guest', searchData.guests);

    navigate(`/listing?${params.toString()}`);
  };

  return (
    <div className={`search-bar-container ${className || ''}`} style={style}>
      <div className="search-bar-content">
        {/* Destination */}
        <div className="search-item" ref={destRef}>
          <MapPin className="item-icon" size={24} />
          <div className="item-text">
            <p className="item-label">Destination / Property ID</p>
            <input
              type="text"
              placeholder="Where to Go or ID?"
              className="item-input"
              value={searchData.destination}
              onChange={(e) => {
                setSearchData({ ...searchData, destination: e.target.value });
                setShowDestDropdown(e.target.value.trim().length > 0);
                if (e.target.value.trim()) setDestError('');
              }}
            />
            {destError && (
              <div className="error-tooltip">
                {destError}
              </div>
            )}
            {showDestDropdown && (
              <div className="dropdown-menu dest-dropdown">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country: any) => (
                    <div
                      key={country.id}
                      className="dropdown-option"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSearchData({ ...searchData, destination: country.name });
                        setShowDestDropdown(false);
                      }}
                    >
                      {country.name}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-option" style={{ color: '#999', cursor: 'default' }}>
                    Loading or no countries found...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="separator-line" />

        {/* Arrive */}
        <div className="search-item">
          <CalendarIcon className="item-icon" size={24} />
          <div className="item-text" style={{ flex: 1 }}>
            <p className="item-label">Arrive</p>
            <DatePicker
              selected={searchData.arrive ? new Date(searchData.arrive) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  // Format as YYYY-MM-DD to keep the date format consistent
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  setSearchData({ ...searchData, arrive: `${year}-${month}-${day}` });
                } else {
                  setSearchData({ ...searchData, arrive: '' });
                }
              }}
              placeholderText="Check-in Date"
              className="item-input date-input"
              minDate={new Date()}
            />
          </div>
        </div>

        <div className="separator-line" />

        {/* Depart */}
        <div className="search-item">
          <CalendarIcon className="item-icon" size={24} />
          <div className="item-text" style={{ flex: 1 }}>
            <p className="item-label">Depart</p>
            <DatePicker
              selected={searchData.depart ? new Date(searchData.depart) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  setSearchData({ ...searchData, depart: `${year}-${month}-${day}` });
                } else {
                  setSearchData({ ...searchData, depart: '' });
                }
              }}
              placeholderText="Check-out Date"
              className="item-input date-input"
              minDate={searchData.arrive ? new Date(searchData.arrive) : new Date()}
            />
          </div>
        </div>

        <div className="separator-line" />

        {/* Guests */}
        <div className="search-item" ref={guestRef}>
          <Users className="item-icon" size={24} onClick={() => setShowGuestDropdown(!showGuestDropdown)} style={{ cursor: 'pointer' }} />
          <div className="item-text" onClick={() => setShowGuestDropdown(!showGuestDropdown)} style={{ cursor: 'pointer' }}>
            <p className="item-label">Guests</p>
            <div className="item-value-display">
              {searchData.guests} <ChevronDown size={14} />
            </div>
          </div>
          {showGuestDropdown && (
            <div className="dropdown-menu" style={{ top: '100%', left: 0 }}>
              {guestsOptions.map(opt => (
                <div
                  key={opt}
                  className="dropdown-option"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchData({ ...searchData, guests: opt });
                    setShowGuestDropdown(false);
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="search-btn-full" onClick={handleSearch}>
          Search <Search size={18} strokeWidth={2.5} />
        </button>
      </div>

      <style>{`
        .search-bar-container { background: white; border-radius: 12px; padding: 0; box-shadow: 0 30px 60px rgba(0,0,0,0.25); overflow: visible; z-index: 100; position: relative; }
        .search-bar-content { display: flex; align-items: center; height: 90px; }
        .search-item { flex: 1; display: flex; align-items: center; gap: 15px; padding: 0 30px; transition: background 0.3s ease; cursor: pointer; height: 100%; position: relative; }
        .search-item:hover { background: #fcfcfc; }
        .item-text { text-align: left; width: 100%; }
        .item-icon { color: var(--accent); flex-shrink: 0; }
        .item-label { font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0; line-height: 1.2; }
        .item-input { border: none; background: transparent; font-size: 14px; font-weight: 500; color: #777; width: 100%; outline: none; padding: 4px 0 0 0; }
        .item-input::placeholder { color: #777; }
        .date-input { cursor: pointer; }
        .item-value-display { font-size: 14px; font-weight: 500; color: #777; margin: 4px 0 0 0; display: flex; align-items: center; gap: 8px; }
        
        .dropdown-menu { opacity: 1; pointer-events: all; position: absolute; top: calc(100% - 10px); left: 0; width: 100%; min-width: 220px; background: white; border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.12); border: 1px solid #eaeaea; z-index: 99999; max-height: 280px; overflow-y: auto; padding: 10px 0;}
        .dropdown-menu::-webkit-scrollbar { width: 6px; }
        .dropdown-menu::-webkit-scrollbar-track { background: transparent; }
        .dropdown-menu::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        
        .dropdown-option { padding: 12px 25px; font-size: 15px; font-weight: 500; color: #444; transition: all 0.2s ease; cursor: pointer; text-align: left; }
        .dropdown-option:hover { background: black; color: var(--accent); padding-left: 32px; }

        .separator-line { width: 1px; height: 50px; background: #eee; }
        .search-btn-full { background: var(--accent); color: white; padding: 0 45px; height: 100%; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; border: none; cursor: pointer; margin-left: auto; border-radius: 0 12px 12px 0;}
        .search-btn-full:hover { background: #1a1a1a; }
        
        /* React Datepicker Custom Overrides */
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__input-container { width: 100%; }
        .react-datepicker__input-container input { width: 100%; border: none; background: transparent; font-size: 14px; font-weight: 500; color: #777; outline: none; padding: 4px 0 0 0; cursor: pointer; font-family: inherit;}
        
        @media (max-width: 1024px) {
          .search-bar-content { flex-direction: column; height: auto; }
          .search-item { width: 100%; padding: 25px; height: auto; }
          .separator-line { display: none; }
          .search-btn-full { width: 100%; height: 70px; border-radius: 0 0 12px 12px; }
          .dropdown-menu { position: static; box-shadow: none; border: 1px solid #eee; margin-top: 10px; border-radius: 8px; }
        }

        .error-tooltip {
          position: absolute;
          bottom: -25px;
          left: 35px;
          color: white;
          background: #ef4444;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1000;
          animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          pointer-events: none;
          white-space: nowrap;
        }
        
        .error-tooltip::after {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 15px;
          border-width: 6px;
          border-style: solid;
          border-color: transparent transparent #ef4444 transparent;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
