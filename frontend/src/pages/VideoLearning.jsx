import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// ── Learning resources — links to YouTube search for each topic ──
// We use YouTube search URLs so users always get fresh, working results
// instead of hardcoded IDs that may be deleted or region-blocked.
const RESOURCES = [
  {
    id: 1,
    scenario: 'Flood',
    icon: '🌊',
    color: '#3b82f6',
    scenarioId: 1,
    topics: [
      {
        id: 'f1',
        title: 'Flood Safety — What To Do Before, During & After',
        searchQuery: 'flood safety preparedness before during after',
        duration: '5–8 min',
        level: 'Beginner',
        description: 'Learn the complete flood response protocol — from receiving a warning to safe evacuation and post-flood recovery.',
        keyPoints: ['Flood warning systems', 'Evacuation routes', 'Emergency kit essentials', 'Post-flood safety'],
        tip: 'Search for videos from Red Cross, FEMA or NDMA for the most reliable guidance.',
      },
      {
        id: 'f2',
        title: 'Turn Around Don\'t Drown — Vehicle Flood Safety',
        searchQuery: 'turn around dont drown flood vehicle safety NOAA',
        duration: '2–4 min',
        level: 'Beginner',
        description: 'Understand why driving through floodwater is the number one cause of flood-related deaths and how to stay safe on roads.',
        keyPoints: ['6 inch rule for walking', '2 feet sweeps vehicles', 'Road flood risks', 'What to do if swept away'],
        tip: 'NOAA and National Weather Service publish excellent short videos on this topic.',
      },
      {
        id: 'f3',
        title: 'How to Build a 72-Hour Emergency Flood Kit',
        searchQuery: '72 hour emergency flood kit preparedness supplies',
        duration: '6–10 min',
        level: 'Beginner',
        description: 'Step-by-step guidance on assembling a complete emergency kit that will sustain your family for 72 hours during a flood.',
        keyPoints: ['Water and food storage', 'Documents to include', 'Medical supplies', 'Communication devices'],
        tip: 'Look for videos from Ready.gov or local disaster management authorities.',
      },
    ],
  },
  {
    id: 2,
    scenario: 'Earthquake',
    icon: '🌍',
    color: '#f59e0b',
    scenarioId: 2,
    topics: [
      {
        id: 'e1',
        title: 'Drop Cover Hold On — The Right Earthquake Response',
        searchQuery: 'drop cover hold on earthquake safety technique ShakeOut',
        duration: '1–3 min',
        level: 'Beginner',
        description: 'The internationally recommended Drop-Cover-Hold On technique demonstrated step-by-step, with common myths like the doorway myth debunked.',
        keyPoints: ['Drop to hands and knees', 'Cover head and neck', 'Hold on until shaking stops', 'Doorway myth debunked'],
        tip: 'The Great ShakeOut organisation has the official short demonstration video.',
      },
      {
        id: 'e2',
        title: 'Earthquake Home Preparedness for Families',
        searchQuery: 'earthquake home preparedness family safety FEMA',
        duration: '5–8 min',
        level: 'Beginner',
        description: 'How to identify earthquake hazards in your home, create a family emergency plan and build your earthquake preparedness kit.',
        keyPoints: ['Securing heavy furniture', 'Family meeting point', 'Emergency kit contents', 'Aftershock response'],
        tip: 'FEMA and Red Cross publish family preparedness guides on YouTube.',
      },
      {
        id: 'e3',
        title: 'Why Buildings Collapse in Earthquakes — Engineering Explained',
        searchQuery: 'why buildings collapse earthquake engineering seismic',
        duration: '7–12 min',
        level: 'Advanced',
        description: 'Understand the structural reasons behind building collapse, liquefaction, and what makes earthquake-resistant construction different.',
        keyPoints: ['Structural failure modes', 'Liquefaction explained', 'Seismic retrofitting', 'Safe building design'],
        tip: 'Engineering Explained and IRIS Earthquake Science have excellent animated explainers.',
      },
    ],
  },
  {
    id: 3,
    scenario: 'Fire',
    icon: '🔥',
    color: '#ef4444',
    scenarioId: 3,
    topics: [
      {
        id: 'fi1',
        title: 'PASS Technique — How to Use a Fire Extinguisher',
        searchQuery: 'PASS technique fire extinguisher how to use correctly NFPA',
        duration: '2–4 min',
        level: 'Beginner',
        description: 'Master the Pull-Aim-Squeeze-Sweep (PASS) technique for using a fire extinguisher correctly, and learn when NOT to fight a fire.',
        keyPoints: ['Pull the pin', 'Aim at fire base', 'Squeeze handle', 'Sweep side to side'],
        tip: 'NFPA (National Fire Protection Association) has the definitive PASS demonstration.',
      },
      {
        id: 'fi2',
        title: 'Home Fire Escape Planning — Two Exits Per Room',
        searchQuery: 'home fire escape plan two ways out smoke alarm NFPA',
        duration: '3–5 min',
        level: 'Beginner',
        description: 'How to create and practise a fire escape plan for your home, including proper smoke alarm placement and night-time fire response.',
        keyPoints: ['Two exits per room', 'Meeting point 15m away', 'Smoke alarm placement', 'Practice drills'],
        tip: 'Search NFPA "two ways out" for their official family escape planning guide.',
      },
      {
        id: 'fi3',
        title: 'Stop Drop and Roll — When Clothes Catch Fire',
        searchQuery: 'stop drop roll fire safety clothes on fire technique',
        duration: '1–3 min',
        level: 'Beginner',
        description: 'The correct Stop-Drop-Roll technique when clothing catches fire, and why running makes it dramatically worse.',
        keyPoints: ['Stop immediately', 'Drop to ground', 'Cover face with hands', 'Roll to smother flames'],
        tip: 'Red Cross has clear short demonstrations. Look for certified fire safety trainer videos.',
      },
    ],
  },
  {
    id: 4,
    scenario: 'Cyclone',
    icon: '🌀',
    color: '#8b5cf6',
    scenarioId: 4,
    topics: [
      {
        id: 'c1',
        title: 'Cyclone Safety — Complete Before During After Guide',
        searchQuery: 'cyclone hurricane safety preparedness before during after Red Cross',
        duration: '4–7 min',
        level: 'Beginner',
        description: 'Complete cyclone preparedness covering actions to take before a cyclone warning, safe shelter protocols during, and dangers to avoid after.',
        keyPoints: ['Pre-cyclone checklist', 'Interior room shelter', 'Eye passage danger', 'Post-storm hazards'],
        tip: 'Australian Red Cross and BOM (Bureau of Meteorology) have excellent cyclone safety videos.',
      },
      {
        id: 'c2',
        title: 'Storm Surge — The Deadliest Part of a Cyclone',
        searchQuery: 'storm surge deadliest hurricane cyclone hazard explained NOAA',
        duration: '3–5 min',
        level: 'Intermediate',
        description: 'How storm surge forms, why it causes more deaths than wind, and the critical importance of coastal evacuation before landfall.',
        keyPoints: ['How surge forms', 'Can reach 6 metres+', 'Arrives before landfall', 'Only escape is evacuation'],
        tip: 'NOAA has an excellent animated storm surge explainer. Search "NOAA storm surge animation".',
      },
      {
        id: 'c3',
        title: 'How Tropical Cyclones Form — The Science',
        searchQuery: 'how tropical cyclones hurricanes form science explained',
        duration: '4–7 min',
        level: 'Intermediate',
        description: 'The meteorological science of how tropical cyclones form over warm ocean waters, develop their eye structure and intensify before landfall.',
        keyPoints: ['Warm ocean water fuel', 'Eye and eyewall structure', 'Coriolis effect rotation', 'Intensity categories'],
        tip: 'SciShow, TED-Ed and Crash Course Earth Science all have good cyclone formation videos.',
      },
    ],
  },
  {
    id: 5,
    scenario: 'Landslide',
    icon: '⛰️',
    color: '#10b981',
    scenarioId: 5,
    topics: [
      {
        id: 'l1',
        title: 'Landslide Warning Signs — What to Look For',
        searchQuery: 'landslide warning signs slope failure identification USGS',
        duration: '4–6 min',
        level: 'Beginner',
        description: 'How to identify the key warning signs that a landslide may be imminent — ground cracks, tilting trees, muddy streams and unusual sounds.',
        keyPoints: ['New ground cracks', 'Tilting poles or trees', 'Rivers turning muddy', 'Cracking hillside sounds'],
        tip: 'USGS (US Geological Survey) publishes authoritative landslide educational videos.',
      },
      {
        id: 'l2',
        title: 'Debris Flows — Fast Moving Landslide Hazards',
        searchQuery: 'debris flow mudslide fast moving landslide hazard survival',
        duration: '5–8 min',
        level: 'Intermediate',
        description: 'What makes debris flows different from normal landslides, how fast they move (up to 80 km/h) and key survival techniques.',
        keyPoints: ['Can move at 80 km/h', 'Run perpendicular to flow', 'Travel long distances', 'Secondary slides common'],
        tip: 'USGS and California Geological Survey have real debris flow footage and safety guidance.',
      },
      {
        id: 'l3',
        title: 'Reducing Landslide Risk — Community Preparedness',
        searchQuery: 'landslide risk reduction community preparedness early warning',
        duration: '6–10 min',
        level: 'Advanced',
        description: 'Community-level approaches to landslide risk reduction including afforestation, early warning systems and land-use planning.',
        keyPoints: ['Afforestation stabilises slopes', 'Drainage management', 'Early warning sensors', 'No-build zones'],
        tip: 'UN OCHA and GSI (Geological Survey of India) publish community preparedness resources.',
      },
    ],
  },
  {
    id: 6,
    scenario: 'Tsunami',
    icon: '🌊',
    color: '#06b6d4',
    scenarioId: 6,
    topics: [
      {
        id: 't1',
        title: 'Tsunami Natural Warning Signs and Evacuation',
        searchQuery: 'tsunami natural warning signs evacuation high ground NOAA safety',
        duration: '3–5 min',
        level: 'Beginner',
        description: 'The natural warning signs of an approaching tsunami and exactly what to do — evacuate inland to high ground immediately without waiting for sirens.',
        keyPoints: ['Strong earthquake = evacuate', 'Sea receding = run now', 'Aim for 30m elevation', 'Never wait for sirens'],
        tip: 'NOAA Pacific Tsunami Warning Center and ITIC have official safety videos.',
      },
      {
        id: 't2',
        title: 'How Tsunamis Work — TED-Ed Explanation',
        searchQuery: 'how tsunamis work science explained TED-Ed animation',
        duration: '4–6 min',
        level: 'Intermediate',
        description: 'The science behind tsunami generation by earthquakes, how they travel at 800 km/h across deep oceans and amplify in shallow coastal water.',
        keyPoints: ['Seafloor displacement', '800 km/h in deep water', 'Coastal amplification', 'Wave train not one wave'],
        tip: 'Search "TED-Ed how tsunamis work" for their well-animated explainer video.',
      },
      {
        id: 't3',
        title: 'The 2004 Indian Ocean Tsunami — Lessons Learned',
        searchQuery: '2004 Indian Ocean tsunami documentary lessons warning system',
        duration: '8–15 min',
        level: 'Advanced',
        description: 'How the 2004 Indian Ocean Tsunami unfolded, why 227,000 people died, and how it led to the creation of modern tsunami early warning systems.',
        keyPoints: ['M9.1 Sumatra earthquake', '227,000 deaths in 14 countries', 'DART buoy network built after', 'INCOIS India system'],
        tip: 'National Geographic and BBC have documentary coverage. Search "2004 tsunami documentary lessons".',
      },
    ],
  },
]

