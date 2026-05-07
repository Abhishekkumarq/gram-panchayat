import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { certificates, complaints, taxes, schemes, funds, schemeApplications, adminData } from '../api';
import { useLanguage } from '../LanguageContext';
import Analytics from './Analytics';
import './Admin.css';

const TABS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'analytics',  label: 'Analytics' },
];

const STAT_CARDS = (stats, citizens, households, birthCerts, deathCerts, grievances, allTaxes, allFunds, allSchemes, allApps, gramSabha, properties, fmt) => [
  { label: 'Total Citizens',       val: fmt(stats.citizens    || citizens.length),                                          tab: 'citizens' },
  { label: 'Households',           val: fmt(stats.households  || households.length),                                        tab: 'households' },
  { label: 'Birth Certificates',   val: fmt(stats.birthCerts  || birthCerts.length),                                        tab: 'birth' },
  { label: 'Death Certificates',   val: fmt(stats.deathCerts  || deathCerts.length),                                        tab: 'death' },
  { label: 'Grievances',           val: fmt(stats.complaints  || grievances.length),                                        tab: 'grievances' },
  { label: 'Tax Revenue',           val: '₹' + fmt(stats.taxRevenue || allTaxes.reduce((s, t) => s + t.amount, 0)),        tab: 'taxes' },
  { label: 'Fund Records',         val: fmt(stats.funds       || allFunds.length),                                          tab: 'funds' },
  { label: 'Schemes',              val: fmt(stats.schemes     || allSchemes.length),                                        tab: 'schemes' },
  { label: 'Applications',         val: fmt(stats.applications|| allApps.length),                                           tab: 'applications' },
  { label: 'Gram Sabha Meetings',  val: fmt(stats.meetings    || gramSabha.length),                                         tab: 'gramsabha' },
  { label: 'Properties',           val: fmt(stats.properties  || properties.length),                                        tab: 'properties' },
];

