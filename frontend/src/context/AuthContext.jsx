import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,             setUser]             = useState(null)
  const [token,            setToken]            = useState(null)
  const [loading,          setLoading]          = useState(true)
  // dashboardVersion bumps every time new activity happens → Dashboard re-fetches
  const [dashboardVersion, setDashboardVersion] = useState(0)

  // ── Restore session on first load ─────────────────
  useEffect(() => {
    const storedUser  = localStorage.getItem('dr_user')
    const storedToken = localStorage.getItem('dr_token')
    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser(parsed)
        setToken(storedToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      } catch { /* corrupt storage */ }
    }
    setLoading(false)
  }, [])

  // ── Login ──────────────────────────────────────────
  const login = useCallback((userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('dr_user',  JSON.stringify(userData))
    localStorage.setItem('dr_token', jwt)
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
  }, [])

  // ── Logout ─────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('dr_user')
    localStorage.removeItem('dr_token')
    delete api.defaults.headers.common['Authorization']
  }, [])

  // ── Called after quiz completes, video watched etc ─
  // Dashboard listens to dashboardVersion and re-fetches
  const refreshDashboard = useCallback(() => {
    setDashboardVersion(v => v + 1)
  }, [])

  const isAdmin = useCallback(() => user?.role === 'ADMIN', [user])

  return (
    <AuthContext.Provider value={{
      user, token, login, logout, isAdmin, loading,
      dashboardVersion, refreshDashboard,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
