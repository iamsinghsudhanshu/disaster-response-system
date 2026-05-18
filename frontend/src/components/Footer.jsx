import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(5,5,15,0.95)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '48px 0 24px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 12 }}>
              🛡️ Disaster<span className="gradient-text">Ready</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 240 }}>
              AI-powered disaster preparedness platform helping communities stay safe and informed.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/', 'Home'], ['/scenarios', 'Scenarios'], ['/dashboard', 'Dashboard']].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
                >{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>Disaster Types</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['🌊 Flood', '🌍 Earthquake', '🔥 Fire', '🌀 Cyclone', '⛰️ Landslide', '🌊 Tsunami'].map(t => (
                <span key={t} style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>Emergency</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', color: '#f87171', fontSize: '0.85rem', fontWeight: 600 }}>
                🚨 Emergency: 112
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)', color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
                🏥 Disaster Helpline: 1078
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
            © 2026 DisasterReady. Built for safety and preparedness.
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
            Made with ❤️ using React + Spring Boot
          </p>
        </div>
      </div>
    </footer>
  )
}
