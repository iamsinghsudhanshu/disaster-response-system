import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { adminAPI, questionAPI, scenarioAPI } from '../utils/api'

const EMPTY_FORM = { question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '', scenarioId: '' }

export default function AdminDash() {
  const [stats,     setStats]     = useState(null)
  const [questions, setQuestions] = useState([])
  const [scenarios, setScenarios] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [tab,       setTab]       = useState('overview') // overview | questions | add
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [editId,    setEditId]    = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [search,    setSearch]    = useState('')
  const [filterScen,setFilter]    = useState('all')

  // ── Load data ────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      const [statsRes, questRes, scenRes] = await Promise.all([
        adminAPI.getStats(),
        questionAPI.getAll(),
        scenarioAPI.getAll(),
      ])
      setStats(statsRes.data)
      setQuestions((Array.isArray(questRes.data) ? questRes.data : []).map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      })))
      setScenarios(Array.isArray(scenRes.data) ? scenRes.data : [])
    } catch {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // ── Form helpers ──────────────────────────────────

  const handleFormChange = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const handleOptionChange = (i, val) => setForm(f => {
    const opts = [...f.options]; opts[i] = val; return { ...f, options: opts }
  })

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null) }

  const handleEdit = (q) => {
    setForm({
      question:      q.question,
      options:       Array.isArray(q.options) ? [...q.options, '', '', '', ''].slice(0, 4) : ['','','',''],
      correctAnswer: q.correctAnswer,
      explanation:   q.explanation || '',
      scenarioId:    q.scenario?.id?.toString() || '',
    })
    setEditId(q.id)
    setTab('add')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return
    try {
      await questionAPI.delete(id)
      toast.success('Question deleted')
      setQuestions(qs => qs.filter(q => q.id !== id))
      setStats(s => s ? { ...s, totalQuestions: s.totalQuestions - 1 } : s)
    } catch {
      toast.error('Failed to delete question')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const opts = form.options.filter(o => o.trim())
    if (opts.length < 2)              { toast.error('At least 2 options required'); return }
    if (!form.correctAnswer.trim())   { toast.error('Correct answer is required'); return }
    if (!opts.includes(form.correctAnswer)) { toast.error('Correct answer must be one of the options'); return }
    if (!form.scenarioId)             { toast.error('Please select a scenario'); return }

    const payload = { ...form, options: opts, scenarioId: Number(form.scenarioId) }
    setSaving(true)
    try {
      if (editId) {
        const { data } = await questionAPI.update(editId, payload)
        const parsed = { ...data, options: typeof data.options === 'string' ? JSON.parse(data.options) : data.options }
        setQuestions(qs => qs.map(q => q.id === editId ? parsed : q))
        toast.success('Question updated ✅')
      } else {
        const { data } = await questionAPI.create(payload)
        const parsed = { ...data, options: typeof data.options === 'string' ? JSON.parse(data.options) : data.options }
        setQuestions(qs => [parsed, ...qs])
        setStats(s => s ? { ...s, totalQuestions: s.totalQuestions + 1 } : s)
        toast.success('Question added ✅')
      }
      resetForm()
      setTab('questions')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save question')
    } finally {
      setSaving(false)
    }
  }

  // Filtered questions
  const filteredQs = questions.filter(q => {
    const matchSearch = q.question.toLowerCase().includes(search.toLowerCase())
    const matchScen   = filterScen === 'all' || String(q.scenario?.id) === filterScen
    return matchSearch && matchScen
  })

  if (loading) return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading admin panel...</p>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">

          {/* Page header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>
              ⚙️ Admin <span className="gradient-text">Dashboard</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage questions, scenarios, and platform analytics</p>
          </motion.div>

          {/* Stat cards */}
          {stats && (
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {[
                { icon: '👥', label: 'Total Users',     value: stats.totalUsers,     color: '#6366f1' },
                { icon: '🌐', label: 'Scenarios',        value: stats.totalScenarios, color: '#06b6d4' },
                { icon: '❓', label: 'Questions',        value: stats.totalQuestions, color: '#f59e0b' },
                { icon: '📝', label: 'Quiz Attempts',    value: stats.totalAttempts,  color: '#10b981' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="card" style={{ textAlign: 'center' }} whileHover={{ y: -4 }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.04)', padding: 6, borderRadius: 'var(--radius-lg)', width: 'fit-content', flexWrap: 'wrap' }}>
            {[
              { id: 'overview',   label: '📊 Overview' },
              { id: 'questions',  label: `❓ Questions (${questions.length})` },
              { id: 'add',        label: editId ? '✏️ Edit Question' : '➕ Add Question' },
            ].map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); if (t.id !== 'add') resetForm() }}
                className={`btn btn-sm ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-sm)' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ─────────────────────────── */}
          <AnimatePresence mode="wait">
            {tab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="grid-2">
                  <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📋 Scenarios Overview</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {scenarios.map(s => {
                        const count = questions.filter(q => q.scenario?.id === s.id).length
                        return (
                          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)' }}>
                            <span>{s.icon} {s.name}</span>
                            <span className="badge badge-primary">{count} questions</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>⚡ Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <button className="btn btn-primary" onClick={() => setTab('add')} style={{ justifyContent: 'flex-start' }}>
                        ➕ Add New Question
                      </button>
                      <button className="btn btn-secondary" onClick={() => setTab('questions')} style={{ justifyContent: 'flex-start' }}>
                        ❓ Manage Questions
                      </button>
                      <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#34d399' }}>
                        ✅ System Status: Online
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── QUESTIONS TAB ─────────────────────── */}
            {tab === 'questions' && (
              <motion.div key="questions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Filters */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                  <input className="input-field" style={{ maxWidth: 320 }}
                    placeholder="🔍 Search questions..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                  <select className="input-field" style={{ maxWidth: 200 }}
                    value={filterScen} onChange={e => setFilter(e.target.value)}>
                    <option value="all">All Scenarios</option>
                    {scenarios.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                  </select>
                  <button className="btn btn-primary btn-sm" onClick={() => { setTab('add'); resetForm() }}>
                    ➕ Add Question
                  </button>
                </div>

                {filteredQs.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>❓</div>
                    <p style={{ color: 'var(--text-muted)' }}>No questions found.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filteredQs.map((q, i) => (
                      <motion.div key={q.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="card" style={{ padding: '20px 24px' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                              <span className="badge badge-primary">{q.scenario?.icon} {q.scenario?.name}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {q.id}</span>
                            </div>
                            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 10, lineHeight: 1.5 }}>{q.question}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {Array.isArray(q.options) && q.options.map((opt, j) => (
                                <span key={j} style={{
                                  padding: '3px 12px', borderRadius: 999, fontSize: '0.78rem',
                                  background: opt === q.correctAnswer ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                                  border: `1px solid ${opt === q.correctAnswer ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                  color: opt === q.correctAnswer ? '#34d399' : 'var(--text-muted)',
                                }}>
                                  {opt === q.correctAnswer && '✅ '}{opt}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(q)}>✏️ Edit</button>
                            <button className="btn btn-danger btn-sm"   onClick={() => handleDelete(q.id)}>🗑️</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── ADD / EDIT TAB ────────────────────── */}
            {tab === 'add' && (
              <motion.div key="add" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="glass" style={{ padding: '36px 32px', maxWidth: 720 }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 28 }}>
                    {editId ? '✏️ Edit Question' : '➕ Add New Question'}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    {/* Scenario select */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Disaster Scenario *
                      </label>
                      <select className="input-field" value={form.scenarioId}
                        onChange={e => handleFormChange('scenarioId', e.target.value)} required>
                        <option value="">Select a scenario...</option>
                        {scenarios.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                      </select>
                    </div>

                    {/* Question text */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Question *
                      </label>
                      <textarea className="input-field" rows={3}
                        placeholder="Enter the quiz question..."
                        value={form.question}
                        onChange={e => handleFormChange('question', e.target.value)}
                        required style={{ resize: 'vertical' }} />
                    </div>

                    {/* Options */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', marginBottom: 10, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Answer Options * <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>(min 2, max 4)</span>
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {form.options.map((opt, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                              background: opt && opt === form.correctAnswer ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                              border: `1px solid ${opt && opt === form.correctAnswer ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)',
                            }}>
                              {['A','B','C','D'][i]}
                            </span>
                            <input className="input-field" style={{ flex: 1 }}
                              placeholder={`Option ${['A','B','C','D'][i]}${i < 2 ? ' (required)' : ' (optional)'}`}
                              value={opt}
                              onChange={e => handleOptionChange(i, e.target.value)} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Correct answer */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Correct Answer * <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>(must match an option exactly)</span>
                      </label>
                      <select className="input-field" value={form.correctAnswer}
                        onChange={e => handleFormChange('correctAnswer', e.target.value)} required>
                        <option value="">Select correct answer...</option>
                        {form.options.filter(o => o.trim()).map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Explanation */}
                    <div style={{ marginBottom: 28 }}>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Explanation (optional)
                      </label>
                      <textarea className="input-field" rows={2}
                        placeholder="Explain why this is the correct answer..."
                        value={form.explanation}
                        onChange={e => handleFormChange('explanation', e.target.value)}
                        style={{ resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <motion.button type="submit" className="btn btn-primary"
                        disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {saving
                          ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
                          : editId ? '✅ Update Question' : '➕ Add Question'}
                      </motion.button>
                      <button type="button" className="btn btn-secondary" onClick={() => { resetForm(); setTab('questions') }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
