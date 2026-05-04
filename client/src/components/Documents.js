import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { documents as docAPI } from '../api';
import './Documents.css';

const DOC_TYPES = [
  { value: 'aadhaar',    label: 'Aadhaar Card' },
  { value: 'pan',        label: 'PAN Card' },
  { value: 'birth',      label: 'Birth Certificate' },
  { value: 'income',     label: 'Income Certificate' },
  { value: 'caste',      label: 'Caste Certificate' },
  { value: 'residence',  label: 'Residence Certificate' },
  { value: 'domicile',   label: 'Domicile Certificate' },
  { value: 'property',   label: 'Property Document' },
  { value: 'other',      label: 'Other' },
];

const typeLabel = (t) => DOC_TYPES.find(d => d.value === t)?.label || t?.replace(/_/g, ' ') || 'Document';

const fileExt = (name = '') => name.split('.').pop().toUpperCase() || 'FILE';

function Documents({ user }) {
  const [docs, setDocs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [uploadPct, setUploadPct]   = useState(0);
  const [docType, setDocType]       = useState('aadhaar');
  const [filterStatus, setFilter]   = useState('all');
  const [error, setError]           = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const { data } = await docAPI.getMy();
      setDocs(Array.isArray(data) ? data : data.documents || []);
    } catch {
      setDocs([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxMB = 10;
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File size must be under ${maxMB} MB.`);
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', docType);

    setUploading(true);
    setUploadPct(0);
    setError('');

    // Fake progress animation
    const tick = setInterval(() => {
      setUploadPct(p => (p < 85 ? p + Math.random() * 20 : p));
    }, 250);

    try {
      await docAPI.upload(formData);
      setUploadPct(100);
      setSuccessMsg('Document uploaded successfully. It will be verified shortly.');
      setTimeout(() => setSuccessMsg(''), 4000);
      await fetchDocs();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      clearInterval(tick);
      setUploading(false);
      setUploadPct(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (doc) => {
    try {
      const res = await docAPI.download(doc._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement('a');
      a.href    = url;
      a.download = doc.originalName || doc.fileName || `document.${doc.fileType || 'pdf'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Download failed. Please try again.');
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const filtered = docs.filter(d => filterStatus === 'all' || d.status === filterStatus);

  const verified = docs.filter(d => d.status === 'verified').length;
  const pending  = docs.filter(d => d.status === 'pending').length;

  return (
    <div className="gp-page">

      {/* Page header */}
      <div className="gp-page-header">
        <div className="gp-page-header-inner">
          <div>
            <p className="gp-page-breadcrumb">
              <Link to="/dashboard">Home</Link> / Document Locker
            </p>
            <h1 className="gp-page-title">Document Locker</h1>
            <p className="gp-page-subtitle">Securely store and manage your government documents</p>
          </div>
          <div className="gp-header-counts">
            <div className="gp-count-pill">
              <span className="gp-count-num">{docs.length}</span>
              <span className="gp-count-lbl">Total</span>
            </div>
            <div className="gp-count-pill approved">
              <span className="gp-count-num">{verified}</span>
              <span className="gp-count-lbl">Verified</span>
            </div>
            <div className="gp-count-pill pending">
              <span className="gp-count-num">{pending}</span>
              <span className="gp-count-lbl">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gp-page-body">

        {/* Upload section */}
        <div className="doc-upload-card">
          <h2 className="doc-section-title">Upload New Document</h2>
          {error      && <div className="doc-alert doc-alert-error">{error}</div>}
          {successMsg && <div className="doc-alert doc-alert-success">{successMsg}</div>}

          <div className="doc-upload-row">
            <div className="doc-type-group">
              <label>Document Type</label>
              <select value={docType} onChange={e => setDocType(e.target.value)} disabled={uploading}>
                {DOC_TYPES.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="doc-file-group">
              <label>Choose File (PDF, JPG, PNG — max 10 MB)</label>
              <div className="doc-file-input-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleUpload}
                  disabled={uploading}
                  id="doc-file-input"
                  className="doc-file-hidden"
                />
                <label htmlFor="doc-file-input" className={`doc-file-label ${uploading ? 'disabled' : ''}`}>
                  {uploading ? 'Uploading…' : 'Browse & Upload'}
                </label>
                <span className="doc-file-hint">Click to select a file from your device</span>
              </div>
            </div>
          </div>

          {uploading && (
            <div className="doc-progress-wrap">
              <div className="doc-progress-bar">
                <div className="doc-progress-fill" style={{ width: `${uploadPct}%` }} />
              </div>
              <span className="doc-progress-pct">{Math.round(uploadPct)}%</span>
            </div>
          )}
        </div>

        {/* Document list */}
        <div className="doc-list-card">
          <div className="doc-list-header">
            <h2 className="doc-section-title">My Documents</h2>
            <div className="doc-filter-tabs">
              {['all','verified','pending','rejected'].map(s => (
                <button
                  key={s}
                  className={`doc-tab ${filterStatus === s ? 'active' : ''}`}
                  onClick={() => setFilter(s)}
                >
                  {s === 'all' ? `All (${docs.length})` : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="doc-loading">Loading documents…</p>
          ) : filtered.length === 0 ? (
            <div className="doc-empty">
              <p>{docs.length === 0 ? 'No documents uploaded yet.' : 'No documents match the selected filter.'}</p>
            </div>
          ) : (
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Format</th>
                    <th>Uploaded On</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((doc, i) => (
                    <tr key={doc._id}>
                      <td className="doc-sno">{i + 1}</td>
                      <td className="doc-name">
                        <span className="doc-name-text">{doc.originalName || doc.fileName || 'Document'}</span>
                      </td>
                      <td>{typeLabel(doc.documentType)}</td>
                      <td><span className="doc-ext">{fileExt(doc.originalName || doc.fileName)}</span></td>
                      <td className="doc-date">{fmt(doc.uploadedAt || doc.createdAt)}</td>
                      <td>
                        <span className={`doc-status-pill ${doc.status === 'verified' ? 'pill-verified' : doc.status === 'rejected' ? 'pill-rejected' : 'pill-pending'}`}>
                          {doc.status === 'verified' ? 'Verified' : doc.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button className="doc-dl-btn" onClick={() => handleDownload(doc)} title="Download">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="doc-guidelines">
          <h2 className="doc-section-title">Document Guidelines</h2>
          <div className="doc-guide-grid">
            <div className="doc-guide-item">
              <h4>Accepted Formats</h4>
              <ul>
                <li>PDF — up to 10 MB</li>
                <li>JPG / PNG — up to 5 MB</li>
                <li>DOC / DOCX — up to 5 MB</li>
              </ul>
            </div>
            <div className="doc-guide-item">
              <h4>Quality Requirements</h4>
              <ul>
                <li>Clear and readable text</li>
                <li>Minimum 300 DPI for scans</li>
                <li>All pages must be included</li>
              </ul>
            </div>
            <div className="doc-guide-item">
              <h4>Verification Timeline</h4>
              <ul>
                <li>Standard documents: 1–2 working days</li>
                <li>You will be notified on approval</li>
                <li>Rejected documents can be re-uploaded</li>
              </ul>
            </div>
            <div className="doc-guide-item">
              <h4>Security & Privacy</h4>
              <ul>
                <li>Documents are encrypted at rest</li>
                <li>Accessible only to you and verified officers</li>
                <li>Compliant with IT Act 2000</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Documents;
