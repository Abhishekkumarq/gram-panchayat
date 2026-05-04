import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { complaints } from '../api';
import { useLanguage } from '../LanguageContext';
import './Service.css';

function Complaints({ user }) {
  const [myComplaints, setMyComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'water', location: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useLanguage();
  const isAdmin = user && (user.role === 'admin' || user.role === 'officer');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setRefreshing(true);
    try {
      if (isAdmin) {
        const { data } = await complaints.getAll();
        setMyComplaints(data);
      } else {
        const { data } = await complaints.getMy();
        setMyComplaints(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter complaints based on search and filters
  const filteredComplaints = useMemo(() => {
    let result = myComplaints;

    // Search by title
    if (searchQuery.trim()) {
      result = result.filter(complaint =>
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter(complaint => complaint.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter) {
      result = result.filter(complaint => complaint.priority === priorityFilter);
    }

    return result;
  }, [myComplaints, searchQuery, statusFilter, priorityFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await complaints.create(formData);
      alert('Complaint registered and automatically routed to the appropriate department!');
      setShowForm(false);
      setFormData({ title: '', description: '', category: 'water', location: '' });
      fetchComplaints();
    } catch (err) {
      alert('Failed to register complaint');
    }
  };

  return (
    <div className="service-page">
      <div className="svc-page-header">
        <div className="svc-page-header-inner">
          <div>
            <p className="svc-breadcrumb"><Link to="/dashboard">Home</Link> / {t('grievances')}</p>
            <h1 className="svc-page-title">{t('grievances')}</h1>
            <p className="svc-page-subtitle">Register complaints and track their resolution status</p>
          </div>
          {!isAdmin && (
            <button className={`svc-header-action ${showForm ? 'cancel' : ''}`} onClick={() => setShowForm(!showForm)}>
              {showForm ? t('cancel') : `+ ${t('registerComplaint')}`}
            </button>
          )}
        </div>
      </div>

      <div className="service-content">
        {!isAdmin && (
          <>

            {showForm && (
              <div className="form-card">
                <h3>{t('registerComplaint')}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder={t('title')}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder={t('description')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    required
                  />
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="water">{t('waterSupply')}</option>
                    <option value="electricity">{t('electricity')}</option>
                    <option value="road">{t('roadInfrastructure')}</option>
                    <option value="sanitation">{t('sanitation')}</option>
                    <option value="health">{t('healthServices')}</option>
                    <option value="education">{t('education')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                  <input
                    type="text"
                    placeholder={t('location')}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <button type="submit">{t('submitComplaint')}</button>
                </form>
              </div>
            )}
          </>
        )}


        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder={t('searchComplaints')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="status-filter">{t('status')}</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">{t('allStatus')}</option>
                <option value="pending">{t('statusPending')}</option>
                <option value="under-review">{t('statusUnderReview')}</option>
                <option value="in-progress">{t('statusInProgress')}</option>
                <option value="resolved">{t('statusResolved')}</option>
                <option value="closed">{t('statusClosed')}</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="priority-filter">{t('priority')}</label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">{t('allPriority')}</option>
                <option value="low">{t('priorityLow')}</option>
                <option value="medium">{t('priorityMedium')}</option>
                <option value="high">{t('priorityHigh')}</option>
              </select>
            </div>

            <button
              className="reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setPriorityFilter('');
              }}
            >
              {t('resetFilters')}
            </button>
          </div>

          {/* Filter Summary */}
          {(searchQuery || statusFilter || priorityFilter) && (
            <div className="filter-summary">
              <p>
                Showing {filteredComplaints.length} of {myComplaints.length} complaints
                {searchQuery && <span> matching "{searchQuery}"</span>}
                {statusFilter && <span> with status "{statusFilter}"</span>}
                {priorityFilter && <span> with priority "{priorityFilter}"</span>}
              </p>
            </div>
          )}
        </div>

        <div className="list-section">
          <h3>{isAdmin ? t('allComplaints') : t('myComplaints')}</h3>
          {filteredComplaints.length === 0 ? (
            <p className="no-results">
              {myComplaints.length === 0 ? t('noComplaints') : t('noMatchingComplaints')}
            </p>
          ) : (
            <div className="cards-grid">
              {filteredComplaints.map((complaint) => (
                <div key={complaint._id} className="card">
                  {isAdmin && complaint.userId && (
                    <p><strong>{t('citizenLabel')}:</strong> {complaint.userId.name || 'Unknown'} ({complaint.userId.email})</p>
                  )}
                  <h4>{complaint.title}</h4>
                  <p>{complaint.description}</p>
                  <p><strong>{t('category')}:</strong> {complaint.category}</p>
                  <p><strong>{t('department')}:</strong> {complaint.department}</p>
                  <p><strong>{t('priority')}:</strong> <span className={`priority ${complaint.priority}`}>{complaint.priority}</span></p>
                  <p><strong>{t('status')}:</strong> <span className={`status ${complaint.status}`}>{complaint.status}</span></p>
                  <p><strong>{t('registered')}:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                  {complaint.resolution && <p><strong>{t('resolution')}:</strong> {complaint.resolution}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Complaints;
