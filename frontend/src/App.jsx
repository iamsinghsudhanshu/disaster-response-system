import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import Navbar         from './components/Navbar'
import Footer         from './components/Footer'
import Home           from './pages/Home'
import Login          from './pages/Login'
import Signup         from './pages/Signup'
import Scenarios      from './pages/Scenarios'
import Quiz           from './pages/Quiz'
import Dashboard      from './pages/Dashboard'
import AdminDash      from './pages/AdminDash'
import VideoLearning  from './pages/VideoLearning'
import EmergencyGuide from './pages/EmergencyGuide'
import NotFound       from './pages/NotFound'

/* ── Route guards ──────────────────────────────────────── */

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin()) return <Navigate to="/" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  return !user ? children : <Navigate to="/" replace />
}

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0a0a1a',
    }}>
      <div className="spinner" />
    </div>
  )
}

/* ── App layout ────────────────────────────────────────── */

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public pages */}
        <Route path="/"          element={<Home />} />
        <Route path="/scenarios" element={<Scenarios />} />

        {/* Guest only */}
        <Route path="/login"  element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

        {/* Protected — login required */}
        <Route path="/learn"            element={<ProtectedRoute><VideoLearning /></ProtectedRoute>} />
        <Route path="/guide"            element={<ProtectedRoute><EmergencyGuide /></ProtectedRoute>} />
        <Route path="/quiz/:scenarioId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<AdminRoute><AdminDash /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(30,30,50,0.97)',
            color: '#f1f5f9',
            border: '1px solid rgba(99,102,241,0.3)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}
