import api from './api.service';

const contractService = {
  create: (data) => api.post('/api/contracts', data),
  getAll: (params) => api.get('/api/contracts', params),
  getById: (id) => api.get(`/api/contracts/${id}`),
  update: (id, data) => api.put(`/api/contracts/${id}`, data),
  delete: (id) => api.delete(`/api/contracts/${id}`),
  analyzeText: (text) => api.post('/api/analysis/analyze', { text }),
  getClauses: (type) => api.get(`/api/contracts/clauses/${type}`),
  getSuggestions: (data) => api.post('/api/contracts/suggestions', data),
  finalize: (id) => api.post(`/api/contracts/${id}/finalize`),
  getPendingApprovals: () => api.get('/api/contracts/pending-approval'),
  getStats: () => api.get('/api/contracts/stats'),
  approve: (id) => api.post(`/api/contracts/${id}/approve`),
  reject: (id) => api.post(`/api/contracts/${id}/reject`),
  downloadPdf: (id) => api.getBlob(`/api/contracts/${id}/pdf`),
  getPdfConfirm: (id) => api.get(`/api/contracts/${id}/pdf-confirm`),
};

export default contractService;
