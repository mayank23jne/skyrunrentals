import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import StripePaymentModal from '../components/StripePaymentModal';
const CheckoutImageSlider = ({ photos }: { photos: any[] }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [candidateIdx, setCandidateIdx] = useState(0);

  const fallbackImage = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800";
  const photo = photos[currentIdx];

  const candidates = photo?.imageCandidates || [photo?.imageName || fallbackImage];
  const currentSrc = candidates[candidateIdx] || fallbackImage;

  React.useEffect(() => {
    setCandidateIdx(0);
  }, [currentIdx]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div style={{ height: '192px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
      <img
        src={currentSrc}
        alt="Property"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => {
          if (candidateIdx < candidates.length - 1) {
            setCandidateIdx(prev => prev + 1);
          } else {
            (e.target as HTMLImageElement).src = fallbackImage;
          }
        }}
      />
      {photos.length > 1 && (
        <>
          <button type="button" onClick={handlePrev} style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, padding: 0 }}>
            <ChevronLeft size={20} color="#1e293b" />
          </button>
          <button type="button" onClick={handleNext} style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, padding: 0 }}>
            <ChevronRight size={20} color="#1e293b" />
          </button>
          <div style={{ position: 'absolute', bottom: '8px', right: '12px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
            {currentIdx + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  );
};

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();

  // Parse query params for booking data
  const searchParams = new URLSearchParams(location.search);
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guestsCount = parseInt(searchParams.get('guestsCount') || '1');
  const childrenCount = parseInt(searchParams.get('childrenCount') || '0');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United States');
  const [zip, setZip] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['property-detail-checkout', id],
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

  // Calculate pricing based on property data
  const property = data?.property || {};
  const extras = data?.property_extras || {};

  const isDateBookedStatus = (year: number, month: number, day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const blockedDatesMap = data?.property?.calendarBlockedDates || {};
    const bookings = data?.bookings || [];

    if (blockedDatesMap[formattedDate] && blockedDatesMap[formattedDate] !== 'available') {
      return blockedDatesMap[formattedDate];
    }
    const bookingRecord = bookings.find((b: any) => {
      const bDate = new Date(b.theDate);
      return bDate.getFullYear() === year && bDate.getMonth() === month && bDate.getDate() === day;
    });
    if (bookingRecord && bookingRecord.status && bookingRecord.status !== 'available') {
      return 'booked';
    }
    return null;
  };

  const nightlyBaseRate = parseFloat(property.rates?.[0]?.nightly || '0') || 0;

  const calculateLegacyRates = () => {
    let selectedDates: string[] = [];
    if (checkIn && checkOut) {
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

    if (datesToProcess.length > 1) {
      const checkoutDateStr = datesToProcess.pop();
      if (checkoutDateStr) {
        const parts = checkoutDateStr.split('-');
        const checkoutDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const dayOfWeek = checkoutDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const rate = (isWeekend && rates.weekend_night) ? rates.weekend_night : rates.nightly;
        totalNightlyRate += (rate / 2);
      }
    }

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

  // Compile image list
  const defaultImage = data?.default_image;
  const otherImages = data?.image || [];
  let allPhotos: any[] = [];

  if (defaultImage) {
    allPhotos.push(defaultImage);
  }
  if (Array.isArray(otherImages)) {
    allPhotos.push(...otherImages);
  }

  if (allPhotos.length === 0) {
    allPhotos.push({ imageName: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800" });
  }

  // Limit to max 5 images for the checkout slider
  allPhotos = allPhotos.slice(0, 5);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (!val.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Restrict input to digits, spaces, hyphens, plus, and parentheses
    const val = e.target.value.replace(/[^\d\s\-\+()]/g, '');
    setMobile(val);

    if (!val.trim()) {
      setErrors(prev => ({ ...prev, mobile: 'Mobile is required' }));
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(val)) {
      setErrors(prev => ({ ...prev, mobile: 'Please enter a valid mobile number (at least 10 digits)' }));
    } else {
      setErrors(prev => ({ ...prev, mobile: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number (at least 10 digits)';
    }

    if (!agreed) newErrors.agreed = 'You must agree to the rental policies';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsModalOpen(true);
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      await api.post(`/properties/${id}/book`, {
        firstName,
        lastName,
        email,
        mobile,
        message,
        street,
        city,
        country,
        zip,
        adults: guestsCount,
        childs: childrenCount,
        bookingDates: `${checkIn} to ${checkOut}`,
        amount: totalRent.toString(),
      });
      setIsModalOpen(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setErrors({ submit: err.response?.data?.message || 'Failed to submit booking' });
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32">
          <div className="loading-spinner"></div>
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
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32">
          <h2>Failed to load property details.</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, paddingTop: '150px', paddingBottom: '4rem', paddingLeft: '5%', paddingRight: '5%' }}>
        <div className="checkout-layout">

          {/* Left Column - Form */}
          <div className="checkout-left" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Check size={40} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Booking Successful!</h2>
                <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '1.5rem' }}>Your booking request has been sent to the property owner.</p>
                <div className="loading-spinner" style={{ margin: '0 auto 1rem', borderTopColor: '#22c55e' }}></div>
                <p style={{ color: '#64748b' }}>Redirecting to home...</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Begin your booking</h2>
                  <p style={{ color: '#475569', fontSize: '1rem' }}>
                    <strong style={{ color: '#1e293b' }}>Book with confidence. Guaranteed.</strong><br />
                    You're covered when you book and pay on Skyrunrentals.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                  {/* Contact Info */}
                  <section>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Enter contact information</h3>
                    <div className="form-grid">
                      <div>
                        <input type="text" placeholder="First Name" value={firstName} onChange={e => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: '' })) }} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: errors.firstName ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
                        {errors.firstName && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.firstName}</span>}
                      </div>
                      <div>
                        <input type="text" placeholder="Last Name" value={lastName} onChange={e => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: '' })) }} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: errors.lastName ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
                        {errors.lastName && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.lastName}</span>}
                      </div>
                      <div>
                        <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: errors.email ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
                        {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                      </div>
                      <div>
                        <input type="tel" placeholder="Mobile" value={mobile} onChange={handleMobileChange} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: errors.mobile ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
                        {errors.mobile && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.mobile}</span>}
                      </div>
                    </div>
                  </section>

                  {/* Message */}
                  <section>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Include a message for the owner</h3>
                    <textarea rows={4} placeholder="Your Message (Optional)" value={message} onChange={e => setMessage(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', resize: 'vertical' }} />
                  </section>

                  {/* Billing Address */}
                  <section>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Billing Address</h3>
                    <div className="form-grid">
                      <input type="text" placeholder="Street" value={street} onChange={e => setStreet(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
                      <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                        <option value="">Select Country</option>
                        {countries.map((c: any) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
                      <input type="text" placeholder="Zipcode" value={zip} onChange={e => setZip(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
                    </div>
                  </section>

                  <section>
                    <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(prev => ({ ...prev, agreed: '' })) }} style={{ marginTop: '4px', width: '20px', height: '20px' }} />
                      <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                        Skyrunrentals is committed to an inclusive marketplace built on a foundation of trust, safety, and respect.<br />
                        <strong style={{ color: '#1e293b', display: 'block', marginTop: '4px' }}>I have read and agree to comply with all rental policies and terms.</strong>
                      </span>
                    </label>
                    {errors.agreed && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '8px', paddingLeft: '1rem' }}>{errors.agreed}</span>}
                  </section>

                  {errors.submit && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #fecaca' }}>{errors.submit}</div>}

                  <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Total: ${totalRent}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Includes all taxes and fees</p>
                    </div>
                    <button type="submit" disabled={loading} style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '14px 32px', borderRadius: '30px', fontSize: '1.125rem', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)' }}>
                      {loading ? 'Processing...' : 'Pay With Card'}
                    </button>
                  </section>
                </form>
              </>
            )}

            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>Payment Protection</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', color: '#475569' }}><Check size={16} color="#22c55e" /> Comprehensive Payment Protection</li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', color: '#475569' }}><Check size={16} color="#22c55e" /> Emergency Booking Assistance</li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', color: '#475569' }}><Check size={16} color="#22c55e" /> 24hr Customer Service</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="checkout-right">
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#1e293b', fontWeight: 700 }}>
                <Phone size={18} color="#2563eb" /> For booking assistance, call +1 603-333-8490
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                Rental Number: {property.propertyId || property.id}
              </div>

              <CheckoutImageSlider photos={allPhotos} />

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                {property.propertyHeadline}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {property.city}, {property.state}, {property.country}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#334155', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Check-in</span>
                  {checkIn || '-'}
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#334155', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Check-out</span>
                  {checkOut || '-'}
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#334155' }}>
                  {guestsCount} Adults
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#334155' }}>
                  {childrenCount} Children
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                  <span>Room Rate (for {stayNights} nights)</span>
                  <span style={{ fontWeight: 500, color: '#1e293b' }}>${baseRentTotal}</span>
                </div>
                {petFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                    <span>Pet Fee</span>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>${petFee}</span>
                  </div>
                )}
                {cleaningFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                    <span>Cleaning Fee</span>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>${cleaningFee}</span>
                  </div>
                )}
                {taxesTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                    <span>Taxes</span>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>${taxesTotal}</span>
                  </div>
                )}
                {damageProtection > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                    <span>Refundable Deposit</span>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>${damageProtection}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>${(totalRent)}</span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Includes taxes and fees</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
      <style>{`
        .checkout-layout {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: start;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 1024px) {
          .checkout-layout {
            grid-template-columns: 2fr 1fr;
          }
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <StripePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPay={handlePayment}
        price={`$${totalRent}`}
        isProcessing={loading}
      />
    </div>
  );
};

export default Checkout;
