import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCurrency } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'framer-motion';
import api, { API_BASE_URL } from '../services/api';
import {
  Star,
  Users,
  Bath,
  BedDouble,
  Compass,
  Layers,
  ArrowUpDown,
  Check,
  Calendar,
  DollarSign,
  Coffee,
  Shield,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plane,
  Waves,
  Train,
  Utensils,
  Map,
  Sparkles,
  Info
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PropertyImage = ({ photo, idx, fallbackImages, alt, className, style, onClick, lightbox }: any) => {
  const [candidateIdx, setCandidateIdx] = useState(0);
  let candidates = photo?.imageCandidates || [photo?.imageName || fallbackImages[idx % fallbackImages.length]];

  if (lightbox) {
    const propertyVer = candidates.find((c: string) => c.includes('uploads/property/') && !c.includes('thumbnail'));
    if (propertyVer) {
      candidates = [propertyVer, ...candidates.filter((c: string) => c !== propertyVer)];
    }
  }

  const currentSrc = candidates[candidateIdx] || fallbackImages[idx % fallbackImages.length];

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onClick={onClick}
      onError={(e) => {
        if (candidateIdx < candidates.length - 1) {
          setCandidateIdx(prev => prev + 1);
        } else {
          (e.target as HTMLImageElement).src = fallbackImages[idx % fallbackImages.length];
        }
      }}
    />
  );
};