function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab]     = useState(location.state?.tab || 'overview');
  const [stats, setStats]             = useState({});
  const [citizens, setCitizens]       = useState([]);
  const [birthCerts, setBirthCerts]   = useState([]);
  const [deathCerts, setDeathCerts]   = useState([]);
  const [grievances, setGrievances]   = useState([]);
  const [allTaxes, setAllTaxes]       = useState([]);
  const [allFunds, setAllFunds]       = useState([]);
  const [allSchemes, setAllSchemes]   = useState([]);
  const [allApps, setAllApps]         = useState([]);
  const [gramSabha, setGramSabha]     = useState([]);
  const [households, setHouseholds]   = useState([]);
  const [properties, setProperties]   = useState([]);
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState('');
  const [error, setError]             = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [
        statsRes, citizensRes, birthRes, deathRes,
        grievRes, taxRes, fundRes, schemeRes, appsRes,
        gsRes, hhRes, propRes
      ] = await Promise.allSettled([
        adminData.getStats(),
        adminData.getCitizens(),
        certificates.getAll(),
        adminData.getDeathCertificates(),
        complaints.getAll(),
        taxes.getAll(),
        funds.getAll(),
        schemes.getAll(),
        schemeApplications.getAll(1, 1000),
        adminData.getGramSabha(),
        adminData.getHouseholds(),
        adminData.getProperties()
      ]);

      if (statsRes.status    === 'fulfilled') setStats(statsRes.value.data);
      if (citizensRes.status === 'fulfilled') setCitizens(citizensRes.value.data);
      if (birthRes.status    === 'fulfilled') {
        const all = birthRes.value.data;
        setBirthCerts(Array.isArray(all) ? all.filter(c => c.type === 'birth') : []);
      }
      if (deathRes.status    === 'fulfilled') setDeathCerts(deathRes.value.data);
      if (grievRes.status    === 'fulfilled') setGrievances(grievRes.value.data);
      if (taxRes.status      === 'fulfilled') setAllTaxes(taxRes.value.data);
      if (fundRes.status     === 'fulfilled') {
        const fd = fundRes.value.data;
        setAllFunds(Array.isArray(fd) ? fd : fd?.funds || []);
      }
      if (schemeRes.status   === 'fulfilled') setAllSchemes(schemeRes.value.data);
      if (appsRes.status     === 'fulfilled') {
        const ap = appsRes.value.data;
        setAllApps(Array.isArray(ap) ? ap : ap?.applications || []);
      }
      if (gsRes.status       === 'fulfilled') setGramSabha(gsRes.value.data);
      if (hhRes.status       === 'fulfilled') setHouseholds(hhRes.value.data);
      if (propRes.status     === 'fulfilled') setProperties(propRes.value.data);
    } catch (e) {
      setError('Failed to load data. Make sure the backend server is running on port 5000.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateCertificate = async (id, status) => {
    try {
      await certificates.updateStatus(id, { status, remarks: `${status} by admin` });
      fetchAll();
    } catch { alert('Update failed'); }
  };

  const updateComplaint = async (id, status) => {
    try {
      await complaints.update(id, { status });
      fetchAll();
    } catch { alert('Update failed'); }
  };

  const filterBySearch = (items, fields) => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(item =>
      fields.some(f => {
        const val = f.split('.').reduce((o, k) => o?.[k], item);
        return String(val || '').toLowerCase().includes(q);
      })
    );
  };

  const fmt = n => Number(n || 0).toLocaleString('en-IN');

  const goToTab = (tab) => { setActiveTab(tab); setSearch(''); };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const adminUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  if (loading && !stats.citizens) {
    return (
      <div className="admin-page">
        <header className="admin-header" style={{ opacity: 0.7 }}>
          <div className="admin-header-left">
            <div className="admin-header-title">Admin Control Panel</div>
            <div className="admin-header-sub">Gram Panchayat E-Governance Portal</div>
          </div>
        </header>
        <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[...Array(11)].map((_, i) => (
              <div key={i} style={{ height: 90, borderRadius: 6, background: 'linear-gradient(90deg,#e8eef5 25%,#f5f7fa 50%,#e8eef5 75%)', backgroundSize: '800px 100%', animation: 'skeletonShimmer 1.4s infinite linear' }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[1,2].map(i => (
              <div key={i} style={{ height: 180, borderRadius: 6, background: 'linear-gradient(90deg,#e8eef5 25%,#f5f7fa 50%,#e8eef5 75%)', backgroundSize: '800px 100%', animation: 'skeletonShimmer 1.4s infinite linear' }} />
            ))}
          </div>
        </div>
        <style>{`@keyframes skeletonShimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* ── Admin Header ── */}
      <header className="admin-header">
        <div className="admin-header-left">
          <button className="admin-header-back" onClick={() => navigate('/dashboard')} title="Back to Dashboard">←</button>
          <div>
            <div className="admin-header-title">Admin Control Panel</div>
            <div className="admin-header-sub">Gram Panchayat E-Governance Portal</div>
          </div>
        </div>
        <div className="admin-header-right">
          <div className="admin-header-meta">
            <span className="admin-live-dot" />
            <span>Live System</span>
          </div>
          <div className="admin-header-user">
            <div className="admin-header-avatar">{adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
            <div>
              <div className="admin-header-username">{adminUser?.name || 'Admin'}</div>
              <div className="admin-header-role">{adminUser?.role || 'Administrator'}</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div className="admin-tab-bar">
        <div className="admin-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => goToTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 2rem', borderBottom: '1px solid #FCA5A5', fontSize: 13 }}>
          {error} — Start backend with <code>cd BACKEND &amp;&amp; node server.js</code>
        </div>
      )}

      <div className="admin-content">

        {/* Search bar (shown on all data tabs) */}
        {activeTab !== 'overview' && (
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-search"
            />
          </div>
        )}

        {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="admin-section">
            <h2>System Overview</h2>
            <div className="stats-grid">
              {STAT_CARDS(stats, citizens, households, birthCerts, deathCerts, grievances, allTaxes, allFunds, allSchemes, allApps, gramSabha, properties, fmt).map(card => (
                <div key={card.label} className="stat-card clickable" onClick={() => goToTab(card.tab)} title={`View ${card.label}`}>
                  <div className="stat-info">
                    <h3>{card.val}</h3>
                    <p>{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick summary panels */}
            <div className="overview-summary">
              <div className="summary-panel">
                <h3>Grievance Status</h3>
                {['pending', 'in-progress', 'resolved'].map(s => (
                  <div key={s} className="summary-row">
                    <span style={{ textTransform: 'capitalize' }}>{s}</span>
                    <strong>{grievances.filter(g => g.status === s).length}</strong>
                  </div>
                ))}
              </div>
              <div className="summary-panel">
                <h3>Gram Sabha Meetings</h3>
                {['Completed', 'Ongoing', 'Scheduled'].map(s => (
                  <div key={s} className="summary-row">
                    <span>{s}</span>
                    <strong>{gramSabha.filter(g => g.status === s).length}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ────────────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="admin-section" style={{ padding: 0, background: 'transparent', boxShadow: 'none', border: 'none' }}>
            <Analytics />
          </div>
        )}

        {/* Back button for drill-down tabs */}
        {!['overview', 'analytics'].includes(activeTab) && (
          <button className="admin-back-overview" onClick={() => goToTab('overview')}>
            ← Back to Overview
          </button>
        )}

        {/* ── CITIZENS ─────────────────────────────────────────────────── */}
        {activeTab === 'citizens' && (
          <div className="admin-section">
            <h2>Citizens ({citizens.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Email</th><th>Phone</th>
                    <th>Ward</th><th>Income (₹)</th><th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(citizens, ['name', 'email', 'phone', 'ward', 'address']).map((c, i) => (
                    <tr key={c._id}>
                      <td>{i + 1}</td>
                      <td><strong>{c.name}</strong></td>
                      <td style={{ fontSize: 12 }}>{c.email}</td>
                      <td>{c.phone}</td>
                      <td style={{ textAlign: 'center' }}>{c.ward}</td>
                      <td style={{ textAlign: 'right' }}>₹{fmt(c.income)}</td>
                      <td style={{ fontSize: 12 }}>{c.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BIRTH CERTIFICATES ───────────────────────────────────────── */}
        {activeTab === 'birth' && (
          <div className="admin-section">
            <h2>Birth Certificates ({birthCerts.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Cert No.</th><th>Name</th><th>Date of Birth</th>
                    <th>Place</th><th>Status</th><th>Registered</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(birthCerts, ['certificateNumber', 'applicationData.name', 'userId.name']).map(cert => (
                    <tr key={cert._id}>
                      <td><code>{cert.certificateNumber}</code></td>
                      <td>{cert.applicationData?.name || cert.userId?.name}</td>
                      <td>{cert.applicationData?.dateOfBirth}</td>
                      <td>{cert.applicationData?.placeOfBirth}</td>
                      <td><span className={`status ${cert.status}`}>{cert.status}</span></td>
                      <td>{cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="action-btns">
                        {cert.status === 'pending' && (
                          <>
                            <button onClick={() => updateCertificate(cert._id, 'approved')} className="approve-btn">Approve</button>
                            <button onClick={() => updateCertificate(cert._id, 'rejected')} className="reject-btn">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DEATH CERTIFICATES ───────────────────────────────────────── */}
        {activeTab === 'death' && (
          <div className="admin-section">
            <h2>Death Certificates ({deathCerts.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Cert No.</th><th>Deceased</th><th>Date of Death</th>
                    <th>Cause</th><th>Place</th><th>Status</th><th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(deathCerts, ['certificateNumber', 'userId.name']).map(cert => (
                    <tr key={cert._id}>
                      <td><code>{cert.certificateNumber}</code></td>
                      <td>{cert.userId?.name}</td>
                      <td>{cert.applicationData?.dateOfDeath}</td>
                      <td>{cert.applicationData?.causeOfDeath}</td>
                      <td>{cert.applicationData?.placeOfDeath}</td>
                      <td><span className={`status ${cert.status}`}>{cert.status}</span></td>
                      <td>{cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── GRIEVANCES ───────────────────────────────────────────────── */}
        {activeTab === 'grievances' && (
          <div className="admin-section">
            <h2>Grievances ({grievances.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Citizen</th><th>Type</th><th>Category</th>
                    <th>Location</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(grievances, ['title', 'category', 'userId.name', 'location']).map(g => (
                    <tr key={g._id}>
                      <td>{g.userId?.name}</td>
                      <td>{g.title}</td>
                      <td><span className="badge">{g.category}</span></td>
                      <td style={{ fontSize: 12 }}>{g.location}</td>
                      <td><span className={`priority ${g.priority}`}>{g.priority}</span></td>
                      <td>
                        <select
                          value={g.status}
                          onChange={e => updateComplaint(g._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td style={{ fontSize: 12 }}>{new Date(g.createdAt).toLocaleDateString('en-IN')}</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAX RECORDS ──────────────────────────────────────────────── */}
        {activeTab === 'taxes' && (
          <div className="admin-section">
            <h2>Tax Records ({allTaxes.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Taxpayer</th><th>Type</th><th>Year</th>
                    <th>Amount Due (₹)</th><th>Paid (₹)</th><th>Status</th><th>Receipt</th><th>Paid On</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(allTaxes, ['userId.name', 'taxType', 'receiptNumber']).map(tax => (
                    <tr key={tax._id}>
                      <td>{tax.userId?.name}</td>
                      <td><span className="badge">{tax.taxType}</span></td>
                      <td>{tax.year}</td>
                      <td style={{ textAlign: 'right' }}>₹{fmt(tax.amount)}</td>
                      <td style={{ textAlign: 'right' }}>₹{fmt(tax.propertyDetails?.amountPaid)}</td>
                      <td><span className={`status ${tax.status}`}>{tax.status}</span></td>
                      <td style={{ fontSize: 12 }}>{tax.receiptNumber || '—'}</td>
                      <td style={{ fontSize: 12 }}>{tax.paymentDate ? new Date(tax.paymentDate).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FUND ALLOCATION ──────────────────────────────────────────── */}
        {activeTab === 'funds' && (
          <div className="admin-section">
            <h2>Fund Allocation ({allFunds.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Ward</th><th>Year</th><th>Department</th>
                    <th>Allocated (₹)</th><th>Used (₹)</th><th>Balance (₹)</th><th>% Used</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(allFunds, ['ward', 'description', 'category']).map(f => {
                    const pct = f.allocated ? Math.round((f.spent / f.allocated) * 100) : 0;
                    return (
                      <tr key={f._id}>
                        <td style={{ textAlign: 'center' }}>{f.ward}</td>
                        <td style={{ textAlign: 'center' }}>{f.year}</td>
                        <td>{f.description}</td>
                        <td style={{ textAlign: 'right' }}>₹{fmt(f.allocated)}</td>
                        <td style={{ textAlign: 'right' }}>₹{fmt(f.spent)}</td>
                        <td style={{ textAlign: 'right' }}>₹{fmt(f.allocated - f.spent)}</td>
                        <td>
                          <div style={{ background: '#E8EFF8', borderRadius: 3, height: 14, width: 80, position: 'relative' }}>
                            <div style={{ background: pct > 90 ? '#CC0000' : '#138808', borderRadius: 3, height: '100%', width: `${Math.min(pct, 100)}%` }} />
                            <span style={{ position: 'absolute', top: 0, left: 4, fontSize: 10, lineHeight: '14px', color: '#333' }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SCHEMES ──────────────────────────────────────────────────── */}
        {activeTab === 'schemes' && (
          <div className="admin-section">
            <h2>Government Schemes ({allSchemes.length})</h2>
            <div className="schemes-grid">
              {filterBySearch(allSchemes, ['name', 'type', 'description']).map(s => (
                <div key={s._id} className="scheme-card">
                  <h3>{s.name}</h3>
                  <span className="scheme-type">{s.type}</span>
                  <p style={{ fontSize: 13, color: '#555' }}>{s.description}</p>
                  {s.benefits && <p><strong>Benefits:</strong> {s.benefits}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SCHEME APPLICATIONS ──────────────────────────────────────── */}
        {activeTab === 'applications' && (
          <div className="admin-section">
            <h2>Scheme Applications ({allApps.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Applicant</th><th>Scheme</th><th>Type</th>
                    <th>Application Date</th><th>Enrollment Date</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(allApps, ['userId.name', 'schemeId.name']).map(app => (
                    <tr key={app._id}>
                      <td>{app.userId?.name}</td>
                      <td>{app.schemeId?.name}</td>
                      <td>{app.applicationData?.applicationType}</td>
                      <td style={{ fontSize: 12 }}>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                      <td style={{ fontSize: 12 }}>{app.applicationData?.enrollmentDate || '—'}</td>
                      <td><span className={`status ${app.status}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DOCUMENTS ────────────────────────────────────────────────── */}
        {activeTab === 'documents' && (
          <div className="admin-section">
            <h2>All Citizen Documents</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Citizen</th><th>Document Type</th>
                    <th>Uploaded On</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(allApps, ['userId.name']).length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No documents found</td></tr>
                  ) : (
                    filterBySearch(allApps, ['userId.name']).slice(0, 50).map((doc, i) => (
                      <tr key={doc._id || i}>
                        <td>{i + 1}</td>
                        <td>{doc.userId?.name || '—'}</td>
                        <td><span className="badge">{doc.documentType || doc.applicationData?.applicationType || 'Document'}</span></td>
                        <td style={{ fontSize: 12 }}>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                        <td><span className={`status ${doc.status}`}>{doc.status || 'submitted'}</span></td>
                        <td className="action-btns">
                          {(!doc.status || doc.status === 'submitted' || doc.status === 'under-review') && (
                            <>
                              <button className="approve-btn" onClick={() => updateCertificate(doc._id, 'approved')}>Approve</button>
                              <button className="reject-btn" onClick={() => updateCertificate(doc._id, 'rejected')}>Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── GRAM SABHA ───────────────────────────────────────────────── */}
        {activeTab === 'gramsabha' && (
          <div className="admin-section">
            <h2>Gram Sabha Meetings ({gramSabha.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Ward</th><th>Title</th><th>Date</th>
                    <th>Location</th><th>Agenda</th><th>Duration</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(gramSabha, ['meetingTitle', 'agenda', 'status']).map((m, i) => (
                    <tr key={m._id}>
                      <td>{m.meetingId || i + 1}</td>
                      <td style={{ textAlign: 'center' }}>{m.wardNumber}</td>
                      <td><strong>{m.meetingTitle}</strong></td>
                      <td>{new Date(m.meetingDate).toLocaleDateString('en-IN')}</td>
                      <td style={{ fontSize: 12 }}>{m.meetingLocation}</td>
                      <td style={{ fontSize: 12, maxWidth: 220 }}>{m.agenda}</td>
                      <td style={{ textAlign: 'center' }}>{m.meetingDurationMinutes} min</td>
                      <td>
                        <span className={`status ${(m.status || '').toLowerCase()}`}>{m.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── HOUSEHOLDS ───────────────────────────────────────────────── */}
        {activeTab === 'households' && (
          <div className="admin-section">
            <h2>Households ({households.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Head of Family</th><th>Phone</th>
                    <th>Ward</th><th>House Type</th><th>Family Size</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(households, ['headUserId.name', 'houseType']).map((h, i) => (
                    <tr key={h._id}>
                      <td>{h.householdId || i + 1}</td>
                      <td>{h.headUserId?.name || `Citizen #${h.csvUserId}`}</td>
                      <td>{h.headUserId?.phone || '—'}</td>
                      <td style={{ textAlign: 'center' }}>{h.wardNumber}</td>
                      <td>
                        <span className={`status ${h.houseType === 'Pucca' ? 'approved' : h.houseType === 'Kutcha' ? 'rejected' : 'pending'}`}>
                          {h.houseType}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>{h.familySize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PROPERTIES ───────────────────────────────────────────────── */}
        {activeTab === 'properties' && (
          <div className="admin-section">
            <h2>Properties ({properties.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Owner</th><th>Ward</th><th>Land Type</th>
                    <th>Area (acres)</th><th>Rate/acre (₹)</th><th>Estimated Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(properties, ['ownerUserId.name', 'landType']).map((p, i) => (
                    <tr key={p._id}>
                      <td>{p.propertyId || i + 1}</td>
                      <td>{p.ownerUserId?.name || `Citizen #${p.csvOwnerId}`}</td>
                      <td style={{ textAlign: 'center' }}>{p.wardNumber}</td>
                      <td>{p.landType}</td>
                      <td style={{ textAlign: 'right' }}>{p.landAreaAcres}</td>
                      <td style={{ textAlign: 'right' }}>₹{fmt(p.pricePerAcre)}</td>
                      <td style={{ textAlign: 'right' }}>₹{fmt(p.estimatedValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
