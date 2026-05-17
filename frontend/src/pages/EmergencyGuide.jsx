import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const GUIDES = [
  {
    id: 1, name: 'Flood', icon: '🌊', color: '#3b82f6', scenarioId: 1,
    before: [
      'Know your flood risk zone and evacuation routes',
      'Prepare a 72-hour emergency kit with waterproof torch and battery radio',
      'Store important documents in a waterproof container',
      'Keep emergency numbers saved: 112 (Emergency), 1078 (NDMA Helpline)',
      'Install check valves in plumbing to prevent backflow',
      'Elevate electrical systems and appliances above potential flood level',
    ],
    during: [
      'Move to higher ground IMMEDIATELY — do not wait to confirm',
      'Turn off main electrical breaker at the fusebox before water enters',
      'Do NOT walk or drive through floodwater — 6 inches can knock you down',
      'If trapped in a car, kick out the window when car stabilises and swim to safety',
      'Avoid contact with floodwater — it is contaminated with sewage and chemicals',
      'Monitor battery-powered radio for official emergency updates',
    ],
    after: [
      'Do NOT re-enter home until authorities declare it safe',
      'Document all damage with photos before cleaning for insurance claims',
      'Disinfect everything that contacted floodwater with bleach solution',
      'Drink only bottled or boiled water until supply is officially cleared',
      'Watch for structural damage, gas leaks and downed power lines',
      'Contact NDMA helpline 1078 for disaster relief and recovery support',
    ],
    kit: [
      '4 litres water per person per day for 72 hours minimum',
      'Non-perishable food for 3 days (canned, sealed, ready-to-eat)',
      'Waterproof torch with spare batteries',
      'Battery-powered FM radio for emergency alerts',
      'First aid kit with antiseptics and bandages',
      'Waterproof document bag with Aadhaar, insurance, bank details',
      'Emergency blanket and warm clothing',
      'Whistle and mirror for signalling rescuers',
    ],
  },
  {
    id: 2, name: 'Earthquake', icon: '🌍', color: '#f59e0b', scenarioId: 2,
    before: [
      'Identify safe spots in each room — under sturdy tables, against inner walls',
      'Secure heavy furniture, bookshelves and water heaters to walls with straps',
      'Know how to turn off gas, water and electricity at main switches',
      'Prepare a 72-hour earthquake kit with first aid and essential medications',
      'Establish a family meeting point outside your neighbourhood',
      'Learn basic first aid and CPR from a certified course',
    ],
    during: [
      'DROP to your hands and knees immediately when shaking starts',
      'COVER your head and neck under a sturdy desk or against an inner wall',
      'HOLD ON until all shaking completely stops — it feels longer than it is',
      'Stay AWAY from windows, exterior walls and heavy furniture',
      'If in bed, stay there and protect your head with a pillow',
      'If outdoors, move away from buildings, trees and power lines to open ground',
    ],
    after: [
      'Check yourself and others for injuries — provide first aid immediately',
      'Smell for gas leaks and listen for hissing — evacuate immediately if detected',
      'Use stairs only — never elevators after an earthquake',
      'Expect aftershocks — respond with full Drop-Cover-Hold every single time',
      'Do NOT use open flames — gas leaks may still be present in the area',
      'Text rather than call to keep phone lines free for emergency services',
    ],
    kit: [
      '4 litres water per person per day for 72 hours',
      'First aid kit with trauma supplies and pressure bandages',
      'Torch with spare batteries for dark conditions',
      'Battery radio for emergency bulletins and aftershock alerts',
      'Whistle to signal rescuers if trapped under debris',
      'Sturdy shoes and work gloves for navigating debris',
      'Copies of vital documents in a waterproof sealed bag',
      'Cash in small denominations — ATMs may not be working',
    ],
  },
  {
    id: 3, name: 'Fire', icon: '🔥', color: '#ef4444', scenarioId: 3,
    before: [
      'Install smoke alarms on every floor of your home — test them monthly',
      'Create and practise a home fire escape plan with two exits per room',
      'Designate a meeting point outside at least 15 metres from the building',
      'Keep fire extinguishers accessible and know the PASS technique',
      'Never leave cooking unattended — most home fires start in the kitchen',
      'Check electrical wiring regularly and replace all frayed cords immediately',
    ],
    during: [
      'Activate the fire alarm and CALL 101 (Fire) or 112 (Emergency) immediately',
      'Evacuate IMMEDIATELY — never stop to collect belongings of any kind',
      'Touch the door with the back of your hand before opening — if hot find another exit',
      'Crawl LOW under the smoke to the nearest exit — clean air is near the floor',
      'Close all doors behind you as you escape to slow the spread of fire',
      'If clothing catches fire: STOP — DROP to the ground — ROLL to smother flames',
    ],
    after: [
      'Go to your pre-planned meeting point and account for every person',
      'Do NOT re-enter the building for ANY reason whatsoever',
      'Call emergency services immediately if anyone is unaccounted for',
      'Do not return inside until fire officials formally declare the building safe',
      'Contact your insurance company as soon as possible after the incident',
      'Seek medical attention for smoke inhalation even if you feel no symptoms',
    ],
    kit: [
      'Multi-purpose ABC fire extinguisher — check pressure gauge monthly',
      'Smoke alarm on every floor — replace batteries annually',
      'Carbon monoxide detector near sleeping areas',
      'Fire blanket in the kitchen for oil and fat fires',
      'Emergency escape ladder for upper floor bedrooms',
      'First aid kit with burn treatment supplies',
      'Torch for navigating through smoke-filled escape routes',
      'Dust masks or wet cloth to reduce smoke inhalation',
    ],
  },
  {
    id: 4, name: 'Cyclone', icon: '🌀', color: '#8b5cf6', scenarioId: 4,
    before: [
      'Monitor IMD bulletins and act on a cyclone WARNING — do not wait for worse',
      'Board or shutter all windows and secure or bring in all loose outdoor items',
      'Turn off LPG cylinders, disconnect and lay them flat indoors safely',
      'Store at least 3 days of food, water and essential medications',
      'Charge all electronic devices and ensure battery radio is working',
      'Know the exact location of your nearest official cyclone shelter',
    ],
    during: [
      'Shelter in an interior room on the lowest floor completely away from windows',
      'Do NOT go outside under any circumstances — extreme danger from flying debris',
      'NEVER go outside during the eye of the cyclone — the violent eyewall will return',
      'Stay away from all floodwaters, drains and low-lying coastal areas',
      'Keep battery radio on continuously for official emergency updates',
      'If ordered to evacuate by authorities, leave your home IMMEDIATELY',
    ],
    after: [
      'Wait for the official all-clear announcement before going outside',
      'Assume ALL downed power lines are live — stay at least 10 metres away',
      'Avoid floodwater — it may be electrified from downed power lines',
      'Do not use tap water until authorities declare it officially safe',
      'Document all structural damage thoroughly with photos for insurance',
      'Contact NDMA helpline 1078 for disaster relief and assistance',
    ],
    kit: [
      '3 days minimum water supply in sealed containers',
      'Non-perishable food for at least 72 hours',
      'Battery-powered radio for continuous IMD storm updates',
      'Waterproof torch with multiple sets of spare batteries',
      'First aid kit and a full 7-day supply of all medications',
      'Waterproof document bag with all identity and insurance documents',
      'Cash in hand — electronic payments may be unavailable for days',
      'Rope for emergency use and securing items',
    ],
  },
  {
    id: 5, name: 'Landslide', icon: '⛰️', color: '#10b981', scenarioId: 5,
    before: [
      'Check if your home is in a landslide risk area using GSI hazard maps',
      'Learn to recognise warning signs: ground cracks, tilting trees, muddy streams',
      'Plan clear evacuation routes leading to flat ground well away from slopes',
      'Avoid building on steep slopes or at the base of slopes completely',
      'Plant deep-rooted vegetation around your property to stabilise soil',
      'Install drainage channels to prevent water accumulation on nearby slopes',
    ],
    during: [
      'Evacuate IMMEDIATELY on any warning signs — do not wait to confirm movement',
      'If directly in the path of a slide, run PERPENDICULAR sideways away from it',
      'Avoid all river valleys and low-lying areas during periods of heavy rainfall',
      'If escape is completely impossible, curl tightly protecting your head and neck',
      'Stay off all roads in landslide zones during and after any heavy rain event',
      'Alert all neighbours and report the situation to disaster management authorities',
    ],
    after: [
      'Stay completely away from the slide area — dangerous secondary slides are common',
      'Check for injured and trapped people nearby and call 112 for professional rescue',
      'Do NOT return home until authorities formally declare the area safe',
      'Report all damage to your local district disaster management office',
      'Do not attempt to cross any damaged bridges or cracked roads',
      'Watch closely for flooding from rivers that may be blocked by landslide debris',
    ],
    kit: [
      'Strong rope at least 15 metres long for slope rescue assistance',
      'Waterproof torch with spare batteries',
      'Comprehensive first aid kit with fracture and wound management supplies',
      'Loud whistle to signal your location if trapped under debris',
      '72-hour food and water supply ready to carry at short notice',
      'Battery-powered radio for emergency bulletins',
      'Sturdy ankle-support boots for navigating unstable debris terrain',
      'Waterproof document bag with all essential personal documents',
    ],
  },
  {
    id: 6, name: 'Tsunami', icon: '🌊', color: '#06b6d4', scenarioId: 6,
    before: [
      'Check if your home is in a tsunami inundation zone using INCOIS hazard maps',
      'Identify your nearest evacuation route and closest high ground above 30 metres',
      'Memorise the natural warning signs — you do not need to wait for a siren',
      'Keep your emergency grab-and-go kit always packed and near the door',
      'Participate in community tsunami evacuation drills whenever they are held',
      'Save INCOIS alert contact numbers and install the official tsunami warning app',
    ],
    during: [
      'Strong earthquake felt near the coast means EVACUATE IMMEDIATELY to high ground',
      'If the sea dramatically recedes exposing the seabed — RUN inland right now',
      'Do NOT wait for any official siren or warning for a locally generated tsunami',
      'Aim to reach at least 30 metres elevation or 3 kilometres inland — whichever is further',
      'Do NOT stop to watch from the beach or coastal area under any circumstances',
      'Keep running and moving inland until you have reached genuine high ground',
    ],
    after: [
      'NEVER return to the coast until official authorities issue a formal all-clear',
      'Tsunami wave trains last 8 to 24 hours — later waves are often the largest',
      'Stay on high ground and wait patiently for official guidance from authorities',
      'Do not enter any tsunami inundation zone — unstable debris and hidden hazards',
      'Watch for fires from ruptured gas lines in areas that were inundated by water',
      'Contact family using text messages — keep voice calls very brief to save network',
    ],
    kit: [
      'Grab-and-go bag always packed and ready near your door',
      '4 litres water per person minimum in portable sealed containers',
      'Non-perishable food for 72 hours that requires no cooking',
      'Waterproof torch with long-life batteries',
      'Battery-powered radio tuned to receive INCOIS tsunami alerts',
      'Comprehensive first aid kit for injuries during evacuation',
      'Waterproof document bag with Aadhaar, passport and insurance papers',
      'Emergency whistle to signal for help if separated from your group',
    ],
  },
]