const MotionPropertyImage = ({ photo, idx, fallbackImages, alt, initial, animate, exit, transition, style }: any) => {
  const [candidateIdx, setCandidateIdx] = useState(0);
  const candidates = photo?.imageCandidates || [photo?.imageName || fallbackImages[idx % fallbackImages.length]];
  const currentSrc = candidates[candidateIdx] || fallbackImages[idx % fallbackImages.length];

  return (
    <motion.img
      src={currentSrc}
      alt={alt}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      style={style}
      onError={(e) => {
        if (candidateIdx < candidates.length - 1) {
          setCandidateIdx(prev => prev + 1);
        } else {
          (e.target as HTMLImageElement).src = fallbackImages[idx % fallbackImages.length];
        }
      }}
    />
  );
};

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  // Booking Calculator States
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [bookingChildrenCount, setBookingChildrenCount] = useState<number>(0);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  // Message Enquiry States
  const [enquiryFirstName, setEnquiryFirstName] = useState<string>('');
  const [enquiryLastName, setEnquiryLastName] = useState<string>('');
  const [enquiryEmail, setEnquiryEmail] = useState<string>('');
  const [enquiryPhone, setEnquiryPhone] = useState<string>('');
  const [enquiryArrival, setEnquiryArrival] = useState<string>('');
  const [enquiryDeparture, setEnquiryDeparture] = useState<string>('');
  const [enquiryFlexible, setEnquiryFlexible] = useState<boolean>(false);
  const [enquiryAdults, setEnquiryAdults] = useState<number>(1);
  const [enquiryChildren, setEnquiryChildren] = useState<number>(0);
  const [enquiryMessage, setEnquiryMessage] = useState<string>('');
  const [enquiryCountry, setEnquiryCountry] = useState<string>('United States');
  const [enquirySent, setEnquirySent] = useState<boolean>(false);
  const [enquiryLoading, setEnquiryLoading] = useState<boolean>(false);

  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [enquiryErrors, setEnquiryErrors] = useState<Record<string, string>>({});

  // Calendar navigation state
  const [calendarBaseYear, setCalendarBaseYear] = useState<number>(new Date().getFullYear());
  const [calendarBaseMonth, setCalendarBaseMonth] = useState<number>(new Date().getMonth());

  // Sticky Navigation State
  const [activeSection, setActiveSection] = useState<string>('overview');
  // const { formatPrice } = useCurrency();

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'photos', 'availability', 'rates', 'amenities'];
      const scrollPosition = window.scrollY + 120; // Offset for 
      // sticky menu

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          if (scrollPosition >= elementTop) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const topPos = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({
        top: topPos,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  const navMonth = (delta: number) => {
    let m = calendarBaseMonth + delta;
    let y = calendarBaseYear;
    while (m > 11) { m -= 12; y++; }
    while (m < 0) { m += 12; y--; }
    setCalendarBaseMonth(m);
    setCalendarBaseYear(y);
  };
  const navYear = (delta: number) => navMonth(delta * 12);

  // Fetch single property details
  const { data, isLoading, error } = useQuery({
    queryKey: ['property-detail', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}/details`);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await api.get('/properties/countries');
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <div className="loading-spinner"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading luxury property details...</p>
          </div>
        </main>
        <Footer />
        <style>{`
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--border);
            border-top: 4px solid var(--secondary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !data || !data.property) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32">
          <div className="glass-card max-w-md w-full p-8 text-center rounded-[2rem] border border-slate-200 shadow-xl mx-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">Property Not Found</h1>
            <p className="text-slate-500 mb-6">
              The property you are looking for does not exist or has been removed from our listings.
            </p>
            <Link to="/listing" className="btn-primary inline-block w-full py-3 rounded-xl font-bold text-center">
              Back to Search
            </Link>
          </div>
        </main>
        <Footer />
        <style>{`
          .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
          }
          .btn-primary {
            background: linear-gradient(135deg, var(--secondary) 0%, #1e40af 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(58, 134, 255, 0.3);
            transition: all 0.3s ease;
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(58, 134, 255, 0.4);
          }
        `}</style>
      </div>
    );
  }

  const {
    property,
    default_image,
    image: otherImages,
    bookings = [],
    amenities = {},
    rates = [],
    property_extras: extras = {},
    nearby_places: nearby = {},
    bedding_info: bedding = [],
    user_detail: assignedUser = {},
    creator_detail: host = {},
    country,
    state,
    city,
    property_type
  } = data;

  // Parse blocked dates from the JSON string stored in property.calendarBlockedDates
  let blockedDatesMap: Record<string, string> = {};
  try {
    if (property.calendarBlockedDates) {
      if (typeof property.calendarBlockedDates === 'string') {
        blockedDatesMap = JSON.parse(property.calendarBlockedDates);
      } else if (typeof property.calendarBlockedDates === 'object') {
        blockedDatesMap = property.calendarBlockedDates;
      }
    }
  } catch (e) {
    console.error("Failed to parse calendar blocked dates", e);
  }

  // Compile image list safely
  const allPhotos: any[] = [];
  if (default_image) {
    allPhotos.push(default_image);
  }
  if (Array.isArray(otherImages)) {
    allPhotos.push(...otherImages);
  }

  const fallbackImages = [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800"
  ];
  const hash = (property.propertyHeadline || "").split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

  const getPhotoUrl = (photoObj: any, idx: number) => {
    if (photoObj && photoObj.imageName) {
      return photoObj.imageName;
    }
    return fallbackImages[(hash + idx) % fallbackImages.length];
  };

  // Resilient parsing for list amenities
  const parseList = (val: any): string[] => {
    if (!val) return [];

    const cleanItem = (item: string) => {
      if (typeof item !== 'string') return item;
      return item.replace(/\s*Available$/i, '').trim();
    };

    if (typeof val === 'string') {
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            return parsed.map(cleanItem);
          }
        } catch (e) {
          // ignore
        }
      }
      return val.split(',').map(cleanItem).filter(Boolean);
    }
    if (Array.isArray(val)) return val.map(cleanItem);
    return [];
  };

  const parsedPopularAmenities = parseList(amenities?.popularAmenities);
  const parsedOutdoorAmenities = parseList(amenities?.outdoorFeatures);
  const parsedKitchenAmenities = parseList(amenities?.kitchenDining);
  const parsedSafetyAmenities = parseList(amenities?.safetyFeatures);
  const parsedEntertainment = parseList(amenities?.entertainment);
  const parsedPoolSpa = parseList(amenities?.poolSpa);
  const parsedThemes = parseList(amenities?.themes);
  const parsedOtherServices = parseList(amenities?.otherServices);

  // Additional Info lists
  const parsedAttractions = parseList(amenities?.attractions);
  const parsedLeisure = parseList(amenities?.leisure);
  const parsedSports = parseList(amenities?.sports);
  const parsedLocalServices = parseList((amenities as any)?.localServices);

  // Filter bedding records
  const beddingRecords = bedding[0] || {};
  const beddingItems = [];
  if (beddingRecords.king) beddingItems.push({ name: 'King Bed', count: beddingRecords.king });
  if (beddingRecords.queen) beddingItems.push({ name: 'Queen Bed', count: beddingRecords.queen });
  if (beddingRecords.doubleBed) beddingItems.push({ name: 'Double Bed', count: beddingRecords.doubleBed });
  if (beddingRecords.twinSingle) beddingItems.push({ name: 'Twin/Single Bed', count: beddingRecords.twinSingle });
  if (beddingRecords.childBed) beddingItems.push({ name: 'Child Bed', count: beddingRecords.childBed });
  if (beddingRecords.babyCrib) beddingItems.push({ name: 'Baby Crib', count: beddingRecords.babyCrib });
  if (beddingRecords.sleepSofaFuton) beddingItems.push({ name: 'Sofa / Futon', count: beddingRecords.sleepSofaFuton });

  // Map Nearby Attractions
  const attractionIcons: Record<string, any> = {
    airport: Plane,
    beach: Waves,
    ferry: Waves,
    train: Train,
    highway: Map,
    bar: Coffee,
    ski: Sparkles,
    golf: Sparkles,
    restaurant: Utensils,
    motor: Map,
  };

  const nearbyItems = [];
  if (nearby.nearestAirport) nearbyItems.push({ type: 'airport', label: 'Nearest Airport', name: nearby.nearestAirport, distance: nearby.airportDistance });
  if (nearby.nearestBeach) nearbyItems.push({ type: 'beach', label: 'Nearest Beach', name: nearby.nearestBeach, distance: nearby.beachDistance });
  if (nearby.nearestFerry) nearbyItems.push({ type: 'ferry', label: 'Nearest Ferry', name: nearby.nearestFerry, distance: nearby.ferryDistance });
  if (nearby.nearestTrain) nearbyItems.push({ type: 'train', label: 'Nearest Train', name: nearby.nearestTrain, distance: nearby.trainDistance });
  if (nearby.nearestHighway) nearbyItems.push({ type: 'highway', label: 'Nearest Highway', name: nearby.nearestHighway, distance: nearby.highwayDistance });
  if (nearby.nearestBar) nearbyItems.push({ type: 'bar', label: 'Nearest Bar', name: nearby.nearestBar, distance: nearby.barDistance });
  if (nearby.nearestSki) nearbyItems.push({ type: 'ski', label: 'Nearest Ski', name: nearby.nearestSki, distance: nearby.skiDistance });
  if (nearby.nearestGolf) nearbyItems.push({ type: 'golf', label: 'Nearest Golf', name: nearby.nearestGolf, distance: nearby.golfDistance });
  if (nearby.nearestRestaurant) nearbyItems.push({ type: 'restaurant', label: 'Nearest Restaurant', name: nearby.nearestRestaurant, distance: nearby.restaurantDistance });

  const isDateBookedStatus = (year: number, month: number, day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // First check the explicit calendarBlockedDates map from the admin
    if (blockedDatesMap[formattedDate] && blockedDatesMap[formattedDate] !== 'available') {
      return blockedDatesMap[formattedDate];
    }

    // Fallback to checking active bookings array
    const bookingRecord = bookings.find((b: any) => {
      const bDate = new Date(b.theDate);
      return bDate.getFullYear() === year && bDate.getMonth() === month && bDate.getDate() === day;
    });

    if (bookingRecord && bookingRecord.status && bookingRecord.status !== 'available') {
      return 'booked';
    }

    return null;
  };

  console.log('property', property.rates);


  // Calculate reservation details using legacy booking rates logic
  const nightlyBaseRate = parseFloat(property.rates?.[0]?.nightly || '0') || 0;

  const calculateLegacyRates = () => {
    let selectedDates: string[] = [];
    if (checkIn && checkOut) {
      // Support YYYY-MM-DD and MM/DD/YYYY cleanly
      const start = new Date(checkIn.includes('-') ? checkIn.replace(/-/g, '\/') : checkIn);
      const end = new Date(checkOut.includes('-') ? checkOut.replace(/-/g, '\/') : checkOut);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          selectedDates.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
        }
      }
    }

    if (!selectedDates || selectedDates.length === 0) {
      return {
        totalNightlyRate: 0, petFee: 0, cleaningFee: 0, subtotal: 0,
        taxPercentage: 0, taxAmount: 0, damageProtection: 0, grandTotal: 0, numberOfNights: 0
      };
    }

    const halfBookedDates: string[] = [];
    selectedDates.forEach(dateStr => {
      const parts = dateStr.split('-');
      const status = isDateBookedStatus(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (status === 'am' || status === 'pm') {
        halfBookedDates.push(dateStr);
      }
    });

    const rates = {
      nightly: parseFloat(property.rates?.[0]?.nightly || '0') || 0,
      weekend_night: parseFloat(property.rates?.[0]?.weekendNight || property.rates?.[0]?.weekend || '0') || null
    };

    let totalNightlyRate = 0;
    const datesToProcess = [...selectedDates];

    // 1. Calculate Checkout Day (Always 50%)
    if (datesToProcess.length > 1) {
      const checkoutDateStr = datesToProcess.pop();
      if (checkoutDateStr) {
        // Fix timezone issue when parsing 'YYYY-MM-DD'
        const parts = checkoutDateStr.split('-');
        const checkoutDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const dayOfWeek = checkoutDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const rate = (isWeekend && rates.weekend_night) ? rates.weekend_night : rates.nightly;
        totalNightlyRate += (rate / 2);
      }
    }

    // 2. Calculate Remaining Days
    for (const dateStr of datesToProcess) {
      const parts = dateStr.split('-');
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const rate = (isWeekend && rates.weekend_night) ? rates.weekend_night : rates.nightly;

      if (halfBookedDates.includes(dateStr)) {
        totalNightlyRate += (rate / 2);
      } else {
        totalNightlyRate += rate;
      }
    }

    const parseFee = (fee?: string | null) => {
      if (!fee) return 0;
      const numericStr = fee.replace(/[^0-9.]/g, '');
      return parseFloat(numericStr) || 0;
    };

    const petFeeVal = parseFee(extras?.petFee);
    const cleaningFeeVal = parseFee(extras?.cleaningFee);
    const damageProtectionVal = parseFee(extras?.damageProtection);
    const taxPercentageVal = parseFee(extras?.taxes);

    const subtotalVal = totalNightlyRate + petFeeVal + cleaningFeeVal;
    const taxAmountVal = (subtotalVal * taxPercentageVal) / 100;
    const grandTotalVal = Math.round(subtotalVal + taxAmountVal + damageProtectionVal);

    return {
      totalNightlyRate,
      petFee: petFeeVal,
      cleaningFee: cleaningFeeVal,
      subtotal: subtotalVal,
      taxPercentage: taxPercentageVal,
      taxAmount: Math.round(taxAmountVal),
      damageProtection: damageProtectionVal,
      grandTotal: grandTotalVal,
      numberOfNights: selectedDates.length > 1 ? selectedDates.length - 1 : 0
    };
  };

  const bookingResult = calculateLegacyRates();
  const stayNights = bookingResult.numberOfNights;
  const baseRentTotal = bookingResult.totalNightlyRate;
  const petFee = bookingResult.petFee;
  const cleaningFee = bookingResult.cleaningFee;
  const taxesTotal = bookingResult.taxAmount;
  const damageProtection = bookingResult.damageProtection;
  const totalRent = bookingResult.grandTotal;

  // Comparison comparison values
  const competitorFeeMarkup = Math.round(totalRent * 0.15); // typical 15% markup

  const isRangeAvailable = () => {
    if (!checkIn || !checkOut) return false;

    // Support YYYY-MM-DD and MM/DD/YYYY cleanly
    const start = new Date(checkIn.includes('-') ? checkIn.replace(/-/g, '\/') : checkIn);
    const end = new Date(checkOut.includes('-') ? checkOut.replace(/-/g, '\/') : checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    if (start >= end) return false;

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      if (isDateBookedStatus(d.getFullYear(), d.getMonth(), d.getDate())) return false;
    }
    return true;
  };

  const available = isRangeAvailable();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!checkIn) newErrors.checkIn = 'Check In date is required';
    if (!checkOut) newErrors.checkOut = 'Check Out date is required';
    if (!guestsCount) newErrors.guestsCount = 'Number of adults is required';

    if (Object.keys(newErrors).length > 0) {
      setBookingErrors(newErrors);
      return;
    }

    const maxSleeps = property?.sleeps ? parseInt(property.sleeps as any) : 8;
    if (guestsCount + bookingChildrenCount > maxSleeps) {
      setBookingErrors({ submit: `The maximum number of guests this property can accommodate is ${maxSleeps}.` });
      return;
    }

    if (!available) {
      setBookingErrors({ submit: 'Selected dates are not available.' });
      return;
    }

    setBookingErrors({});
    navigate(`/checkout/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guestsCount=${guestsCount}&childrenCount=${bookingChildrenCount}`);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!enquiryFirstName.trim()) newErrors.firstName = 'First name is required';
    if (!enquiryLastName.trim()) newErrors.lastName = 'Last name is required';
    if (!enquiryEmail.trim()) newErrors.email = 'Email is required';
    if (!enquiryMessage.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setEnquiryErrors(newErrors);
      return;
    }

    setEnquiryErrors({});
    setEnquiryLoading(true);

    try {
      await api.post(`/admin/properties/${id}/enquire`, {
        firstName: enquiryFirstName,
        lastName: enquiryLastName,
        email: enquiryEmail,
        phone: enquiryPhone,
        country: enquiryCountry,
        arrival: enquiryArrival,
        departure: enquiryDeparture,
        adults: enquiryAdults,
        children: enquiryChildren,
        message: enquiryMessage
      });

      setEnquirySent(true);
      setTimeout(() => {
        setEnquiryFirstName('');
        setEnquiryLastName('');
        setEnquiryEmail('');
        setEnquiryPhone('');
        setEnquiryArrival('');
        setEnquiryDeparture('');
        setEnquiryAdults(1);
        setEnquiryChildren(0);
        setEnquiryMessage('');
        setEnquirySent(false);
      }, 3000);
    } catch (err: any) {
      console.error('Failed to send enquiry:', err);
      setEnquiryErrors({ submit: err.response?.data?.message || 'Failed to send enquiry. Please try again.' });
    } finally {
      setEnquiryLoading(false);
    }
  };

  // Admin-matching calendar: Monday-based week, ghost days, navigable
  const generateMonthDays = (baseYear: number, baseMonth: number, offsetMonths: number) => {
    let month = baseMonth + offsetMonths;
    let year = baseYear;
    while (month > 11) { month -= 12; year++; }
    while (month < 0) { month += 12; year--; }

    const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    // Monday-based: Sun => 6 blank slots, Mon => 0, Tue => 1, ...
    const startingPadding = firstDay === 0 ? 6 : firstDay - 1;
    const ghostDays = Array.from({ length: startingPadding }, (_, i) =>
      prevMonthTotalDays - startingPadding + 1 + i
    );
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    // Add trailing ghost days to complete the last row
    const totalCellsSoFar = startingPadding + totalDays;
    const trailingPadding = totalCellsSoFar % 7 === 0 ? 0 : 7 - (totalCellsSoFar % 7);
    const trailingGhostDays = Array.from({ length: trailingPadding }, (_, i) => i + 1);

    return { monthName, ghostDays, days, trailingGhostDays, year, month };
  };

  const calendarMonths = [0, 1, 2, 3].map(offset =>
    generateMonthDays(calendarBaseYear, calendarBaseMonth, offset)
  );

  // const calendarMonths = [generateMonthDays(0), generateMonthDays(1), generateMonthDays(2), generateMonthDays(3)];

  return (
    <div className="property-detail-page bg-slate-50 min-h-screen text-slate-800" style={{ overflowX: 'clip', width: '100%' }}>
      <style>{`
/* Basic layout utilities */
.flex{display:flex;}
.flex-col{flex-direction:column;}
.flex-row{flex-direction:row;}
.md\:flex-row{display:flex;flex-direction:row;}
.gap-8{gap:2rem;}
.gap-4{gap:1rem;}
.gap-2{gap:0.5rem;}
.w-full{width:100%;}
.max-w-7xl{max-width:80rem;}
.mx-auto{margin-left:auto;margin-right:auto;}
.p-8{padding:2rem;}
.p-6{padding:1.5rem;}
.p-4{padding:1rem;}
.pb-6{padding-bottom:1.5rem;}
.pt-6{padding-top:1.5rem;}
.text-6xl{font-size:4rem;}
.text-4xl{font-size:2.25rem;}
.text-5xl{font-size:3rem;}
.text-2xl{font-size:1.5rem;}
.text-xl{font-size:1.25rem;}
.text-base{font-size:1rem;}
.text-base{font-size:0.875rem;}
.font-black{font-weight:900;}
.font-bold{font-weight:700;}
.tracking-tight{letter-spacing:-0.025em;}
.leading-tight{line-height:1.25;}
.text-slate-900{color:#0f172a;}
.text-slate-800{color:#1e293b;}
.text-slate-600{color:#475569;}
.text-slate-500{color:#64748b;}
.text-slate-400{color:#94a3b8;}
.bg-white{background-color:#ffffff;}
.bg-slate-50{background-color:#f8fafc;}
.bg-slate-900{background-color:#0f172a;}
.border{border-width:1px;}
.border-slate-200{border-color:#e2e8f0;}
.border-slate-300{border-color:#cbd5e1;}
.border-slate-100{border-color:#f1f5f9;}
.rounded{border-radius:0.25rem;}
.rounded-lg{border-radius:0.5rem;}
.rounded-xl{border-radius:0.75rem;}
.rounded-2xl{border-radius:1rem;}
.rounded-[2rem]{border-radius:2rem;}
.shadow-sm{box-shadow:0 1px 2px 0 rgba(0,0,0,0.05);}
.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1);}
.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1);}
.border-t{border-top-width:1px;}
.border-b{border-bottom-width:1px;}
.border-l{border-left-width:1px;}
.border-r{border-right-width:1px;}
.text-center{text-align:center;}
.text-left{text-align:left;}
.overflow-x-auto{overflow-x:auto;}
.overflow-hidden{overflow:hidden;}
.object-cover{object-fit:cover;}
.object-contain{object-fit:contain;}
.aspect-square{aspect-ratio:1/1;}
.cursor-pointer{cursor:pointer;}
.cursor-not-allowed{cursor:not-allowed;}
.hover\:bg-slate-50:hover{background-color:#f8fafc;}
.hover\:bg-white:hover{background-color:#ffffff;}
.hover\:text-secondary:hover{color:var(--secondary);}
.transition-all{transition:all 0.3s ease;}
.transition-colors{transition:color 0.3s ease;}
.bg-[#fe9d3d]{background-color:#fe9d3d;}
.text-white{color:#ffffff;}
.text-[#fe9d3d]{color:#fe9d3d;}
.bg-[#1e293b]{background-color:#1e293b;}
.text-[#1e293b]{color:#1e293b;}
.bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops));}
.from-[#fe9d3d]{--tw-gradient-from:#fe9d3d;--tw-gradient-stops:#fe9d3d, var(--tw-gradient-to,rgba(255,255,255,0));}
.to-slate-50{--tw-gradient-to:#f8fafc;}
.from-slate-50{--tw-gradient-from:#f8fafc;--tw-gradient-stops:#f8fafc, var(--tw-gradient-to,rgba(0,0,0,0));}
.to-[#fe9d3d]{--tw-gradient-to:#fe9d3d;}
.font-medium{font-weight:500;}
.font-normal{font-weight:400;}
.text-xs{font-size:0.75rem;}
.text-base{font-size:0.875rem;}
.text-base{font-size:1rem;}
.text-lg{font-size:1.125rem;}
.text-xl{font-size:1.25rem;}
.text-2xl{font-size:1.5rem;}
.text-3xl{font-size:1.875rem;}
.text-4xl{font-size:2.25rem;}
.text-5xl{font-size:3rem;}
.text-6xl{font-size:4rem;}
.grid{display:grid;}
.grid-cols-7{grid-template-columns:repeat(7, minmax(0, 1fr));}
.grid-cols-1{grid-template-columns:repeat(1, minmax(0, 1fr));}
.grid-cols-2{grid-template-columns:repeat(2, minmax(0, 1fr));}
.grid-cols-3{grid-template-columns:repeat(3, minmax(0, 1fr));}
.grid-cols-4{grid-template-columns:repeat(4, minmax(0, 1fr));}
.grid-cols-5{grid-template-columns:repeat(5, minmax(0, 1fr));}
.grid-cols-12{grid-template-columns:repeat(12, minmax(0, 1fr));}
.border-r-white{border-right-color:#ffffff;}
.border-[#1e293b]{border-color:#1e293b;}
.border-[#fe9d3d]{border-color:#fe9d3d;}
.text-white{color:#ffffff;}
.bg-white/10{background-color:rgba(255,255,255,0.1);}
.bg-white/50{background-color:rgba(255,255,255,0.5);}
.bg-black/50{background-color:rgba(0,0,0,0.5);}
.bg-black/0{background-color:rgba(0,0,0,0);}
.bg-black/95{background-color:rgba(0,0,0,0.95);}
.bg-white/80{background-color:rgba(255,255,255,0.8);}
.bg-white/95{background-color:rgba(255,255,255,0.95);}
.z-10{z-index:10;}
.z-[100]{z-index:100;}
.absolute{position:absolute;}
.relative{position:relative;}
.sticky{position:sticky;}
.top-0{top:0;}
.top-6{top:1.5rem;}
.left-4{left:1rem;}
.right-4{right:1rem;}
.inset-0{top:0;right:0;bottom:0;left:0;}
.translate-y-1\/2{transform:translateY(50%);}
.-translate-y-1\/2{transform:translateY(-50%);}
.-ml-1{margin-left:-0.25rem;}
.-ml-1{margin-left:-0.25rem;}
.-ml-1{margin-left:-0.25rem;}
.opacity-0{opacity:0;}
.opacity-100{opacity:1;}
.group:hover .group-hover\:opacity-100{opacity:1;}
.group:hover .group-hover\:bg-black\/10{background-color:rgba(0,0,0,0.1);}
.shadow-2xl{box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);}
        @media (max-width: 768px) {
          .property-detail-page .container { padding: 0 15px !important; }
          .property-detail-page .container[style] { margin-top: 100px !important; padding: 0 15px !important; }
          .property-detail-page .main-layout { flex-direction: column !important; }
          .property-detail-page .left-column { width: 100% !important; padding-right: 0 !important; }
          .property-detail-page .right-column { width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-top: 20px !important; }
          .property-detail-page .hero-image-container { height: 300px !important; }
          .property-detail-page .sticky-nav { overflow-x: auto !important; white-space: nowrap !important; padding-bottom: 10px !important; justify-content: flex-start !important; top: 17px !important;}
          .property-detail-page .sticky-nav::-webkit-scrollbar { height: 4px; }
          .property-detail-page .sticky-nav::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
          .property-detail-page .photo-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .property-detail-page .calendar-grid { grid-template-columns: 1fr !important; }
          .property-detail-page .amenities-grid { grid-
          template-columns: 1fr !important; gap: 8px !important; }
          .property-detail-page .mobile-rates-overflow { overflow-x: auto; }
        }
`}</style>
      <Navbar />

      <div className="container max-w-7xl mx-auto px-8 md:px-8" style={{ marginTop: '180px', padding: '0 80px' }}>
        <SearchBar />
      </div>

      {/* 70/30 Split Layout */}
      <div className="container max-w-7xl mx-auto px-8 md:px-8 py-4" style={{ marginTop: '60px', padding: '0 80px' }}>
        <div className="flex flex-row gap-8 main-layout">

          {/* Left Column (70%) */}
          <div className="flex flex-col gap-8 left-column" style={{ width: '70%', paddingRight: '1.5rem' }}>
            {/* Hero Title Bar */}
            <div className="px-6 md:px-8" style={{ padding: '1.5rem', background: '#fff' }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#1e293b', lineHeight: '1.2', margin: 0 }}>
                    {property.propertyHeadline || 'Luxury Retreat'}
                  </h3>
                </div>
              </div>
            </div>

            {/* Full-width Hero Image */}
            <div className="w-full bg-slate-900">
              <div className="w-full">
                {allPhotos.length > 0 && (
                  <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden shadow-2xl hero-image-container">
                    <PropertyImage
                      photo={allPhotos[0]}
                      idx={0}
                      fallbackImages={fallbackImages}
                      alt="Main Property View"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Navigation Menu */}
            <div className="sticky-nav px-6 md:px-8" style={{ position: 'sticky', top: '70px', zIndex: 40, background: '#fff', padding: '12px', marginTop: '10px', marginBottom: '10px', display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0' }}>
              {['OVERVIEW', 'PHOTOS', 'AVAILABILITY', 'RATES', 'AMENITIES'].map((item) => {
                const id = item.toLowerCase();
                const isActive = activeSection === id;
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(id)}
                    style={{
                      background: isActive ? 'transparent' : '#e2e8f0',
                      color: isActive ? '#0284c7' : '#64748b',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Property Narrative / Description */}
            <section id="overview" className="py-12 px-6 md:px-8 bg-white" style={{ marginTop: '20px', padding: '12px' }}>
              <div className="w-full">
                <h3 className="fontSize: '22px', fontWeight: 600, font-black text-slate-900 mb-6 font-outfit" style={{ fontSize: '22px', fontWeight: 600 }}>
                  {property.propertyHeadline}
                </h3>
                <div
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed prose-p:mb-4 prose-a:text-secondary hover:prose-a:text-blue-600"
                  style={{ fontSize: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: property.propertyDescription || 'No detailed narrative loaded.' }}
                />
              </div>
            </section>
            {/* Suitability & Photos (From Screenshot) */}
            <section id="photos" className="py-8 px-6 md:px-8 bg-white w-full" style={{ padding: '12px' }}>
              <div className="w-full">

                {/* Suitability */}
                <div className="mb-8">
                  <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '1rem' }} />
                  <h2 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                    Suitability :
                  </h2>
                  <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '1.5rem' }}>
                    {[
                      amenities?.childrenSuitability,
                      amenities?.smokingSuitability,
                      amenities?.wheelchairSuitability,
                      amenities?.petsSuitability,
                      amenities?.otherSuitability
                    ].filter(Boolean).join(' , ') || 'Not specified'}
                  </p>

                  {/* Nearby Places */}
                  {nearbyItems.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                      <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Map size={20} className="text-blue-600" /> Nearby Places
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                        {nearbyItems.map((item, idx) => {
                          const Icon = attractionIcons[item.type] || Map;
                          const distanceParts = item.distance ? item.distance.split(',') : ['0.00', 'MILES'];
                          const distVal = distanceParts[0];
                          const distUnit = distanceParts[1] || 'MILES';

                          return (
                            <div
                              key={idx}
                              className="group transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                              style={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '16px 20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', transition: 'all 0.2s ease-in-out' }} className="group-hover:bg-blue-50 group-hover:text-blue-700">
                                  <Icon size={20} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem', marginBottom: '2px' }}>{item.label}</span>
                                  <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: '#f1f5f9', padding: '6px 10px', borderRadius: '8px' }}>
                                <span style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 700, lineHeight: '1' }}>
                                  {distVal}
                                </span>
                                <span style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '4px' }}>
                                  {distUnit}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Gallery Collage (Pure Grid) */}
                {allPhotos.length > 0 && (
                  <div id="photos" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: 'repeat(2, 220px)',
                    gap: '16px',
                    width: '100%',
                    marginTop: '20px'
                  }}>
                    {/* Main large photo */}
                    <div
                      className="relative cursor-pointer group shadow-md"
                      style={{ gridColumn: 'span 2', gridRow: 'span 2', borderRadius: '20px', overflow: 'hidden' }}
                      onClick={() => { setActiveImageIndex(0); setLightboxOpen(true); }}
                    >
                      <PropertyImage 
                        photo={allPhotos[0]} 
                        idx={0} 
                        fallbackImages={fallbackImages} 
                        alt="Main Gallery" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                        className="transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>

                    {/* Right side 4 small photos */}
                    {allPhotos.slice(1, 5).map((photo, idx) => {
                      const actualIdx = idx + 1;
                      return (
                        <div
                          key={actualIdx}
                          className="relative cursor-pointer group shadow-sm"
                          style={{ gridColumn: 'span 1', gridRow: 'span 1', borderRadius: '16px', overflow: 'hidden' }}
                          onClick={() => { setActiveImageIndex(actualIdx); setLightboxOpen(true); }}
                        >
                          <PropertyImage 
                            photo={photo} 
                            idx={actualIdx} 
                            fallbackImages={fallbackImages} 
                            alt={`Gallery ${actualIdx + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                            className="transition-transform duration-500 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" style={{ zIndex: 5 }}></div>

                          {/* Overlay for the 5th photo if there are more */}
                          {idx === 3 && allPhotos.length > 5 && (
                            <div className="absolute inset-0 flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10 }}>
                              <span className="text-white font-bold text-2xl tracking-wide">+{allPhotos.length - 5} Photos</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </section>

            {/* Interactive Calendar widget */}
            <section id="availability" className="px-6 md:px-8" style={{ padding: '2rem', background: '#fff', width: '100%' }}>
              <div style={{ width: '100%' }}>
                {/* Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                  <button onClick={() => navYear(-1)} style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', background: '#fff', color: '#64748b', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Prev Year">
                    <ChevronLeft size={12} /><ChevronLeft size={12} style={{ marginLeft: '-4px' }} />
                  </button>
                  <button onClick={() => navMonth(-1)} style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', background: '#fff', color: '#64748b', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Prev Month">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => navMonth(1)} style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', background: '#fff', color: '#64748b', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Next Month">
                    <ChevronRight size={14} />
                  </button>
                  <button onClick={() => navYear(1)} style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', background: '#fff', color: '#64748b', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Next Year">
                    <ChevronRight size={12} /><ChevronRight size={12} style={{ marginLeft: '-4px' }} />
                  </button>
                </div>

                <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  {calendarMonths.map((m, mIdx) => {
                    const weekendRate = rates && rates.length > 0
                      ? (parseFloat(rates[0].weekendNight || rates[0].weekend || '0') || nightlyBaseRate)
                      : nightlyBaseRate;

                    return (
                      <div key={mIdx} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>

                        {/* Month Header */}
                        <div style={{ background: '#1e293b', color: '#fff', textAlign: 'center', fontWeight: 700, fontSize: '1rem', padding: '10px 4px', letterSpacing: '0.03em' }}>
                          {m.monthName}
                        </div>

                        {/* Day-of-week header row - also dark navy like the screenshot */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#1e293b' }}>
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, di) => (
                            <div key={di} style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, padding: '6px 2px', borderRight: di < 6 ? '1px solid rgba(255,255,255,0.08)' : 'none', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                              {d}
                            </div>
                          ))}
                        </div>

                        {/* Calendar grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>

                          {/* Ghost days from previous month */}
                          {m.ghostDays.map((gDay, i) => {
                            const colIdx = i % 7;
                            const isLastCol = colIdx === 6;
                            return (
                              <div key={`ghost-${i}`} style={{ textAlign: 'center', padding: '6px 2px', background: '#fafafa', borderRight: !isLastCol ? '1px solid #e2e8f0' : 'none', borderBottom: '1px solid #e2e8f0', minHeight: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: '#c0cfe0', fontSize: '0.82rem', fontWeight: 500 }}>{gDay}</span>
                              </div>
                            );
                          })}

                          {/* Current month days */}
                          {m.days.map((day, i) => {
                            const status = isDateBookedStatus(m.year, m.month, day);

                            const totalIdx = m.ghostDays.length + i;
                            const colIdx = totalIdx % 7; // 0=Mon … 5=Sat, 6=Sun
                            const isWeekend = colIdx === 5 || colIdx === 6;
                            const isLastCol = colIdx === 6;
                            const isBooked = status === 'booked';
                            const isAM = status === 'am' || status === 'booked-am';
                            const isPM = status === 'pm' || status === 'booked-pm';

                            const cellDate = new Date(m.year, m.month, day);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isPast = cellDate < today;

                            // Find the dynamic rate for this specific date
                            let matchedRate = null;
                            if (rates && rates.length > 0) {
                              for (const r of rates) {
                                if (r.startDate && r.endDate) {
                                  const s = new Date(r.startDate); s.setHours(0, 0, 0, 0);
                                  const e = new Date(r.endDate); e.setHours(23, 59, 59, 999);
                                  if (cellDate >= s && cellDate <= e) {
                                    matchedRate = r;
                                    break;
                                  }
                                }
                              }
                              // Fallback to a default rate if no dates are set on it
                              if (!matchedRate) {
                                const defaultRate = rates.find((r: any) => !r.startDate && !r.endDate);
                                if (defaultRate) matchedRate = defaultRate;
                                // If still no rate, fallback to the first rate to ensure we show a price
                                else matchedRate = rates[0];
                              }
                            }

                            const dynamicNightly = matchedRate ? (parseFloat(matchedRate.nightly || '0') || nightlyBaseRate) : nightlyBaseRate;
                            const dynamicWeekend = matchedRate ? (parseFloat(matchedRate.weekendNight || matchedRate.weekend || '0') || dynamicNightly) : weekendRate;

                            const displayRate = isWeekend && dynamicWeekend !== dynamicNightly ? dynamicWeekend : dynamicNightly;
                            const priceLabel = displayRate > 0 ? '$' + displayRate : null;
                            const priceColor = isWeekend && dynamicWeekend !== dynamicNightly ? '#e07b1a' : '#fe9d3d';

                            let bgColor = '#fff';
                            let numColor = '#1e293b';
                            let gradientBg: string | undefined;

                            if (isBooked) { bgColor = '#132742'; numColor = '#fff'; }
                            else if (isAM) { gradientBg = 'linear-gradient(135deg, #132742 50%, #ffffff 50%)'; numColor = '#132742'; }
                            else if (isPM) { gradientBg = 'linear-gradient(135deg, #ffffff 50%, #132742 50%)'; numColor = '#132742'; }

                            const isAvailable = !isBooked && !isAM && !isPM && !isPast;

                            return (
                              <div
                                key={day}
                                style={{ textAlign: 'center', padding: '6px 2px', background: gradientBg || bgColor, borderRight: !isLastCol ? '1px solid #e2e8f0' : 'none', borderBottom: '1px solid #e2e8f0', minHeight: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: !isAvailable ? 'not-allowed' : 'pointer', opacity: isPast && !isBooked ? 0.6 : 1 }}
                                onMouseEnter={e => { if (isAvailable) (e.currentTarget as HTMLDivElement).style.background = '#f1f5f9'; }}
                                onMouseLeave={e => { if (isAvailable) (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}
                              >
                                <span style={{ color: numColor, fontSize: '0.85rem', fontWeight: 600, lineHeight: '1' }}>{day}</span>
                                {isAvailable && priceLabel && (
                                  <span style={{ color: priceColor, fontSize: '0.68rem', fontWeight: 500, marginTop: '3px', lineHeight: '1' }}>{priceLabel}</span>
                                )}
                              </div>
                            );
                          })}

                          {/* Trailing ghost days */}
                          {m.trailingGhostDays?.map((gDay, i) => {
                            const totalIdx = m.ghostDays.length + m.days.length + i;
                            const colIdx = totalIdx % 7;
                            const isLastCol = colIdx === 6;
                            return (
                              <div key={`trailing-${i}`} style={{ textAlign: 'center', padding: '6px 2px', background: '#fafafa', borderRight: !isLastCol ? '1px solid #e2e8f0' : 'none', borderBottom: '1px solid #e2e8f0', minHeight: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: '#c0cfe0', fontSize: '0.82rem', fontWeight: 500 }}>{gDay}</span>
                              </div>
                            );
                          })}

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend (Key) */}
                <div style={{ marginTop: '2rem', width: '100%' }}>
                  <div style={{ background: '#132742', padding: '0.75rem', textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                    Key
                  </div>
                  <div style={{ background: '#f3f4f6', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '1rem', color: '#132742' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '36px', height: '36px', background: '#fff', display: 'inline-block' }}></span>
                      <span>Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '36px', height: '36px', background: '#132742', display: 'inline-block' }}></span>
                      <span>Booked</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '36px', height: '36px', display: 'inline-block', background: 'linear-gradient(135deg, #132742 50%, #ffffff 50%)' }}></span>
                      <span>Booked am</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '36px', height: '36px', display: 'inline-block', background: 'linear-gradient(135deg, #ffffff 50%, #132742 50%)' }}></span>
                      <span>Booked pm</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>
                    Last updated: {new Date(property.updatedAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
                  </div>
                </div>
              </div>
            </section>

            {/* Rates Section */}
            <section id="rates" className="py-8 px-6 md:px-8 bg-white w-full" style={{ padding: '12px' }}>
              <div className="w-full">
                {rates && rates.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl shadow-sm border border-slate-200" style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '700px' }}>
                      <thead style={{ backgroundColor: '#1e293b', color: '#fff' }}>
                        <tr>
                          <th style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.9rem', width: '35%', whiteSpace: 'nowrap' }}>Rate Period</th>
                          <th style={{ padding: '16px 12px', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Nightly</th>
                          <th style={{ padding: '16px 12px', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Weekend</th>
                          <th style={{ padding: '16px 12px', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Weekly</th>
                          <th style={{ padding: '16px 12px', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Monthly</th>
                          <th style={{ padding: '16px 24px 16px 12px', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Event</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rates.map((rate: any, idx: number) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: '#fff', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            <td style={{ padding: '20px' }}>
                              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', marginBottom: '8px', lineHeight: '1.4' }}>{rate.seasonName || `Standard Rates`}</div>
                              <div style={{ color: '#64748b', fontSize: '1rem', fontWeight: 600, display: 'inline-block', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                                Min Stay: {rate.minimumStay || '3 Nights'}
                              </div>
                            </td>
                            <td style={{ padding: '20px 12px', color: '#475569', fontWeight: 600, textAlign: 'center', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                              {rate.nightly ? '$' + (rate.nightly) : <span style={{ color: '#cbd5e1' }}>-</span>}
                            </td>
                            <td style={{ padding: '20px 12px', color: '#475569', fontWeight: 600, textAlign: 'center', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                              {rate.weekendNight || rate.weekend ? '$' + (rate.weekendNight || rate.weekend) : <span style={{ color: '#cbd5e1' }}>-</span>}
                            </td>
                            <td style={{ padding: '20px 12px', color: '#475569', fontWeight: 600, textAlign: 'center', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                              {rate.weekly ? '$' + (rate.weekly) : <span style={{ color: '#cbd5e1' }}>-</span>}
                            </td>
                            <td style={{ padding: '20px 12px', color: '#475569', fontWeight: 600, textAlign: 'center', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                              {rate.monthly ? '$' + (rate.monthly) : <span style={{ color: '#cbd5e1' }}>-</span>}
                            </td>
                            <td style={{ padding: '20px 24px 20px 12px', color: '#475569', fontWeight: 600, textAlign: 'center', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                              {rate.event ? '$' + (rate.event) : <span style={{ color: '#cbd5e1' }}>-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500 font-medium">
                    No rates available for this property yet.
                  </div>
                )}
              </div>
            </section>

            {/* Additional Rate Information */}
            <section className="px-6 md:px-8" style={{ padding: '2rem', background: '#fff', width: '100%' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
                Additional Information About Rental Rates
              </h2>
              <div className="overflow-x-auto w-full">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                  <tbody>
                    {extras?.refundableDamageDeposit && (
                      <tr style={{ background: '#f3f4f6' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b', width: '40%', borderBottom: '1px solid #e2e8f0' }}>Refundable Damage Deposit</td>
                        <td style={{ padding: '10px 14px', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>{extras.refundableDamageDeposit}</td>
                      </tr>
                    )}
                    {extras?.petFee && (
                      <tr style={{ background: '#fff' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>Pet Fee</td>
                        <td style={{ padding: '10px 14px', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>{extras.petFee}</td>
                      </tr>
                    )}
                    {extras?.cleaningFee && (
                      <tr style={{ background: '#f3f4f6' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>Cleaning Fee</td>
                        <td style={{ padding: '10px 14px', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>{extras.cleaningFee}</td>
                      </tr>
                    )}
                    {extras?.taxes && (
                      <tr style={{ background: '#fff' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>Taxes</td>
                        <td style={{ padding: '10px 14px', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>{extras.taxes}%</td>
                      </tr>
                    )}
                    {extras?.paymentTerms && (
                      <tr style={{ background: '#f3f4f6' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #e2e8f0', verticalAlign: 'top' }}>Payment Terms</td>
                        <td style={{ padding: '10px 14px', color: '#475569', borderBottom: '1px solid #e2e8f0', lineHeight: '1.7' }}
                          dangerouslySetInnerHTML={{ __html: extras.paymentTerms }}
                        />
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cancellation Policy */}
              {extras?.cancellationPolicy && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem', marginBottom: '0.5rem' }}>Cancellation Policy:</div>
                  <div style={{ color: '#3b82f6', fontSize: '1rem', lineHeight: '1.7' }}
                    dangerouslySetInnerHTML={{ __html: extras.cancellationPolicy }}
                  />
                </div>
              )}
            </section>
            {/* Amenities Section Wrapper */}
            <section className="py-8 px-6 md:px-8 bg-white w-full" style={{ padding: '12px' }}>
              {/* Property Type (Start of Amenities group) */}
              <div id="amenities" style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>Property Type</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0', color: '#64748b', fontSize: '1rem' }}>
                  {property_type?.propertyName || property.propertyType || <span style={{ fontStyle: 'italic' }}>Not specified</span>}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Meals */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>Meals</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0', color: '#64748b', fontSize: '1rem' }}>
                  {extras?.meals || amenities?.meals || amenities?.accommodationType || <span style={{ fontStyle: 'italic' }}>Guests provide their own meals</span>}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* General Amenities */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>General</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0' }}>
                  {parsedPopularAmenities.length > 0 ? (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {parsedPopularAmenities.map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {['Internet', 'Heating', 'Washing Machine', 'Garage', 'Hair Dryer', 'Fireplace', 'Linens', 'Clothes Dryer', 'Living Room', 'Iron & Board', 'Air Conditioning', 'Towels', 'Parking', 'Fitness Room / Equipment'].map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Kitchen */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>Kitchen</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0' }}>
                  {parsedKitchenAmenities.length > 0 ? (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {parsedKitchenAmenities.map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {['Kitchen', 'Oven', 'Dishes And Utensils', 'Toaster', 'Refrigerator', 'Microwave', 'Pantry Items', 'Child Highchair', 'Stove', 'Dishwasher', 'Coffee Maker'].map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Dining */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>Dining</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0', color: '#64748b', fontSize: '1rem' }}>
                  {amenities?.diningArea ? (
                    <>{amenities.diningArea}{amenities.diningSeats ? ` With ${amenities.diningSeats} Seats` : ''}</>
                  ) : (
                    <span style={{ color: '#64748b' }}>Dining Area With 20 Seats</span>
                  )}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Bedrooms / Bedding */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>Bedrooms</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0' }}>
                  {beddingItems.length > 0 ? (
                    <>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '0.75rem' }}>
                        <div style={{ color: '#64748b', fontSize: '1rem' }}>Bedrooms - {beddingItems.reduce((acc, b) => acc + (b.count ? parseInt(b.count as any) || 0 : 0), 0) || property.bedrooms || 'Not specified'}</div>
                        <div style={{ color: '#64748b', fontSize: '1rem' }}>Sleeps - {property.sleeps || 'Not specified'}</div>
                      </div>
                      <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                        {beddingItems.map((b, i) => (
                          <div key={i} style={{ fontSize: '1rem', color: '#64748b' }}>
                            {b.name} - {b.count || 0}
                          </div>
                        ))}
                      </div>
                      {beddingRecords?.note && (
                        <div style={{ marginTop: '0.75rem', fontSize: '1rem', color: '#1e293b' }}>
                          <span style={{ fontWeight: 700 }}>Note:</span> <span style={{ color: '#64748b' }}>{beddingRecords.note}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '0.75rem' }}>
                        <div style={{ color: '#64748b', fontSize: '1rem' }}>Bedrooms - 8</div>
                        <div style={{ color: '#64748b', fontSize: '1rem' }}>Sleeps - 20</div>
                      </div>
                      <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                        {['King Size Beds - 9', 'Queen Size Beds - 5', 'Twin Beds - 2', 'Sleeping Sofa/Futon - 0'].map((b, i) => (
                          <div key={i} style={{ fontSize: '1rem', color: '#64748b' }}>{b}</div>
                        ))}
                      </div>
                      <div style={{ marginTop: '0.75rem', fontSize: '1rem', color: '#1e293b' }}>
                        <span style={{ fontWeight: 700 }}>Note:</span> <span style={{ color: '#64748b' }}>5 bedrooms in the main mansion (no stairs) 1 bedroom upstairs in mansion 2 bedrooms in the casitas</span>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Entertainment */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>Entertainment</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0' }}>
                  {parsedEntertainment.length > 0 ? (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {parsedEntertainment.map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {['Television Available', 'Stereo Available', 'Pool Table Available', 'Satellite / Cable Available', 'Games Available', 'Ping Pong Table Available', 'Video Games Available', 'Game Room Available', 'Foosball Available'].map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Outdoor Features */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>OutDoor Features</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0' }}>
                  {parsedOutdoorAmenities.length > 0 ? (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {parsedOutdoorAmenities.map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {['Outdoor Grill Available', 'Deck / Patio Available', 'Lawn / Garden Available'].map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Pool & Spa */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>Pool &amp; Spa Facilities</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0' }}>
                  {parsedPoolSpa.length > 0 ? (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {parsedPoolSpa.map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {['Private Pool Available', 'Hot Tub Available'].map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Themes */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>Themes</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0' }}>
                  {parsedThemes.length > 0 ? (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {parsedThemes.map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {['Away From It All', 'Family', 'Tourist Attractions'].map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Additional Info */}
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>Additional Info</div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
                <div style={{ padding: '0.75rem 0' }}>
                  {amenities?.additionalInfo ? (
                    <div className="additional-info-rich-text">
                      <div
                        className="text-slate-600 leading-relaxed"
                        style={{ fontSize: '1rem' }}
                        dangerouslySetInnerHTML={{ __html: amenities.additionalInfo }}
                      />
                      <style>{`
                        .additional-info-rich-text p { margin-bottom: 0.75rem; }
                        .additional-info-rich-text div:not(.row):not([class*="col-"]) > div:not(.row):not([class*="col-"]) { margin-bottom: 0.75rem; }
                        .additional-info-rich-text h1, .additional-info-rich-text h2, .additional-info-rich-text h3, .additional-info-rich-text h4, .additional-info-rich-text h5, .additional-info-rich-text h6 { 
                          margin-top: 1.25rem; margin-bottom: 0.5rem; color: #1e293b; font-weight: 700; 
                        }
                        .additional-info-rich-text ul { margin-bottom: 0.75rem; padding-left: 1.5rem; list-style-type: disc; }
                        .additional-info-rich-text ol { margin-bottom: 0.75rem; padding-left: 1.5rem; list-style-type: decimal; }
                        .additional-info-rich-text li { margin-bottom: 0.25rem; }
                        .additional-info-rich-text strong, .additional-info-rich-text b { color: #1e293b; font-weight: 700; }
                        /* If the editor output uses paragraphs for bold headings, add some top margin to them */
                        .additional-info-rich-text p:has(strong:only-child) { margin-top: 1.25rem; margin-bottom: 0.25rem; }

                        /* Legacy Bootstrap Grid Polyfill for Editor Content */
                        .additional-info-rich-text .row { display: flex; flex-wrap: wrap; margin-left: -15px; margin-right: -15px; margin-bottom: 1rem; }
                        .additional-info-rich-text [class*="col-"] { position: relative; width: 100%; padding-right: 15px; padding-left: 15px; }
                        @media (min-width: 640px) {
                          .additional-info-rich-text .col-md-3, .additional-info-rich-text .col-sm-3, .additional-info-rich-text .col-lg-3 { flex: 0 0 25%; max-width: 25%; }
                          .additional-info-rich-text .col-md-4, .additional-info-rich-text .col-sm-4, .additional-info-rich-text .col-lg-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
                          .additional-info-rich-text .col-md-5, .additional-info-rich-text .col-sm-5, .additional-info-rich-text .col-lg-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
                          .additional-info-rich-text .col-md-6, .additional-info-rich-text .col-sm-6, .additional-info-rich-text .col-lg-6 { flex: 0 0 50%; max-width: 50%; }
                          .additional-info-rich-text .col-md-8, .additional-info-rich-text .col-sm-8, .additional-info-rich-text .col-lg-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
                          .additional-info-rich-text .col-md-9, .additional-info-rich-text .col-sm-9, .additional-info-rich-text .col-lg-9 { flex: 0 0 75%; max-width: 75%; }
                        }
                      `}</style>
                    </div>
                  ) : (
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                      {['Winery Tours', 'Museums', 'Theme Parks', 'Water Parks', 'Zoo', 'Health/Beauty Spa'].map((item: string, i: number) => (
                        <div key={i} style={{ color: '#64748b', fontSize: '1rem' }}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ height: '1px', background: '#e2e8f0' }} />
              </div>

              {/* Dynamic Amenities */}
              {property.propertyAmenities && property.propertyAmenities.length > 0 && (
                <div style={{ width: '100%' }}>
                  {Object.entries(
                    property.propertyAmenities.reduce((acc: any, pa: any) => {
                      if (pa.amenityItem && pa.amenityItem.category) {
                        const catName = pa.amenityItem.category.name;
                        if (!acc[catName]) acc[catName] = [];
                        acc[catName].push({ name: pa.amenityItem.name, icon: pa.amenityItem.icon });
                      }
                      return acc;
                    }, {})
                  ).map(([catName, items]: any, idx) => (
                    <div key={idx}>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', padding: '0.75rem 0' }}>{catName}</div>
                      <div style={{ height: '1px', background: '#e2e8f0' }} />
                      <div style={{ padding: '0.75rem 0' }}>
                        <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 16px' }}>
                          {items.map((item: any, i: number) => (
                            <div key={i} style={{ color: '#64748b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {item.icon && (() => {
                                const IconName = item.icon.split('-').map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
                                const IconComp = (LucideIcons as any)[IconName];
                                return IconComp ? <IconComp size={14} /> : <Check size={14} />;
                              })()}
                              <span>{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </section>

          </div>

          {/* Right Column (30%) - Booking & Enquiry Widget */}
          <div className="flex flex-col gap-6 right-column" style={{ width: '30%', paddingLeft: '1rem', paddingRight: '0.5rem', paddingBottom: '2rem', marginTop: '30px' }}>
            {/* Inner wrapper */}
            <div>

              {/* Breadcrumbs */}
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>HOME</Link> /{' '}
                {country?.id ? (
                  <Link to={`/listing/countries/${country.id}`} style={{ color: '#64748b', textDecoration: 'none' }}>{country.name}</Link>
                ) : (
                  <span>{property.country || 'UNITED STATES'}</span>
                )} /{' '}
                {state?.id ? (
                  <Link to={`/listing/states/${state.id}`} style={{ color: '#64748b', textDecoration: 'none' }}>{state.name}</Link>
                ) : (
                  <span>{property.state || 'HAWAII'}</span>
                )} /{' '}
                {city?.id ? (
                  <Link to={`/listing/cities/${city.id}`} style={{ color: '#64748b', textDecoration: 'none' }}>{city.name}</Link>
                ) : (
                  <span>{property.city || 'KOHALA COAST'}</span>
                )} /{' '}
                <span style={{ color: '#1e293b' }}>RENTAL {property.propertyId || property.id || '42242'}</span>
              </div>

              {/* Property Details Grid */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: '#fff', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>Sleeps</div>
                  <div style={{ flex: 1, padding: '12px 16px', color: '#64748b', fontSize: '0.875rem' }}>{property.sleeps || 8}</div>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>Bedrooms</div>
                  <div style={{ flex: 1, padding: '12px 16px', color: '#64748b', fontSize: '0.875rem' }}>{property.bedrooms || 4}</div>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #e2e8f0', color: '#64748b', fontSize: '1rem' }}>Bathrooms</div>
                  <div style={{ flex: 1, padding: '12px 16px', color: '#64748b', fontSize: '1rem' }}>{property.bathrooms || 5}</div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #e2e8f0', color: '#64748b', fontSize: '1rem' }}>Property type</div>
                  <div style={{ flex: 1, padding: '12px 16px', color: '#64748b', fontSize: '1rem' }}>{property_type?.propertyName || property.propertyType || 'Farmhouse Rentals'}</div>
                </div>
              </div>

              {/* Book Now Section */}
              <div style={{ marginBottom: '2.5rem' }}>
                {available && (
                  <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '4px', textAlign: 'left', fontWeight: 600, marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
                    Your dates are available
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', width: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <DatePicker
                      selectsRange={true}
                      startDate={checkIn ? new Date(checkIn) : undefined}
                      endDate={checkOut ? new Date(checkOut) : undefined}
                      onChange={(update: [Date | null, Date | null]) => {
                        const [start, end] = update;
                        const formatDate = (d: Date | null) => d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '';
                        setCheckIn(formatDate(start));
                        setCheckOut(formatDate(end));
                        setBookingErrors(prev => ({ ...prev, checkIn: '', checkOut: '' }));
                      }}
                      minDate={new Date()}
                      monthsShown={1}
                      wrapperClassName="pd-date-picker-wrapper"
                      customInput={
                        <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
                          <div style={{ flex: 1, position: 'relative' }}>
                            <input type="text" placeholder="Check In" value={checkIn} readOnly style={{ width: '100%', boxSizing: 'border-box', border: bookingErrors.checkIn ? '1px solid #dc2626' : '1px solid #cbd5e1', padding: '10px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', cursor: 'pointer', background: '#fff' }} />
                            {bookingErrors.checkIn && <span className="field-error-msg">{bookingErrors.checkIn}</span>}
                          </div>
                          <div style={{ flex: 1, position: 'relative' }}>
                            <input type="text" placeholder="Check Out" value={checkOut} readOnly style={{ width: '100%', boxSizing: 'border-box', border: bookingErrors.checkOut ? '1px solid #dc2626' : '1px solid #cbd5e1', padding: '10px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', cursor: 'pointer', background: '#fff' }} />
                            {bookingErrors.checkOut && <span className="field-error-msg">{bookingErrors.checkOut}</span>}
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
                  <div style={{ flex: 1 }}>
                    <select value={guestsCount} onChange={(e) => { setGuestsCount(parseInt(e.target.value)); setBookingErrors(prev => ({ ...prev, guestsCount: '' })); }} style={{ width: '100%', boxSizing: 'border-box', border: bookingErrors.guestsCount ? '1px solid #dc2626' : '1px solid #cbd5e1', padding: '10px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', background: '#fff', cursor: 'pointer', color: '#334155' }}>
                      <option value="">Select Adults</option>
                      {Array.from({ length: property?.sleeps ? parseInt(property.sleeps as any) : 8 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    {bookingErrors.guestsCount && <span className="field-error-msg">{bookingErrors.guestsCount}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <select value={bookingChildrenCount} onChange={(e) => setBookingChildrenCount(parseInt(e.target.value))} style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: '0.9rem', borderRadius: '2px', outline: 'none', background: '#fff', cursor: 'pointer', color: '#334155' }}>
                      <option value="">Select Children</option>
                      {Array.from({ length: (property?.sleeps ? parseInt(property.sleeps as any) : 8) + 1 }, (_, i) => i).map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {(guestsCount + bookingChildrenCount > (property?.sleeps ? parseInt(property.sleeps as any) : 8)) && (
                  <div style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}>
                    The maximum number of guests this property can accommodate is {property?.sleeps ? parseInt(property.sleeps as any) : 8}.
                  </div>
                )}


                {bookingErrors.submit && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>{bookingErrors.submit}</div>}

                {available && (
                  <div style={{ marginBottom: '1.5rem', display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                        Total <span style={{ marginLeft: '1rem', color: '#fe9d3d' }}>${totalRent}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Includes taxes and fees</div>
                    </div>
                    <button type="button" onClick={() => setShowBookingModal(true)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', fontSize: '0.95rem' }}>
                      View Details
                    </button>
                  </div>
                )}

                <button style={{ width: '100%', background: '#557f9f', color: '#fff', fontWeight: 600, padding: '12px', borderRadius: '24px', fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s', opacity: bookingLoading ? 0.7 : 1 }} disabled={bookingLoading} onMouseEnter={(e) => !bookingLoading && (e.currentTarget.style.background = '#436b8a')} onMouseLeave={(e) => !bookingLoading && (e.currentTarget.style.background = '#557f9f')} onClick={handleBookingSubmit}>
                  {bookingLoading ? 'Processing...' : 'Book Now'}
                </button>
              </div>

              {/* Contact the Owner Section */}
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>Contact the owner</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.5rem' }}>Name : {assignedUser?.firstname ? `${assignedUser.firstname} ${assignedUser.lastname || ''}` : 'Property Owner'}</div>

              <form onSubmit={handleEnquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <input type="text" placeholder="First Name" value={enquiryFirstName} onChange={(e) => { setEnquiryFirstName(e.target.value); setEnquiryErrors(prev => ({ ...prev, firstName: '' })); }} style={{ width: '100%', boxSizing: 'border-box', border: enquiryErrors.firstName ? '1px solid #dc2626' : '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', color: '#334155' }} />
                  {enquiryErrors.firstName && <span className="field-error-msg">{enquiryErrors.firstName}</span>}
                </div>
                <div>
                  <input type="text" placeholder="Last Name" value={enquiryLastName} onChange={(e) => { setEnquiryLastName(e.target.value); setEnquiryErrors(prev => ({ ...prev, lastName: '' })); }} style={{ width: '100%', boxSizing: 'border-box', border: enquiryErrors.lastName ? '1px solid #dc2626' : '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', color: '#334155' }} />
                  {enquiryErrors.lastName && <span className="field-error-msg">{enquiryErrors.lastName}</span>}
                </div>
                <div>
                  <input type="email" placeholder="Email" value={enquiryEmail} onChange={(e) => { setEnquiryEmail(e.target.value); setEnquiryErrors(prev => ({ ...prev, email: '' })); }} style={{ width: '100%', boxSizing: 'border-box', border: enquiryErrors.email ? '1px solid #dc2626' : '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', color: '#334155' }} />
                  {enquiryErrors.email && <span className="field-error-msg">{enquiryErrors.email}</span>}
                </div>
                <select value={enquiryCountry} onChange={(e) => setEnquiryCountry(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', background: '#fff', color: '#334155' }}>
                  <option value="">Select a Country</option>
                  {countries.map((c: any) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <input type="tel" placeholder="Phone No" value={enquiryPhone} onChange={(e) => setEnquiryPhone(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', color: '#334155' }} />

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px', width: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <DatePicker
                      selectsRange={true}
                      startDate={enquiryArrival ? new Date(enquiryArrival) : undefined}
                      endDate={enquiryDeparture ? new Date(enquiryDeparture) : undefined}
                      onChange={(update: [Date | null, Date | null]) => {
                        const [start, end] = update;
                        const formatDate = (d: Date | null) => d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '';
                        setEnquiryArrival(formatDate(start));
                        setEnquiryDeparture(formatDate(end));
                      }}
                      minDate={new Date()}
                      monthsShown={1}
                      wrapperClassName="pd-date-picker-wrapper"
                      customInput={
                        <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
                          <input type="text" placeholder="Arrival" value={enquiryArrival} readOnly style={{ flex: 1, width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', cursor: 'pointer', background: '#fff' }} />
                          <input type="text" placeholder="Departure" value={enquiryDeparture} readOnly style={{ flex: 1, width: '100%', boxSizing: 'border-box', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', cursor: 'pointer', background: '#fff' }} />
                        </div>
                      }
                    />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: '#334155', cursor: 'pointer', margin: '4px 0' }}>
                  <input type="checkbox" checked={enquiryFlexible} onChange={(e) => setEnquiryFlexible(e.target.checked)} style={{ cursor: 'pointer' }} /> My travel dates are flexible.
                </label>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Adults</div>
                    <select value={enquiryAdults} onChange={(e) => setEnquiryAdults(parseInt(e.target.value))} style={{ width: '100%', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', background: '#fff', color: '#334155' }}>
                      <option value="">Select one</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>Children</div>
                    <select value={enquiryChildren} onChange={(e) => setEnquiryChildren(parseInt(e.target.value))} style={{ width: '100%', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', background: '#fff', color: '#334155' }}>
                      <option value="">Select one</option>
                      {[0, 1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <textarea rows={4} value={enquiryMessage} onChange={(e) => { setEnquiryMessage(e.target.value); setEnquiryErrors(prev => ({ ...prev, message: '' })); }} placeholder="Message to owner/manager" style={{ width: '100%', border: enquiryErrors.message ? '1px solid #dc2626' : '1px solid #cbd5e1', padding: '8px 12px', fontSize: '1rem', borderRadius: '2px', outline: 'none', resize: 'vertical', color: '#334155', marginTop: '4px' }} />
                  {enquiryErrors.message && <span className="field-error-msg">{enquiryErrors.message}</span>}
                </div>

                <div style={{ fontSize: '1rem', color: '#64748b', textTransform: 'uppercase', lineHeight: 1.5, marginTop: '4px' }}>
                  BY CLICKING 'SEND EMAIL' YOU ARE<br />AGREEING TO OUR <span className="hover-underline" onClick={() => setShowTermsModal(true)} style={{ color: '#557f9f', cursor: 'pointer', textDecoration: 'none' }}>TERMS AND<br />CONDITIONS</span>
                </div>

                {enquiryErrors.submit && <div style={{ color: '#dc2626', fontSize: '1rem', marginBottom: '8px', textAlign: 'center' }}>{enquiryErrors.submit}</div>}

                {enquirySent ? (
                  <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '4px', textAlign: 'center', fontWeight: 600, marginTop: '4px' }}>
                    Message sent successfully!
                  </div>
                ) : (
                  <button type="submit" disabled={enquiryLoading} style={{ width: '100%', background: '#557f9f', color: '#fff', fontWeight: 600, padding: '10px', borderRadius: '24px', fontSize: '1rem', border: 'none', cursor: enquiryLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', marginTop: '4px', opacity: enquiryLoading ? 0.7 : 1 }} onMouseEnter={(e) => !enquiryLoading && (e.currentTarget.style.background = '#436b8a')} onMouseLeave={(e) => !enquiryLoading && (e.currentTarget.style.background = '#557f9f')}>
                    {enquiryLoading ? 'Sending...' : 'Send message'}
                  </button>
                )}
              </form>

              {/* Travel Guard Promo */}
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Get Vacation Protection for Your Booking!</div>
                <a href="https://www.travelguard.com/?cmpid=kac-CJ2018-QuoteReferral&PID=7751806&cjevent=9a7eef165e4711f1828000100a18ba73" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '8px', textDecoration: 'none' }}>
                  <div style={{ border: '2px solid #0284c7', padding: '0px 4px', borderRadius: '2px' }}>
                    <span style={{ color: '#0284c7', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.5px' }}>AIG</span>
                  </div>
                  <div style={{ color: '#0284c7', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.5px' }}>Travel Guard&reg;</div>
                </a>
                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>
                  <a className="hover-underline" href="https://www.travelguard.com/?cmpid=kac-CJ2018-QuoteReferral&PID=7751806&cjevent=9a7eef165e4711f1828000100a18ba73" target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', textDecoration: 'none' }}>Get Protected Now</a> Travel with peace of mind
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      {/* Booking Summary Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: '#fff', padding: '1rem', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '95vh', overflowY: 'auto', position: 'relative' }}
            >
              <button
                onClick={() => setShowBookingModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <LucideIcons.X size={24} />
              </button>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>Booking Summary</h2>

              <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '4px', textAlign: 'left', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid #bbf7d0' }}>
                Your dates are available
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px', color: '#334155', fontWeight: 600 }}>{checkIn}</div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px', color: '#334155', fontWeight: 600 }}>{checkOut}</div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px', color: '#334155', fontWeight: 600 }}>{guestsCount} Adults</div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px', color: '#334155', fontWeight: 600 }}>{bookingChildrenCount} Children</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#475569', fontWeight: 500 }}>
                  <span>${nightlyBaseRate} x {stayNights} nights</span>
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>${baseRentTotal}</span>
                </div>
                {petFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#475569', fontWeight: 500 }}>
                    <span>Pet Fee</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>${petFee}</span>
                  </div>
                )}
                {cleaningFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#475569', fontWeight: 500 }}>
                    <span>Cleaning Fee</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>${cleaningFee}</span>
                  </div>
                )}
                {taxesTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#475569', fontWeight: 500 }}>
                    <span>Taxes</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>${taxesTotal}</span>
                  </div>
                )}
                {damageProtection > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#475569', fontWeight: 500 }}>
                    <span>Refundable Deposit</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>${damageProtection}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.5rem 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Total</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>${totalRent}</span>
              </div>

              <button
                onClick={handleBookingSubmit}
                style={{ width: '100%', background: '#0f172a', color: '#fff', fontWeight: 700, padding: '8px', borderRadius: '8px', fontSize: '1.125rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#0f172a'}
              >
                Continue Booking
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <div style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)', padding: '1.5rem 2rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', flexShrink: 0 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <LucideIcons.ShieldCheck size={28} style={{ color: '#38bdf8' }} />
                  Terms & Conditions
                </h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <LucideIcons.X size={20} />
                </button>
              </div>

              <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#475569', fontSize: '1rem', lineHeight: 1.7, background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                  <div><strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>1. COLLECTION OF INFORMATION AND IT'S PROTECTION</strong>We collect information like email addresses or other personal information required for authentication of property owners. This information is either collected through email communication or a direct phone call. This information is strictly used for owner identification and future correspondences only. We do not get involved in any information selling processes. Privacy of the information is our first priority.<br /><br />Entire property details, photos and other information is provided by the property owners. holidayhavenhomes.com is not responsible for any data duplicacy or authenticity as it is owners copyright and their responsibilty.</div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                  <div><strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>2. EMAIL MARKETING & MESSAGES</strong>We do not entertain spamming and are strictly against it. All our email messages and promotions are either to our registered owners or travelers that inquire on a property and those who have subscribed for our newsletter to receive such promotions. If you do not wish to receive emails or promotions from us, please contact SUPPORT</div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                  <div><strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>3. TELEPHONE CALLS</strong>In addition to collecting data online, we may also speak to our users on phone. This can either be for customer support or any promotional marketing which we want to explain to our users. If you wish to unsubscribe from these calls, please contact us at SUPPORT or inform the telephone representative about the same. We follow strict DNC rules.</div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                  <div><strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>4. SURVEYS</strong>We do feedback surveys from time to time and we request users to input their valuable comments on our services or their experience with us. The decision to answer the survey is solely with the user. User may or may not fill in the details depending on their discretion.</div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                  <div><strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>5. RENTAL INQUIRIES</strong>Travelers send inquiries through email contact forms on listing pages. Once a traveler choose to send an inquiry, he/she should understand that the personal information filled in the form, like email, phone and other information, will be shared with the property owner. We request users not to enter any financial information like credit card numbers or bank account information in our email contact forms.</div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                  <div><strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>6. SECURITY OF INFORMATION</strong>Guarantee valid for new listings from first time advertisers purchased from 16th March 2015 at 9 a.m. GMT (Greenwich Mean Time).</div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                  <div><strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>7. PHISHING OR FALSE EMAILS</strong>If you receive an unsolicited email requesting personal information like credit card, bank account, date of birth or even your account credentials with us, please be informed that this must be from someone trying to gain access to your information unlawfully. We do not request for such information in emails. Please contact SUPPORT if you receive something like this.</div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                  <div><strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>8. OPTING OUT OF RECEIVING MARKETING MESSAGES</strong>As a part of marketing, we may contact you through email or phone.<br />You can opt out of these marketing communications by following ways -: Contact us at SUPPORT</div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>
                  <div><strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>9. CONTACT US</strong>If you have any questions about our Terms & Conditions, Privacy Policy, Process of marketing etc, you may contact us at SUPPORT.</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            <button
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'rgba(255,255,255,0.7)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s', zIndex: 110 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              onClick={() => setLightboxOpen(false)}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div style={{ width: '100%', maxWidth: '1200px', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                style={{ color: 'rgba(255,255,255,0.7)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '1rem', transition: 'all 0.2s transform' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev === 0 ? allPhotos.length - 1 : prev - 1));
                }}
              >
                <ChevronLeft size={56} />
              </button>

              <div style={{ position: 'relative', width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AnimatePresence mode="wait">
                  <MotionPropertyImage
                    key={activeImageIndex}
                    photo={allPhotos[activeImageIndex]}
                    idx={activeImageIndex}
                    fallbackImages={fallbackImages}
                    alt={`Property Photo Full ${activeImageIndex + 1}`}
                    lightbox={true}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                  />
                </AnimatePresence>
              </div>

              <button
                style={{ color: 'rgba(255,255,255,0.7)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '1rem', transition: 'all 0.2s transform' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev === allPhotos.length - 1 ? 0 : prev + 1));
                }}
              >
                <ChevronRight size={56} />
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1.5rem', fontWeight: 600, letterSpacing: '0.1em', fontSize: '1rem' }}
            >
              {activeImageIndex + 1} / {allPhotos.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <style>{`
        .pd-date-picker-wrapper { width: 100%; display: block; }
        .pd-date-picker-wrapper .react-datepicker-wrapper { width: 100%; }
        .pd-date-picker-wrapper .react-datepicker__input-container { width: 100%; display: flex; }
        .hover-underline:hover { text-decoration: underline !important; }
      `}</style>
    </div>
  );
};

export default PropertyDetail;
