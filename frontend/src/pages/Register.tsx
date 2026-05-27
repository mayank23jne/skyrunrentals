import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Globe, Hash, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import loginBg from '../assets/login-bg.png';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    contact_no: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    address: '',
    verify_code: '',
    confirm_password: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/admin/register', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    }
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg-main overflow-hidden py-12 px-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginBg})`,
          filter: 'brightness(0.5)'
        }}
      />

      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] z-1" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <button
          onClick={() => navigate('/')}
          className="absolute -top-12 left-0 text-white flex items-center gap-2 hover:text-accent transition-colors"
        >
          <ArrowLeft size={20} /> Back to Website
        </button>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/20 w-full">
          <div className="text-center mb-10">
            {/* Top Pill Icon Bar */}
            <div className="bg-[#f8fafc] w-32 h-10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#e2e8f0] shadow-sm">
              <User className="text-[#1a2a44]" size={24} />
            </div>

            <h1 className="text-4xl font-bold text-[#1a2a44] tracking-tight">Partner Registration</h1>
            <p className="text-[#64748b] mt-3 font-medium">Join our network of premium vacation havens.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 text-green-600 p-4 rounded-xl text-sm mb-6 border border-green-100 flex items-center gap-3"
            >
              <ShieldCheck className="text-green-600" size={20} />
              {success}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-10">
            {/* 1. Personal Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#1a2a44] border-b border-[#eef4ff] pb-2">Personal information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">First Name</label>
                  <input
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                    placeholder="FIRST NAME"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">Last Name</label>
                  <input
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                    placeholder="LAST NAME"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                    placeholder="EMAIL ADDRESS"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">Your Phone</label>
                  <input
                    name="contact_no"
                    required
                    value={formData.contact_no}
                    onChange={handleChange}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                    placeholder="YOUR PHONE"
                  />
                </div>
              </div>
            </div>

            {/* 2. Account Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#1a2a44] border-b border-[#eef4ff] pb-2">Account information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                      placeholder="PASSWORD"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                    >
                      <ShieldCheck size={18} className={showPassword ? 'text-[#d4af37]' : ''} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      name="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                      placeholder="CONFIRM PASSWORD"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                    >
                      <ShieldCheck size={18} className={showConfirmPassword ? 'text-[#d4af37]' : ''} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Billing Address */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#1a2a44] border-b border-[#eef4ff] pb-2">Billing Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">Country</label>
                  <input
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                    placeholder="COUNTRY"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">City</label>
                  <input
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                    placeholder="CITY"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">Street Address</label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium resize-none"
                    placeholder="ADDRESS"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">State</label>
                  <input
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                    placeholder="STATE"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">Zip Code</label>
                  <input
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                    placeholder="ZIP CODE"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className="flex items-center gap-3 ml-1 cursor-pointer group"
                onClick={() => setAcceptTerms(!acceptTerms)}
              >
                <div className={`
                  w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                  ${acceptTerms
                    ? 'bg-[#d4af37] border-[#d4af37] shadow-lg shadow-[#d4af37]/30 scale-110'
                    : 'bg-white border-[#e2e8f0] hover:border-[#d4af37]'
                  }
                `}>
                  {acceptTerms && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                    >
                      <ShieldCheck size={16} className="#c19b2e" />
                    </motion.div>
                  )}
                </div>
                <span className={`text-sm font-bold transition-colors ${acceptTerms ? 'text-[#1a2a44]' : 'text-[#64748b]'}`}>
                  Accept Terms & Condition
                </span>
              </div>

              {acceptTerms && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 pt-2"
                >
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748b] ml-1">Verification Code</label>
                  <input
                    name="verify_code"
                    required
                    value={formData.verify_code}
                    onChange={handleChange}
                    className="w-full bg-[#eef4ff] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all text-[#1a2a44] font-medium"
                    placeholder="ENTER CODE (e.g. SS358)"
                  />
                </motion.div>
              )}
            </div>

            <div className="pt-6 space-y-4">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-[#d4af37]/10 text-[#d4af37] py-5 rounded-2xl font-bold text-lg flex items-center justify-center border border-[#d4af37]/20 hover:bg-[#d4af37] hover:text-white transition-all disabled:opacity-70"
              >
                {mutation.isPending ? <Loader2 className="animate-spin" size={24} /> : 'Create Account'}
              </button>

              <p className="text-center text-[#64748b] text-sm font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-[#d4af37] font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      <style>{`
        .relative { position: relative; }
        .absolute { position: absolute; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-0 { z-index: 0; }
        .z-1 { z-index: 1; }
        .z-10 { z-index: 10; }
        .min-h-screen { min-height: 100vh; }
        .bg-cover { background-size: cover; }
        .bg-center { background-position: center; }
        .overflow-hidden { overflow: hidden; }
        
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .flex-col { flex-direction: column; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        
        @media (min-width: 768px) {
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .md\\:p-12 { padding: 3rem; }
          .gap-x-10 { column-gap: 2.5rem; }
        }
        
        .w-full { width: 100%; }
        .max-w-4xl { max-width: 56rem; }
        .w-32 { width: 8rem; }
        .h-10 { height: 2.5rem; }
        .w-2 { width: 0.5rem; }
        .h-2 { height: 0.5rem; }
        
        .bg-white { background-color: white; }
        .bg-primary\\/20 { background-color: rgba(26, 42, 68, 0.2); }
        .bg-\\[#f8fafc\\] { background-color: #f8fafc; }
        .bg-red-50 { background-color: #fef2f2; }
        .bg-green-50 { background-color: #f0fdf4; }
        .bg-\\[#eef4ff\\] { background-color: #eef4ff; }
        .bg-\\[#d4af37\\]\\/10 { background-color: rgba(212, 175, 55, 0.1); }
        
        .text-white { color: white; }
        .text-\\[#1a2a44\\] { color: #1a2a44; }
        .text-\\[#64748b\\] { color: #64748b; }
        .text-red-600 { color: #dc2626; }
        .text-green-600 { color: #16a34a; }
        .text-\\[#d4af37\\] { color: #d4af37; }
        
        .rounded-full { border-radius: 9999px; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-\\[2\\.5rem\\] { border-radius: 2.5rem; }
        
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        
        .border { border: 1px solid #e2e8f0; }
        .border-white\\/20 { border-color: rgba(255, 255, 255, 0.2); }
        .border-\\[#e2e8f0\\] { border-color: #e2e8f0; }
        .border-none { border: none; }
        .border-red-100 { border-color: #fee2e2; }
        .border-green-100 { border-color: #dcfce7; }
        .border-\\[#d4af37\\]\\/20 { border-color: rgba(212, 175, 55, 0.2); }
        
        .p-4 { padding: 1rem; }
        .p-8 { padding: 2rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
        .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .pl-12 { padding-left: 3rem; }
        .pr-4 { padding-right: 1rem; }
        .pt-4 { padding-top: 1rem; }
        .pt-6 { padding-top: 1.5rem; }
        
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .mt-3 { margin-top: 0.75rem; }
        .ml-1 { margin-left: 0.25rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .text-4xl { font-size: 2.25rem; }
        .text-3xl { font-size: 1.875rem; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .text-\\[11px\\] { font-size: 11px; }
        
        .uppercase { text-transform: uppercase; }
        .tracking-tight { letter-spacing: -0.025em; }
        .tracking-\\[0\\.15em\\] { letter-spacing: 0.15em; }
        .tracking-widest { letter-spacing: 0.1em; }
        
        .outline-none { outline: 2px solid transparent; outline-offset: 2px; }
        .resize-none { resize: none; }
        .pointer-events-none { pointer-events: none; }
        
        .backdrop-blur-\\[2px\\] { backdrop-filter: blur(2px); }
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 300ms; }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        
        .group:focus-within .group-focus-within\\:text-\\[#d4af37\\] { color: #d4af37; }
        .focus\\:ring-2:focus { box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2); }
        .hover\\:-translate-y-1:hover { transform: translateY(-0.25rem); }
        .hover\\:bg-\\[#d4af37\\]:hover { background-color: #d4af37; }
        .hover\\:text-white:hover { color: white; }
        .active\\:scale-95:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
};

export default Register;