const TABS = ['Before', 'During', 'After', 'Kit']
const TAB_COLORS = { Before:'#6366f1', During:'#ef4444', After:'#10b981', Kit:'#f59e0b' }
const TAB_ICONS  = { Before:'📋', During:'🚨', After:'✅', Kit:'🎒' }

// ── Write guide-view to localStorage and notify Dashboard ──
function trackGuideView(guideName, guideIcon, refreshDashboard) {
  try {
    const existing = JSON.parse(localStorage.getItem('viewedGuides') || '[]')
    if (!existing.includes(guideName)) {
      const updated = [...existing, guideName]
      localStorage.setItem('viewedGuides', JSON.stringify(updated))
    }
    // Always log to activity feed
    const activity = JSON.parse(localStorage.getItem('dr_activity') || '[]')
    const timeStr  = new Date().toLocaleDateString('en-IN', {
      day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit',
    })
    const entry = {
      title: 'Read Guide: ' + guideIcon + ' ' + guideName,
      type:  'guide',
      time:  timeStr,
    }
    // Don't duplicate the same guide within 1 minute
    const alreadyLogged = activity.length > 0 &&
      activity[0].title === entry.title &&
      activity[0].time  === entry.time
    if (!alreadyLogged) {
      localStorage.setItem('dr_activity', JSON.stringify([entry, ...activity].slice(0, 30)))
      refreshDashboard()
    }
  } catch { /* storage unavailable */ }
}

