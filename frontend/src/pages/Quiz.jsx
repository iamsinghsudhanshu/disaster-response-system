import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { questionAPI, scenarioAPI, attemptAPI } from '../utils/api'

export default function Quiz() {
  const { scenarioId } = useParams()
  const { user, refreshDashboard } = useAuth()
  const navigate = useNavigate()

  const [scenario,    setScenario]    = useState(null)
  const [questions,   setQuestions]   = useState([])
  const [current,     setCurrent]     = useState(0)
  const [selected,    setSelected]    = useState(null)
  const [answered,    setAnswered]    = useState(false)
  const [score,       setScore]       = useState(0)
  const [answers,     setAnswers]     = useState([])
  const [finished,    setFinished]    = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [timeLeft,    setTimeLeft]    = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const [saving,      setSaving]      = useState(false)

  // ── Load scenario + questions ───────────────────────
  useEffect(() => {
    Promise.all([
      scenarioAPI.getById(scenarioId),
      questionAPI.getByScenario(scenarioId),
    ])
      .then(([sRes, qRes]) => {
        setScenario(sRes.data)
        const qs = qRes.data
        if (qs.length === 0) {
          toast.error('No questions for this scenario yet.')
          navigate('/scenarios')
          return
        }
        // Shuffle questions, pick up to 20
        const shuffled = [...qs].sort(() => Math.random() - 0.5).slice(0, 20)
        const parsed   = shuffled.map(q => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        }))
        setQuestions(parsed)
        setTimerActive(true)
      })
      .catch(() => { toast.error('Failed to load quiz.'); navigate('/scenarios') })
      .finally(() => setLoading(false))
  }, [scenarioId])

  // ── Countdown timer ──────────────────────────────────
  useEffect(() => {
    if (!timerActive || answered || finished) return
    if (timeLeft <= 0) { handleTimeout(); return }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, timerActive, answered, finished])

  const handleTimeout = useCallback(() => {
    if (answered) return
    setAnswered(true)
    setTimerActive(false)
    const q = questions[current]
    setAnswers(prev => [...prev, {
      question: q.question, selected: 'Time out ⏰',
      correct: q.correctAnswer, isRight: false,
    }])
    toast.error('Time\'s up! ⏰')
  }, [answered, current, questions])

  const handleAnswer = (option) => {
    if (answered) return
    setSelected(option)
    setAnswered(true)
    setTimerActive(false)
    const q       = questions[current]
    const isRight = option === q.correctAnswer
    if (isRight) { setScore(s => s + 1); toast.success('Correct! 🎉') }
    else           toast.error(`Wrong! ✗`)
    setAnswers(prev => [...prev, {
      question: q.question, selected: option,
      correct: q.correctAnswer, isRight,
    }])
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
      setTimeLeft(30)
      setTimerActive(true)
    }
  }

  const finishQuiz = async () => {
    setFinished(true)
    setTimerActive(false)
    setSaving(true)
    try {
      await attemptAPI.save({
        userId:         user.id,
        scenarioId:     Number(scenarioId),
        score,
        totalQuestions: questions.length,
      })
      // ✅ KEY FIX: notify Dashboard to re-fetch immediately
      refreshDashboard()
      toast.success('Results saved to your dashboard! 📊')
    } catch {
      toast.error('Could not save results — check backend connection.')
    } finally {
      setSaving(false)
    }
  }

  const retryQuiz = () => {
    setCurrent(0); setScore(0); setAnswers([])
    setSelected(null); setAnswered(false)
    setFinished(false); setTimeLeft(30); setTimerActive(true)
  }

  // ── Grade helper ─────────────────────────────────────
  const percentage = questions.length > 0
    ? Math.round((score / questions.length) * 100) : 0
  const getGrade = (p) =>
    p >= 90 ? ['S', '#f59e0b'] :
    p >= 75 ? ['A', '#10b981'] :
    p >= 60 ? ['B', '#3b82f6'] :
    p >= 40 ? ['C', '#8b5cf6'] : ['D', '#ef4444']
  const [grade, gradeColor] = getGrade(percentage)

  // ── Loading ──────────────────────────────────────────
  if (loading) return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading quiz...</p>
      </div>
    </div>
  )

  // ── RESULTS SCREEN ───────────────────────────────────
  if (finished) return (
    <div className="page-wrapper" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '80px 16px',
    }}>
      <div className="orb orb-purple animate-float" style={{ width: 400, height: 400, top: -100, left: -100, opacity: 0.1 }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        style={{ maxWidth: 680, width: '100%', position: 'relative', zIndex: 1 }}
      >
        <div className="glass" style={{ padding: 'clamp(28px, 5vw, 48px)', textAlign: 'center' }}>

          {/* Grade circle */}
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            style={{
              width: 120, height: 120, borderRadius: '50%', margin: '0 auto 24px',
              background: `radial-gradient(circle, ${gradeColor}33, ${gradeColor}11)`,
              border: `3px solid ${gradeColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '2rem', fontWeight: 900, color: gradeColor }}>{grade}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Grade</span>
          </motion.div>

          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, marginBottom: 6 }}>
            {percentage >= 80 ? '🎉 Excellent!' : percentage >= 60 ? '👍 Good Job!' : '📚 Keep Practicing!'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
            Completed: <strong style={{ color: 'var(--text)' }}>{scenario?.icon} {scenario?.name}</strong>
            {saving && <span style={{ color: 'var(--primary-light)', marginLeft: 8, fontSize: '0.8rem' }}>💾 Saving...</span>}
          </p>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Score',    value: `${score}/${questions.length}`, color: gradeColor },
              { label: 'Accuracy', value: `${percentage}%`,               color: '#6366f1' },
              { label: 'Correct',  value: `${score} Right`,               color: '#10b981' },
            ].map(s => (
              <div key={s.label} style={{
                padding: '14px 10px', background: 'rgba(255,255,255,0.04)',
                borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Answer review */}
          <div style={{ textAlign: 'left', marginBottom: 28 }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Answer Review
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
              {answers.map((a, i) => (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                  background: a.isRight ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)',
                  border: `1px solid ${a.isRight ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: a.isRight ? 0 : 4 }}>
                    {a.isRight ? '✅' : '❌'} Q{i + 1}: {a.question}
                  </p>
                  {!a.isRight && (
                    <p style={{ fontSize: '0.78rem', color: '#34d399' }}>✔ Correct: {a.correct}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={retryQuiz}>🔄 Retry</button>
            <button className="btn btn-primary"   onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
            <button className="btn btn-secondary" onClick={() => navigate('/scenarios')}>← Scenarios</button>
          </div>
        </div>
      </motion.div>
    </div>
  )

  // ── QUESTION SCREEN ───────────────────────────────────
  const q = questions[current]
  if (!q) return null
  const timerPct = (timeLeft / 30) * 100

  return (
    <div className="page-wrapper" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '80px 16px',
    }}>
      <div className="orb orb-cyan" style={{ width: 300, height: 300, top: 0, right: 0, opacity: 0.06 }} />

      <div style={{ maxWidth: 700, width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.4rem' }}>{scenario?.icon}</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{scenario?.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {current + 1}/{questions.length}
            </span>
            {/* Timer */}
            <div style={{
              padding: '4px 14px', borderRadius: 999, fontWeight: 700, fontSize: '0.9rem',
              background: timeLeft <= 10 ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.15)',
              border: `1px solid ${timeLeft <= 10 ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.3)'}`,
              color: timeLeft <= 10 ? '#f87171' : 'var(--primary-light)',
              transition: 'all 0.3s',
            }}>
              ⏱ {timeLeft}s
            </div>
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>✅ {score}</div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginBottom: 3, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${(current / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 2 }}
          />
        </div>
        {/* Timer bar */}
        <div style={{ height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 2, marginBottom: 22, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            style={{ height: '100%', background: timeLeft <= 10 ? '#ef4444' : '#10b981', borderRadius: 2 }}
          />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div key={current}
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.3 }}
            className="glass" style={{ padding: 'clamp(20px, 4vw, 32px)', marginBottom: 18 }}
          >
            <p style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Question {current + 1} of {questions.length}
            </p>
            <h2 style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', fontWeight: 700, lineHeight: 1.55, marginBottom: 24 }}>
              {q.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg     = 'rgba(255,255,255,0.04)'
                let border = '1px solid var(--border)'
                let color  = 'var(--text)'
                if (answered) {
                  if (opt === q.correctAnswer)              { bg = 'rgba(16,185,129,0.13)'; border = '1px solid rgba(16,185,129,0.5)'; color = '#34d399' }
                  else if (opt === selected)                { bg = 'rgba(239,68,68,0.1)';   border = '1px solid rgba(239,68,68,0.4)'; color = '#f87171' }
                }
                return (
                  <motion.button key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={answered}
                    whileHover={!answered ? { scale: 1.012, x: 4 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    style={{
                      width: '100%', padding: '13px 18px', textAlign: 'left',
                      background: bg, border, borderRadius: 'var(--radius)',
                      color, cursor: answered ? 'default' : 'pointer',
                      font: '0.9rem/1.45 var(--font)', fontWeight: 500,
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12,
                    }}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(255,255,255,0.06)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 800,
                    }}>
                      {['A','B','C','D'][i]}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {answered && opt === q.correctAnswer && <span>✅</span>}
                    {answered && opt === selected && opt !== q.correctAnswer && <span>❌</span>}
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {answered && q.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                  style={{
                    marginTop: 18, padding: '13px 16px', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.2)',
                  }}
                >
                  <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 700, marginBottom: 4 }}>💡 Explanation</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{q.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {answered && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={handleNext}>
              {current + 1 >= questions.length ? '🏁 See Results' : 'Next Question →'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