const LEVEL_COLORS = {
  Beginner:     { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
  Intermediate: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  Advanced:     { bg: 'rgba(239,68,68,0.12)',  color: '#f87171', border: 'rgba(239,68,68,0.25)'  },
}

// Log activity to localStorage and refresh dashboard
function logWatchActivity(topicTitle, refreshDashboard) {
  try {
    const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]')
    if (!watched.includes(topicTitle)) {
      watched.push(topicTitle)
      localStorage.setItem('watchedVideos', JSON.stringify(watched))
    }
    const activity = JSON.parse(localStorage.getItem('dr_activity') || '[]')
    const timeStr  = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    })
    const entry = { title: 'Watched: ' + topicTitle, type: 'video', time: timeStr }
    const alreadyLogged = activity.length > 0 && activity[0].title === entry.title
    if (!alreadyLogged) {
      localStorage.setItem('dr_activity', JSON.stringify([entry, ...activity].slice(0, 30)))
      refreshDashboard()
    }
  } catch {}
}

export default function VideoLearning() {
  const { refreshDashboard } = useAuth()
  const [activeScenario, setActiveScenario] = useState(null)
  const [searchQuery,    setSearchQuery]    = useState('')
  const [expanded,       setExpanded]       = useState(null)
  const [watched,        setWatched]        = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('watchedVideos') || '[]')) }
    catch { return new Set() }
  })

  const totalTopics  = RESOURCES.reduce((s, c) => s + c.topics.length, 0)
  const watchedCount = watched.size

  const handleMarkWatched = useCallback((topicId, topicTitle) => {
    setWatched(prev => {
      const next = new Set(prev)
      next.add(topicTitle)
      return next
    })
    logWatchActivity(topicTitle, refreshDashboard)
  }, [refreshDashboard])

  const handleOpenYouTube = useCallback((topic, topicId) => {
    const url = 'https://www.youtube.com/results?search_query=' +
      encodeURIComponent(topic.searchQuery)
    window.open(url, '_blank', 'noopener,noreferrer')
    // Mark as watched when they open YouTube
    handleMarkWatched(topicId, topic.title)
  }, [handleMarkWatched])

  const filteredResources = RESOURCES
    .filter(cat => activeScenario === null || cat.id === activeScenario)
    .map(cat => ({
      ...cat,
      topics: cat.topics.filter(t =>
        !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(cat => cat.topics.length > 0)

  return (
    <div className="page-wrapper">

      {/* ── Header ───────────────────────────────── */}
      <section style={{ padding: '56px 0 28px', position: 'relative', overflow: 'hidden' }}>
        <div className="orb orb-cyan   animate-float" style={{ width: 400, height: 400, top: -200, right: -100, opacity: 0.09 }} />
        <div className="orb orb-purple animate-float" style={{ width: 300, height: 300, bottom: -100, left: -80, opacity: 0.07, animationDelay: '2s' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px',
              borderRadius: 999, background: 'rgba(6,182,212,0.15)',
              border: '1px solid rgba(6,182,212,0.3)', color: '#67e8f9',
              fontSize: '0.8rem', fontWeight: 600, marginBottom: 20,
            }}>
              🎬 Video Learning Centre
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 12 }}>
              Learn Through <span className="gradient-text">Videos</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 560, marginBottom: 24, lineHeight: 1.75 }}>
              Curated disaster preparedness topics with guided YouTube search. Each topic you explore is tracked in your dashboard.
            </p>

            {/* Notice banner */}
            <div style={{
              display: 'inline-flex', alignItems: 'flex-start', gap: 10, padding: '12px 18px',
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 'var(--radius)', maxWidth: 600, marginBottom: 20,
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>📌</span>
              <p style={{ fontSize: '0.82rem', color: '#fbbf24', lineHeight: 1.65, margin: 0 }}>
                Videos open on YouTube in a new tab so you always get the latest working content.
                Click <strong>Mark as Watched</strong> after watching to update your dashboard progress.
              </p>
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, maxWidth: 300 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Topics Explored</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#06b6d4' }}>{watchedCount}/{totalTopics}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(watchedCount / totalTopics) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #06b6d4, #6366f1)', borderRadius: 3 }}
                  />
                </div>
              </div>
              <span className="badge badge-success">{Math.round((watchedCount / totalTopics) * 100)}% Complete</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Filters ──────────────────────────────── */}
      <div className="container" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="input-field"
            style={{ maxWidth: 280, flex: '1 1 180px' }}
            placeholder="🔍 Search topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveScenario(null)}
              className={`btn btn-sm ${activeScenario === null ? 'btn-primary' : 'btn-secondary'}`}
            >All</button>
            {RESOURCES.map(cat => (
              <button key={cat.id}
                onClick={() => setActiveScenario(cat.id === activeScenario ? null : cat.id)}
                className={`btn btn-sm ${activeScenario === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat.icon} {cat.scenario}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Topic cards ───────────────────────────── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          {filteredResources.map((cat, catIdx) => (
            <motion.div key={cat.id}
              initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: catIdx * 0.07, duration: 0.5 }}
              style={{ marginBottom: 48 }}
            >
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.55rem', background: `${cat.color}15`, border: `1px solid ${cat.color}30`,
                  }}>{cat.icon}</div>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: cat.color }}>{cat.scenario}</h2>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {cat.topics.filter(t => watched.has(t.title)).length}/{cat.topics.length} explored
                    </p>
                  </div>
                </div>
                <Link to={`/quiz/${cat.scenarioId}`} className="btn btn-secondary btn-sm">
                  🎯 Take {cat.scenario} Quiz
                </Link>
              </div>

              {/* Topic cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cat.topics.map((topic, ti) => {
                  const isWatched   = watched.has(topic.title)
                  const isExpanded  = expanded === topic.id
                  const levelStyle  = LEVEL_COLORS[topic.level]

                  return (
                    <motion.div key={topic.id}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: ti * 0.06 }}
                      style={{
                        background: isWatched ? `${cat.color}08` : 'var(--bg-glass)',
                        backdropFilter: 'blur(16px)',
                        border: `1px solid ${isWatched ? cat.color + '44' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        transition: 'all 0.25s',
                      }}
                    >
                      {/* Card header — always visible */}
                      <div
                        onClick={() => setExpanded(isExpanded ? null : topic.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '16px 20px', cursor: 'pointer',
                        }}
                      >
                        {/* Left: colour bar */}
                        <div style={{
                          width: 4, height: 48, borderRadius: 2, flexShrink: 0,
                          background: isWatched ? cat.color : 'var(--border)',
                          transition: 'background 0.3s',
                        }} />

                        {/* Title + badges */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700,
                              background: levelStyle.bg, color: levelStyle.color, border: `1px solid ${levelStyle.border}` }}>
                              {topic.level}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>⏱ {topic.duration}</span>
                            {isWatched && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>✓ Watched</span>}
                          </div>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text)', margin: 0 }}>
                            {topic.title}
                          </h3>
                        </div>

                        {/* Expand chevron */}
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0 }}
                        >▾</motion.span>
                      </div>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{
                              padding: '0 20px 20px 20px',
                              borderTop: `1px solid ${cat.color}20`,
                              marginTop: 0,
                            }}>
                              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: '14px 0 14px' }}>
                                {topic.description}
                              </p>

                              {/* Key learning points */}
                              <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                                  Key learning points
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                                  {topic.keyPoints.map((pt, i) => (
                                    <span key={i} style={{
                                      padding: '4px 12px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 500,
                                      background: `${cat.color}12`, border: `1px solid ${cat.color}28`, color: cat.color,
                                    }}>✓ {pt}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Search tip */}
                              <div style={{
                                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                marginBottom: 16,
                              }}>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                                  <span style={{ color: '#fbbf24', fontWeight: 600 }}>💡 Search tip: </span>
                                  {topic.tip}
                                </p>
                              </div>

                              {/* Action buttons */}
                              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                <motion.button
                                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                  onClick={() => handleOpenYouTube(topic, topic.id)}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 20px', borderRadius: 'var(--radius)',
                                    background: `linear-gradient(135deg, ${cat.color}, ${cat.color}bb)`,
                                    border: 'none', color: 'white', cursor: 'pointer',
                                    fontFamily: 'var(--font)', fontSize: '0.88rem', fontWeight: 700,
                                    boxShadow: `0 4px 18px ${cat.color}40`,
                                  }}
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/>
                                  </svg>
                                  Watch on YouTube
                                </motion.button>

                                {!isWatched && (
                                  <motion.button
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => handleMarkWatched(topic.id, topic.title)}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 8,
                                      padding: '10px 20px', borderRadius: 'var(--radius)',
                                      background: 'rgba(16,185,129,0.12)',
                                      border: '1px solid rgba(16,185,129,0.3)',
                                      color: '#34d399', cursor: 'pointer',
                                      fontFamily: 'var(--font)', fontSize: '0.88rem', fontWeight: 600,
                                    }}
                                  >
                                    ✓ Mark as Watched
                                  </motion.button>
                                )}

                                <Link
                                  to={`/quiz/${cat.scenarioId}`}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '10px 18px' }}
                                >
                                  🎯 Take Quiz
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}

          {filteredResources.length === 0 && (
            <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎬</div>
              <p>No topics found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
