import api from './api.service';

const verificationService = {
  getStatus: () => api.get('/api/verification/status'),
  verify: (data) => api.post('/api/verification/identity', data),
};

export default verificationService;
