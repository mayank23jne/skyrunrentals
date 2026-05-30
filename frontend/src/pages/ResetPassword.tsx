import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const resetMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMsg('Your password has been successfully reset. Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message;
      setErrorMsg(Array.isArray(msg) ? msg[0] : (msg || 'Failed to reset password. Please try again.'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg('');
    setSuccessMsg('');

    const newErrors: Record<string, string> = {};
    if (!password) newErrors.password = 'Password is required';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!id || !token) {
      setErrorMsg('Invalid or missing reset token.');
      return;
    }

    resetMutation.mutate({ id: parseInt(id), token, newPassword: password });
  };

  return (
    <div className="reset-page-container">
      <Navbar />

      <div className="reset-body">
        <div className="reset-card">
          <div className="reset-header">
            <span className="reset-badge">Security</span>
            <h2 className="reset-title">Reset Your Password</h2>
            <p className="reset-subtitle">Enter your new password below to regain access to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="reset-form">
            {errorMsg && <div className="reset-alert reset-alert--error">{errorMsg}</div>}
            {successMsg && <div className="reset-alert reset-alert--success">{successMsg}</div>}

            <div className="reset-field">
              <label className="reset-label">New Password</label>
              <div className="reset-pwd-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••••"
                  className={`reset-input ${errors.password ? 'reset-input-error' : ''}`}
                />
                <button type="button" className="reset-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.password && <span className="reset-field-error">{errors.password}</span>}
            </div>

            <div className="reset-field">
              <label className="reset-label">Confirm Password</label>
              <div className="reset-pwd-wrap">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (password && e.target.value !== password) {
                      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
                    } else {
                      setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }
                  }}
                  placeholder="••••••••••"
                  className={`reset-input ${errors.confirmPassword ? 'reset-input-error' : ''}`}
                />
                <button type="button" className="reset-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="reset-field-error">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="reset-submit" disabled={resetMutation.isPending}>
              {resetMutation.isPending
                ? <><Loader2 size={16} className="reset-spin" /><span>Resetting...</span></>
                : <span>Update Password</span>}
            </button>

            <div className="reset-footer">
              <Link to="/" className="reset-home-link">Return to Home</Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />

      <style>{`
        .reset-page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .reset-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .reset-card {
          background: #ffffff;
          width: 100%;
          max-width: 450px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(4, 20, 36, 0.08);
          padding: 25px;
          box-sizing: border-box;
          margin-top: 72px;
        }

        .reset-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .reset-badge {
          display: inline-block;
          background: linear-gradient(135deg, #2e80ec, #1a65d6);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 15px;
        }

        .reset-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0d1f35;
          margin: 0 0 10px 0;
          letter-spacing: -0.5px;
        }

        .reset-subtitle {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.5;
        }

        .reset-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .reset-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .reset-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .reset-input {
          width: 100%;
          padding: 12px 14px;
          background: #f5f8ff;
          border: 1.5px solid #dde8fa;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #1e293b;
          font-family: inherit;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .reset-input::placeholder {
          color: #a0aec0;
        }

        .reset-input:focus {
          outline: none;
          background: #fff;
          border-color: #2e80ec;
          box-shadow: 0 0 0 3px rgba(46, 128, 236, 0.12);
        }

        .reset-input-error {
          border-color: #dc2626 !important;
        }

        .reset-field-error {
          color: #dc2626;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 2px;
        }

        .reset-pwd-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .reset-pwd-wrap .reset-input {
          padding-right: 45px;
        }

        .reset-eye {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }

        .reset-eye:hover { color: #2e80ec; }

        .reset-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #fe9d3d;
          color: #fff;
          padding: 14px;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          margin-top: 10px;
        }

        .reset-submit:hover:not(:disabled) {
          background: #2e80ec;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(46, 128, 236, 0.3);
        }

        .reset-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .reset-footer {
          text-align: center;
          margin-top: 10px;
        }

        .reset-home-link {
          font-size: 0.85rem;
          color: #64748b;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .reset-home-link:hover {
          color: #2e80ec;
          text-decoration: underline;
        }

        .reset-alert {
          padding: 14px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: center;
        }

        .reset-alert--error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }

        .reset-alert--success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
        }

        @keyframes reset-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .reset-spin { animation: reset-spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default ResetPassword;
