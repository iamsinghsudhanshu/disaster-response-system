import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { scenarioAPI } from '../utils/api'

export default function Scenarios() {
  const { user } = useAuth()
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    scenarioAPI
      .getAll()
      .then((r) =>
        setScenarios(Array.isArray(r.data) ? r.data : [])
      )
      .catch(() => setScenarios(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <div
        className="page-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            className="spinner"
            style={{ margin: '0 auto 16px' }}
          />
          <p style={{ color: 'var(--text-muted)' }}>
            Loading scenarios...
          </p>
        </div>
      </div>
    )

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section
        style={{
          padding: '60px 0 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="orb orb-purple"
          style={{
            width: 400,
            height: 400,
            top: -200,
            right: -100,
            opacity: 0.1,
          }}
        />

        <div
          className="container"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '5px 16px',
                borderRadius: 999,
                background: 'rgba(99,102,241,0.15)',
                border:
                  '1px solid rgba(99,102,241,0.3)',
                color: 'var(--primary-light)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              🎯 Training Modules
            </span>

            <h1
              style={{
                fontSize:
                  'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 900,
                marginBottom: 16,
              }}
            >
              Disaster{' '}
              <span className="gradient-text">
                Scenarios
              </span>
            </h1>

            <p
              style={{
                color: 'var(--text-muted)',
                maxWidth: 520,
                margin: '0 auto',
                fontSize: '1rem',
                lineHeight: 1.7,
              }}
            >
              Choose a disaster type below and test
              your emergency response knowledge with
              interactive quizzes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Scenario grid */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div className="grid-3">
            {scenarios.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                style={{
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border:
                    '1px solid var(--border)',
                  borderRadius:
                    'var(--radius-xl)',
                  padding: 32,
                  cursor: 'pointer',
                  transition:
                    'border-color 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor =
                    (s.color || '#6366f1') +
                    '66')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor =
                    'var(--border)')
                }
              >
                {/* Glow accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${
                      s.color || '#6366f1'
                    }, transparent)`,
                    borderRadius:
                      '20px 20px 0 0',
                  }}
                />

                <div
                  style={{
                    fontSize: '3.5rem',
                    marginBottom: 20,
                    display: 'block',
                  }}
                >
                  {s.icon}
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    marginBottom: 10,
                    color:
                      s.color ||
                      'var(--primary-light)',
                  }}
                >
                  {s.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.7,
                    marginBottom: 24,
                    minHeight: 60,
                  }}
                >
                  {s.description}
                </p>

                <Link
                  to={
                    user
                      ? `/quiz/${s.id}`
                      : '/login'
                  }
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    background: `linear-gradient(
                      135deg,
                      ${s.color || '#6366f1'},
                      ${
                        s.color || '#4f46e5'
                      }cc
                    )`,
                  }}
                >
                  {user
                    ? '▶ Start Quiz'
                    : '🔐 Login to Start'}
                </Link>
              </motion.div>
            ))}
          </div>

          {scenarios.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 0',
                color: 'var(--text-muted)',
              }}
            >
              <div
                style={{
                  fontSize: '3rem',
                  marginBottom: 16,
                }}
              >
                🌐
              </div>

              <p>
                No scenarios found. Make sure the
                backend is running.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Fallback data if backend is unreachable
const FALLBACK = [
  {
    id: 1,
    name: 'Flood',
    icon: '🌊',
    color: '#3b82f6',
    description:
      'Learn flood response protocols, evacuation procedures, and water safety.',
  },
  {
    id: 2,
    name: 'Earthquake',
    icon: '🌍',
    color: '#f59e0b',
    description:
      'Master Drop-Cover-Hold and post-quake safety procedures.',
  },
  {
    id: 3,
    name: 'Fire',
    icon: '🔥',
    color: '#ef4444',
    description:
      'Understand fire prevention and safe evacuation routes.',
  },
  {
    id: 4,
    name: 'Cyclone',
    icon: '🌀',
    color: '#8b5cf6',
    description:
      'Prepare for cyclones with early warning and shelter protocols.',
  },
  {
    id: 5,
    name: 'Landslide',
    icon: '⛰️',
    color: '#10b981',
    description:
      'Identify landslide risks and learn emergency response.',
  },
  {
    id: 6,
    name: 'Tsunami',
    icon: '🌊',
    color: '#06b6d4',
    description:
      'Recognize warning signs and master evacuation to high ground.',
  },
]
