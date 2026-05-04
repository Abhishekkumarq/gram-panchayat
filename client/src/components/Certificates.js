import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificates } from '../api';
import { useLanguage } from '../LanguageContext';
import './Service.css';

function Certificates({ user }) {
  const [myCertificates, setMyCertificates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'birth', applicationData: {} });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: true });
  const { t } = useLanguage();
  const isAdmin = user && (user.role === 'admin' || user.role === 'officer');

  useEffect(() => { fetchCertificates(); }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = isAdmin ? await certificates.getAll() : await certificates.getMy();
      setMyCertificates(data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await certificates.apply(formData);
      setMsg({ text: 'Application submitted successfully. You will be notified once processed.', ok: true });
      setShowForm(false);
      fetchCertificates();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Submission failed. Please try again.', ok: false });
    }
    setSubmitting(false);
    setTimeout(() => setMsg({ text: '', ok: true }), 5000);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="service-page">
      <div className="svc-page-header">
        <div className="svc-page-header-inner">
          <div>
            <p className="svc-breadcrumb"><Link to="/dashboard">Home</Link> / {t('certificates')}</p>
            <h1 className="svc-page-title">{t('digitalCertificates')}</h1>
            <p className="svc-page-subtitle">Apply for birth, income, caste, residence and domicile certificates</p>
          </div>
          {!isAdmin && (
            <button className={`svc-header-action ${showForm ? 'cancel' : ''}`} onClick={() => setShowForm(!showForm)}>
              {showForm ? t('cancel') : `+ ${t('applyForCertificate')}`}
            </button>
          )}
        </div>
      </div>

      <div className="service-content">
        {msg.text && (
          <div style={{ background: msg.ok ? '#EBF7EB' : '#FDEAEA', color: msg.ok ? '#0A4D0A' : '#7A0000', padding: '0.75rem 1rem', borderLeft: `4px solid ${msg.ok ? '#138808' : '#CC0000'}`, borderRadius: 3, marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 500 }}>
            {msg.text}
          </div>
        )}

        {!isAdmin && showForm && (
          <div className="form-card">
            <h3>{t('applyForCertificate')}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.85rem', color: '#444' }}>Certificate Type *</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required>
                  <option value="birth">{t('birthCertificate')}</option>
                  <option value="income">{t('incomeCertificate')}</option>
                  <option value="caste">{t('casteCertificate')}</option>
                  <option value="residence">{t('residenceCertificate')}</option>
                  <option value="domicile">{t('domicileCertificate')}</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.85rem', color: '#444' }}>{t('description')} / Purpose</label>
                <textarea
                  placeholder="Briefly describe the purpose of this certificate application…"
                  onChange={e => setFormData({ ...formData, applicationData: { details: e.target.value } })}
                  rows="3"
                />
              </div>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : t('submitApplication')}
              </button>
            </form>
          </div>
        )}

        <div className="list-section">
          <h3>{isAdmin ? t('allCertApplications') : t('myApplications')}</h3>
          {myCertificates.length === 0 ? (
            <div className="no-results">{t('noApplicationsYet')}</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    {isAdmin && <th>Applicant</th>}
                    <th>Type</th>
                    <th>Certificate No.</th>
                    <th>Date Applied</th>
                    <th>{t('status')}</th>
                    {isAdmin && <th>Remarks</th>}
                  </tr>
                </thead>
                <tbody>
                  {myCertificates.map((cert, i) => (
                    <tr key={cert._id}>
                      <td>{i + 1}</td>
                      {isAdmin && <td><strong>{cert.userId?.name || '—'}</strong><br /><span style={{ fontSize: '0.75rem', color: '#888' }}>{cert.userId?.email}</span></td>}
                      <td style={{ fontWeight: 600 }}>{cert.type?.charAt(0).toUpperCase() + cert.type?.slice(1)} Certificate</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{cert.certificateNumber || '—'}</td>
                      <td>{fmt(cert.createdAt)}</td>
                      <td><span className={`status ${cert.status}`}>{cert.status}</span></td>
                      {isAdmin && <td style={{ color: '#666', fontSize: '0.82rem' }}>{cert.remarks || '—'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Certificates;
