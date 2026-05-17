import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="page-wrapper" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '80px 16px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="orb orb-purple animate-float" style={{ width: 400, height: 400, top: -100, left: -150, opacity: 0.12 }} />
      <div className="orb orb-cyan animate-float"   style={{ width: 300, height: 300, bottom: -80, right: -100, opacity: 0.1, animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{ fontSize: '6rem', marginBottom: 24, display: 'block' }}
        >
          🚨
        </motion.div>

        <h1 style={{
          fontSize: 'clamp(5rem, 15vw, 9rem)', fontWeight: 900,
          lineHeight: 1, marginBottom: 8,
          background: 'linear-gradient(135deg, #6366f1, #ef4444)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          404
        </h1>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
          Page Not Found
        </h2>

        <p style={{ color: 'var(--text-muted)', marginBottom: 36, maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.7 }}>
          The page you're looking for has evacuated the area. Let's get you back to safety.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/"          className="btn btn-primary">🏠 Go Home</Link>
          <Link to="/scenarios" className="btn btn-secondary">🎯 Browse Scenarios</Link>
        </div>
      </motion.div>
    </div>
  )
}
