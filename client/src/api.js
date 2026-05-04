import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const auth = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile')
};

export const certificates = {
  apply: (data) => API.post('/certificates', data),
  getMy: () => API.get('/certificates/my'),
  getAll: () => API.get('/certificates/all'),
  updateStatus: (id, data) => API.put(`/certificates/${id}`, data)
};

export const taxes = {
  create: (data) => API.post('/taxes', data),
  calculate: (data) => API.post('/taxes/calculate', data),
  pay: (id) => API.put(`/taxes/${id}/pay`),
  getMy: () => API.get('/taxes/my'),
  getAll: () => API.get('/taxes/all')
};

export const complaints = {
  create: (data) => API.post('/complaints', data),
  getMy: () => API.get('/complaints/my'),
  getAll: () => API.get('/complaints/all'),
  update: (id, data) => API.put(`/complaints/${id}`, data)
};

export const schemes = {
  getRecommended: () => API.get('/schemes/recommended'),
  getAll: () => API.get('/schemes'),
  create: (data) => API.post('/schemes', data),
  update: (id, data) => API.put(`/schemes/${id}`, data),
  delete: (id) => API.delete(`/schemes/${id}`)
};

export const schemeApplications = {
  apply: (data) => API.post('/scheme-applications', data),
  getMy: () => API.get('/scheme-applications/my'),
  getAll: (page = 1, limit = 50) => API.get('/scheme-applications/all', { params: { page, limit } }),
  getForScheme: (schemeId, page = 1, limit = 50) => API.get(`/scheme-applications/scheme/${schemeId}`, { params: { page, limit } }),
  updateStatus: (applicationId, data) => API.put(`/scheme-applications/${applicationId}/status`, data)
};

export const funds = {
  create: (data) => API.post('/funds', data),
  getAll: (params) => API.get('/funds', { params }),
  getAnalytics: (params) => API.get('/funds/analytics', { params }),
  update: (id, data) => API.put(`/funds/${id}`, data)
};

export const notifications = {
  getMy: (page = 1, limit = 20, unreadOnly = false) => 
    API.get('/notifications/my', { params: { page, limit, unreadOnly } }),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  getByType: (type, page = 1, limit = 20) => 
    API.get('/notifications/by-type', { params: { type, page, limit } }),
  getById: (notificationId) => API.get(`/notifications/${notificationId}`),
  markAsRead: (notificationId) => API.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => API.put('/notifications/read-all'),
  delete: (notificationId) => API.delete(`/notifications/${notificationId}`),
  deleteAll: () => API.delete('/notifications'),
  create: (data) => API.post('/notifications', data),
  adminCreate: (data) => API.post('/notifications/admin/create', data),
  adminBroadcast: (data) => API.post('/notifications/admin/broadcast', data),
  adminGetAll: (params) => API.get('/notifications/admin/all', { params })
};

export const documents = {
  upload: (formData) => API.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMy: (page = 1, limit = 20) => API.get('/documents/my', { params: { page, limit } }),
  getStats: () => API.get('/documents/stats'),
  getById: (documentId) => API.get(`/documents/${documentId}`),
  getByType: (documentType) => API.get(`/documents/type/${documentType}`),
  download: (documentId) => API.get(`/documents/${documentId}/download`, { responseType: 'blob' }),
  delete: (documentId) => API.delete(`/documents/${documentId}`),
  adminGetAll: (params) => API.get('/documents/admin/all', { params }),
  adminGetPending: (params) => API.get('/documents/admin/pending', { params }),
  adminVerify: (documentId, data) => API.put(`/documents/${documentId}/verify`, data)
};

export const adminData = {
  getStats: () => API.get('/admin/stats'),
  getCitizens: () => API.get('/admin/citizens'),
  getDeathCertificates: () => API.get('/admin/death-certificates'),
  getGramSabha: () => API.get('/admin/gram-sabha'),
  getHouseholds: () => API.get('/admin/households'),
  getProperties: () => API.get('/admin/properties'),
  updateGramSabha: (id, data) => API.put(`/admin/gram-sabha/${id}`, data),
  updateDeathCert: (id, data) => API.put(`/admin/death-certificates/${id}`, data)
};

export const analytics = {
  getSummary: () => API.get('/analytics/summary')
};

export default API;
