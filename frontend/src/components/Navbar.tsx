import React, { useState, useEffect } from 'react';
import {
  MapPin, Phone, User, LogOut,
  ChevronDown, ChevronRight, Menu, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { useAuthModal } from '../context/AuthModalContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { API_BASE_URL } from '../services/api';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openAuthModal } = useAuthModal();
  const { user, isLoggedIn, logout, token } = useAuth();
  const { currencies, activeCurrency, setCurrency } = useCurrency();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/', hasDropdown: false },
    { name: 'Flights', path: '/flights', hasDropdown: false },
    { name: 'Cars', path: '/cars', hasDropdown: false },
    { name: 'About Us', path: '/about', hasDropdown: false },
    { name: 'List Your Property', path: '/list-property', hasDropdown: false },
    { name: 'Contact', path: '/contact', hasDropdown: false },
    { name: 'FAQ', path: '/faq', hasDropdown: false },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const displayName = user
    ? ((user.firstname || user.lastname)
      ? `${user.firstname || ''} ${user.lastname || ''}`.trim()
      : user.email)
    : '';

  return (
    <header className={`navbar-header ${isScrolled && !isMobileMenuOpen ? 'scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-left">
            <div className="info-item">
              <MapPin size={14} />
              <span>19 Woodville St, Roxbury, MA, 02119, USA</span>
            </div>
            <span className="separator">|</span>
            <div className="info-item">
              <Phone size={14} />
              <span>(+1) - 603-333-8490</span>
            </div>
          </div>
          <div className="top-bar-right">
            {isLoggedIn ? (
              /* ── Logged-in state ── */
              <div className="auth-logged-in">
                <a href={`${API_BASE_URL}/api/admin/dashboard${token ? `?token=${token}` : ''}`} className="user-greeting" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} />
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>My Account</span>
                    <span className="user-name" style={{ fontSize: '11px', fontWeight: 400, opacity: 0.8 }}>{displayName}</span>
                  </div>
                </a>
              </div>
            ) : (
              /* ── Guest state ── */
              <div className="auth-item" onClick={() => openAuthModal('signin')}>
                <User size={14} />
                <span>Sign in or Register</span>
              </div>
            )}
            <span className="separator">|</span>
            {/* Currency Selector */}
            <div className="currency-selector group">
              <div className="active-currency">
                {activeCurrency ? `${activeCurrency.code} - ${activeCurrency.name}` : 'Loading...'}
                <ChevronDown size={14} />
              </div>
              <div className="currency-dropdown">
                {currencies.map(c => (
                  <div key={c.id} className="currency-option" onClick={() => setCurrency(c)}>
                    {c.code} - {c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container-fluid main-navbar-container">
        <div className="main-navbar-pill">
          {/* Logo */}
          <div className="logo-section">
            <Link to='/' className="logo-icon">
              <img className='logo' src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="desktop-menu">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <div key={link.name} className={`menu-item-wrapper group ${isActive ? 'menu-active' : ''}`}>
                  <div className="menu-item">
                    <Link to={link.path} className={`menu-link ${isActive ? 'menu-link--active' : ''}`}>{link.name}</Link>
                    {link.hasDropdown && <ChevronDown size={14} className="dropdown-chevron" />}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="actions-section">
            {isLoggedIn ? (
              <button className="booking-btn desktop-only" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <button className="booking-btn desktop-only" onClick={() => openAuthModal('signin')}>Sign In / Register</button>
            )}
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal is rendered globally by AuthModalProvider */}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="mobile-overlay" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="mobile-drawer">
              <div className="mobile-drawer-header">
                <img src={logo} alt="Logo" style={{ height: '45px', objectFit: 'contain' }} />
                <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="mobile-drawer-content">
                <div className="mobile-nav-links">
                  {navLinks.map((link, idx) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx, duration: 0.3 }}
                      >
                        <Link
                          to={link.path}
                          className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="nav-item-text">{link.name}</span>
                          <ChevronRight size={18} className="nav-item-icon" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <hr className="mobile-divider" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="mobile-extras"
                >
                  {isLoggedIn ? (
                    <div className="mobile-user-section">
                      <a href={`${API_BASE_URL}/api/admin/dashboard${token ? `?token=${token}` : ''}`} className="mobile-greeting" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <User size={20} />
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                          <span style={{ fontSize: '15px', fontWeight: 700 }}>My Account</span>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>{displayName}</span>
                        </div>
                      </a>
                      <button className="mobile-action-btn outline" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  ) : (
                    <button className="mobile-action-btn primary" onClick={() => { openAuthModal('signin'); setIsMobileMenuOpen(false); }}>
                      <User size={18} /> Sign In / Register
                    </button>
                  )}

                  <div className="mobile-currency-section">
                    <p className="mobile-section-label">Select Currency</p>
                    <div className="mobile-currency-grid">
                      {currencies.map(c => (
                        <button
                          key={c.id}
                          className={`mobile-currency-btn ${activeCurrency?.id === c.id ? 'active' : ''}`}
                          onClick={() => { setCurrency(c); setIsMobileMenuOpen(false); }}
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .container-fluid { width: 100%; }
        .navbar-header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; transition: transform 0.5s ease; }
        .navbar-header.scrolled { transform: translateY(-62px); }
        .top-bar { background-color: var(--secondary); color: white; padding: 10px 0 30px; height: 55px; }
        .top-bar-content { display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: 400; line-height: 1.8; }
        .top-bar-left, .top-bar-right { display: flex; align-items: center; gap: 16px; }
        .info-item, .auth-item { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .separator { opacity: 0.3; margin: 0 8px; }
        .social-items { display: flex; gap: 16px; }

        /* ── Currency Selector ── */
        .currency-selector { position: relative; cursor: pointer; display: flex; align-items: center; height: 100%; font-weight: 400; font-size: 16px; }
        .active-currency { display: flex; align-items: center; gap: 6px; }
        .currency-dropdown { position: absolute; top: 100%; right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 12px 0; min-width: 220px; opacity: 0; visibility: hidden; transition: all 0.2s ease; transform: translateY(10px); z-index: 100; }
        .currency-selector:hover .currency-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
        .currency-option { display: flex; align-items: center; justify-content: space-between; padding: 10px 24px; color: #4b5563; font-size: 15px; font-weight: 500; transition: all 0.2s; white-space: nowrap; margin: 0; background: transparent; cursor: pointer; }
        .currency-option:hover { color: var(--secondary); background: #f8fafc; padding-left: 28px; }

        /* ── Logged-in auth bar ── */
        .auth-logged-in {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-greeting {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }
        .user-name {
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .logout-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.8;
          padding: 0;
          transition: opacity 0.2s;
        }
        .logout-item:hover { opacity: 0.75; }

        .main-navbar-container { margin-top: 0px; height: 0; overflow: visible; }
        .main-navbar-pill { background: white; border-radius: 0px 9999px 9999px 0px; padding: 0 21px 0 21px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 20px 50px rgba(0,0,0,0.1); margin-top: 0px; height: 80px; overflow: hidden; }
        .logo-section { display: flex; align-items: center; }
        .logo-icon { display: flex; align-items: center; height: 100%; }
        .logo { max-height: 125px; width: auto; object-fit: contain; margin-top: 10px; margin-left: 70px; object-fit: cover; }

        .desktop-menu { display: flex; gap: 30px; align-items: center; margin: 0 40px; }
        .menu-item-wrapper { position: relative; padding: 15px 0; cursor: pointer; }
        .menu-item { display: flex; align-items: center; gap: 6px; }
        .menu-link { font-size: 17px; font-weight: 400; color: #1a1a1a; transition: color 0.3s ease; position: relative; padding-bottom: 3px; }
        .menu-link--active { color: var(--secondary) !important; font-weight: 600; }
        .menu-link--active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #fe9d3d;
          border-radius: 2px;
          transform: scaleX(1);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .menu-link:not(.menu-link--active)::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #fe9d3d;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .menu-item-wrapper:hover .menu-link:not(.menu-link--active)::after { transform: scaleX(1); }

        /* ── Navbar logout button ── */
        .nav-logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 17px;
          font-weight: 500;
          color: #fe9d3d;
          padding: 0;
          transition: color 0.3s ease;
          white-space: nowrap;
        }
        .nav-logout-btn:hover { color: #e07a1f; }

        .dropdown-menu { position: absolute; top: 100%; left: -20px; width: 220px; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); opacity: 0; transform: translateY(10px); pointer-events: none; transition: all 0.3s ease; border-top: 4px solid var(--secondary); z-index: 100; }
        .menu-item-wrapper:hover .dropdown-menu { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .dropdown-menu ul { list-style: none; padding: 0; margin: 0; }
        .dropdown-menu li { padding: 10px 0; font-weight: 700; color: #1a1a1a; cursor: pointer; border-bottom: 1px solid #f5f5f5; font-size: 15px; }
        .dropdown-menu li:last-child { border-bottom: none; }
        .dropdown-menu li:hover { color: var(--secondary); padding-left: 5px; transition: all 0.3s ease; }

        .actions-section { display: flex; align-items: center; gap: 30px; }
        .cart-wrapper { position: relative; cursor: pointer; color: #1a1a1a; display: flex; align-items: center; }
        .cart-badge { position: absolute; top: -10px; right: -12px; background: var(--accent); color: white; font-size: 10px; font-weight: 900; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; }
        .v-separator { width: 1px; height: 30px; background: #eee; }
        .search-icon { cursor: pointer; color: #1a1a1a; transition: color 0.3s ease; }
        .search-icon:hover { color: var(--secondary); }
        .booking-btn { background: #fe9d3d; padding: 12px 34px; border-radius: 30px; color: #fff; display: inline-block; border: 1px solid #fe9d3d; text-align: center; overflow: hidden; position: relative; font-weight: 500; transition: all 0.3s ease; white-space: nowrap; font-size: 16px; line-height: 1.8; }
        .booking-btn:hover { background: #2e80ec; border: 1px solid #2e80ec; }
        .mobile-toggle { display: none; background: transparent; border: none; cursor: pointer; color: var(--primary); }
        .mobile-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); z-index: 1100; backdrop-filter: blur(4px); }
        .mobile-drawer { position: fixed; right: 0; top: 0; bottom: 0; width: 340px; max-width: 85vw; background: #ffffff; z-index: 1200; display: flex; flex-direction: column; box-shadow: -20px 0 40px rgba(0,0,0,0.15); border-top-left-radius: 24px; border-bottom-left-radius: 24px; }
        .mobile-drawer-header { padding: 24px 28px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; background: #fff; border-top-left-radius: 24px; }
        .mobile-close-btn { background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .mobile-close-btn:hover { background: #e2e8f0; color: #0f172a; transform: rotate(90deg); }
        .mobile-drawer-content { padding: 28px; overflow-y: auto; flex-grow: 1; }
        .mobile-nav-links { display: flex; flex-direction: column; gap: 8px; }
        .mobile-nav-item { display: flex; justify-content: space-between; align-items: center; font-size: 17px; font-weight: 600; color: #475569; text-decoration: none; padding: 16px 20px; border-radius: 16px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: transparent; }
        .mobile-nav-item:hover { background: #f8fafc; color: #0f172a; padding-left: 24px; }
        .mobile-nav-item.active { background: rgba(254, 157, 61, 0.1); color: var(--secondary); font-weight: 700; }
        .mobile-nav-item .nav-item-icon { color: #cbd5e1; transition: transform 0.3s, color 0.3s; }
        .mobile-nav-item:hover .nav-item-icon { transform: translateX(4px); color: #94a3b8; }
        .mobile-nav-item.active .nav-item-icon { color: var(--secondary); }
        .mobile-divider { margin: 32px 0; border: 0; border-top: 1px dashed #e2e8f0; }
        .mobile-extras { display: flex; flex-direction: column; gap: 24px; }
        .mobile-user-section { display: flex; flex-direction: column; gap: 16px; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; }
        .mobile-greeting { display: flex; align-items: center; gap: 12px; font-weight: 700; color: #0f172a; font-size: 16px; }
        .mobile-action-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; width: 100%; transition: all 0.3s; border: none; letter-spacing: 0.3px; }
        .mobile-action-btn.primary { background: var(--accent); color: white; box-shadow: 0 4px 15px rgba(255, 156, 69, 0.3); }
        .mobile-action-btn.outline { background: transparent; border: 2px solid #e2e8f0; color: #64748b; }
        .mobile-action-btn.outline:hover { background: #f8fafc; border-color: #cbd5e1; }
        .mobile-currency-section { margin-top: 10px; }
        .mobile-section-label { font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
        .mobile-currency-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .mobile-currency-btn { padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #475569; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .mobile-currency-btn.active { background: var(--secondary); border-color: var(--secondary); color: white; }
        
        .container { max-width: 1400px; margin: 0 12px; padding: 0 12px; }
        @media (max-width: 1200px) {
          .desktop-menu { display: none; }
          .mobile-toggle { display: block; }
        }
        @media (max-width: 768px) {
          .top-bar { display: none !important; }
          .desktop-only { display: none !important; }
          .main-navbar-pill { padding: 0 15px; border-radius: 0; }
          .logo { margin-left: 0; max-height: 70px; }
          .actions-section { gap: 15px; }
          .currency-dropdown { right: -50px; }
          .navbar-header.scrolled { transform: translateY(0) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
