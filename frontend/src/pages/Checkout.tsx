import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Phone, Check } from 'lucide-react';

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

  const { data, isLoading, error } = useQuery({
    queryKey: ['property-detail-checkout', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}/details`);
      return response.data;
    },
    enabled: !!id,
  });

  // Calculate pricing based on property data
  const property = data?.property || {};
  const extras = data?.property_extras || {};

  const nightlyBaseRate = parseFloat(property.rates?.[0]?.nightly || '0') || 250;
  const petFee = parseFloat(extras.petFee || '0') || 0;
  const cleaningFee = parseFloat(extras.cleaningFee || '0') || 75;
  const taxesRate = parseFloat(extras.taxes || '0') || 10;

  let stayNights = 0;
  if (checkIn && checkOut) {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    stayNights = Math.max(0, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  }

  const baseRentTotal = stayNights * nightlyBaseRate;
  const taxesTotal = Math.round((baseRentTotal * taxesRate) / 100);
  const totalRent = baseRentTotal + petFee + cleaningFee + taxesTotal;

  // Get hero image
  const defaultImage = data?.default_image;
  const heroImageUrl = defaultImage?.imageName || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!mobile.trim()) newErrors.mobile = 'Mobile is required';
    if (!agreed) newErrors.agreed = 'You must agree to the rental policies';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
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
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setErrors({ submit: err.response?.data?.message || 'Failed to submit booking' });
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
                        <input type="email" placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: errors.email ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
                        {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                      </div>
                      <div>
                        <input type="tel" placeholder="Mobile" value={mobile} onChange={e => { setMobile(e.target.value); setErrors(prev => ({ ...prev, mobile: '' })) }} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: errors.mobile ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
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
                      <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
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
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Total: {formatPrice(totalRent)}</h3>
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
          <div className="checkout-right" style={{ position: 'sticky', top: '130px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#1e293b', fontWeight: 700 }}>
                <Phone size={18} color="#2563eb" /> For booking assistance, call +1 408 520 9124
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                Rental Number: {property.propertyId || property.id}
              </div>

              <div style={{ height: '192px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <img src={heroImageUrl} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

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
                  <span>{formatPrice(nightlyBaseRate)} x {stayNights} nights</span>
                  <span style={{ fontWeight: 500, color: '#1e293b' }}>{formatPrice(baseRentTotal)}</span>
                </div>
                {petFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                    <span>Pet Fee</span>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>{formatPrice(petFee)}</span>
                  </div>
                )}
                {cleaningFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                    <span>Cleaning Fee</span>
                    <span style={{ fontWeight: 500, color: '#1e293b' }}>{formatPrice(cleaningFee)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#475569' }}>
                  <span>Taxes & Fees</span>
                  <span style={{ fontWeight: 500, color: '#1e293b' }}>{formatPrice(taxesTotal)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>{formatPrice(totalRent)}</span>
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
    </div>
  );
};

export default Checkout;
