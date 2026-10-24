const API_BASE = '/api';
const DIRECT_BACKEND_BASE = 'http://127.0.0.1:5000/api';

function getAuthHeader() {
  const token = localStorage.getItem('sg_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function safeFetch(endpoint, options = {}) {
  // 1. Try relative endpoint first (through Vite's /api proxy)
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    // If Vite proxy returns 502 Bad Gateway or 504 Gateway Timeout, immediately fallback direct to backend
    if ((res.status === 502 || res.status === 504) && API_BASE.startsWith('/')) {
      console.warn(`[SocialGuard API] Proxy returned ${res.status}. Falling back direct to backend ${DIRECT_BACKEND_BASE}...`);
      const directRes = await fetch(`${DIRECT_BACKEND_BASE}${endpoint}`, options);
      return handleResponse(directRes);
    }
    return handleResponse(res);
  } catch (err) {
    // If proxy network failed completely, retry direct to backend with CORS
    if (API_BASE.startsWith('/')) {
      try {
        console.warn(`[SocialGuard API] Proxy unreachable. Retrying direct to ${DIRECT_BACKEND_BASE}${endpoint}...`);
        const directRes = await fetch(`${DIRECT_BACKEND_BASE}${endpoint}`, options);
        return handleResponse(directRes);
      } catch (fallbackErr) {
        throw err;
      }
    }
    throw err;
  }
}

export const api = {
  // Auth
  async login(email, password) {
    return safeFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  },

  async register(name, email, password, confirm_password) {
    return safeFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirm_password })
    });
  },

  async getMe() {
    return safeFetch('/auth/me', {
      headers: { ...getAuthHeader() }
    });
  },

  // Analysis
  async analyzeMessage(text) {
    return safeFetch('/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ text })
    });
  },

  async analyzeEmail({ sender, subject, body }) {
    return safeFetch('/analyze/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ sender, subject, body })
    });
  },

  // History
  async getHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`/history${query ? `?${query}` : ''}`, {
      headers: { ...getAuthHeader() }
    });
  },

  async getHistoryDetail(id) {
    return safeFetch(`/history/${id}`, {
      headers: { ...getAuthHeader() }
    });
  },

  async deleteHistory(id) {
    return safeFetch(`/history/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  },

  async clearAllHistory() {
    return safeFetch('/history', {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  },

  // Dashboard & Admin
  async getDashboardStats() {
    return safeFetch('/dashboard/stats', {
      headers: { ...getAuthHeader() }
    });
  },

  async getAdminStats() {
    return safeFetch('/admin/stats', {
      headers: { ...getAuthHeader() }
    });
  },

  async getAdminUsers() {
    return safeFetch('/admin/users', {
      headers: { ...getAuthHeader() }
    });
  },

  // Safety & Profile
  async getSafetyTips() {
    return safeFetch('/safety-tips');
  },

  async getProfile() {
    return safeFetch('/profile', {
      headers: { ...getAuthHeader() }
    });
  },

  async updateProfile(name) {
    return safeFetch('/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ name })
    });
  },

  async changePassword(current_password, new_password, confirm_new_password) {
    return safeFetch('/profile/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ current_password, new_password, confirm_new_password })
    });
  }
};
