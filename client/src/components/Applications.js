import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificates, schemeApplications } from '../api';
import './Applications.css';

const STATUS_STEPS = ['Submitted', 'Under Review', 'Processing', 'Decision'];

const statusStep = (status) => {
  switch (status) {
    case 'pending':      return 1;
    case 'under-review': return 2;
    case 'processing':   return 2;
    case 'approved':     return 4;
    case 'rejected':     return 4;
    default:             return 1;
  }
};

const statusMeta = (status) => {
  switch (status) {
    case 'approved':     return { label: 'Approved',     cls: 'st-approved' };
    case 'rejected':     return { label: 'Rejected',     cls: 'st-rejected' };
    case 'processing':   return { label: 'Processing',   cls: 'st-processing' };
    case 'under-review': return { label: 'Under Review', cls: 'st-review' };
    default:             return { label: 'Pending',      cls: 'st-pending' };
  }
};

function Applications({ user }) {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filterType, setFilterType]     = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [certRes, schemeRes] = await Promise.allSettled([
          certificates.getMy(),
          schemeApplications.getMy()
        ]);

        const certs = certRes.status === 'fulfilled'
          ? (certRes.value.data || []).map(c => ({
              _id: c._id,
              refNo: c.certificateNumber || `CERT-${c._id?.slice(-6).toUpperCase()}`,
              title: `${(c.type || 'Certificate').replace(/^\w/, s => s.toUpperCase())} Certificate`,
              type: 'Certificate',
              status: c.status || 'pending',
              submittedAt: c.createdAt,
              updatedAt: c.updatedAt || c.createdAt,
              remarks: c.remarks || '',
            }))
          : [];

        const schemes = schemeRes.status === 'fulfilled'
          ? (schemeRes.value.data || []).map(s => ({
              _id: s._id,
              refNo: `SCHEME-${s._id?.slice(-6).toUpperCase()}`,
              title: s.schemeName || s.schemeId?.name || 'Scheme Application',
              type: 'Scheme',
              status: s.status || 'pending',
              submittedAt: s.createdAt,
              updatedAt: s.updatedAt || s.createdAt,
              remarks: s.remarks || '',
            }))
          : [];

        setItems([...certs, ...schemes].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const filtered = items.filter(app => {
    const matchType   = filterType === 'all' || app.type === filterType;
    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchSearch = !search || app.title.toLowerCase().includes(search.toLowerCase()) || app.refNo.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  return (
    <div className="gp-page">

      {/* Page header */}
      <div className="gp-page-header">
        <div className="gp-page-header-inner">
          <div>
            <p className="gp-page-breadcrumb">
              <Link to="/dashboard">Home</Link> / My Applications
            </p>
            <h1 className="gp-page-title">My Applications</h1>
            <p className="gp-page-subtitle">Track status of all your submitted applications</p>
          </div>
          <div className="gp-header-counts">
            <div className="gp-count-pill">
              <span className="gp-count-num">{items.length}</span>
              <span className="gp-count-lbl">Total</span>
            </div>
            <div className="gp-count-pill approved">
              <span className="gp-count-num">{items.filter(i => i.status === 'approved').length}</span>
              <span className="gp-count-lbl">Approved</span>
            </div>
            <div className="gp-count-pill pending">
              <span className="gp-count-num">{items.filter(i => i.status === 'pending' || i.status === 'processing' || i.status === 'under-review').length}</span>
              <span className="gp-count-lbl">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gp-page-body">

        {/* Filters */}
        <div className="gp-filters">
          <input
            className="gp-search"
            type="text"
            placeholder="Search by name or reference number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="gp-filter-row">
            <div className="gp-filter-group">
              <label>Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="Certificate">Certificate</option>
                <option value="Scheme">Scheme</option>
              </select>
            </div>
            <div className="gp-filter-group">
              <label>Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under-review">Under Review</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="gp-result-count">
          Showing <strong>{filtered.length}</strong> of <strong>{items.length}</strong> applications
        </p>

        {/* List */}
        {loading ? (
          <div className="gp-loading">Loading applications…</div>
        ) : filtered.length === 0 ? (
          <div className="gp-empty">
            <div className="gp-empty-icon">&#9780;</div>
            <h3>No applications found</h3>
            <p>You have not submitted any applications yet, or none match your filters.</p>
            <Link to="/certificates" className="gp-empty-link">Apply for a Certificate</Link>
          </div>
        ) : (
          <div className="gp-app-list">
            {filtered.map(app => {
              const meta  = statusMeta(app.status);
              const step  = statusStep(app.status);
              return (
                <div key={app._id} className={`gp-app-card ${app.status === 'rejected' ? 'gp-card-rejected' : ''}`}>

                  {/* Card top row */}
                  <div className="gp-card-top">
                    <div className="gp-card-left">
                      <span className={`gp-type-badge ${app.type === 'Certificate' ? 'type-cert' : 'type-scheme'}`}>
                        {app.type}
                      </span>
                      <h3 className="gp-card-title">{app.title}</h3>
                      <p className="gp-card-ref">Reference No.: <strong>{app.refNo}</strong></p>
                    </div>
                    <span className={`gp-status-badge ${meta.cls}`}>{meta.label}</span>
                  </div>

                  {/* Progress tracker */}
                  <div className="gp-tracker">
                    {STATUS_STEPS.map((s, i) => {
                      const done    = step > i + 1;
                      const current = step === i + 1;
                      const isFinal = i === 3;
                      const rejected = app.status === 'rejected' && isFinal;
                      return (
                        <React.Fragment key={s}>
                          <div className={`gp-tracker-step ${done || current ? 'gp-step-done' : ''} ${rejected ? 'gp-step-rejected' : ''}`}>
                            <div className="gp-step-dot">{done ? '✓' : i + 1}</div>
                            <span className="gp-step-label">{isFinal ? (app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Decision') : s}</span>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`gp-tracker-line ${done ? 'gp-line-done' : ''}`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Dates & remarks */}
                  <div className="gp-card-meta">
                    <div className="gp-meta-item">
                      <span className="gp-meta-label">Date Submitted</span>
                      <span className="gp-meta-value">{fmt(app.submittedAt)}</span>
                    </div>
                    <div className="gp-meta-item">
                      <span className="gp-meta-label">Last Updated</span>
                      <span className="gp-meta-value">{fmt(app.updatedAt)}</span>
                    </div>
                    {app.remarks && (
                      <div className="gp-meta-item gp-meta-remarks">
                        <span className="gp-meta-label">Remarks</span>
                        <span className="gp-meta-value">{app.remarks}</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
