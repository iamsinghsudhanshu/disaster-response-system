import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../utils/api'

export default function Signup() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const strength = (pw) => {
    let score = 0
    if (pw.length >= 8)          score++
    if (/[A-Z]/.test(pw))        score++
    if (/[0-9]/.test(pw))        score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }
  const pwStrength = strength(form.password)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength]
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'][pwStrength]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      const { data } = await authAPI.signup({ name: form.name, email: form.email, password: form.password })
      login({ id: data.id, name: data.name, email: data.email, role: data.role }, data.token)
      toast.success(`Account created! Welcome, ${data.name}! 🎉`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="orb orb-cyan   animate-float" style={{ width: 500, height: 500, top: -200, right: -200 }} />
      <div className="orb orb-purple animate-float" style={{ width: 400, height: 400, bottom: -150, left: -150, animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 480, padding: '0 16px', position: 'relative', zIndex: 1 }}
      >
        <div className="glass" style={{ padding: '40px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🚀</div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the preparedness community</p>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { name: 'name',    label: 'Full Name',       type: 'text',     placeholder: 'John Doe' },
              { name: 'email',   label: 'Email Address',   type: 'email',    placeholder: 'you@example.com' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {field.label}
                </label>
                <input
                  className="input-field"
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            {/* Password with strength meter */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= pwStrength ? strengthColor : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Confirm Password
              </label>
              <input
                className="input-field"
                type="password"
                name="confirm"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={handleChange}
                required
                style={{ borderColor: form.confirm && form.confirm !== form.password ? '#ef4444' : '' }}
              />
              {form.confirm && form.confirm !== form.password && (
                <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: 4 }}>Passwords don't match</p>
              )}
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account...</> : '🎉 Create Account'}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
