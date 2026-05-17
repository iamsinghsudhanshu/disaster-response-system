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

  const [scenario, setScenario] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const [saving, setSaving] = useState(false)

  // ── Load scenario + questions ───────────────────────
  useEffect(() => {
    Promise.all([
      scenarioAPI.getById(scenarioId),
      questionAPI.getByScenario(scenarioId),
    ])
      .then(([sRes, qRes]) => {
        setScenario(sRes.data)

        // ✅ FIXED: safe array handling
        const qs = Array.isArray(qRes.data) ? qRes.data : []

        if (qs.length === 0) {
          toast.error('No questions for this scenario yet.')
          navigate('/scenarios')
          return
        }

        // Shuffle questions and limit to 20
        const shuffled = [...qs]
          .sort(() => Math.random() - 0.5)
          .slice(0, 20)

        const parsed = shuffled.map((q) => ({
          ...q,
          options:
            typeof q.options === 'string'
              ? JSON.parse(q.options)
              : q.options,
        }))

        setQuestions(parsed)
        setTimerActive(true)
      })
      .catch(() => {
        toast.error('Failed to load quiz.')
        navigate('/scenarios')
      })
      .finally(() => setLoading(false))
  }, [scenarioId, navigate])

  // ── Countdown timer ─────────────────────────────────
  useEffect(() => {
    if (!timerActive || answered || finished) return

    if (timeLeft <= 0) {
      handleTimeout()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, timerActive, answered, finished])

  // ── Timeout handler ─────────────────────────────────
  const handleTimeout = useCallback(() => {
    if (answered) return

    setAnswered(true)
    setTimerActive(false)

    const q = questions[current]

    setAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        selected: 'Time out ⏰',
        correct: q.correctAnswer,
        isRight: false,
      },
    ])

    toast.error("Time's up! ⏰")
  }, [answered, current, questions])

  // ── Answer handler ──────────────────────────────────
  const handleAnswer = (option) => {
    if (answered) return

    setSelected(option)
    setAnswered(true)
    setTimerActive(false)

    const q = questions[current]
    const isRight = option === q.correctAnswer

    if (isRight) {
      setScore((prev) => prev + 1)
      toast.success('Correct! 🎉')
    } else {
      toast.error('Wrong answer ✗')
    }

    setAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        selected: option,
        correct: q.correctAnswer,
        isRight,
      },
    ])
  }

  // ── Next question ───────────────────────────────────
  const handleNext = () => {
    if (current + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrent((prev) => prev + 1)
      setSelected(null)
      setAnswered(false)
      setTimeLeft(30)
      setTimerActive(true)
    }
  }

  // ── Finish quiz ─────────────────────────────────────
  const finishQuiz = async () => {
    setFinished(true)
    setTimerActive(false)
    setSaving(true)

    try {
      await attemptAPI.save({
        userId: user.id,
        scenarioId: Number(scenarioId),
        score,
        totalQuestions: questions.length,
      })

      refreshDashboard()

      toast.success('Results saved successfully! 📊')
    } catch {
      toast.error('Could not save results.')
    } finally {
      setSaving(false)
    }
  }

  // ── Retry quiz ──────────────────────────────────────
  const retryQuiz = () => {
    setCurrent(0)
    setScore(0)
    setAnswers([])
    setSelected(null)
    setAnswered(false)
    setFinished(false)
    setTimeLeft(30)
    setTimerActive(true)
  }

  // ── Loading screen ──────────────────────────────────
  if (loading) {
    return (
      <div className="page-wrapper">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <h2>Loading quiz...</h2>
        </div>
      </div>
    )
  }

  // ── Prevent crashes ─────────────────────────────────
  const q = questions[current]

  if (!q) {
    return (
      <div className="page-wrapper">
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <h2>No quiz data found.</h2>
        </div>
      </div>
    )
  }

  // ── Finished screen ─────────────────────────────────
  if (finished) {
    const percentage = Math.round(
      (score / questions.length) * 100
    )

    return (
      <div className="page-wrapper">
        <div
          className="glass"
          style={{
            maxWidth: 700,
            margin: '60px auto',
            padding: 40,
            textAlign: 'center',
          }}
        >
          <h1>Quiz Completed 🎉</h1>

          <h2>
            Score: {score}/{questions.length}
          </h2>

          <p>Accuracy: {percentage}%</p>

          {saving && <p>Saving results...</p>}

          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              marginTop: 24,
              flexWrap: 'wrap',
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={retryQuiz}
            >
              Retry Quiz
            </button>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => navigate('/scenarios')}
            >
              Back to Scenarios
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Question UI ─────────────────────────────────────
  return (
    <div className="page-wrapper">
      <div
        className="glass"
        style={{
          maxWidth: 800,
          margin: '40px auto',
          padding: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div>
            <h2>
              {scenario?.icon} {scenario?.name}
            </h2>

            <p>
              Question {current + 1} of{' '}
              {questions.length}
            </p>
          </div>

          <div>
            <h3>⏱ {timeLeft}s</h3>
          </div>
        </div>

        <h2 style={{ marginBottom: 24 }}>
          {q.question}
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {(q.options || []).map((opt, i) => {
            let className = 'btn btn-secondary'

            if (answered) {
              if (opt === q.correctAnswer) {
                className = 'btn btn-success'
              } else if (
                opt === selected &&
                opt !== q.correctAnswer
              ) {
                className = 'btn btn-danger'
              }
            }

            return (
              <button
                key={i}
                className={className}
                disabled={answered}
                onClick={() => handleAnswer(opt)}
                style={{
                  textAlign: 'left',
                  padding: 16,
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {answered && (
          <div style={{ marginTop: 24 }}>
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              {current + 1 >= questions.length
                ? 'Finish Quiz'
                : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
