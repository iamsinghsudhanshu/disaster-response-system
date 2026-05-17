import axios from 'axios'

/**
 * Axios instance that points to the backend via Vite proxy.
 * The Authorization header is set by AuthContext after login.
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Response interceptor: handle 401 globally ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale session and redirect to login
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth endpoints ─────────────────────────────
export const authAPI = {
  login:  (data) => api.post('/auth/login',  data),
  signup: (data) => api.post('/auth/signup', data),
}

// ── Scenario endpoints ─────────────────────────
export const scenarioAPI = {
  getAll:    ()       => api.get('/scenarios'),
  getById:   (id)     => api.get(`/scenarios/${id}`),
  create:    (data)   => api.post('/scenarios', data),
  update:    (id, d)  => api.put(`/scenarios/${id}`, d),
  delete:    (id)     => api.delete(`/scenarios/${id}`),
}

// ── Question endpoints ─────────────────────────
export const questionAPI = {
  getByScenario: (scenarioId) => api.get(`/scenarios/${scenarioId}/questions`),
  getAll:        ()           => api.get('/questions'),
  create:        (data)       => api.post('/questions', data),
  update:        (id, data)   => api.put(`/questions/${id}`, data),
  delete:        (id)         => api.delete(`/questions/${id}`),
}

// ── Quiz attempt endpoints ─────────────────────
export const attemptAPI = {
  save:        (data)   => api.post('/attempts', data),
  getByUser:   (userId) => api.get(`/attempts/user/${userId}`),
}

// ── Admin endpoints ────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
}

export default api
