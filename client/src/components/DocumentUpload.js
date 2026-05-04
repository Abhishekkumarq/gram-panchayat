import React, { useState, useEffect } from 'react';
import { FiUpload, FiX, FiCheck, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import api from '../api';
import '../components/Documents.css';

const DocumentUpload = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    documentType: 'aadhaar',
    documentNumber: '',
    document: null
  });
  
  const [preview, setPreview] = useState(null);
  const [reuploadingDocId, setReuploadingDocId] = useState(null);

  // Document types with labels
  const documentTypes = {
    aadhaar: 'Aadhaar Card',
    pan: 'PAN Card',
    voter_id: 'Voter ID',
    driving_license: 'Driving License',
    passport: 'Passport',
    birth_certificate: 'Birth Certificate',
    income_certificate: 'Income Certificate',
    caste_certificate: 'Caste Certificate',
    residence_certificate: 'Residence Certificate',
    other: 'Other Document'
  };

  // Fetch user's documents and stats
  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/api/documents/my');
      setDocuments(response.data.documents);
    } catch (err) {
      setError('Failed to fetch documents');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/documents/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only PDF, JPG, PNG, GIF, DOC, DOCX are allowed');
      return;
    }

    setFormData(prev => ({
      ...prev,
      document: file
    }));
    setError(null);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReupload = (doc) => {
    setReuploadingDocId(doc._id);
    setFormData({
      documentType: doc.documentType,
      documentNumber: doc.documentNumber,
      document: null
    });
    setPreview(null);
    setError(null);
  };

  const handleCancelReupload = () => {
    setReuploadingDocId(null);
    setFormData({
      documentType: 'aadhaar',
      documentNumber: '',
      document: null
    });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.document) {
      setError('Please select a file');
      return;
    }

    if (!formData.documentNumber.trim()) {
      setError('Please enter document number');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const uploadFormData = new FormData();
      uploadFormData.append('document', formData.document);
      uploadFormData.append('documentType', formData.documentType);
      uploadFormData.append('documentNumber', formData.documentNumber);

      let response;
      if (reuploadingDocId) {
        // If reuploading, delete old and upload new
        await api.delete(`/api/documents/${reuploadingDocId}`);
        response = await api.post('/api/documents/upload', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Document reuploaded successfully!');
      } else {
        response = await api.post('/api/documents/upload', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Document uploaded successfully!');
      }

      if (response.data.success) {
        // Reset form
        setFormData({
          documentType: 'aadhaar',
          documentNumber: '',
          document: null
        });
        setPreview(null);
        setReuploadingDocId(null);
        
        // Refresh documents list
        setTimeout(() => {
          fetchDocuments();
          fetchStats();
          setSuccess(null);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'verified': return 'badge-verified';
      case 'rejected': return 'badge-rejected';
      case 'pending_verification': return 'badge-pending';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending_verification': 'Pending Verification',
      'verified': 'Verified',
      'rejected': 'Rejected'
    };
    return labels[status] || status;
  };

  return (
    <div className="document-upload-container">
      <div className="document-header">
        <h2>Document Management</h2>
        <p>Upload and manage your important documents</p>
      </div>

      {/* Statistics */}
      <div className="document-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Documents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value pending">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value verified">{stats.verified}</div>
          <div className="stat-label">Verified</div>
        </div>
        <div className="stat-card">
          <div className="stat-value rejected">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="upload-form-section">
        <h3>
          {reuploadingDocId ? (
            <>
              <FiRefreshCw style={{ display: 'inline', marginRight: '8px' }} />
              Reupload Document
            </>
          ) : (
            'Upload New Document'
          )}
        </h3>
        
        {error && (
          <div className="alert alert-error">
            <FiAlertCircle /> {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <FiCheck /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="document-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="documentType">Document Type *</label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                required
                disabled={reuploadingDocId ? true : false}
              >
                {Object.entries(documentTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="documentNumber">Document Number *</label>
              <input
                type="text"
                id="documentNumber"
                name="documentNumber"
                placeholder="e.g., Aadhaar Number"
                value={formData.documentNumber}
                onChange={handleInputChange}
                required
                disabled={reuploadingDocId ? true : false}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="document">Select File *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="document"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                onChange={handleDocumentChange}
                required
              />
              <div className="file-input-label">
                <FiUpload />
                <span>
                  {formData.document ? formData.document.name : 'Click to select or drag & drop'}
                </span>
              </div>
            </div>
            <small>Accepted formats: PDF, JPG, PNG, GIF, DOC, DOCX (Max 5MB)</small>
          </div>

          {preview && (
            <div className="preview-section">
              <label>Preview</label>
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-upload"
              disabled={uploading}
            >
              {uploading ? (reuploadingDocId ? 'Reuploading...' : 'Uploading...') : (reuploadingDocId ? 'Reupload Document' : 'Upload Document')}
            </button>
            
            {reuploadingDocId && (
              <button 
                type="button" 
                className="btn-cancel"
                onClick={handleCancelReupload}
                disabled={uploading}
              >
                Cancel Reupload
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Documents List */}
      <div className="documents-list-section">
        <h3>Your Documents ({documents.length})</h3>
        
        {documents.length === 0 ? (
          <div className="no-documents">
            <p>No documents uploaded yet. Upload your first document above.</p>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc._id} className="document-card">
                <div className="document-header-card">
                  <h4>{documentTypes[doc.documentType] || doc.documentType}</h4>
                  <span className={`status-badge ${getStatusBadgeClass(doc.status)}`}>
                    {getStatusLabel(doc.status)}
                  </span>
                </div>
                
                <div className="document-details">
                  <p><strong>Document #:</strong> {doc.documentNumber}</p>
                  <p><strong>File:</strong> {doc.fileName}</p>
                  <p><strong>Size:</strong> {(doc.fileSize / 1024).toFixed(2)} KB</p>
                  <p><strong>Uploaded:</strong> {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>

                <div className="document-actions">
                  <button 
                    className="btn-download"
                    onClick={() => api.get(`/api/documents/${doc._id}/download`, { responseType: 'blob' })
                      .then(response => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', doc.fileName);
                        document.body.appendChild(link);
                        link.click();
                        link.parentChild.removeChild(link);
                      })}
                  >
                    Download
                  </button>
                  
                  {doc.status === 'rejected' && (
                    <button 
                      className="btn-reupload"
                      onClick={() => handleReupload(doc)}
                      title="Reupload this document"
                    >
                      <FiRefreshCw /> Reupload
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
