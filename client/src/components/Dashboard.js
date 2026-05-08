import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import {
  FiFileText, FiDollarSign, FiAlertCircle, FiSettings,
  FiTrendingUp, FiUsers, FiArrowRight, FiChevronDown,
  FiLogOut, FiGlobe, FiClipboard, FiFolder, FiMenu, FiX, FiUser, FiShield, FiEdit2, FiSave
} from 'react-icons/fi';
import Notifications from './Notifications';
import { auth } from '../api';
import './Dashboard.css';

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const { language, setLanguage, t, languages } = useLanguage();

  // Profile editor state
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '', phone: '', email: '', address: '', ward: '',
    aadhar: '', income: '', category: '', landHolding: '', familySize: '', occupation: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200',
      textHindi: t('heroHindi1'),
      text: t('heroText1'),
      description: t('heroDesc1')
    },
    {
      image: '/images/indianvillage.jpg',
      textHindi: t('heroHindi2'),
      text: t('heroText2'),
      description: t('heroDesc2')
    },
    {
      image: '/images/farmer.jpg',
      textHindi: t('heroHindi3'),
      text: t('heroText3'),
      description: t('heroDesc3')
    }
  ];

  const importantNotices = [
    "PM Awas Yojana (Rural) applications are open — apply before 31st December 2025 | पीएम आवास योजना (ग्रामीण) हेतु आवेदन आमंत्रित हैं।",
    "Kisan Samman Nidhi Yojana — new enrollment deadline is 15th January 2026 | किसान सम्मान निधि हेतु नामांकन की अंतिम तिथि 15 जनवरी 2026।",
    "Online property tax payment facility is now live. Pay via Net Banking / UPI | संपत्ति कर ऑनलाइन जमा करें।",
    "Grievance Redressal Camp: 5th January 2026 at Gram Panchayat Office | शिकायत निवारण शिविर 5 जनवरी 2026।",
    "MNREGA Job Card renewal process has started — contact your Ward Representative | मनरेगा जॉब कार्ड नवीनीकरण प्रक्रिया प्रारंभ।"
  ];

  const latestUpdates = [
    { date: "22 Apr 2025", title: "PM Awas Yojana (Rural) applications now open for eligible families", category: "Scheme" },
    { date: "20 Apr 2025", title: "Online property tax payment facility launched on portal", category: "Tax" },
    { date: "18 Apr 2025", title: "Digital birth & death certificate issuance started", category: "Certificate" },
    { date: "15 Apr 2025", title: "Gram Sabha special meeting scheduled for 1st May 2025", category: "Notice" },
    { date: "12 Apr 2025", title: "MNREGA job cards renewal process initiated by Gram Panchayat", category: "Scheme" },
    { date: "10 Apr 2025", title: "New grievance portal launched for faster citizen redressal", category: "Grievance" },
  ];

  const quickLinks = [
    { labelKey: "qlPMAwas",      href: "/schemes" },
    { labelKey: "qlMNREGA",      href: "/schemes" },
    { labelKey: "qlKisan",       href: "/schemes" },
    { labelKey: "qlPropertyTax", href: "/taxes" },
    { labelKey: "qlBirthCert",   href: "/certificates" },
    { labelKey: "qlCasteCert",   href: "/certificates" },
    { labelKey: "qlGrievance",   href: "/complaints" },
    { labelKey: "qlFund",        href: "/funds" },
    { labelKey: "qlApplications",href: "/applications" },
    { labelKey: "qlDocuments",   href: "/documents" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfileMenu && !e.target.closest('.header-profile-area')) setShowProfileMenu(false);
      if (showLangMenu && !e.target.closest('.header-lang-area')) setShowLangMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu, showLangMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    const root = document.documentElement;
    if (size === 'small') root.style.fontSize = '14px';
    else if (size === 'large') root.style.fontSize = '18px';
    else root.style.fontSize = '16px';
  };

  const isActive = (path) => location.pathname === path;

  const openProfileEditor = async () => {
    setShowProfileMenu(false);
    setProfileError('');
    setProfileSuccess('');
    setShowProfileEditor(true);
    setProfileLoading(true);
    try {
      const { data } = await auth.getProfile();
      setProfileForm({
        name:        data.name        || '',
        phone:       data.phone       || '',
        email:       data.email       || '',
        address:     data.address     || '',
        ward:        data.ward        || '',
        aadhar:      data.aadhar      || '',
        income:      data.income      || '',
        category:    data.category    || '',
        landHolding: data.landHolding || '',
        familySize:  data.familySize  || '',
        occupation:  data.occupation  || '',
      });
    } catch {
      setProfileError('Could not load profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const { data } = await auth.updateProfile(profileForm);
      const updated = { ...user, name: data.user.name, email: data.user.email };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="dashboard gov-portal" id="top">

      {/* ===== MAIN GOVERNMENT HEADER ===== */}
      <header className="gov-header">
        <div className="gov-header-inner">
          <div className="gov-header-left">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Government of India Emblem — Satyamev Jayate"
              className="gov-emblem"
            />
            <div className="gov-branding">
              <p className="branding-hindi">ग्राम पंचायत ई-गवर्नेंस पोर्टल</p>
              <h1 className="branding-title">Gram Panchayat E-Governance Portal</h1>
            </div>
          </div>

          <div className="gov-header-right">
            {/* Language Selector */}
            <div className="header-lang-area">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="header-action-btn" title="Select Language" aria-expanded={showLangMenu}>
                <FiGlobe size={15} />
                <span>{languages.find(l => l.code === language)?.native || 'EN'}</span>
                <FiChevronDown size={12} />
              </button>
              {showLangMenu && (
                <div className="header-dropdown">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                      className={`dropdown-item ${language === lang.code ? 'active' : ''}`}>
                      {lang.native}
                      {language === lang.code && <span style={{ color: '#FF6600', marginLeft: '0.5rem', fontSize: '0.7rem' }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="header-notif-area">
              <Notifications user={user} />
            </div>

            {/* User Profile */}
            <div className="header-profile-area">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="profile-trigger-btn" title="My Profile" aria-expanded={showProfileMenu}>
                <div className="header-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                <span className="header-username">{user?.name?.split(' ')[0] || 'User'}</span>
                <FiChevronDown size={13} />
              </button>
              {showProfileMenu && (
                <div className="header-dropdown profile-dropdown">
                  <div className="profile-info-header">
                    <div className="profile-avatar-lg">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <div>
                      <p className="profile-full-name">{user?.name || 'User'}</p>
                      <p className="profile-role-tag">{user?.role === 'admin' || user?.role === 'officer' ? 'Officer / Admin' : 'Citizen'}</p>
                    </div>
                  </div>
                  <div className="profile-menu-items">
                    {user?.role === 'admin' || user?.role === 'officer' ? (
                      <>
                        <button className="dropdown-item" onClick={() => { navigate('/admin', { state: { tab: 'overview' } }); setShowProfileMenu(false); }}>
                          <FiSettings size={14} /> Admin Dashboard
                        </button>
                        <button className="dropdown-item" onClick={() => { navigate('/admin', { state: { tab: 'applications' } }); setShowProfileMenu(false); }}>
                          <FiClipboard size={14} /> All Applications
                        </button>
                        <button className="dropdown-item" onClick={() => { navigate('/admin', { state: { tab: 'documents' } }); setShowProfileMenu(false); }}>
                          <FiFolder size={14} /> All Documents
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="dropdown-item" onClick={openProfileEditor}>
                          <FiEdit2 size={14} /> Edit My Profile
                        </button>
                        <button className="dropdown-item" onClick={() => { navigate('/applications'); setShowProfileMenu(false); }}>
                          <FiClipboard size={14} /> My Applications
                        </button>
                        <button className="dropdown-item" onClick={() => { navigate('/documents'); setShowProfileMenu(false); }}>
                          <FiFolder size={14} /> My Documents
                        </button>
                      </>
                    )}
                  </div>
                  <div className="profile-menu-footer">
                    <button className="dropdown-item logout-dropdown-item" onClick={() => { setShowProfileMenu(false); handleLogout(); }}>
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tricolor Strip */}
        <div className="gov-tricolor">
          <div className="tc-saffron"></div>
          <div className="tc-white"></div>
          <div className="tc-green"></div>
        </div>
      </header>

      {/* ===== NAVIGATION BAR ===== */}
      <nav className="gov-navbar" role="navigation" aria-label="Main Navigation">
        <div className="gov-navbar-inner">
          <button className="navbar-mobile-btn" onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Toggle navigation">
            {showMobileMenu ? <FiX size={18} /> : <FiMenu size={18} />}
            <span>Menu</span>
          </button>
          <div className={`navbar-links ${showMobileMenu ? 'navbar-open' : ''}`}>
            <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>{t('home')}</Link>
            <Link to="/certificates" className={`navbar-link ${isActive('/certificates') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>{t('certificates')}</Link>
            <Link to="/taxes" className={`navbar-link ${isActive('/taxes') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>{t('taxPayment')}</Link>
            <Link to="/complaints" className={`navbar-link ${isActive('/complaints') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>{t('grievances')}</Link>
            <Link to="/schemes" className={`navbar-link ${isActive('/schemes') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>{t('schemes')}</Link>
            <Link to="/funds" className={`navbar-link ${isActive('/funds') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>{t('funds')}</Link>
            {(user?.role === 'admin' || user?.role === 'officer') && (
              <Link to="/admin" className={`navbar-link admin-navbar-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setShowMobileMenu(false)}>Admin</Link>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO CAROUSEL ===== */}
      <section className="hero-carousel">
        <div className="carousel-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="carousel-overlay" />
              <div className="carousel-content">
                <p className="carousel-hindi">{slide.textHindi}</p>
                <h2 className="carousel-title">{slide.text}</h2>
                <p className="carousel-description">{slide.description}</p>
                <div className="carousel-badge-row">
                  <span className="carousel-badge">🇮🇳 Digital India</span>
                  <span className="carousel-badge">🏡 Gram Swaraj</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button key={index} className={`indicator ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="stats-section" id="main-content">
        <div className="stats-inner">
          <div className="stat-card stat-blue">
            <div className="stat-icon-wrap"><FiFileText size={26} /></div>
            <div className="stat-body">
              <div className="stat-value">14,354</div>
              <div className="stat-label">{t('statOnlineServices')}</div>
            </div>
          </div>
          <div className="stat-card stat-saffron">
            <div className="stat-icon-wrap"><FiClipboard size={26} /></div>
            <div className="stat-body">
              <div className="stat-value">4,664</div>
              <div className="stat-label">{t('statActiveSchemes')}</div>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon-wrap"><FiUsers size={26} /></div>
            <div className="stat-body">
              <div className="stat-value">54,760</div>
              <div className="stat-label">{t('statCitizens')}</div>
            </div>
          </div>
          <div className="stat-card stat-teal">
            <div className="stat-icon-wrap"><FiTrendingUp size={26} /></div>
            <div className="stat-body">
              <div className="stat-value">98.2%</div>
              <div className="stat-label">{t('statSatisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="services-section">
        <div className="services-inner">
          <div className="section-title-block">
            <h2 className="section-main-title">{t('onlineServices')}</h2>
            <p className="section-sub-title">{t('onlineServicesDesc')}</p>
          </div>

          <div className="services-grid">
            <Link to="/certificates" className="service-card svc-blue">
              <div className="svc-top">
                <span className="svc-badge">{t('badgeAvailable')}</span>
              </div>
              <h3>{t('digitalCertificates')}</h3>
              <p>{t('digitalCertDesc')}</p>
              <div className="svc-footer"><span>{t('accessService')}</span><FiArrowRight size={15} /></div>
            </Link>

            <Link to="/taxes" className="service-card svc-orange">
              <div className="svc-top">
                <span className="svc-badge">{t('badgePayOnline')}</span>
              </div>
              <h3>{t('taxPaymentTitle')}</h3>
              <p>{t('taxPaymentDesc')}</p>
              <div className="svc-footer"><span>{t('payNow')}</span><FiArrowRight size={15} /></div>
            </Link>

            <Link to="/complaints" className="service-card svc-red">
              <div className="svc-top">
                <span className="svc-badge">{t('badge24x7')}</span>
              </div>
              <h3>{t('grievancesTitle')}</h3>
              <p>{t('grievancesDesc')}</p>
              <div className="svc-footer"><span>{t('fileComplaint')}</span><FiArrowRight size={15} /></div>
            </Link>

            <Link to="/schemes" className="service-card svc-green">
              <div className="svc-top">
                <span className="svc-badge">{t('badgeApplyNow')}</span>
              </div>
              <h3>{t('schemesTitle')}</h3>
              <p>{t('schemesDesc')}</p>
              <div className="svc-footer"><span>{t('viewSchemes')}</span><FiArrowRight size={15} /></div>
            </Link>

            <Link to="/funds" className="service-card svc-teal">
              <div className="svc-top">
                <span className="svc-badge">{t('badgeTransparent')}</span>
              </div>
              <h3>{t('fundsTitle')}</h3>
              <p>{t('fundsDesc')}</p>
              <div className="svc-footer"><span>{t('checkFunds')}</span><FiArrowRight size={15} /></div>
            </Link>

            <Link to="/applications" className="service-card svc-purple">
              <div className="svc-top">
                <span className="svc-badge">{t('badgeTrack')}</span>
              </div>
              <h3>{t('myApplicationsTitle')}</h3>
              <p>{t('myApplicationsDesc')}</p>
              <div className="svc-footer"><span>{t('trackStatus')}</span><FiArrowRight size={15} /></div>
            </Link>

            {(user?.role === 'admin' || user?.role === 'officer') && (
              <Link to="/admin" className="service-card svc-admin">
                <div className="svc-top">
                  <span className="svc-badge admin-svc-badge">{t('badgeAdmin')}</span>
                </div>
                <h3>{t('adminTitle')}</h3>
                <p>{t('adminDesc')}</p>
                <div className="svc-footer"><span>{t('adminPanel')}</span><FiArrowRight size={15} /></div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ===== LATEST UPDATES + QUICK LINKS ===== */}
      <section className="gov-info-section">
        <div className="gov-info-inner">

          {/* Latest Updates Panel */}
          <div className="info-panel">
            <div className="panel-title-bar updates-bar">
              <h3>{t('latestNews')}</h3>
              <span className="panel-hindi">{t('latestNewsHindi')}</span>
            </div>
            <div className="updates-list">
              {latestUpdates.map((item, i) => (
                <div key={i} className="update-row">
                  <div className="update-top">
                    <span className={`update-tag tag-${item.category.toLowerCase()}`}>{item.category}</span>
                    <span className="update-date">{item.date}</span>
                  </div>
                  <p className="update-text">{item.title}</p>
                </div>
              ))}
            </div>
            <div className="panel-view-all">
              <Link to="/schemes">{t('viewAllUpdates')}</Link>
            </div>
          </div>

          {/* Quick Links + Contact Panel */}
          <div className="info-panel">
            <div className="panel-title-bar links-bar">
              <h3>{t('quickLinks')}</h3>
              <span className="panel-hindi">{t('quickLinksHindi')}</span>
            </div>
            <div className="quick-links-grid">
              {quickLinks.map((link, i) => (
                <Link key={i} to={link.href} className="quick-link-btn">
                  <span className="ql-arrow">›</span> {t(link.labelKey)}
                </Link>
              ))}
            </div>

            <div className="panel-title-bar contact-bar" style={{ marginTop: '1.25rem' }}>
              <h3>{t('helpdesk')}</h3>
            </div>
            <div className="contact-box">
              <p>☎ {t('tollfree')}: <strong>1800-123-4567</strong></p>
              <p>📧 <strong>support@grampanchayat.gov.in</strong></p>
              <p>⏰ {t('officeHours')}</p>
              <p>📍 Gram Panchayat Office, District Headquarters</p>
            </div>
          </div>

        </div>
      </section>

      {/* ===== CITIZEN PROFILE EDITOR MODAL ===== */}
      {showProfileEditor && (
        <div className="prof-overlay" onClick={() => setShowProfileEditor(false)}>
          <div className="prof-modal" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="prof-header">
              <div className="prof-header-left">
                <div className="prof-avatar-lg">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                <div>
                  <h2>My Profile</h2>
                  <p>Update your personal details</p>
                </div>
              </div>
              <button className="prof-close" onClick={() => setShowProfileEditor(false)}>✕</button>
            </div>

            {/* Modal Body */}
            <div className="prof-body">
              {profileLoading ? (
                <div className="prof-loading">Loading your profile…</div>
              ) : (
                <form onSubmit={saveProfile}>
                  {profileError   && <div className="prof-msg prof-msg-error">{profileError}</div>}
                  {profileSuccess && <div className="prof-msg prof-msg-success">{profileSuccess}</div>}

                  {/* Personal Info */}
                  <div className="prof-section-title">Personal Information</div>
                  <div className="prof-grid-2">
                    <div className="prof-field">
                      <label>Full Name *</label>
                      <input type="text" value={profileForm.name} required
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Your full name" />
                    </div>
                    <div className="prof-field">
                      <label>Phone Number *</label>
                      <input type="text" value={profileForm.phone} required maxLength={10}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="10-digit mobile number" />
                    </div>
                    <div className="prof-field">
                      <label>Email Address</label>
                      <input type="email" value={profileForm.email}
                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="your@email.com (optional)" />
                    </div>
                    <div className="prof-field">
                      <label>Occupation</label>
                      <input type="text" value={profileForm.occupation}
                        onChange={e => setProfileForm({ ...profileForm, occupation: e.target.value })}
                        placeholder="e.g. Farmer, Teacher, Labour" />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="prof-section-title">Address &amp; Location</div>
                  <div className="prof-grid-2">
                    <div className="prof-field prof-field-full">
                      <label>Full Address</label>
                      <input type="text" value={profileForm.address}
                        onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                        placeholder="House No., Street, Village" />
                    </div>
                    <div className="prof-field">
                      <label>Ward</label>
                      <select value={profileForm.ward}
                        onChange={e => setProfileForm({ ...profileForm, ward: e.target.value })}>
                        <option value="">— Select Ward —</option>
                        {['Ward 1','Ward 2','Ward 3','Ward 4','Ward 5','Ward 6','Ward 7','Ward 8','Ward 9','Ward 10'].map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                    <div className="prof-field">
                      <label>Aadhaar Number</label>
                      <input type="text" value={profileForm.aadhar} maxLength={12}
                        onChange={e => setProfileForm({ ...profileForm, aadhar: e.target.value })}
                        placeholder="12-digit Aadhaar" />
                    </div>
                  </div>

                  {/* Demographics & Finance */}
                  <div className="prof-section-title">Demographics &amp; Financial Details</div>
                  <div className="prof-grid-2">
                    <div className="prof-field">
                      <label>Social Category</label>
                      <select value={profileForm.category}
                        onChange={e => setProfileForm({ ...profileForm, category: e.target.value })}>
                        <option value="">— Select Category —</option>
                        {['General','OBC','SC','ST','EWS'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="prof-field">
                      <label>Family Size</label>
                      <input type="number" min={1} max={20} value={profileForm.familySize}
                        onChange={e => setProfileForm({ ...profileForm, familySize: e.target.value })}
                        placeholder="No. of family members" />
                    </div>
                    <div className="prof-field">
                      <label>Annual Income (₹)</label>
                      <input type="number" min={0} value={profileForm.income}
                        onChange={e => setProfileForm({ ...profileForm, income: e.target.value })}
                        placeholder="e.g. 120000" />
                    </div>
                    <div className="prof-field">
                      <label>Land Holding (Acres)</label>
                      <input type="number" min={0} step={0.1} value={profileForm.landHolding}
                        onChange={e => setProfileForm({ ...profileForm, landHolding: e.target.value })}
                        placeholder="e.g. 2.5" />
                    </div>
                  </div>

                  <div className="prof-info-note">
                    ℹ Your income, category, and land holding details are used for government scheme eligibility checks.
                  </div>

                  <div className="prof-actions">
                    <button type="button" className="prof-btn-cancel" onClick={() => setShowProfileEditor(false)}>Cancel</button>
                    <button type="submit" className="prof-btn-save" disabled={profileSaving}>
                      <FiSave size={14} /> {profileSaving ? 'Saving…' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
