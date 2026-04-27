import { API_BASE_URL, API_TIMEOUT } from '../config/api.config';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const { timeoutMs, ...fetchOptions } = options;
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs ?? this.timeout);

    const headers = { 'Content-Type': 'application/json', ...fetchOptions.headers };
    const token = localStorage.getItem('authToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(url, { ...fetchOptions, headers, signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('disclaimerAccepted_v1.0');
      }
      // 204 No Content — body yok, parse etme
      if (response.status === 204) return null;
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') throw new Error('İstek zaman aşımına uğradı.');
      throw error;
    }
  }

  get(endpoint, params = {}, opts = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `${endpoint}?${query}` : endpoint, { method: 'GET', ...opts });
  }

  post(endpoint, data = {}, opts = {}) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(data), ...opts });
  }

  put(endpoint, data = {}, opts = {}) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data), ...opts });
  }

  patch(endpoint, data = {}, opts = {}) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(data), ...opts });
  }

  delete(endpoint, opts = {}) {
    return this.request(endpoint, { method: 'DELETE', ...opts });
  }

  async getBlob(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const headers = {};
    const token = localStorage.getItem('authToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const response = await fetch(url, { method: 'GET', headers, signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.blob();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') throw new Error('İstek zaman aşımına uğradı.');
      throw error;
    }
  }
}

const api = new ApiService();
export default api;
