import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schemes, schemeApplications } from '../api';
import socketService from '../socketService';
import { useLanguage } from '../LanguageContext';
import './Service.css';

function Schemes({ user }) {
  const [allSchemes, setAllSchemes]           = useState([]);
  const [recommended, setRecommended]         = useState([]);
  const [activeTab, setActiveTab]             = useState('recommended');
  const [appliedIds, setAppliedIds]           = useState(new Set());

  // Admin: applications modal
  const [selectedScheme, setSelectedScheme]   = useState(null);
  const [applications, setApplications]       = useState([]);
  const [showAdminModal, setShowAdminModal]   = useState(false);
  const [loadingApps, setLoadingApps]         = useState(false);
  const [hasMore, setHasMore]                 = useState(false);
  const [totalApps, setTotalApps]             = useState(0);
  const [adminPage, setAdminPage]             = useState(1);
  const [isLoadingMore, setIsLoadingMore]     = useState(false);

  // Citizen: apply modal
  const [applyScheme, setApplyScheme]         = useState(null);
  const [applying, setApplying]               = useState(false);
  const [applyMsg, setApplyMsg]               = useState({ text: '', ok: true });

  const { t } = useLanguage();
  const isAdmin = user && (user.role === 'admin' || user.role === 'officer');

  useEffect(() => {
    fetchSchemes();
    if (isAdmin) setActiveTab('all');
  }, []);

  // Real-time updates
  useEffect(() => {
    const handleNewApp = (newApp) => {
      if (showAdminModal && selectedScheme && newApp.schemeId === selectedScheme._id)
        setApplications(prev => [newApp, ...prev]);
    };
    const handleUpdatedApp = (updatedApp) => {
      if (showAdminModal && selectedScheme && updatedApp.schemeId === selectedScheme._id)
        setApplications(prev => prev.map(a => a._id === updatedApp._id ? updatedApp : a));
    };
    socketService.on('application:new', handleNewApp);
    socketService.on('application:updated', handleUpdatedApp);
    return () => {
      socketService.off('application:new', handleNewApp);
      socketService.off('application:updated', handleUpdatedApp);
    };
  }, [showAdminModal, selectedScheme]);

  const fetchSchemes = async () => {
    try {
      if (isAdmin) {
        const { data } = await schemes.getAll();
        setAllSchemes(data);
      } else {
        const [recRes, allRes, myAppsRes] = await Promise.allSettled([
          schemes.getRecommended(),
          schemes.getAll(),
          schemeApplications.getMy()
        ]);
        if (recRes.status === 'fulfilled') setRecommended(recRes.value.data);
        if (allRes.status === 'fulfilled') setAllSchemes(allRes.value.data);
        if (myAppsRes.status === 'fulfilled') {
          const ids = new Set((myAppsRes.value.data || []).map(a => a.schemeId?._id || a.schemeId));
          setAppliedIds(ids);
        }
      }
    } catch (err) { console.error(err); }
  };

  // Admin: open applications modal
  const openAdminModal = async (scheme) => {
    if (!isAdmin) return;
    setSelectedScheme(scheme);
    setAdminPage(1);
    setApplications([]);
    setLoadingApps(true);
    setShowAdminModal(true);
    try {
      const { data } = await schemeApplications.getForScheme(scheme._id, 1, 50);
      setApplications(data.applications || data);
      setTotalApps(data.pagination?.total || (data.applications || data).length);
      setHasMore(data.pagination?.hasMore || false);
    } catch { setApplications([]); }
    setLoadingApps(false);
  };

  const loadMore = async () => {
    if (!selectedScheme || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const next = adminPage + 1;
      const { data } = await schemeApplications.getForScheme(selectedScheme._id, next, 50);
      setApplications(prev => [...prev, ...(data.applications || data)]);
      setAdminPage(next);
      setHasMore(data.pagination?.hasMore || false);
    } catch {}
    setIsLoadingMore(false);
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      await schemeApplications.updateStatus(appId, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch { alert('Update failed'); }
  };

  // Citizen: apply
  const handleApply = async () => {
    if (!applyScheme) return;
    setApplying(true);
    try {
      await schemeApplications.apply({ schemeId: applyScheme._id, applicationData: {} });
      setAppliedIds(prev => new Set([...prev, applyScheme._id]));
      setApplyMsg({ text: `Application for "${applyScheme.name}" submitted successfully. You will be notified once reviewed.`, ok: true });
      setTimeout(() => { setApplyScheme(null); setApplyMsg({ text: '', ok: true }); }, 3000);
    } catch (err) {
      setApplyMsg({ text: err.response?.data?.message || 'Application failed. Please try again.', ok: false });
    }
    setApplying(false);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const renderScheme = (scheme) => {
    const isApplied = appliedIds.has(scheme._id);
    return (
      <div key={scheme._id} className={`card scheme-card ${isAdmin ? 'scheme-admin' : ''}`}
        onClick={() => isAdmin && openAdminModal(scheme)}
        style={{ cursor: isAdmin ? 'pointer' : 'default' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span className="scheme-type">{scheme.type?.toUpperCase()}</span>
          {isApplied && <span style={{ background: '#EBF7EB', color: '#138808', border: '1px solid #138808', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem' }}>Applied</span>}
        </div>
        <h4>{scheme.name}</h4>
        <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.875rem', lineHeight: 1.5 }}>{scheme.description}</p>
        <div className="scheme-details">
          <p><strong>{t('benefits')}:</strong> {scheme.benefits}</p>
          <p><strong>{t('applicationProcess')}:</strong> {scheme.applicationProcess}</p>
          {scheme.documents?.length > 0 && (
            <p><strong>{t('requiredDocuments')}:</strong> {scheme.documents.join(', ')}</p>
          )}
        </div>
        {!isAdmin && (
          <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid #E0E0E0' }}>
            {isApplied ? (
              <button disabled style={{ background: '#F0F0F0', color: '#888', border: '1px solid #CCC', borderRadius: 3, padding: '0.5rem 1.25rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'not-allowed', width: '100%' }}>
                Already Applied
              </button>
            ) : (
              <button
                className="primary-btn"
                style={{ marginBottom: 0, width: '100%', textAlign: 'center' }}
                onClick={e => { e.stopPropagation(); setApplyScheme(scheme); setApplyMsg({ text: '', ok: true }); }}
              >
                Apply Now
              </button>
            )}
          </div>
        )}
        {isAdmin && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #E0E0E0', textAlign: 'center' }}>
            <span style={{ color: '#003087', fontSize: '0.8rem', fontWeight: 600 }}>{t('viewApplicationsHint')}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="service-page">
      <div className="svc-page-header">
        <div className="svc-page-header-inner">
          <div>
            <p className="svc-breadcrumb"><Link to="/dashboard">Home</Link> / {t('schemes')}</p>
            <h1 className="svc-page-title">{t('schemesTitle')}</h1>
            <p className="svc-page-subtitle">Government welfare schemes — view eligibility and apply online</p>
          </div>
        </div>
      </div>

      <div className="service-content">
        <div className="tabs">
          {!isAdmin && (
            <button className={activeTab === 'recommended' ? 'active' : ''} onClick={() => setActiveTab('recommended')}>
              {t('recommendedForYou')} ({recommended.length})
            </button>
          )}
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
            {isAdmin ? t('allGovtSchemes') : t('allSchemes')} ({allSchemes.length})
          </button>
        </div>

        {!isAdmin && activeTab === 'recommended' && (
          <div className="list-section">
            <h3>{t('personalizedRecommendations')}</h3>
            <p className="info-text">{t('schemesEligText')}</p>
            {recommended.length === 0 ? (
              <div className="no-results">{t('noPersonalRec')}</div>
            ) : (
              <div className="cards-grid">{recommended.map(renderScheme)}</div>
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div className="list-section">
            <h3>{isAdmin ? t('allGovtSchemes') : t('allSchemes')}</h3>
            {allSchemes.length === 0 ? (
              <div className="no-results">{t('noSchemes')}</div>
            ) : (
              <div className="cards-grid">{allSchemes.map(renderScheme)}</div>
            )}
          </div>
        )}
      </div>

      {/* ── Citizen Apply Modal ── */}
      {applyScheme && (
        <div className="modal-overlay" onClick={() => { if (!applying) { setApplyScheme(null); setApplyMsg({ text: '', ok: true }); } }}>
          <div className="modal-content" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for Scheme</h2>
              <button className="close-btn" onClick={() => { if (!applying) { setApplyScheme(null); setApplyMsg({ text: '', ok: true }); } }}>✕</button>
            </div>
            <div className="modal-body">
              <h3 style={{ color: '#003087', marginTop: 0 }}>{applyScheme.name}</h3>
              <span className="scheme-type" style={{ marginBottom: '1rem', display: 'inline-block' }}>{applyScheme.type?.toUpperCase()}</span>
              <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '1rem' }}>{applyScheme.description}</p>
              <div style={{ background: '#F7F9FC', border: '1px solid #E4EAF2', borderRadius: 3, padding: '1rem', marginBottom: '1.25rem' }}>
                <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem' }}><strong style={{ color: '#003087' }}>Benefits:</strong> {applyScheme.benefits}</p>
                <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem' }}><strong style={{ color: '#003087' }}>Process:</strong> {applyScheme.applicationProcess}</p>
                {applyScheme.documents?.length > 0 && (
                  <p style={{ margin: 0, fontSize: '0.85rem' }}><strong style={{ color: '#003087' }}>Documents needed:</strong> {applyScheme.documents.join(', ')}</p>
                )}
              </div>
              {applyMsg.text && (
                <div style={{ background: applyMsg.ok ? '#EBF7EB' : '#FDEAEA', color: applyMsg.ok ? '#0A4D0A' : '#7A0000', padding: '0.65rem 1rem', borderLeft: `4px solid ${applyMsg.ok ? '#138808' : '#CC0000'}`, borderRadius: 3, marginBottom: '1rem', fontSize: '0.85rem' }}>
                  {applyMsg.text}
                </div>
              )}
              {!applyMsg.ok || !appliedIds.has(applyScheme._id) ? (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="primary-btn" style={{ marginBottom: 0, flex: 1 }} disabled={applying} onClick={handleApply}>
                    {applying ? 'Submitting…' : 'Confirm Application'}
                  </button>
                  <button onClick={() => { if (!applying) { setApplyScheme(null); setApplyMsg({ text: '', ok: true }); } }}
                    style={{ padding: '0.7rem 1.25rem', background: 'white', border: '2px solid #CCCCCC', borderRadius: 3, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Applications Modal ── */}
      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Applications — {selectedScheme?.name}</h2>
              <button className="close-btn" onClick={() => setShowAdminModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {loadingApps ? (
                <p>Loading applications…</p>
              ) : applications.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>No applications for this scheme yet.</p>
              ) : (
                <>
                  <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.85rem' }}>Showing {applications.length} of {totalApps} applications</p>
                  <div className="applications-list">
                    {applications.map(app => (
                      <div key={app._id} className="application-card">
                        <div className="app-header">
                          <div>
                            <h4>{app.userId?.name}</h4>
                            <p className="email">{app.userId?.email} &bull; {app.userId?.phone}</p>
                          </div>
                          <span className={`status-badge ${app.status}`}>{app.status.toUpperCase()}</span>
                        </div>
                        <div className="app-details">
                          <p><strong>Ward</strong> {app.userId?.ward || '—'}</p>
                          <p><strong>Category</strong> {app.userId?.category || '—'}</p>
                          <p><strong>Income</strong> ₹{app.userId?.income?.toLocaleString('en-IN') || '—'}</p>
                          <p><strong>Applied on</strong> {fmt(app.createdAt)}</p>
                        </div>
                        <div className="app-actions">
                          <select value={app.status} onChange={e => handleUpdateStatus(app._id, e.target.value)} className="status-select">
                            <option value="submitted">Submitted</option>
                            <option value="under-review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                  {hasMore && (
                    <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                      <button className="primary-btn" style={{ marginBottom: 0 }} disabled={isLoadingMore} onClick={loadMore}>
                        {isLoadingMore ? 'Loading…' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schemes;
