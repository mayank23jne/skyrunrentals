import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import StripePaymentModal from '../components/StripePaymentModal';
import { planService, type SubscriptionPlan } from '../services/planService';
import api, { API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CreditCard, ChevronDown, CheckCircle2, Loader2, Plus } from 'lucide-react';
import loginBg from '../assets/login-bg.png';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, token } = useAuth();

  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [toastError, setToastError] = useState<string>('');

  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<string>('1');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [appliedCustomPrice, setAppliedCustomPrice] = useState<string | null>(null);
  const [appliedCustomDescription, setAppliedCustomDescription] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['subscription-plans-raw'],
    queryFn: async () => {
      const data = await planService.getPlans();
      return data;
    },
  });

  const SPECIAL_PLAN_ID = 'skyrunrental-special';

  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (plans.length > 0 && !isInitialized) {
      const searchParams = new URLSearchParams(location.search);
      const planNameFromUrl = searchParams.get('plan');

      let matchedPlanId = '';
      if (planNameFromUrl) {
        if (planNameFromUrl.toLowerCase() === 'special') {
          matchedPlanId = SPECIAL_PLAN_ID;
        } else {
          const found = plans.find((p: any) => (p?.planName || '').trim().toLowerCase() === (planNameFromUrl || '').trim().toLowerCase());
          if (found) {
            matchedPlanId = String(found?.id || '');
          }
        }
      }

      if (matchedPlanId) {
        setSelectedPlanId(matchedPlanId);
      } else if (plans[0]?.id) {
        setSelectedPlanId(String(plans[0]?.id || ''));
      }
      setIsInitialized(true);
    }
  }, [plans, location.search, isInitialized]);

  const selectedPlan = plans.find((p: any) => p?.id?.toString() === selectedPlanId) || null;
  const isSpecialPlan = selectedPlanId === SPECIAL_PLAN_ID;

  const basePrice = isSpecialPlan
    ? parseFloat(appliedCustomPrice || '0')
    : parseFloat(selectedPlan?.price || '0');

  const noOfProps = parseInt(selectedProperty, 10);
  const totalPrice = (basePrice * noOfProps).toFixed(2).replace(/\.00$/, '');

  const handleAddCustomPrice = () => {
    if (customPrice && customDescription) {
      setAppliedCustomPrice(customPrice);
      setAppliedCustomDescription(customDescription);
    }
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedPlanId(newId);
    setAppliedCustomPrice(null);
    setAppliedCustomDescription(null);

    const newPlan = plans.find((p: any) => String(p?.id || p?._id || '') === newId);
    const searchParams = new URLSearchParams(location.search);
    if (newPlan) {
      searchParams.set('plan', newPlan.planName);
    } else if (newId === SPECIAL_PLAN_ID) {
      searchParams.set('plan', 'special');
    }
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  const paymentMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        planType: isSpecialPlan ? 999 : parseInt(selectedPlanId, 10),
        amount: totalPrice,
        description: isSpecialPlan ? (appliedCustomDescription || 'Custom Plan') : `Subscribed to ${selectedPlan?.planName}`,
        noOfProperty: parseInt(selectedProperty, 10),
        userId: user?.id,
      };
      const res = await api.post('/properties/mock-payment', payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (user) {
        const updatedUser = { ...user, subscription_type: 1 };
        setUser(updatedUser);
      }
      setIsModalOpen(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        window.location.href = `${API_BASE_URL}/admin/dashboard${token ? `?token=${token}` : ''}`;
      }, 3000);
    },
    onError: (err) => {
      setIsModalOpen(false);
      setToastError('Payment processing failed. Please try again later.');
      setTimeout(() => setToastError(''), 5000);
    }
  });

  const handlePayment = () => {
    if (isSpecialPlan && (!appliedCustomPrice || !appliedCustomDescription)) {
      alert("Please add custom price and description first.");
      return;
    }
    paymentMutation.mutate();
  };

  const handleOpenModal = () => {
    if (!user) {
      alert("Please login first to make a payment.");
      return;
    }
    if (isSpecialPlan && (!appliedCustomPrice || !appliedCustomDescription)) {
      alert("Please add custom price and description first.");
      return;
    }
    setIsModalOpen(true);
  };

  const getPlanFeatures = (plan: SubscriptionPlan | null) => {
    if (!plan) return [];
    const features = [];
    for (let i = 1; i <= 13; i++) {
      const desc = (plan as any)[`description${i}`];
      if (desc && desc.trim() !== '' && desc.trim() !== '-----') {
        features.push(desc);
      }
    }
    return features;
  };

  const currentFeatures = getPlanFeatures(selectedPlan);

  const displayPrice = `$${totalPrice}`;

  const displayDesc = isSpecialPlan
    ? (appliedCustomDescription || 'Custom Duration / Features')
    : '12 Months';

  if (paymentSuccess) {
    return (
      <div className="payment-page-container" style={{ overflowX: 'hidden', width: '100%' }}>
        <Navbar />
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '20px', textAlign: 'center' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
            <CheckCircle2 size={100} color="#22c55e" style={{ marginBottom: '24px' }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: '32px', color: '#0f172a', marginBottom: '16px', fontWeight: 'bold' }}>
            Payment Successful!
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ color: '#64748b', fontSize: '18px' }}>
            Thank you for subscribing. Redirecting you to your dashboard...
          </motion.p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-page-container" style={{ overflowX: 'hidden', width: '100%' }}>
      <AnimatePresence>
        {toastError && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -50 }}
            style={{ position: 'fixed', top: '24px', right: '24px', background: '#ef4444', color: '#fff', padding: '16px 24px', borderRadius: '8px', zIndex: 9999, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <span>{toastError}</span>
            <button onClick={() => setToastError('')} style={{ color: '#fff', opacity: 0.8 }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <main className="payment-main-content">
        <div className="payment-container">

          <div className="payment-hero-header">
            <span className="premium-badge">Partner With Us</span>
            <h1 className="payment-title">Why Advertise With us</h1>
            <p className="payment-subtitle">
              Advertise your stayz property, bed and breakfast, villa, apartment, cottage, cabin with Skyrunrentals Network. Sign up in 2 minutes, and we will make your accommodation online in 24 hours.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="guarantee-banner-card"
            >
              <div className="guarantee-badge-wrapper">
                <div className="guarantee-circle">
                  <div className="guarantee-text-inner">
                    <div className="g-text-big">365-DAY</div>
                    <div className="g-text-small">100% Money Back</div>
                    <div className="g-text-bold">GUARANTEE</div>
                  </div>
                </div>
                <div className="guarantee-shield-icon">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="guarantee-info">
                <h3>Our Promise to You</h3>
                <p>
                  We guarantee you at least 3-8 bookings of your minimum stay. If this does not happen within your subscription period, you may either take a full refund or choose to stay with us for lifetime, absolutely free.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="payment-section-header">
            <h2>Choose a package and get listed now</h2>
            <p>Make a payment below to unlock global reach and more bookings.</p>
          </div>

          <div className="payment-layout-grid">
            {(!isInitialized || isLoading) ? (
              <div style={{ gridColumn: '1 / -1', padding: '100px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fe9d3d' }}>
                <Loader2 size={40} className="spin-anim" />
              </div>
            ) : (
              <>
                {/* Left Side: Form & Table */}
                <div className="payment-left-col">

                  <div className="payment-form-card">
                    <div className="form-card-header">
                      <h3>Pay For Skyrunrentals</h3>
                      <p>You are paying : <span>www.skyrunrentals.com</span></p>
                    </div>

                    <div className="form-selectors-grid">
                      <div className="form-group">
                        <label>Select Property</label>
                        <div className="select-wrapper">
                          <select
                            value={selectedProperty}
                            onChange={(e) => setSelectedProperty(e.target.value)}
                            className="custom-select"
                          >
                            {Array.from({ length: 18 }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Property' : 'Properties'}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={18} className="select-icon" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Choose Your Plan</label>
                        <div className="select-wrapper">
                          <select
                            value={selectedPlanId}
                            onChange={handlePlanChange}
                            disabled={isLoading}
                            className="custom-select"
                          >
                            {isLoading ? (
                              <option value="">Loading plans...</option>
                            ) : (
                              <>
                                {plans.map((p: any) => {
                                  const planIdStr = String(p?.id || p?._id || Math.random());
                                  return <option key={planIdStr} value={planIdStr}>{p.planName}</option>;
                                })}
                                <option value={SPECIAL_PLAN_ID}>Skyrunrental Special Plan</option>
                              </>
                            )}
                          </select>
                          <ChevronDown size={18} className="select-icon" />
                        </div>
                      </div>
                    </div>

                    {isSpecialPlan && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="special-plan-container"
                      >
                        <h4>
                          <ShieldCheck size={16} /> Custom Special Plan
                        </h4>
                        <div className="special-plan-inputs">
                          <div className="input-group">
                            <label>Other Price ($)</label>
                            <input
                              type="number"
                              value={customPrice}
                              onChange={(e) => setCustomPrice(e.target.value)}
                              placeholder="e.g. 299"
                            />
                          </div>
                          <div className="input-group group-large">
                            <label>Description / Months</label>
                            <input
                              type="text"
                              value={customDescription}
                              onChange={(e) => setCustomDescription(e.target.value)}
                              placeholder="e.g. 6 Months Custom Promo"
                            />
                          </div>
                          <button onClick={handleAddCustomPrice} className="btn-add-price">
                            <Plus size={16} /> Add Price
                          </button>
                        </div>
                      </motion.div>
                    )}

                    <div className="payment-table-wrapper">
                      <table className="payment-table">
                        <thead>
                          <tr>
                            <th>Number Of Property</th>
                            <th>Months / Description</th>
                            <th>Price</th>
                            <th>Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{selectedProperty}</td>
                            <td>{displayDesc}</td>
                            <td>${basePrice}</td>
                            <td className="total-price-cell">{displayPrice}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="payment-actions">
                      <div className="mock-logos">
                        <div className="mock-logo logo-visa">VISA</div>
                        <div className="mock-logo logo-amex">AMEX</div>
                        <div className="mock-logo logo-mc">MC</div>
                        <div className="mock-logo logo-paypal">PAYPAL</div>
                      </div>

                      <button
                        onClick={handleOpenModal}
                        disabled={paymentMutation.isPending || (isSpecialPlan && !appliedCustomPrice)}
                        className="btn-pay"
                      >
                        {paymentMutation.isPending ? <Loader2 size={20} className="spinner" /> : <CreditCard size={20} />}
                        {paymentMutation.isPending ? 'Processing...' : 'Pay With Card'}
                      </button>
                    </div>

                  </div>
                </div>

                {/* Right Side: Plan Preview Card */}
                <div className="payment-right-col">
                  <div className="sticky-preview-card">
                    <div className="preview-card-inner">

                      <div className="preview-card-header" style={{ backgroundImage: `url(${loginBg})` }}>
                        <div className="preview-overlay" />
                        <div className="preview-header-content">
                          <h4 className="preview-plan-name">
                            {isSpecialPlan ? 'Special Custom Plan' : selectedPlan?.planName || 'Select a Plan'}
                          </h4>
                          <div className="preview-plan-price">${basePrice}</div>
                          <div className="preview-plan-desc">{displayDesc}</div>
                        </div>
                      </div>

                      <div className="preview-card-body">
                        <h5 className="preview-features-title">Package Includes</h5>

                        {isSpecialPlan ? (
                          <div className="preview-custom-info">
                            <ShieldCheck size={48} className="custom-icon" />
                            <p>Custom features as negotiated with your account manager.</p>
                          </div>
                        ) : (
                          <ul className="preview-features-list">
                            {currentFeatures.map((feature, idx) => (
                              <li key={idx}>
                                <CheckCircle2 size={18} className="check-icon" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />

      <StripePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPay={handlePayment}
        price={displayPrice}
        isProcessing={paymentMutation.isPending}
      />

      <style>{`
        /* Payment Page Global Styles */
        .spin-anim { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .payment-page-container {
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Outfit', 'Inter', sans-serif;
        }

        .payment-main-content {
          padding-top: 150px;
          padding-bottom: 80px;
          margin-top: 0;
        }

        .payment-container {
          max-width: 1152px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* Hero Header */
        .payment-hero-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .premium-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #2563eb;
          background-color: #eff6ff;
          padding: 6px 16px;
          border-radius: 30px;
          margin-bottom: 20px;
          border: 1px solid #bfdbfe;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.1);
        }

        .payment-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        @media (min-width: 768px) {
          .payment-title { font-size: 2.5rem; }
        }

        .payment-subtitle {
          font-size: 1rem;
          color: #64748b;
          max-width: 650px;
          margin: 0 auto 40px;
          line-height: 1.7;
          font-weight: 400;
        }

        /* Guarantee Banner */
        .guarantee-banner-card {
          background-color: #ffffff;
          border-radius: 1rem;
          padding: 32px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.01);
          max-width: 768px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          text-align: left;
        }

        @media (min-width: 768px) {
          .guarantee-banner-card {
            flex-direction: row;
          }
        }

        .guarantee-badge-wrapper {
          flex-shrink: 0;
          position: relative;
        }

        .guarantee-circle {
          width: 128px;
          height: 128px;
          background: linear-gradient(to bottom right, #2563eb, #3b82f6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
        }

        .guarantee-text-inner {
          text-align: center;
          color: #ffffff;
        }

        .g-text-big {
          font-size: 1.5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 4px;
        }

        .g-text-small {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .g-text-bold {
          font-size: 0.875rem;
          font-weight: 900;
        }

        .guarantee-shield-icon {
          position: absolute;
          bottom: -8px;
          right: -8px;
          background-color: #fbbf24;
          color: #78350f;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #ffffff;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .guarantee-info h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .guarantee-info p {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.75;
        }

        /* Section Header */
        .payment-section-header {
          margin-bottom: 32px;
        }

        .payment-section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .payment-section-header p {
          color: #64748b;
        }

        /* Layout Grid */
        .payment-layout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: flex-start;
        }

        @media (min-width: 1024px) {
          .payment-layout-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .payment-left-col {
            grid-column: span 2 / span 2;
          }
          .payment-right-col {
            grid-column: span 1 / span 1;
          }
        }

        .payment-left-col {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* Form Card */
        .payment-form-card {
          background-color: #ffffff;
          border-radius: 1rem;
          padding: 32px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .form-card-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 24px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 16px;
        }

        .form-card-header p {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .form-card-header p span {
          color: #2563eb;
        }

        .form-selectors-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        @media (min-width: 768px) {
          .form-selectors-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .form-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .select-wrapper {
          position: relative;
        }

        .custom-select {
          width: 100%;
          appearance: none;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          font-weight: 600;
          border-radius: 0.75rem;
          padding: 12px 40px 12px 16px;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
          font-size: 1rem;
        }

        .custom-select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5);
        }

        .select-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        /* Special Plan Inputs */
        .special-plan-container {
          background-color: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 0.75rem;
          padding: 20px;
          margin-bottom: 32px;
          overflow: hidden;
        }

        .special-plan-container h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0369a1;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .special-plan-inputs {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: flex-end;
        }

        @media (min-width: 768px) {
          .special-plan-inputs {
            flex-direction: row;
          }
        }

        .input-group {
          flex: 1;
          width: 100%;
        }

        .input-group.group-large {
          flex: 2;
        }

        .input-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #0284c7;
          margin-bottom: 4px;
        }

        .input-group input {
          width: 100%;
          background-color: #ffffff;
          border: 1px solid #7dd3fc;
          border-radius: 0.5rem;
          padding: 10px 12px;
          outline: none;
          transition: box-shadow 0.2s ease;
          box-sizing: border-box;
          font-family: inherit;
        }

        .input-group input:focus {
          box-shadow: 0 0 0 2px #38bdf8;
        }

        .btn-add-price {
          background-color: #0284c7;
          color: #ffffff;
          padding: 10px 24px;
          border-radius: 0.5rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          height: 42px;
          width: 100%;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .btn-add-price {
            width: auto;
          }
        }

        .btn-add-price:hover {
          background-color: #0369a1;
        }

        /* Summary Table */
        .payment-table-wrapper {
          overflow-x: auto;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          margin-bottom: 32px;
        }

        .payment-table {
          width: 100%;
          text-align: left;
          border-collapse: collapse;
        }

        .payment-table thead tr {
          background-color: #0f172a;
          color: #ffffff;
        }

        .payment-table th {
          padding: 16px 24px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .payment-table tbody tr {
          background-color: #ffffff;
        }

        .payment-table td {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          color: #334155;
        }

        .total-price-cell {
          font-weight: 700;
          color: #0f172a;
          font-size: 1.125rem;
        }

        /* Actions */
        .payment-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-top: 16px;
        }

        @media (min-width: 640px) {
          .payment-actions {
            flex-direction: row;
          }
        }

        .mock-logos {
          display: flex;
          gap: 8px;
        }

        .mock-logo {
          height: 32px;
          width: 48px;
          background-color: #f1f5f9;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 10px;
        }

        .logo-visa { color: #1e40af; }
        .logo-amex { color: #0ea5e9; }
        .logo-mc { color: #ef4444; }
        .logo-paypal { color: #4338ca; }

        .btn-pay {
          width: 100%;
          background-color: #fbbf24;
          color: #78350f;
          padding: 14px 32px;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1.125rem;
          border: none;
          box-shadow: 0 10px 15px -3px rgba(251, 191, 36, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @media (min-width: 640px) {
          .btn-pay { width: auto; }
        }

        .btn-pay:hover:not(:disabled) {
          background-color: #f59e0b;
          transform: translateY(-4px);
        }

        .btn-pay:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Preview Card */
        .sticky-preview-card {
          position: sticky;
          top: 96px;
        }

        .preview-card-inner {
          background-color: #0f172a;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          color: #ffffff;
        }

        .preview-card-header {
          height: 128px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
        }

        .preview-header-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .preview-plan-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #38bdf8;
          margin-bottom: 4px;
        }

        .preview-plan-price {
          font-size: 2.25rem;
          font-weight: 900;
        }

        .preview-plan-desc {
          font-size: 0.75rem;
          font-weight: 600;
          color: #d1d5db;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .preview-card-body {
          padding: 24px;
          background-color: #ffffff;
          color: #0f172a;
        }

        .preview-features-title {
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 16px;
          text-align: center;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 16px;
        }

        .preview-custom-info {
          text-align: center;
          padding: 32px 0;
        }

        .custom-icon {
          margin: 0 auto 16px;
          color: #fbbf24;
          opacity: 0.5;
        }

        .preview-custom-info p {
          color: #64748b; 
          font-weight: 500;
          font-size: 0.875rem;
        }

        .preview-features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .preview-features-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .check-icon {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .preview-features-list li span {
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
        }

        /* Mobile Refinements */
        @media (max-width: 768px) {
          .payment-main-content {
            padding-top: 80px;
          }
          .payment-container {
            padding: 0 16px !important;
          }
          .payment-hero-header > span,
          .payment-hero-header > h1,
          .payment-hero-header > p,
          .payment-section-header {
            padding-left: 0;
            padding-right: 0;
          }
          .payment-hero-header {
            margin-bottom: 32px;
          }
          .payment-title {
            font-size: 1.5rem;
          }
          .payment-subtitle {
            font-size: 0.9rem;
            margin-bottom: 24px;
          }
          .payment-left-col, 
          .payment-right-col {
            min-width: 0;
            width: 100%;
          }
          .guarantee-banner-card,
          .payment-form-card,
          .preview-card-inner {
            border-radius: 1rem !important;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
          }
          .guarantee-banner-card {
            padding: 20px 16px;
            gap: 20px;
          }
          .guarantee-info h3 {
            font-size: 1.1rem;
            text-align: center;
          }
          .guarantee-info p {
            font-size: 0.85rem;
            text-align: center;
          }
          .payment-form-card {
            padding: 24px 16px;
          }
          .payment-table-wrapper {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
          }
          .payment-table th, .payment-table td {
            padding: 12px;
            font-size: 0.75rem;
          }
          .preview-card-body {
            padding: 20px 16px;
          }
          .mock-logos {
            flex-wrap: wrap;
            justify-content: center;
          }
          .btn-pay {
            width: 100%;
            font-size: 1rem;
            padding: 12px 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Payment;
