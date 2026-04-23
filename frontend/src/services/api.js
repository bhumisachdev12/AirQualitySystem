/**
 * api.js — Axios client for the Air Quality CO(GT) Prediction API.
 *
 * Endpoints used:
 *   GET  /health          → liveness check
 *   POST /forecast        → run ARIMA prediction for a location
 *   GET  /history         → retrieve all past predictions
 *   POST /auth/signup     → register new user
 *   POST /auth/login      → login user
 *   GET  /auth/me         → get current user info
 *   GET  /auth/total-searches → get user's total searches
 */
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// ─── Health ───────────────────────────────────────────────────────────────────
export const healthCheck = async () => {
  const response = await api.get('/health')
  return response.data
}

// ─── Authentication ───────────────────────────────────────────────────────────
export const signup = async (email, username, password) => {
  const response = await api.post('/auth/signup', { email, username, password })
  return response.data
}

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const getTotalSearches = async () => {
  const response = await api.get('/auth/total-searches')
  return response.data
}

// ─── POST /forecast ───────────────────────────────────────────────────────────
export const postForecast = async (location) => {
  const response = await api.post('/forecast', { location })
  return response.data
}

// ─── GET /history ─────────────────────────────────────────────────────────────
export const getHistory = async ({ limit = 100 } = {}) => {
  const response = await api.get('/history', { params: { limit } })
  return response.data
}

// ─── Alias for compatibility ──────────────────────────────────────────────────
export const getData = getHistory

export default api
