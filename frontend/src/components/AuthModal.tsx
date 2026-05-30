import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api, { API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'register';
  initialEmail?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'signin', initialEmail = '' }) => {
  const { setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    setIsLoading(false);
  }, [activeTab, isOpen]);

  const [signInEmail, setSignInEmail] = useState(initialTab === 'signin' ? initialEmail : '');
  const [signInPassword, setSignInPassword] = useState('');

  const [registerForm, setRegisterForm] = useState({
    firstName: '', lastName: '', email: initialTab === 'register' ? initialEmail : '', phone: '',
    password: '', confirmPassword: '',
    country: '', city: '', address: '', state: '', zipCode: '',
    verifyCode: '', acceptTerms: false
  });

  if (!isOpen) return null;

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/admin/register', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess('Registration successful! Redirecting to sign in...');
      setTimeout(() => { setSuccess(null); setActiveTab('signin'); }, 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    }
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!registerForm.firstName) errors.firstName = 'First name is required';
    if (!registerForm.lastName) errors.lastName = 'Last name is required';
    if (!registerForm.email) errors.email = 'Email is required';
    
    const phoneDigits = registerForm.phone.replace(/\D/g, '');
    if (!registerForm.phone) {
      errors.phone = 'Phone is required';
    } else if (phoneDigits.length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    } else if (phoneDigits.length > 15) {
      errors.phone = 'Phone number must be at most 15 digits';
    }
    
    if (!registerForm.password) errors.password = 'Password is required';
    if (!registerForm.confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (!registerForm.country) errors.country = 'Country is required';
    if (!registerForm.state) errors.state = 'State is required';
    if (!registerForm.city) errors.city = 'City is required';
    if (!registerForm.address) errors.address = 'Address is required';
    if (!registerForm.zipCode) errors.zipCode = 'Zip code is required';

    if (!registerForm.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms';
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    registerMutation.mutate({
      firstname: registerForm.firstName, lastname: registerForm.lastName,
      email: registerForm.email, password: registerForm.password,
      contact_number: registerForm.phone, country: registerForm.country,
      state: registerForm.state, city: registerForm.city,
      address: registerForm.address, zipcode: Number(registerForm.zipCode) || 0,
    });
  };

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/auth/login', data, { withCredentials: true });
      return response.data;
    },
    onSuccess: (data) => {
      const userData = data.user;
      setUser(userData);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        onClose();
        window.location.href = `${API_BASE_URL}/api/admin/dashboard`;
      }, 800);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    },
    onSuccess: (data) => {
      setSuccess(data.message || 'Reset password link dispatched.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg || 'Failed to dispatch reset link. Please try again.'));
    }
  });

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!signInEmail) errors.signInEmail = 'Email is required';
    if (!signInPassword) errors.signInPassword = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    loginMutation.mutate({ username: signInEmail, password: signInPassword });
  };

  return (
    <div className="am-overlay">
      <motion.div
        className="am-window"
        style={{ maxWidth: activeTab === 'signin' ? '450px' : '780px', transition: 'max-width 0.3s ease' }}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring' as const, damping: 26, stiffness: 280 }}
      >
        {/* Header */}
        <div className="am-header">
          <div className="am-tabs">
            <button
              onClick={() => setActiveTab('signin')}
              className={`am-tab ${activeTab === 'signin' ? 'am-tab--active' : ''}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`am-tab ${activeTab === 'register' ? 'am-tab--active' : ''}`}
            >
              Register
            </button>
          </div>
          <button className="am-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body — no scroll */}
        <div className="am-body">
          {activeTab === 'signin' ? (

            /* ── SIGN IN ── */
            <form onSubmit={handleSignInSubmit} className="am-form">
              <div className="am-title-row">
                <span className="am-badge">Welcome Back</span>
                <h2 className="am-title">Sign In to Your Account</h2>
              </div>

              {error && <div className="am-alert am-alert--error">{error}</div>}
              {success && <div className="am-alert am-alert--success">{success}</div>}

              <div className="am-field">
                <label className="am-label">Email Address</label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => { setSignInEmail(e.target.value); setFieldErrors(prev => ({ ...prev, signInEmail: '' })); }}
                  placeholder="you@example.com"
                  className={`am-input ${fieldErrors.signInEmail ? 'am-input-error' : ''}`}
                />
                {fieldErrors.signInEmail && <span className="am-field-error">{fieldErrors.signInEmail}</span>}
              </div>

              <div className="am-field">
                <label className="am-label">Password</label>
                <div className="am-pwd-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => { setSignInPassword(e.target.value); setFieldErrors(prev => ({ ...prev, signInPassword: '' })); }}
                    placeholder="••••••••••"
                    className={`am-input ${fieldErrors.signInPassword ? 'am-input-error' : ''}`}
                  />
                  <button type="button" className="am-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {fieldErrors.signInPassword && <span className="am-field-error">{fieldErrors.signInPassword}</span>}
              </div>

              <div className="am-row-between">
                <a
                  href="#forgot"
                  className="am-forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setError(null);
                    setSuccess(null);
                    setFieldErrors({});
                    if (!signInEmail) {
                      setFieldErrors(prev => ({ ...prev, signInEmail: 'Please enter your email above to reset your password.' }));
                      return;
                    }
                    forgotPasswordMutation.mutate(signInEmail);
                  }}
                  style={{ opacity: forgotPasswordMutation.isPending ? 0.7 : 1, pointerEvents: forgotPasswordMutation.isPending ? 'none' : 'auto' }}
                >
                  {forgotPasswordMutation.isPending ? 'Sending...' : 'Forgot password?'}
                </a>
              </div>

              <div className="am-submit-row" style={{ marginTop: '20px' }}>
                <button type="submit" className="am-submit" disabled={loginMutation.isPending}>
                  {loginMutation.isPending
                    ? <><Loader2 size={16} className="am-spin" /><span>Signing in…</span></>
                    : <><span>Sign In</span><span className="am-arrow">→</span></>}
                </button>
              </div>

              <p className="am-switch" style={{ textAlign: 'center', marginTop: '20px' }}>
                Don't have an account?{' '}
                <button type="button" className="am-switch-btn" onClick={() => setActiveTab('register')}>
                  Create one
                </button>
              </p>
            </form>

          ) : (

            /* ── REGISTER ── */
            <form onSubmit={handleRegisterSubmit} className="am-form">
              <div className="am-title-row">
                <span className="am-badge">New Account</span>
                <h2 className="am-title">Create Your Account</h2>
              </div>

              {error && <div className="am-alert am-alert--error">{error}</div>}
              {success && <div className="am-alert am-alert--success">{success}</div>}

              {/* Personal */}
              <div className="am-section-label">Personal Information</div>
              <div className="am-grid-2">
                <div className="am-field">
                  <label className="am-label">First Name</label>
                  <input type="text" value={registerForm.firstName}
                    onChange={(e) => { setRegisterForm({ ...registerForm, firstName: e.target.value }); setFieldErrors(prev => ({ ...prev, firstName: '' })); }}
                    placeholder="First name" className={`am-input ${fieldErrors.firstName ? 'am-input-error' : ''}`} />
                  {fieldErrors.firstName && <span className="am-field-error">{fieldErrors.firstName}</span>}
                </div>
                <div className="am-field">
                  <label className="am-label">Last Name</label>
                  <input type="text" value={registerForm.lastName}
                    onChange={(e) => { setRegisterForm({ ...registerForm, lastName: e.target.value }); setFieldErrors(prev => ({ ...prev, lastName: '' })); }}
                    placeholder="Last name" className={`am-input ${fieldErrors.lastName ? 'am-input-error' : ''}`} />
                  {fieldErrors.lastName && <span className="am-field-error">{fieldErrors.lastName}</span>}
                </div>
                <div className="am-field">
                  <label className="am-label">Email</label>
                  <input type="email" value={registerForm.email}
                    onChange={(e) => { setRegisterForm({ ...registerForm, email: e.target.value }); setFieldErrors(prev => ({ ...prev, email: '' })); }}
                    placeholder="you@example.com" className={`am-input ${fieldErrors.email ? 'am-input-error' : ''}`} />
                  {fieldErrors.email && <span className="am-field-error">{fieldErrors.email}</span>}
                </div>
                <div className="am-field">
                  <label className="am-label">Phone</label>
                  <input type="tel" value={registerForm.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9+\-\s()]/g, '');
                      setRegisterForm({ ...registerForm, phone: val });
                      const digitsLen = val.replace(/\D/g, '').length;
                      if (digitsLen > 0 && digitsLen < 10) {
                        setFieldErrors(prev => ({ ...prev, phone: 'Phone number must be at least 10 digits' }));
                      } else if (digitsLen > 15) {
                        setFieldErrors(prev => ({ ...prev, phone: 'Phone number must be at most 15 digits' }));
                      } else {
                        setFieldErrors(prev => ({ ...prev, phone: '' }));
                      }
                    }}
                    placeholder="+1 555 000 0000" className={`am-input ${fieldErrors.phone ? 'am-input-error' : ''}`} />
                  {fieldErrors.phone && <span className="am-field-error">{fieldErrors.phone}</span>}
                </div>
              </div>

              {/* Account */}
              <div className="am-section-label">Account Security</div>
              <div className="am-grid-2">
                <div className="am-field">
                  <label className="am-label">Password</label>
                  <div className="am-pwd-wrap">
                    <input type={showPassword ? 'text' : 'password'} value={registerForm.password}
                      onChange={(e) => { setRegisterForm({ ...registerForm, password: e.target.value }); setFieldErrors(prev => ({ ...prev, password: '' })); }}
                      placeholder="Create password" className={`am-input ${fieldErrors.password ? 'am-input-error' : ''}`} />
                    <button type="button" className="am-eye" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && <span className="am-field-error">{fieldErrors.password}</span>}
                </div>
                <div className="am-field">
                  <label className="am-label">Confirm Password</label>
                  <div className="am-pwd-wrap">
                    <input type={showConfirmPassword ? 'text' : 'password'} value={registerForm.confirmPassword}
                      onChange={(e) => { 
                        setRegisterForm({ ...registerForm, confirmPassword: e.target.value }); 
                        if (registerForm.password && e.target.value !== registerForm.password) {
                          setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
                        } else {
                          setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }
                      }}
                      placeholder="Confirm password" className={`am-input ${fieldErrors.confirmPassword ? 'am-input-error' : ''}`} />
                    <button type="button" className="am-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && <span className="am-field-error">{fieldErrors.confirmPassword}</span>}
                </div>
              </div>

              {/* Address */}
              <div className="am-section-label">Billing Address</div>
              <div className="am-grid-3">
                <div className="am-field">
                  <label className="am-label">Country</label>
                  <input type="text" value={registerForm.country}
                    onChange={(e) => { setRegisterForm({ ...registerForm, country: e.target.value }); setFieldErrors(prev => ({ ...prev, country: '' })); }}
                    placeholder="Country" className={`am-input ${fieldErrors.country ? 'am-input-error' : ''}`} />
                  {fieldErrors.country && <span className="am-field-error">{fieldErrors.country}</span>}
                </div>
                <div className="am-field">
                  <label className="am-label">State</label>
                  <input type="text" value={registerForm.state}
                    onChange={(e) => { setRegisterForm({ ...registerForm, state: e.target.value }); setFieldErrors(prev => ({ ...prev, state: '' })); }}
                    placeholder="State" className={`am-input ${fieldErrors.state ? 'am-input-error' : ''}`} />
                  {fieldErrors.state && <span className="am-field-error">{fieldErrors.state}</span>}
                </div>
                <div className="am-field">
                  <label className="am-label">City</label>
                  <input type="text" value={registerForm.city}
                    onChange={(e) => { setRegisterForm({ ...registerForm, city: e.target.value }); setFieldErrors(prev => ({ ...prev, city: '' })); }}
                    placeholder="City" className={`am-input ${fieldErrors.city ? 'am-input-error' : ''}`} />
                  {fieldErrors.city && <span className="am-field-error">{fieldErrors.city}</span>}
                </div>
                <div className="am-field am-col-2">
                  <label className="am-label">Address</label>
                  <input type="text" value={registerForm.address}
                    onChange={(e) => { setRegisterForm({ ...registerForm, address: e.target.value }); setFieldErrors(prev => ({ ...prev, address: '' })); }}
                    placeholder="Street address" className={`am-input ${fieldErrors.address ? 'am-input-error' : ''}`} />
                  {fieldErrors.address && <span className="am-field-error">{fieldErrors.address}</span>}
                </div>
                <div className="am-field">
                  <label className="am-label">Zip Code</label>
                  <input type="text" value={registerForm.zipCode}
                    onChange={(e) => { setRegisterForm({ ...registerForm, zipCode: e.target.value }); setFieldErrors(prev => ({ ...prev, zipCode: '' })); }}
                    placeholder="Zip code" className={`am-input ${fieldErrors.zipCode ? 'am-input-error' : ''}`} />
                  {fieldErrors.zipCode && <span className="am-field-error">{fieldErrors.zipCode}</span>}
                </div>
              </div>

              {/* Promo code — shown when terms accepted */}
              {registerForm.acceptTerms && (
                <div className="am-field">
                  <label className="am-label">Promo Code</label>
                  <input type="text" value={registerForm.verifyCode}
                    onChange={(e) => { setRegisterForm({ ...registerForm, verifyCode: e.target.value }); setFieldErrors(prev => ({ ...prev, verifyCode: '' })); }}
                    placeholder="e.g. SS358" className={`am-input ${fieldErrors.verifyCode ? 'am-input-error' : ''}`} />
                  {fieldErrors.verifyCode && <span className="am-field-error">{fieldErrors.verifyCode}</span>}
                </div>
              )}

              <div className="am-footer-row">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="am-terms">
                    <input
                      type="checkbox"
                      checked={registerForm.acceptTerms}
                      onChange={(e) => { setRegisterForm({ ...registerForm, acceptTerms: e.target.checked }); setFieldErrors(prev => ({ ...prev, acceptTerms: '' })); }}
                      className="am-check"
                    />
                    <span>I accept the <span className="am-link" style={{ cursor: 'default' }}>Terms &amp; Conditions</span></span>
                  </label>
                  {fieldErrors.acceptTerms && <span className="am-field-error" style={{ marginTop: '4px' }}>{fieldErrors.acceptTerms}</span>}
                </div>

                <button type="submit" className="am-submit" disabled={registerMutation.isPending}>
                  {registerMutation.isPending
                    ? <><Loader2 size={16} className="am-spin" /><span>Registering…</span></>
                    : <><span>Register</span><span className="am-arrow">→</span></>}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>

      <style>{`
        /* ─── Overlay ─── */
        .am-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 20, 36, 0.65);
          backdrop-filter: blur(10px);
          z-index: 9999999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 60px 20px 20px;
          overflow-y: auto;
        }

        /* ─── Window ─── */
        .am-window {
          background: #ffffff;
          width: 100%;
          max-width: 780px;
          border-radius: 16px;
          box-shadow: 0 30px 80px rgba(4, 20, 36, 0.28);
          overflow: hidden;
        }

        /* ─── Header / Tabs ─── */
        .am-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--secondary, #2e80ec);
          padding: 0 18px 0 0;
          height: 48px;
        }

        .am-tabs {
          display: flex;
          height: 100%;
        }

        .am-tab {
          height: 100%;
          padding: 0 24px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.65);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: all 0.25s ease;
        }

        .am-tab--active {
          background: rgba(255,255,255,0.15);
          color: #ffffff;
          border-bottom: 3px solid #fe9d3d;
        }

        .am-tab:hover:not(.am-tab--active) {
          color: #ffffff;
          background: rgba(255,255,255,0.08);
        }

        .am-close {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .am-close:hover {
          background: #fe9d3d;
          transform: rotate(90deg);
        }

        /* ─── Body (no scroll) ─── */
        .am-body {
          padding: 14px 24px 16px;
        }

        /* ─── Form ─── */
        .am-form {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .am-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0px;
        }

        .am-badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--secondary, #2e80ec), #1a65d6);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 20px;
        }

        .am-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0d1f35;
          margin: 0;
          letter-spacing: -0.3px;
        }

        /* ─── Section label ─── */
        .am-section-label {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--secondary, #2e80ec);
          border-bottom: 1.5px solid #e8f0fd;
          padding-bottom: 4px;
          margin-top: 2px;
          margin-bottom: 0;
        }

        /* ─── Field ─── */
        .am-field {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .am-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .am-input {
          width: 100%;
          padding: 5px 10px;
          background: #f5f8ff;
          border: 1.5px solid #dde8fa;
          border-radius: 6px;
          font-size: 0.82rem;
          color: #1e293b;
          font-family: inherit;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .am-input::placeholder {
          color: #a0aec0;
          font-size: 0.8rem;
        }

        .am-input:focus {
          outline: none;
          background: #fff;
          border-color: var(--secondary, #2e80ec);
          box-shadow: 0 0 0 3px rgba(46, 128, 236, 0.12);
        }

        .am-input-error {
          border-color: #dc2626 !important;
        }

        .am-field-error {
          color: #dc2626;
          font-size: 0.7rem;
          font-weight: 600;
          margin-top: 2px;
        }

        /* ─── Password wrapper ─── */
        .am-pwd-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .am-pwd-wrap .am-input {
          padding-right: 40px;
        }

        .am-eye {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }

        .am-eye:hover { color: var(--secondary, #2e80ec); }

        /* ─── Grids ─── */
        .am-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .am-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
        }

        .am-col-2 { grid-column: span 2; }

        /* ─── Forgot / options ─── */
        .am-row-between {
          display: flex;
          justify-content: flex-end;
          margin-top: -4px;
        }

        .am-forgot {
          font-size: 0.83rem;
          color: var(--secondary, #2e80ec);
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .am-forgot:hover { opacity: 0.75; text-decoration: underline; }

        /* ─── Submit row (sign-in) ─── */
        .am-submit-row {
          display: flex;
          align-items: center;
        }

        /* ─── Footer row (terms + submit) ─── */
        .am-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 4px;
        }

        .am-terms {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #475569;
          cursor: pointer;
          user-select: none;
          font-weight: 500;
        }

        .am-check {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
          accent-color: var(--secondary, #2e80ec);
          flex-shrink: 0;
        }

        .am-link {
          font-weight: 600;
          text-decoration: none;
        }

        .am-link:hover { text-decoration: underline; }

        /* ─── Submit button ─── */
        .am-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fe9d3d;
          color: #fff;
          padding: 9px 24px;
          border-radius: 30px;
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s ease;
          flex-shrink: 0;
          width: auto;
        }

        .am-submit:hover {
          background: var(--secondary, #2e80ec);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(254, 157, 61, 0.3);
        }

        .am-submit:active { transform: translateY(0); }

        .am-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .am-arrow { font-size: 1.1rem; font-weight: bold; }

        /* ─── Switch link ─── */
        .am-switch {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          text-align: center;
        }

        .am-switch-btn {
          background: none;
          border: none;
          color: var(--secondary, #2e80ec);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.2s;
        }

        .am-switch-btn:hover { opacity: 0.75; text-decoration: underline; }

        /* ─── Alerts ─── */
        .am-alert {
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .am-alert--error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }

        .am-alert--success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
        }

        /* ─── Spin animation ─── */
        @keyframes am-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .am-spin { animation: am-spin 1s linear infinite; }

        /* ─── Responsive ─── */
        @media (max-width: 700px) {
          .am-body { padding: 18px 18px 22px; }
          .am-grid-2, .am-grid-3 { grid-template-columns: 1fr; }
          .am-col-2 { grid-column: span 1; }
          .am-footer-row { flex-direction: column; align-items: stretch; }
          .am-submit { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