export default function EmergencyGuide() {
  const { refreshDashboard } = useAuth()
  const [selected,  setSelected]  = useState(GUIDES[0])
  const [activeTab, setActiveTab] = useState('Before')
  const [viewedIds, setViewedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('viewedGuides') || '[]')) }
    catch { return new Set() }
  })

  // ── Track when a guide is viewed ──────────────────────
  useEffect(() => {
    trackGuideView(selected.name, selected.icon, refreshDashboard)
    setViewedIds(prev => {
      const next = new Set(prev)
      next.add(selected.name)
      return next
    })
  }, [selected.id])  // re-runs every time user switches scenario

  const tabData = {
    Before: selected.before,
    During: selected.during,
    After:  selected.after,
    Kit:    selected.kit,
  }

  return (
    <div className="page-wrapper">

      {/* ── Header ──────────────────────────────────── */}
      <section style={{ padding:'56px 0 36px', position:'relative', overflow:'hidden' }}>
        <div className="orb orb-amber  animate-float" style={{ width:350, height:350, top:-150, right:-80,  opacity:0.08 }} />
        <div className="orb orb-purple animate-float" style={{ width:300, height:300, bottom:-100, left:-80, opacity:0.07, animationDelay:'3s' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:8, padding:'5px 16px',
              borderRadius:999, background:'rgba(245,158,11,0.15)',
              border:'1px solid rgba(245,158,11,0.3)', color:'#fbbf24',
              fontSize:'0.8rem', fontWeight:600, marginBottom:20,
            }}>
              📋 Quick Reference Guides
            </span>
            <h1 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:900, marginBottom:14 }}>
              Emergency <span className="gradient-text">Action Guides</span>
            </h1>
            <p style={{ color:'var(--text-muted)', maxWidth:520, lineHeight:1.7 }}>
              Step-by-step checklists for every disaster. Every guide you read is tracked in your dashboard.
            </p>
            {/* Progress */}
            <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:20, flexWrap:'wrap' }}>
              <div style={{ flex:1, maxWidth:280 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Guides Read</span>
                  <span style={{ fontSize:'0.78rem', fontWeight:700, color:'#f59e0b' }}>{viewedIds.size}/{GUIDES.length}</span>
                </div>
                <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' }}>
                  <motion.div
                    initial={{ width:0 }}
                    animate={{ width:`${(viewedIds.size/GUIDES.length)*100}%` }}
                    transition={{ duration:1, ease:'easeOut' }}
                    style={{ height:'100%', background:'linear-gradient(90deg,#f59e0b,#ef4444)', borderRadius:3 }}
                  />
                </div>
              </div>
              <span className="badge badge-warning">{Math.round((viewedIds.size/GUIDES.length)*100)}% Complete</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────── */}
      <section style={{ padding:'0 0 80px' }}>
        <div className="container">
          <div style={{
            display:'grid',
            gridTemplateColumns:'clamp(200px,22%,260px) 1fr',
            gap:24,
          }}>

            {/* ── Sidebar ───────────────────────────── */}
            <div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, position:'sticky', top:88 }}>
                {GUIDES.map(guide => (
                  <motion.button key={guide.id}
                    onClick={() => { setSelected(guide); setActiveTab('Before') }}
                    whileHover={{ x:4 }}
                    style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'13px 16px', borderRadius:'var(--radius)',
                      background: selected.id===guide.id ? `${guide.color}15` : 'rgba(255,255,255,0.03)',
                      border:`1px solid ${selected.id===guide.id ? guide.color+'55' : 'var(--border)'}`,
                      cursor:'pointer', transition:'all 0.2s', textAlign:'left',
                      color: selected.id===guide.id ? guide.color : 'var(--text-muted)',
                      fontFamily:'var(--font)', fontWeight:600, fontSize:'0.88rem',
                    }}
                  >
                    <span style={{ fontSize:'1.3rem' }}>{guide.icon}</span>
                    <span style={{ flex:1 }}>{guide.name}</span>
                    {viewedIds.has(guide.name) && (
                      <span style={{ fontSize:'0.65rem', color:'#34d399', fontWeight:700 }}>✓</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ── Guide content ─────────────────────── */}
            <AnimatePresence mode="wait">
              <motion.div key={selected.id}
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }} transition={{ duration:0.28 }}
              >
                {/* Guide header card */}
                <div className="glass" style={{ padding:'24px 28px', marginBottom:20, borderTop:`3px solid ${selected.color}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18, flexWrap:'wrap' }}>
                    <span style={{ fontSize:'2.8rem' }}>{selected.icon}</span>
                    <div style={{ flex:1 }}>
                      <h2 style={{ fontSize:'clamp(1.2rem,3vw,1.5rem)', fontWeight:900, color:selected.color, marginBottom:3 }}>
                        {selected.name} Emergency Guide
                      </h2>
                      <p style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>
                        Before • During • After • Kit — complete action checklist
                      </p>
                    </div>
                    <Link to={`/quiz/${selected.scenarioId}`} className="btn btn-primary btn-sm">
                      🎯 Test Knowledge
                    </Link>
                  </div>

                  {/* Tabs */}
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {TABS.map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding:'7px 16px', borderRadius:'var(--radius-sm)',
                        border:`1px solid ${activeTab===tab ? TAB_COLORS[tab]+'88' : 'var(--border)'}`,
                        background: activeTab===tab ? `${TAB_COLORS[tab]}18` : 'transparent',
                        color: activeTab===tab ? TAB_COLORS[tab] : 'var(--text-muted)',
                        cursor:'pointer', fontFamily:'var(--font)', fontWeight:600, fontSize:'0.83rem',
                        transition:'all 0.2s', display:'flex', alignItems:'center', gap:5,
                      }}>
                        {TAB_ICONS[tab]} {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab checklist */}
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab}
                    initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-14 }} transition={{ duration:0.22 }}
                    className="glass" style={{ padding:'24px 28px', marginBottom:20 }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                      <span style={{ fontSize:'1.4rem' }}>{TAB_ICONS[activeTab]}</span>
                      <h3 style={{ fontSize:'1rem', fontWeight:800, color:TAB_COLORS[activeTab] }}>
                        {activeTab === 'Kit' ? 'Emergency Kit Checklist' : activeTab + ' the ' + selected.name}
                      </h3>
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {tabData[activeTab].map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity:0, x:-14 }}
                          animate={{ opacity:1, x:0 }}
                          transition={{ delay:i * 0.055, duration:0.28 }}
                          style={{
                            display:'flex', alignItems:'flex-start', gap:12,
                            padding:'13px 16px', borderRadius:'var(--radius-sm)',
                            background:`${TAB_COLORS[activeTab]}08`,
                            border:`1px solid ${TAB_COLORS[activeTab]}1e`,
                          }}
                        >
                          <div style={{
                            width:26, height:26, borderRadius:'50%', flexShrink:0,
                            background:`${TAB_COLORS[activeTab]}1a`,
                            border:`1px solid ${TAB_COLORS[activeTab]}44`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'0.72rem', fontWeight:800, color:TAB_COLORS[activeTab],
                          }}>
                            {i + 1}
                          </div>
                          <p style={{ fontSize:'0.875rem', lineHeight:1.65, color:'var(--text)', flex:1, margin:0 }}>
                            {item}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Emergency numbers */}
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(auto-fill, minmax(170px,1fr))',
                  gap:10,
                }}>
                  {[
                    { label:'Emergency',        number:'112',  color:'#ef4444', icon:'🚨' },
                    { label:'Fire Service',      number:'101',  color:'#f59e0b', icon:'🔥' },
                    { label:'Disaster Helpline', number:'1078', color:'#6366f1', icon:'🛡️' },
                    { label:'Ambulance',         number:'108',  color:'#10b981', icon:'🏥' },
                  ].map(item => (
                    <div key={item.number} style={{
                      padding:'12px 14px', borderRadius:'var(--radius-sm)',
                      background:`${item.color}0e`, border:`1px solid ${item.color}28`,
                      display:'flex', alignItems:'center', gap:10,
                    }}>
                      <span style={{ fontSize:'1.2rem' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize:'1.05rem', fontWeight:900, color:item.color }}>{item.number}</div>
                        <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Responsive: single column on mobile */}
          <style>{`
            @media (max-width: 768px) {
              .container > div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </section>
    </div>
  )
}
