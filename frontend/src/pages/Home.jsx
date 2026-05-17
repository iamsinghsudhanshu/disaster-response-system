import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { scenarioAPI } from '../utils/api'

const STATS = [
  { value: '6+',    label: 'Disaster Types', icon: '🌐' },
  { value: '50+',   label: 'Quiz Questions', icon: '❓' },
  { value: '100%',  label: 'Free Platform',  icon: '✅' },
  { value: '24/7',  label: 'Always Ready',   icon: '⏰' },
]

const FEATURES = [
  { icon: '🎯', title: 'Scenario-Based Learning', desc: 'Train with real-world disaster scenarios including floods, earthquakes, fires, and more.' },
  { icon: '📊', title: 'Progress Analytics',      desc: 'Track your preparedness level with detailed charts, scores, and performance insights.' },
  { icon: '🏆', title: 'Achievements & Badges',   desc: 'Earn badges as you complete quizzes and improve your disaster response skills.' },
  { icon: '🤖', title: 'AI-Powered Insights',     desc: 'Get personalized recommendations based on your quiz performance and weak areas.' },
  { icon: '📱', title: 'Mobile Responsive',        desc: 'Access training anytime, anywhere on any device — phone, tablet, or desktop.' },
  { icon: '🔐', title: 'Secure & Private',         desc: 'Your data is protected with JWT authentication and encrypted passwords.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = { show: { transition: { staggerChildren: 0.12 } } }

export default function Home() {
  const { user } = useAuth()
  const [scenarios, setScenarios] = useState([])

  useEffect(() => {
    scenarioAPI.getAll().then(r => setScenarios(Array.isArray(r.data) ? r.data.slice(0, 3) : [])).catch(() => setScenarios([]))
  }, [])

  return (
    <div className="page-wrapper" style={{ background: 'var(--bg-dark)' }}>

      {/* ── Hero ─────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Animated background orbs */}
        <div className="orb orb-purple animate-float" style={{ width: 600, height: 600, top: -200, left: -200 }} />
        <div className="orb orb-cyan animate-float"   style={{ width: 400, height: 400, bottom: -100, right: -100, animationDelay: '2s' }} />
        <div className="orb orb-amber animate-float"  style={{ width: 300, height: 300, top: '40%', right: '20%', animationDelay: '4s' }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 60, paddingBottom: 60 }}>
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}
          >
            <motion.div variants={fadeUp}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 18px', borderRadius: 999,
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                color: 'var(--primary-light)', fontSize: '0.82rem', fontWeight: 600,
                marginBottom: 28, letterSpacing: '0.05em',
              }}>
                🚨 AI-Powered Disaster Preparedness Platform
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 900,
              lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.03em',
            }}>
              Be Ready for{' '}
              <span className="gradient-text">Any Disaster</span>
              <br />Before It Strikes
            </motion.h1>

            <motion.p variants={fadeUp} style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-muted)',
              lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px',
            }}>
              Train with interactive quizzes on floods, earthquakes, fires, and more.
              Track your progress, earn badges, and ensure you're prepared when it matters most.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={user ? '/scenarios' : '/signup'} className="btn btn-primary btn-lg">
                {user ? '🎯 Start Training' : '🚀 Get Started Free'}
              </Link>
              <Link to="/scenarios" className="btn btn-secondary btn-lg">
                📖 Explore Scenarios
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} style={{ marginTop: 48, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
              {STATS.map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-light)' }}>
                    {stat.icon} {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: 24, height: 40, borderRadius: 12, border: '2px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, borderRadius: 2, background: 'var(--primary-light)' }} />
          </motion.div>
        </div>
      </section>

      {/* ── Scenarios preview ─────────────────────── */}
      {scenarios.length > 0 && (
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: 48 }}
            >
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 12 }}>
                Disaster <span className="gradient-text">Scenarios</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
                Practice with real emergency protocols for different disaster types
              </p>
            </motion.div>

            <div className="grid-3">
              {scenarios.map((s, i) => (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="card" style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>{s.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: s.color }}>
                    {s.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                    {s.description}
                  </p>
                  <Link to={user ? `/quiz/${s.id}` : '/login'}
                    className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Start Quiz →
                  </Link>
                </motion.div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/scenarios" className="btn btn-secondary">View All Scenarios →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Features ──────────────────────────────── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 12 }}>
              Why Choose <span className="gradient-text">DisasterReady</span>?
            </h2>
          </motion.div>

          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="card"
              >
                <div style={{ fontSize: '2.2rem', marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      {!user && (
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{
                textAlign: 'center', padding: '64px 32px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.15))',
                border: '1px solid rgba(99,102,241,0.3)', borderRadius: 'var(--radius-xl)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div className="orb orb-purple" style={{ width: 300, height: 300, top: -150, right: -100 }} />
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 16, position: 'relative' }}>
                Start Your Preparedness Journey Today
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px', position: 'relative' }}>
                Join thousands learning to protect themselves and their families from disasters.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <Link to="/signup" className="btn btn-primary btn-lg">Create Free Account</Link>
                <Link to="/scenarios" className="btn btn-secondary btn-lg">Browse Scenarios</Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
