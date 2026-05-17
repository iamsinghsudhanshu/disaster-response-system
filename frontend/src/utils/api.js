import axios from 'axios'

/**
 * Production-safe API configuration
 * Uses Vercel env variable in production
 * Falls back to Vite proxy locally
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// ── Attach JWT token automatically ─────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dr_token')

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

// ── Handle unauthorized globally ──────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dr_user')
      localStorage.removeItem('dr_token')

      delete api.defaults.headers.common['Authorization']

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
}

// ── Scenarios ─────────────────────────────────────────
export const scenarioAPI = {
  getAll: () => api.get('/scenarios'),
  getById: (id) => api.get(`/scenarios/${id}`),
  create: (data) => api.post('/scenarios', data),
  update: (id, data) => api.put(`/scenarios/${id}`, data),
  delete: (id) => api.delete(`/scenarios/${id}`),
}

// ── Questions ─────────────────────────────────────────
export const questionAPI = {
  getByScenario: (scenarioId) =>
    api.get(`/scenarios/${scenarioId}/questions`),

  getAll: () => api.get('/questions'),

  create: (data) => api.post('/questions', data),

  update: (id, data) =>
    api.put(`/questions/${id}`, data),

  delete: (id) =>
    api.delete(`/questions/${id}`),
}

// ── Attempts ──────────────────────────────────────────
export const attemptAPI = {
  save: (data) => api.post('/attempts', data),

  getByUser: (userId) =>
    api.get(`/attempts/user/${userId}`),
}

// ── Admin ─────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),

  getUsers: () => api.get('/admin/users'),
}

export default api
