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
    destination: searchParams.get('venueName') || initialData?.destination || searchParams.get('venue') || '',
    arrive: initialData?.arrive || searchParams.get('check_in') || '',
    depart: initialData?.depart || searchParams.get('check_out') || '',
    guests: initialData?.guests || searchParams.get('guest') || '1 Guest'
  });

  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [destError, setDestError] = useState('');
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const guestsOptions = Array.from({ length: 12 }, (_, i) => `${i + 1} Guest${i === 0 ? '' : 's'}`);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkDropdownDirection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropdownDirection(spaceAbove > spaceBelow ? 'up' : 'down');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (showDestDropdown) checkDropdownDirection(destRef);
      if (showGuestDropdown) checkDropdownDirection(guestRef);
    };

    // Listen to scroll events on the window and any scrollable parent
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showDestDropdown, showGuestDropdown]);

  const destRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const { data: searchLocations, isFetching } = useQuery({
    queryKey: ['searchLocations', searchData.destination],
    queryFn: async () => {
      if (!searchData.destination.trim()) return [];
      const response = await api.get(`/properties/search-locations?q=${encodeURIComponent(searchData.destination)}`);
      return response.data;
    },
    enabled: searchData.destination.trim().length > 0,
    staleTime: 60000,
  });

  const locations = searchLocations || [];

  useEffect(() => {
    setSearchData(prev => ({
      ...prev,
      destination: searchParams.get('venueName') || searchParams.get('venue') || initialData?.destination || prev.destination,
      arrive: searchParams.get('check_in') || initialData?.arrive || prev.arrive,
      depart: searchParams.get('check_out') || initialData?.depart || prev.depart,
      guests: searchParams.get('guest') || initialData?.guests || prev.guests
    }));
  }, [searchParams, initialData?.destination, initialData?.arrive, initialData?.depart, initialData?.guests]);

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
    if (searchData.arrive) params.set('check_in', searchData.arrive);
    if (searchData.depart) params.set('check_out', searchData.depart);
    if (searchData.guests) params.set('guest', searchData.guests);
    
    // Pass the actual display name to persist in the input
    if (searchData.destination) params.set('venueName', searchData.destination);

    if (selectedLocation) {
      if (selectedLocation.type === 'country') {
        navigate(`/listing/countries/${selectedLocation.id}?${params.toString()}`);
      } else if (selectedLocation.type === 'state' || selectedLocation.type === 'city') {
        if (selectedLocation.type === 'city') {
          // Pass the city name specifically so the listing page can auto-filter by it
          const cityName = selectedLocation.label.split(',')[0].trim();
          params.set('searchedCity', cityName);
        }
        navigate(`/listing/states/${selectedLocation.stateId}?${params.toString()}`);
      } else {
        if (searchData.destination) params.set('venue', selectedLocation.id);
        navigate(`/listing?${params.toString()}`);
      }
    } else {
      if (searchData.destination) params.set('venue', searchData.destination);
      navigate(`/listing?${params.toString()}`);
    }
  };

  return (
    <div className={`search-bar-container ${className || ''}`} style={style}>
      <div className="search-bar-content">
        {/* Destination */}
        <div className="search-item" ref={destRef} style={{ flex: 1.5 }}>
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
                setSelectedLocation(null); // Reset selection when user types
                const isShowing = e.target.value.trim().length > 0;
                setShowDestDropdown(isShowing);
                if (isShowing) checkDropdownDirection(destRef);
                if (e.target.value.trim()) setDestError('');
              }}
              onClick={(e) => {
                const isShowing = (e.target as HTMLInputElement).value.trim().length > 0;
                setShowDestDropdown(isShowing);
                if (isShowing) checkDropdownDirection(destRef);
              }}
            />
            {destError && (
              <div className="error-tooltip">
                {destError}
              </div>
            )}
            {showDestDropdown && (
              <div
                className="dropdown-menu dest-dropdown"
                style={dropdownDirection === 'up' ? { bottom: 'calc(100% - 0px)', top: 'auto' } : { top: 'calc(100% - 10px)', bottom: 'auto' }}
              >
                {locations.length > 0 ? (
                  <>
                    <div className="dropdown-group-title">Matches</div>
                    {locations.map((loc: any, idx: number) => (
                      <div
                        key={`loc-${loc.type}-${loc.id}-${idx}`}
                        className="dropdown-option"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSearchData({ ...searchData, destination: loc.label });
                          setSelectedLocation(loc);
                          setShowDestDropdown(false);
                        }}
                      >
                        <MapPin size={14} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: '#999' }} />
                        {loc.label}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="dropdown-empty" style={{ padding: '12px 16px', color: '#999' }}>
                    {isFetching ? 'Searching...' : 'No locations found'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="separator-line" />

        {/* Date Range Picker */}
        <DatePicker
          selectsRange={true}
          startDate={searchData.arrive ? new Date(searchData.arrive) : undefined}
          endDate={searchData.depart ? new Date(searchData.depart) : undefined}
          onChange={(update: [Date | null, Date | null]) => {
            const [start, end] = update;
            setSearchData(prev => {
              let arrive = prev.arrive;
              let depart = prev.depart;
              if (start) {
                const year = start.getFullYear();
                const month = String(start.getMonth() + 1).padStart(2, '0');
                const day = String(start.getDate()).padStart(2, '0');
                arrive = `${year}-${month}-${day}`;
              } else {
                arrive = '';
              }
              if (end) {
                const year = end.getFullYear();
                const month = String(end.getMonth() + 1).padStart(2, '0');
                const day = String(end.getDate()).padStart(2, '0');
                depart = `${year}-${month}-${day}`;
              } else {
                depart = '';
              }
              return { ...prev, arrive, depart };
            });
          }}
          monthsShown={isMobile ? 1 : 2}
          minDate={new Date()}
          wrapperClassName="date-picker-range-wrapper"
          customInput={
            <div style={{ display: 'flex', width: '100%', height: '100%', cursor: 'pointer' }}>
              <div className="search-item" style={{ flex: 1, paddingRight: '15px' }}>
                <CalendarIcon className="item-icon" size={24} />
                <div className="item-text" style={{ flex: 1 }}>
                  <p className="item-label">Arrive</p>
                  <div className="item-value-display">
                    {searchData.arrive || <span style={{ color: '#777' }}>Check-in Date</span>}
                  </div>
                </div>
              </div>
              <div className="separator-line" />
              <div className="search-item" style={{ flex: 1, paddingLeft: '15px' }}>
                <CalendarIcon className="item-icon" size={24} />
                <div className="item-text" style={{ flex: 1 }}>
                  <p className="item-label">Depart</p>
                  <div className="item-value-display">
                    {searchData.depart || <span style={{ color: '#777' }}>Check-out Date</span>}
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <div className="separator-line" />

        {/* Guests */}
        <div className="search-item" ref={guestRef}>
          <Users className="item-icon" size={24} onClick={() => {
            const willShow = !showGuestDropdown;
            setShowGuestDropdown(willShow);
            if (willShow) checkDropdownDirection(guestRef);
          }} style={{ cursor: 'pointer' }} />
          <div className="item-text" onClick={() => {
            const willShow = !showGuestDropdown;
            setShowGuestDropdown(willShow);
            if (willShow) checkDropdownDirection(guestRef);
          }} style={{ cursor: 'pointer' }}>
            <p className="item-label">Guests</p>
            <div className="item-value-display">
              {searchData.guests} <ChevronDown size={14} />
            </div>
          </div>
          {showGuestDropdown && (
            <div
              className="dropdown-menu"
              style={dropdownDirection === 'up' ? { bottom: 'calc(100% - 0px)', top: 'auto', left: 0 } : { top: 'calc(100% - 10px)', bottom: 'auto', left: 0 }}
            >
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
        .search-bar-container { background: white; border-radius: 12px; padding: 0; box-shadow: 0 30px 60px rgba(0,0,0,0.25); overflow: visible; z-index: 999; position: relative; }
        .search-bar-content { display: flex; align-items: center; height: 90px; }
        .search-item { flex: 1; display: flex; align-items: center; gap: 15px; padding: 0 30px; transition: background 0.3s ease; cursor: pointer; height: 100%; position: relative; }
        .search-item:hover { background: #fcfcfc; }
        .item-text { text-align: left; width: 100%; }
        .item-icon { color: var(--accent); flex-shrink: 0; }
        .item-label { font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0; line-height: 1.2; }
        .item-input { border: none; background: transparent; font-size: 14px; font-weight: 500; color: #777; width: 100%; outline: none; padding: 4px 0 0 0; }
        .item-input::placeholder { color: #777; }
        .date-input { cursor: pointer; }
        .item-value-display { font-size: 13px; font-weight: 500; color: #777; margin: 4px 0 0 0; display: flex; align-items: center; gap: 8px; }
        
        .dropdown-menu { opacity: 1; pointer-events: all; position: absolute; top: calc(100% - 10px); left: 0; width: 100%; min-width: 250px; background: white; border-radius: 12px; box-shadow: 0 15px 40px rgba(0,0,0,0.12); border: 1px solid #eaeaea; z-index: 9999999; max-height: 280px; overflow-y: auto; padding: 10px 0;}
        .dropdown-menu::-webkit-scrollbar { width: 6px; }
        .dropdown-menu::-webkit-scrollbar-track { background: transparent; }
        .dropdown-menu::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        
        .dropdown-group-title { padding: 8px 25px; font-size: 11px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; background: #fafafa; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; margin: 4px 0; }
        .dropdown-group-title:first-child { border-top: none; margin-top: 0; }
        
        .dropdown-option { padding: 10px 25px; font-size: 14px; font-weight: 500; color: #444; transition: all 0.2s ease; cursor: pointer; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dropdown-option:hover { background: #f8fafc; color: var(--accent); padding-left: 30px; }

        .separator-line { width: 1px; height: 50px; background: #eee; }
        .search-btn-full { background: var(--accent); color: white; padding: 0 45px; height: 100%; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; border: none; cursor: pointer; margin-left: auto; border-radius: 0 12px 12px 0;}
        .search-btn-full:hover { background: #1a1a1a; }
        
        /* React Datepicker Custom Overrides */
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__input-container { width: 100%; }
        .react-datepicker__input-container input { width: 100%; border: none; background: transparent; font-size: 14px; font-weight: 500; color: #777; outline: none; padding: 4px 0 0 0; cursor: pointer; font-family: inherit;}
        
        .react-datepicker { font-family: inherit; border: none; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); padding: 15px; }
        .react-datepicker__header { background-color: white; border-bottom: none; padding-top: 10px; }
        .react-datepicker__current-month { font-size: 17px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; }
        .react-datepicker__day-name { color: #1a1a1a; font-weight: 700; font-size: 13px; width: 40px; line-height: 40px; margin: 0; }
        .react-datepicker__day { width: 40px; line-height: 40px; font-weight: 500; color: #1a1a1a; border-radius: 50%; margin: 0; transition: all 0.2s ease; outline: none; }
        .react-datepicker__day:hover { background-color: #f1f5f9; color: var(--accent); border-radius: 50%; }
        .react-datepicker__day--in-range { background-color: #f1f5f9 !important; color: #1a1a1a !important; border-radius: 0; }
        .react-datepicker__day--range-start, .react-datepicker__day--selecting-range-start { background-color: var(--accent) !important; color: white !important; border-radius: 50% 0 0 50% !important; }
        .react-datepicker__day--range-end { background-color: var(--accent) !important; color: white !important; border-radius: 0 50% 50% 0 !important; }
        .react-datepicker__day--range-start.react-datepicker__day--range-end { border-radius: 50% !important; }
        .react-datepicker__day--keyboard-selected { background-color: transparent; }
        .react-datepicker__day--outside-month { color: #ccc; }
        .react-datepicker__day--disabled { color: #ccc !important; cursor: not-allowed; opacity: 0.5; pointer-events: none; }
        .react-datepicker__day--disabled:hover { background-color: transparent !important; color: #ccc !important; }
        .react-datepicker__triangle { display: none; }
        .react-datepicker__navigation { top: 25px; }
        
        .date-picker-range-wrapper { flex: 2; height: 100%; display: flex; }
        .date-picker-range-wrapper .react-datepicker__input-container { display: flex; width: 100%; height: 100%; }
        
        @media (max-width: 1024px) {
          .search-bar-content { flex-direction: column; height: auto; }
          .search-item { width: 100%; padding: 25px; height: auto; }
          .separator-line { display: none; }
          .search-btn-full { width: 100%; height: 70px; border-radius: 0 0 12px 12px; }
          .dropdown-menu { position: static; box-shadow: none; border: 1px solid #eee; margin-top: 10px; border-radius: 8px; }
          
          .date-picker-range-wrapper { width: 100%; }
          .date-picker-range-wrapper .react-datepicker__input-container > div { flex-direction: column !important; }
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
