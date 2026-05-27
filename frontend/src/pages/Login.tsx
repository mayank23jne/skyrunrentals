import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import api, { API_BASE_URL } from '../services/api';
import loginBg from '../assets/login-bg.png';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/auth/login', {
        username,
        password
      }, { withCredentials: true });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      if (data.user.subscription_type === 0) {
        navigate('/payment');
      } else {
        window.location.href = `${API_BASE_URL}/api/admin/dashboard`;
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate();
  };

  return (
    <div className="login-page-container">
      {/* Background Image with optimized dark overlay */}
      <div
        className="login-bg-overlay"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      />
      <div className="login-backdrop-blur" />

      {/* Decorative Premium Floating Glow Orbs */}
      <div className="neon-orb orb-blue" />
      <div className="neon-orb orb-indigo" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="login-card-wrapper"
      >
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="back-btn-website"
        >
          <ArrowLeft size={18} />
          <span>Back to Website</span>
        </button>

        {/* High-Fidelity Glassmorphic Login Card */}
        <div className="glass-login-card">
          <div className="card-header">
            <div className="logo-aura-container">
              <div className="logo-glow-aura" />
              <div className="logo-icon-box">
                <Lock size={28} className="logo-icon" />
              </div>
            </div>
            <h1 className="login-header-title">Admin Control</h1>
            <p className="login-header-subtitle">Sign in to manage your empire.</p>
          </div>

          {/* Elegant Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="error-alert-banner"
            >
              <span className="error-dot" />
              <span className="error-message-txt">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label className="input-field-label">Username</label>
              <div className="input-box-wrapper">
                <div className="input-icon-left">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input-field"
                  placeholder="Enter your username"
                />
                <div className="input-focus-border" />
              </div>
            </div>

            <div className="input-group">
              <label className="input-field-label">Password</label>
              <div className="input-box-wrapper">
                <div className="input-icon-left">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input-field password-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <div className="input-focus-border" />
              </div>
            </div>

            {/* Glowing Gradient Action Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="submit-login-btn"
            >
              {mutation.isPending ? (
                <Loader2 className="animate-loader-spin" size={22} />
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      <style>{`
        .login-page-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0b0f19;
          overflow: hidden;
          font-family: 'Outfit', 'Inter', sans-serif;
        }

        /* Ambient backgrounds */
        .login-bg-overlay {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.4) saturate(1.2);
          transform: scale(1.02);
        }

        .login-backdrop-blur {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          background: radial-gradient(circle at center, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%);
          backdrop-filter: blur(3px);
        }

        /* Pulsing abstract neon orbs for ultra premium look */
        .neon-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(130px);
          opacity: 0.3;
          z-index: 2;
          pointer-events: none;
        }

        .orb-blue {
          top: -10%;
          left: -10%;
          width: 50%;
          height: 50%;
          background: var(--secondary);
          animation: floatOrb 12s ease-in-out infinite alternate;
        }

        .orb-indigo {
          bottom: -15%;
          right: -15%;
          width: 60%;
          height: 60%;
          background: var(--accent);
          animation: floatOrb 16s ease-in-out infinite alternate-reverse;
        }

        @keyframes floatOrb {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(40px) scale(1.1); }
        }

        /* Login Card Wrapper */
        .login-card-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          padding: 20px;
          box-sizing: border-box;
        }

        /* Back Button to Website */
        .back-btn-website {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50px;
          padding: 10px 22px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 24px;
          width: fit-content;
        }

        .back-btn-website:hover {
          background: var(--accent);
          border-color: var(--accent);
          box-shadow: 0 10px 25px rgba(255, 156, 69, 0.3);
          transform: translateX(-4px);
        }

        /* Frosted Glass login card styling */
        .glass-login-card {
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 32px;
          padding: 24px 20px;
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .card-header {
          text-align: center;
          margin-bottom: 35px;
        }

        /* Glowing logo container */
        .logo-aura-container {
          position: relative;
          width: 72px;
          height: 72px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-glow-aura {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--accent);
          border-radius: 20px;
          filter: blur(12px);
          opacity: 0.5;
        }

        .logo-icon-box {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(255, 156, 69, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .logo-icon {
          color: #ffffff;
        }

        .login-header-title {
          font-size: 32px;
          color: #ffffff;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .login-header-subtitle {
          font-size: 15px;
          color: #94a3b8;
          margin-top: 6px;
          font-weight: 500;
        }

        /* Error Banner */
        .error-alert-banner {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 16px;
          padding: 14px 18px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .error-dot {
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 10px #ef4444;
        }

        .error-message-txt {
          color: #fca5a5;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
        }

        /* Form Controls */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-field-label {
          font-size: 12px;
          font-weight: 700;
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-left: 4px;
        }

        .input-box-wrapper {
          position: relative;
          width: 100%;
        }

        .input-icon-left {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          z-index: 2;
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .login-input-field {
          width: 100%;
          box-sizing: border-box;
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 16px 18px 16px 52px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-input-field:focus {
          background: rgba(30, 41, 59, 0.6);
          border-color: var(--secondary);
          box-shadow: 0 0 15px rgba(58, 134, 255, 0.15);
        }

        /* Changing the left icon color on field focus */
        .input-box-wrapper:focus-within .input-icon-left {
          color: var(--secondary);
        }

        .password-input {
          padding-right: 52px;
        }

        .password-toggle-btn {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.3s ease;
        }

        .password-toggle-btn:hover {
          color: #ffffff;
        }

        /* Glowing Submit Button */
        .submit-login-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-radius: 18px;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 24px rgba(255, 156, 69, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .submit-login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255, 156, 69, 0.45);
          filter: brightness(1.05);
        }

        .submit-login-btn:active:not(:disabled) {
          transform: translateY(0);
          filter: brightness(0.95);
        }

        .submit-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        .animate-loader-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .glass-login-card {
            padding: 36px 24px;
            border-radius: 24px;
          }
          .login-header-title {
            font-size: 28px;
          }
          .back-btn-website {
            left: 20px;
            top: -45px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
