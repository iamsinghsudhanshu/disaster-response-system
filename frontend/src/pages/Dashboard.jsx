import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { attemptAPI } from '../utils/api'

// ── Constants ──────────────────────────────────────────────
const TOTAL_VIDEOS   = 18  // 3 per scenario × 6 scenarios
const TOTAL_GUIDES   = 6   // one per scenario

const BADGES = [
  { id: 'first',    icon: '🎯', title: 'First Steps',    desc: 'Complete your first quiz',      check: (a) => a.length >= 1 },
  { id: 'five',     icon: '🔥', title: 'On Fire',         desc: 'Complete 5 quizzes',            check: (a) => a.length >= 5 },
  { id: 'ten',      icon: '💪', title: 'Dedicated',       desc: 'Complete 10 quizzes',           check: (a) => a.length >= 10 },
  { id: 'perfect',  icon: '⭐', title: 'Perfectionist',   desc: 'Score 100% on any quiz',        check: (a) => a.some(x => x.score === x.totalQuestions) },
  { id: 'highscore',icon: '🏆', title: 'High Achiever',   desc: 'Score 80%+ on three quizzes',   check: (a) => a.filter(x => (x.score / x.totalQuestions) >= 0.8).length >= 3 },
  { id: 'explorer', icon: '🌐', title: 'Explorer',        desc: 'Try 3 different scenarios',     check: (a) => new Set(a.map(x => x.scenario?.id)).size >= 3 },
  { id: 'allscen',  icon: '🌍', title: 'Completionist',   desc: 'Try all 6 scenarios',           check: (a) => new Set(a.map(x => x.scenario?.id)).size >= 6 },
  { id: 'videos',   icon: '🎬', title: 'Video Learner',   desc: 'Watch 5 videos',                check: (_, v) => v >= 5 },
  { id: 'allvids',  icon: '📺', title: 'Video Master',    desc: 'Watch all 18 videos',           check: (_, v) => v >= TOTAL_VIDEOS },
  { id: 'guide',    icon: '📋', title: 'Prepared',        desc: 'Read 3 emergency guides',       check: (_, _v, g) => g >= 3 },
]

const COLORS = ['#6366f1','#06b6d4','#f59e0b','#10b981','#ef4444','#8b5cf6']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'rgba(15,15,35,0.97)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px', fontSize:'0.82rem' }}>
      <p style={{ color:'var(--text-muted)', marginBottom:4 }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color:p.color, fontWeight:700 }}>{p.name}: {p.value}{p.name==='Score'?'%':''}</p>)}
    </div>
  )
}

function StatCard({ icon, label, value, color='#6366f1', sub }) {
  return (
    <motion.div whileHover={{ y:-4 }} className="card" style={{ textAlign:'center' }}>
      <div style={{ fontSize:'2rem', marginBottom:8 }}>{icon}</div>
      <div style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:900, color }}>{value}</div>
      <div style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--text)', marginTop:4 }}>{label}</div>
      {sub && <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:4 }}>{sub}</div>}
    </motion.div>
  )
}

// ── Activity type config ───────────────────────────────────
const ACTIVITY_CONFIG = {
  quiz:  { icon:'🎯', label:'Quiz Completed', color:'#6366f1' },
  video: { icon:'🎬', label:'Video Watched',  color:'#06b6d4' },
  guide: { icon:'📋', label:'Guide Viewed',   color:'#f59e0b' },
}

