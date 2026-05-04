import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import {
  FiMenu, FiX, FiGlobe, FiLogOut, FiChevronDown,
  FiClipboard, FiFolder, FiUser, FiSettings
} from 'react-icons/fi';
import Notifications from './Notifications';
import './ModernHeader.css';

function ModernHeader({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const { language, setLanguage, t, languages } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const changeFontSize = (size) => {
    setFontSize(size);
    const root = document.documentElement;
    if (size === 'small') root.style.fontSize = '14px';
    else if (size === 'large') root.style.fontSize = '18px';
    else root.style.fontSize = '16px';
  };

  return (
    <div className="mh-wrapper">
      {/* ===== MAIN HEADER ===== */}
      <header className="mh-header">
        <div className="mh-header-inner">
          {/* Left: Emblem + Branding */}
          <div className="mh-brand-area">
            <button className="mh-mobile-toggle" onClick={() => setShowNavMenu(!showNavMenu)} aria-label="Toggle navigation">
              {showNavMenu ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <Link to="/dashboard" className="mh-brand-link">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Government of India Emblem"
                className="mh-emblem"
              />
              <div className="mh-brand-text">
                <p className="mh-brand-hindi">ग्राम पंचायत पोर्टल</p>
                <h1 className="mh-brand-title">Gram Panchayat E-Governance Portal</h1>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="mh-actions">
            {/* Language Selector — icon only */}
            <div className="mh-action-wrap">
              <button onClick={() => { setShowLangMenu(!showLangMenu); setShowProfileMenu(false); }}
                className="mh-icon-btn" title={`Language: ${language}`} aria-expanded={showLangMenu}>
                <FiGlobe size={17} />
              </button>
              {showLangMenu && (
                <div className="mh-dropdown">
                  {languages.map((lang) => (
                    <button key={lang.code}
                      onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                      className={`mh-dropdown-item ${language === lang.code ? 'active' : ''}`}>
                      <span style={{ marginRight: '0.5rem' }}>{lang.native}</span>
                      {language === lang.code && <span style={{ color: '#FF6600', fontSize: '0.7rem' }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="mh-action-wrap mh-notif-wrap">
              <Notifications user={user} />
            </div>

            {/* Divider */}
            <div className="mh-action-divider" />

            {/* User Profile */}
            <div className="mh-action-wrap">
              <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowLangMenu(false); }}
                className="mh-profile-btn" title="My Profile" aria-expanded={showProfileMenu}>
                <div className="mh-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                <div className="mh-profile-info">
                  <span className="mh-profile-name-sm">{user?.name?.split(' ')[0] || 'User'}</span>
                  <span className="mh-profile-role-sm">{user?.role === 'admin' || user?.role === 'officer' ? 'Admin' : 'Citizen'}</span>
                </div>
                <FiChevronDown size={12} />
              </button>
              {showProfileMenu && (
                <div className="mh-dropdown mh-profile-dropdown">
                  <div className="mh-profile-head">
                    <div className="mh-avatar-lg">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <div>
                      <p className="mh-profile-name">{user?.name || 'User'}</p>
                      <p className="mh-profile-role">{user?.role === 'admin' || user?.role === 'officer' ? 'Officer / Admin' : 'Citizen'}</p>
                    </div>
                  </div>
                  <div className="mh-profile-body">
                    {user?.role === 'admin' || user?.role === 'officer' ? (
                      <>
                        <button className="mh-dropdown-item" onClick={() => { navigate('/admin', { state: { tab: 'overview' } }); setShowProfileMenu(false); }}>
                          <FiSettings size={14} /> Admin Dashboard
                        </button>
                        <button className="mh-dropdown-item" onClick={() => { navigate('/admin', { state: { tab: 'applications' } }); setShowProfileMenu(false); }}>
                          <FiClipboard size={14} /> All Applications
                        </button>
                        <button className="mh-dropdown-item" onClick={() => { navigate('/admin', { state: { tab: 'documents' } }); setShowProfileMenu(false); }}>
                          <FiFolder size={14} /> All Documents
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="mh-dropdown-item" onClick={() => { navigate('/applications'); setShowProfileMenu(false); }}>
                          <FiClipboard size={14} /> My Applications
                        </button>
                        <button className="mh-dropdown-item" onClick={() => { navigate('/documents'); setShowProfileMenu(false); }}>
                          <FiFolder size={14} /> My Documents
                        </button>
                      </>
                    )}
                  </div>
                  <div className="mh-profile-footer">
                    <button className="mh-dropdown-item mh-logout-item"
                      onClick={() => { setShowProfileMenu(false); handleLogout(); }}>
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tricolor Strip */}
        <div className="mh-tricolor">
          <div className="mh-tc-saffron"></div>
          <div className="mh-tc-white"></div>
          <div className="mh-tc-green"></div>
        </div>
      </header>

      {/* ===== NAVIGATION BAR ===== */}
      <nav className="mh-navbar" role="navigation" aria-label="Site Navigation">
        <div className="mh-navbar-inner">
          <div className={`mh-nav-links ${showNavMenu ? 'mh-nav-open' : ''}`}>
            <Link to="/dashboard" className={`mh-nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setShowNavMenu(false)}>{t('home')}</Link>
            <Link to="/certificates" className={`mh-nav-link ${isActive('/certificates') ? 'active' : ''}`} onClick={() => setShowNavMenu(false)}>{t('certificates')}</Link>
            <Link to="/taxes" className={`mh-nav-link ${isActive('/taxes') ? 'active' : ''}`} onClick={() => setShowNavMenu(false)}>{t('taxPayment')}</Link>
            <Link to="/complaints" className={`mh-nav-link ${isActive('/complaints') ? 'active' : ''}`} onClick={() => setShowNavMenu(false)}>{t('grievances')}</Link>
            <Link to="/schemes" className={`mh-nav-link ${isActive('/schemes') ? 'active' : ''}`} onClick={() => setShowNavMenu(false)}>{t('schemes')}</Link>
            <Link to="/funds" className={`mh-nav-link ${isActive('/funds') ? 'active' : ''}`} onClick={() => setShowNavMenu(false)}>{t('funds')}</Link>
            {(user?.role === 'admin' || user?.role === 'officer') && (
              <Link to="/admin" className={`mh-nav-link mh-admin-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setShowNavMenu(false)}>Admin</Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default ModernHeader;