export default function Dashboard() {
  const { user, dashboardVersion } = useAuth()

  const [attempts,      setAttempts]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [videosWatched, setVideosWatched] = useState(0)
  const [guidesViewed,  setGuidesViewed]  = useState(0)
  const [recentActivity,setRecentActivity]= useState([])
  const [activeTab,     setActiveTab]     = useState('overview')

  // ── Read localStorage activity data ────────────────────
  const readLocalActivity = useCallback(() => {
    try {
      const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]')
      setVideosWatched(watched.length)
    } catch { setVideosWatched(0) }

    try {
      const guides = JSON.parse(localStorage.getItem('viewedGuides') || '[]')
      setGuidesViewed(guides.length)
    } catch { setGuidesViewed(0) }

    try {
      const activity = JSON.parse(localStorage.getItem('dr_activity') || '[]')
      setRecentActivity(activity.slice(0, 20))
    } catch { setRecentActivity([]) }
  }, [])

  // ── Fetch quiz attempts from backend ───────────────────
  const fetchAttempts = useCallback(() => {
    if (!user?.id) return
    setLoading(true)
    attemptAPI.getByUser(user.id)
      .then(r => setAttempts(Array.isArray(r.data) ? r.data : []))
      .catch(() => setAttempts([]))
      .finally(() => setLoading(false))
  }, [user])

  // ── Re-run every time dashboardVersion bumps ───────────
  // dashboardVersion increments when: quiz finishes, video watched, guide viewed
  useEffect(() => {
    fetchAttempts()
    readLocalActivity()
  }, [dashboardVersion, fetchAttempts, readLocalActivity])

  // ── Derived quiz stats ─────────────────────────────────
  const total      = attempts.length
  const avgScore   = total > 0 ? Math.round(attempts.reduce((s,a) => s + (a.score/a.totalQuestions)*100, 0) / total) : 0
  const bestScore  = total > 0 ? Math.max(...attempts.map(a => Math.round((a.score/a.totalQuestions)*100))) : 0
  const uniqueScen = new Set(attempts.map(a => a.scenario?.id)).size

  // Charts data
  const barData = [...attempts].reverse().slice(-8).map((a,i) => ({
    name:  a.scenario?.name?.slice(0,5) || `Q${i+1}`,
    Score: Math.round((a.score/a.totalQuestions)*100),
  }))

  const scenMap = {}
  attempts.forEach(a => {
    const name = a.scenario?.name || 'Other'
    scenMap[name] = (scenMap[name]||0) + 1
  })
  const pieData = Object.entries(scenMap).map(([name,value]) => ({ name, value }))

  const lineData = [...attempts].reverse().slice(-10).map((a,i) => ({
    attempt: `#${i+1}`,
    Score: Math.round((a.score/a.totalQuestions)*100),
  }))

  // Badges
  const earnedBadges = new Set(
    BADGES.filter(b => b.check(attempts, videosWatched, guidesViewed)).map(b => b.id)
  )

  // Total activity score (gamification points)
  const totalPoints = (total * 10) + (videosWatched * 5) + (guidesViewed * 3) + (earnedBadges.size * 25)

  // Preparedness level
  const prepLevel  = Math.min(100, Math.round(
    (total * 3) + (videosWatched * 2) + (guidesViewed * 2) + (earnedBadges.size * 5)
  ))
  const prepLabel  = prepLevel >= 80 ? 'Expert' : prepLevel >= 55 ? 'Prepared' : prepLevel >= 30 ? 'Learning' : 'Beginner'
  const prepColor  = prepLevel >= 80 ? '#10b981' : prepLevel >= 55 ? '#06b6d4' : prepLevel >= 30 ? '#f59e0b' : '#6366f1'

  if (loading) return (
    <div className="page-wrapper" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
      <div style={{ textAlign:'center' }}>
        <div className="spinner" style={{ margin:'0 auto 16px' }} />
        <p style={{ color:'var(--text-muted)' }}>Loading dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <section style={{ padding:'48px 0 80px' }}>
        <div className="container">

          {/* ── Profile header ──────────────────────── */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="glass" style={{ padding:'24px 28px', marginBottom:28,
              display:'flex', alignItems:'center', gap:18, flexWrap:'wrap',
              borderTop:`3px solid ${prepColor}`,
            }}
          >
            <div style={{
              width:68, height:68, borderRadius:'50%', flexShrink:0,
              background:`linear-gradient(135deg, ${prepColor}, #6366f1)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.8rem', fontWeight:900, color:'white',
              boxShadow:`0 0 28px ${prepColor}44`,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex:1, minWidth:140 }}>
              <h1 style={{ fontSize:'clamp(1.1rem,3vw,1.4rem)', fontWeight:800, marginBottom:3 }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', marginBottom:8 }}>{user?.email}</p>
              <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                <span className={`badge ${user?.role==='ADMIN'?'badge-warning':'badge-primary'}`}>{user?.role}</span>
                <span style={{ padding:'2px 12px', borderRadius:999, fontSize:'0.72rem', fontWeight:700,
                  background:`${prepColor}18`, border:`1px solid ${prepColor}44`, color:prepColor }}>
                  {prepLabel} — {prepLevel}% Prepared
                </span>
                <span style={{ fontSize:'0.78rem', color:'var(--primary-light)', fontWeight:700 }}>
                  ⚡ {totalPoints} pts
                </span>
              </div>
            </div>

            {/* Preparedness ring */}
            <div style={{ flexShrink:0, textAlign:'center' }}>
              <svg width="80" height="80" style={{ transform:'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke={prepColor} strokeWidth="7"
                  strokeDasharray={`${prepLevel * 2.01} 201`} strokeLinecap="round"
                  style={{ transition:'stroke-dasharray 1.2s ease' }}
                />
              </svg>
              <div style={{ marginTop:-64, fontSize:'1rem', fontWeight:900, color:prepColor }}>{prepLevel}%</div>
              <div style={{ marginTop:36, fontSize:'0.7rem', color:'var(--text-muted)' }}>Ready</div>
            </div>

            <Link to="/scenarios" className="btn btn-primary btn-sm" style={{ marginLeft:'auto', flexShrink:0 }}>
              🎯 New Quiz
            </Link>
          </motion.div>

          {/* ── 6 Stat cards ────────────────────────── */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:16, marginBottom:28 }}>
            {[
              { icon:'📝', label:'Quizzes Done',    value: total,            color:'#6366f1' },
              { icon:'📊', label:'Avg Score',        value:`${avgScore}%`,    color:'#06b6d4' },
              { icon:'⭐', label:'Best Score',        value:`${bestScore}%`,   color:'#f59e0b' },
              { icon:'🌐', label:'Scenarios Tried',  value: uniqueScen,       color:'#10b981' },
              { icon:'🎬', label:'Videos Watched',   value:`${videosWatched}/${TOTAL_VIDEOS}`, color:'#8b5cf6' },
              { icon:'📋', label:'Guides Viewed',    value:`${guidesViewed}/${TOTAL_GUIDES}`,  color:'#ef4444' },
            ].map((s,i) => (
              <motion.div key={s.label}
                initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.06 }}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </div>

          {/* ── Empty state ──────────────────────────── */}
          {total === 0 && videosWatched === 0 && guidesViewed === 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="glass" style={{ textAlign:'center', padding:'52px 32px', marginBottom:28 }}>
              <div style={{ fontSize:'3.5rem', marginBottom:16 }}>🎯</div>
              <h2 style={{ fontSize:'1.4rem', fontWeight:800, marginBottom:10 }}>Start Your Journey!</h2>
              <p style={{ color:'var(--text-muted)', marginBottom:28, maxWidth:400, margin:'0 auto 28px', lineHeight:1.7 }}>
                Your dashboard updates live as you take quizzes, watch videos and read guides.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <Link to="/scenarios" className="btn btn-primary">🎯 Take a Quiz</Link>
                <Link to="/learn"     className="btn btn-secondary">🎬 Watch Videos</Link>
                <Link to="/guide"     className="btn btn-secondary">📋 Read Guides</Link>
              </div>
            </motion.div>
          )}

          {/* ── Tab switcher ────────────────────────── */}
          {(total > 0 || videosWatched > 0 || guidesViewed > 0) && (
            <>
              <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
                {[
                  { id:'overview',  label:'📊 Overview'  },
                  { id:'charts',    label:'📈 Charts'    },
                  { id:'badges',    label:'🏅 Badges'    },
                  { id:'activity',  label:'🕐 Activity'  },
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`btn btn-sm ${activeTab===t.id?'btn-primary':'btn-secondary'}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">

                {/* ── OVERVIEW TAB ─────────────────── */}
                {activeTab === 'overview' && (
                  <motion.div key="overview"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0 }} transition={{ duration:0.25 }}
                  >
                    {/* Progress bars */}
                    <div className="grid-2" style={{ marginBottom:24 }}>
                      <div className="card">
                        <h3 style={{ fontWeight:700, marginBottom:18, fontSize:'0.95rem' }}>📚 Learning Progress</h3>
                        {[
                          { label:'Quizzes Completed', value: Math.min(100, total*10),        count:`${total} done`,           color:'#6366f1' },
                          { label:'Videos Watched',    value: Math.round((videosWatched/TOTAL_VIDEOS)*100), count:`${videosWatched}/${TOTAL_VIDEOS}`, color:'#06b6d4' },
                          { label:'Guides Read',       value: Math.round((guidesViewed/TOTAL_GUIDES)*100),  count:`${guidesViewed}/${TOTAL_GUIDES}`,  color:'#f59e0b' },
                          { label:'Badges Earned',     value: Math.round((earnedBadges.size/BADGES.length)*100), count:`${earnedBadges.size}/${BADGES.length}`, color:'#10b981' },
                        ].map(item => (
                          <div key={item.label} style={{ marginBottom:14 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                              <span style={{ fontSize:'0.82rem', fontWeight:600 }}>{item.label}</span>
                              <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{item.count}</span>
                            </div>
                            <div style={{ height:7, background:'rgba(255,255,255,0.07)', borderRadius:4, overflow:'hidden' }}>
                              <motion.div
                                initial={{ width:0 }}
                                animate={{ width:`${item.value}%` }}
                                transition={{ duration:1, ease:'easeOut' }}
                                style={{ height:'100%', background:item.color, borderRadius:4 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick actions */}
                      <div className="card">
                        <h3 style={{ fontWeight:700, marginBottom:18, fontSize:'0.95rem' }}>⚡ Continue Learning</h3>
                        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                          <Link to="/scenarios" style={{
                            display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
                            background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)',
                            borderRadius:'var(--radius-sm)', textDecoration:'none', color:'var(--text)',
                            transition:'all 0.2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background='rgba(99,102,241,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.background='rgba(99,102,241,0.1)'}
                          >
                            <span style={{ fontSize:'1.4rem' }}>🎯</span>
                            <div>
                              <div style={{ fontWeight:700, fontSize:'0.88rem' }}>Take a Quiz</div>
                              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Test your knowledge</div>
                            </div>
                            <span style={{ marginLeft:'auto', color:'var(--primary-light)' }}>→</span>
                          </Link>
                          <Link to="/learn" style={{
                            display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
                            background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.2)',
                            borderRadius:'var(--radius-sm)', textDecoration:'none', color:'var(--text)',
                            transition:'all 0.2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background='rgba(6,182,212,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.background='rgba(6,182,212,0.1)'}
                          >
                            <span style={{ fontSize:'1.4rem' }}>🎬</span>
                            <div>
                              <div style={{ fontWeight:700, fontSize:'0.88rem' }}>Watch Videos</div>
                              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{TOTAL_VIDEOS - videosWatched} videos remaining</div>
                            </div>
                            <span style={{ marginLeft:'auto', color:'#06b6d4' }}>→</span>
                          </Link>
                          <Link to="/guide" style={{
                            display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
                            background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)',
                            borderRadius:'var(--radius-sm)', textDecoration:'none', color:'var(--text)',
                            transition:'all 0.2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background='rgba(245,158,11,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.background='rgba(245,158,11,0.1)'}
                          >
                            <span style={{ fontSize:'1.4rem' }}>📋</span>
                            <div>
                              <div style={{ fontWeight:700, fontSize:'0.88rem' }}>Emergency Guides</div>
                              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{TOTAL_GUIDES - guidesViewed} guides remaining</div>
                            </div>
                            <span style={{ marginLeft:'auto', color:'#f59e0b' }}>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Recent quiz table */}
                    {total > 0 && (
                      <div className="card">
                        <h3 style={{ fontWeight:700, marginBottom:18, fontSize:'0.95rem' }}>📝 Recent Quizzes</h3>
                        <div className="table-wrapper">
                          <table>
                            <thead><tr><th>Scenario</th><th>Score</th><th>Accuracy</th><th>Date</th><th>Grade</th></tr></thead>
                            <tbody>
                              {attempts.slice(0,8).map(a => {
                                const pct   = Math.round((a.score/a.totalQuestions)*100)
                                const gc    = pct>=90?['S','#f59e0b']:pct>=75?['A','#10b981']:pct>=60?['B','#3b82f6']:['C','#ef4444']
                                const date  = new Date(a.attemptedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})
                                return (
                                  <tr key={a.id}>
                                    <td style={{ fontWeight:600 }}>{a.scenario?.icon} {a.scenario?.name}</td>
                                    <td>{a.score}/{a.totalQuestions}</td>
                                    <td>
                                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                        <div style={{ flex:1, height:5, background:'rgba(255,255,255,0.07)', borderRadius:3, minWidth:50 }}>
                                          <div style={{ width:`${pct}%`, height:'100%', background:gc[1], borderRadius:3 }} />
                                        </div>
                                        <span style={{ fontSize:'0.78rem', fontWeight:700, color:gc[1], minWidth:34 }}>{pct}%</span>
                                      </div>
                                    </td>
                                    <td style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>{date}</td>
                                    <td><span style={{ fontWeight:900, color:gc[1], fontSize:'1rem' }}>{gc[0]}</span></td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── CHARTS TAB ───────────────────── */}
                {activeTab === 'charts' && (
                  <motion.div key="charts"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0 }} transition={{ duration:0.25 }}
                  >
                    {total === 0 ? (
                      <div className="card" style={{ textAlign:'center', padding:48 }}>
                        <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📊</div>
                        <p style={{ color:'var(--text-muted)' }}>Complete quizzes to see your charts here.</p>
                        <Link to="/scenarios" className="btn btn-primary" style={{ marginTop:20, display:'inline-flex' }}>Take First Quiz</Link>
                      </div>
                    ) : (
                      <>
                        <div className="grid-2" style={{ marginBottom:24 }}>
                          <div className="card">
                            <h3 style={{ fontWeight:700, marginBottom:18, fontSize:'0.95rem' }}>📊 Score History</h3>
                            <ResponsiveContainer width="100%" height={210}>
                              <BarChart data={barData} margin={{ top:5, right:5, left:-25, bottom:5 }}>
                                <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
                                <YAxis domain={[0,100]} tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
                                <Tooltip content={<CustomTooltip />}/>
                                <Bar dataKey="Score" fill="url(#barGrad)" radius={[6,6,0,0]} maxBarSize={36}/>
                                <defs>
                                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1"/>
                                    <stop offset="100%" stopColor="#06b6d4"/>
                                  </linearGradient>
                                </defs>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="card">
                            <h3 style={{ fontWeight:700, marginBottom:18, fontSize:'0.95rem' }}>🌐 By Scenario</h3>
                            <ResponsiveContainer width="100%" height={210}>
                              <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} paddingAngle={3}>
                                  {pieData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />}/>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        {lineData.length > 1 && (
                          <div className="card">
                            <h3 style={{ fontWeight:700, marginBottom:18, fontSize:'0.95rem' }}>📈 Score Trend</h3>
                            <ResponsiveContainer width="100%" height={170}>
                              <LineChart data={lineData} margin={{ top:5, right:5, left:-25, bottom:5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                                <XAxis dataKey="attempt" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
                                <YAxis domain={[0,100]} tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
                                <Tooltip content={<CustomTooltip />}/>
                                <Line type="monotone" dataKey="Score" stroke="#6366f1" strokeWidth={2.5} dot={{ fill:'#6366f1', r:4 }} activeDot={{ r:7 }}/>
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* ── BADGES TAB ───────────────────── */}
                {activeTab === 'badges' && (
                  <motion.div key="badges"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0 }} transition={{ duration:0.25 }}
                  >
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:14 }}>
                      {BADGES.map(badge => {
                        const earned = earnedBadges.has(badge.id)
                        return (
                          <motion.div key={badge.id} whileHover={{ scale:1.04 }}
                            style={{
                              padding:'20px 14px', textAlign:'center',
                              background: earned ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                              border:`1px solid ${earned ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)'}`,
                              borderRadius:'var(--radius)', opacity: earned ? 1 : 0.45,
                              transition:'all 0.2s',
                              boxShadow: earned ? '0 0 20px rgba(99,102,241,0.15)' : 'none',
                            }}
                          >
                            <div style={{ fontSize:'2.2rem', marginBottom:10, filter: earned ? 'none' : 'grayscale(100%)' }}>
                              {badge.icon}
                            </div>
                            <div style={{ fontSize:'0.85rem', fontWeight:800, marginBottom:4 }}>{badge.title}</div>
                            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', lineHeight:1.5, marginBottom:8 }}>{badge.desc}</div>
                            {earned
                              ? <span className="badge badge-success" style={{ fontSize:'0.65rem' }}>✓ Earned</span>
                              : <span className="badge" style={{ fontSize:'0.65rem', background:'rgba(255,255,255,0.06)', color:'var(--text-dim)' }}>Locked</span>
                            }
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ── ACTIVITY TAB ─────────────────── */}
                {activeTab === 'activity' && (
                  <motion.div key="activity"
                    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0 }} transition={{ duration:0.25 }}
                  >
                    <div className="card">
                      <h3 style={{ fontWeight:700, marginBottom:20, fontSize:'0.95rem' }}>🕐 Recent Activity</h3>
                      {recentActivity.length === 0 && attempts.length === 0 ? (
                        <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-muted)' }}>
                          <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📭</div>
                          <p>No activity yet. Take a quiz, watch a video or read a guide!</p>
                        </div>
                      ) : (
                        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                          {/* Quiz attempts as activity */}
                          {attempts.slice(0,5).map((a,i) => {
                            const pct = Math.round((a.score/a.totalQuestions)*100)
                            const date = new Date(a.attemptedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
                            return (
                              <div key={`quiz-${a.id}`} style={{
                                display:'flex', alignItems:'center', gap:14, padding:'12px 16px',
                                background:'rgba(99,102,241,0.07)', border:'1px solid rgba(99,102,241,0.15)',
                                borderRadius:'var(--radius-sm)',
                              }}>
                                <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
                                  🎯
                                </div>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontWeight:600, fontSize:'0.88rem' }}>
                                    Quiz: {a.scenario?.icon} {a.scenario?.name}
                                  </div>
                                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                                    Score: {a.score}/{a.totalQuestions} ({pct}%) · {date}
                                  </div>
                                </div>
                                <span style={{ fontWeight:800, color: pct>=75?'#10b981':'#f59e0b', fontSize:'0.9rem' }}>{pct}%</span>
                              </div>
                            )
                          })}
                          {/* Local activity (video/guide) */}
                          {recentActivity.map((act,i) => {
                            const cfg = ACTIVITY_CONFIG[act.type] || ACTIVITY_CONFIG.quiz
                            return (
                              <div key={`act-${i}`} style={{
                                display:'flex', alignItems:'center', gap:14, padding:'12px 16px',
                                background:`${cfg.color}0d`, border:`1px solid ${cfg.color}22`,
                                borderRadius:'var(--radius-sm)',
                              }}>
                                <div style={{ width:38, height:38, borderRadius:'50%', background:`${cfg.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
                                  {cfg.icon}
                                </div>
                                <div style={{ flex:1 }}>
                                  <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{act.title}</div>
                                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>
                                    {cfg.label} · {act.time}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </>
          )}

        </div>
      </section>
    </div>
  )
}
