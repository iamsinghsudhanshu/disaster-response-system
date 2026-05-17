import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [dropOpen,  setDropOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setDropOpen(false) }, [location])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLinks = [
    { to: '/',          label: 'Home',                locked: false },
    { to: '/scenarios', label: 'Scenarios',           locked: false },
    { to: '/learn',     label: '🎬 Videos',           locked: !user },
    { to: '/guide',     label: '📋 Guide',            locked: !user },
    ...(user        ? [{ to: '/dashboard', label: 'Dashboard', locked: false }] : []),
    ...(isAdmin()   ? [{ to: '/admin',     label: '⚙️ Admin',  locked: false }] : []),
  ]

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -80 }} animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">Disaster<span className="gradient-text">Ready</span></span>
        </Link>

        {/* Desktop links */}
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.locked ? '/login' : link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                title={link.locked ? 'Login required' : ''}
              >
                {link.label}{link.locked ? ' 🔒' : ''}
                {location.pathname === link.to && (
                  <motion.div className="nav-active-bar" layoutId="activeBar" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth */}
        <div className="nav-auth">
          {user ? (
            <div className="user-menu" onClick={() => setDropOpen(o => !o)}>
              <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user.name?.split(' ')[0]}</span>
              <span style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>▾</span>
              <AnimatePresence>
                {dropOpen && (
                  <motion.div className="dropdown"
                    initial={{ opacity:0, y:-10, scale:0.95 }}
                    animate={{ opacity:1, y:0,   scale:1 }}
                    exit={{   opacity:0, y:-10, scale:0.95 }}
                    transition={{ duration:0.15 }}
                  >
                    <div className="dropdown-header">
                      <div style={{ fontWeight:600 }}>{user.name}</div>
                      <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{user.email}</div>
                      <span className={`badge ${user.role==='ADMIN'?'badge-warning':'badge-primary'}`} style={{marginTop:4}}>
                        {user.role}
                      </span>
                    </div>
                    <Link to="/dashboard"  className="dropdown-item">📊 Dashboard</Link>
                    <Link to="/learn"      className="dropdown-item">🎬 Video Learning</Link>
                    <Link to="/guide"      className="dropdown-item">📋 Emergency Guide</Link>
                    {isAdmin() && <Link to="/admin" className="dropdown-item">⚙️ Admin Panel</Link>}
                    <button className="dropdown-item danger" onClick={handleLogout}>🚪 Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login"  className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary  btn-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span className={menuOpen ? 'bar open' : 'bar'} />
          <span className={menuOpen ? 'bar open mid' : 'bar mid'} />
          <span className={menuOpen ? 'bar open' : 'bar'} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu"
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{   opacity:0, height:0 }}
            transition={{ duration:0.25 }}
          >
            {navLinks.map(link => (
              <Link key={link.to}
                to={link.locked ? '/login' : link.to}
                className={`mobile-link ${location.pathname===link.to?'active':''}`}>
                {link.label}{link.locked ? ' 🔒' : ''}
              </Link>
            ))}
            <div className="mobile-divider" />
            {user ? (
              <>
                <div className="mobile-user">
                  <div className="user-avatar sm">{user.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{user.name}</div>
                    <span className={`badge ${user.role==='ADMIN'?'badge-warning':'badge-primary'}`}>{user.role}</span>
                  </div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={handleLogout} style={{margin:'8px 16px'}}>
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display:'flex', gap:8, padding:'8px 16px' }}>
                <Link to="/login"  className="btn btn-secondary btn-sm" style={{flex:1,justifyContent:'center'}}>Login</Link>
                <Link to="/signup" className="btn btn-primary  btn-sm" style={{flex:1,justifyContent:'center'}}>Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar{position:fixed;top:0;left:0;right:0;z-index:1000;transition:all 0.3s ease}
        .navbar-scrolled{background:rgba(10,10,26,0.9);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);box-shadow:0 4px 30px rgba(0,0,0,0.4)}
        .nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:72px;display:flex;align-items:center;gap:24px}
        .nav-logo{display:flex;align-items:center;gap:8px;text-decoration:none;font-size:1.2rem;font-weight:800;color:var(--text);letter-spacing:-0.03em}
        .logo-icon{font-size:1.5rem}
        .nav-links{display:flex;list-style:none;gap:2px;flex:1}
        .nav-link{position:relative;padding:6px 10px;border-radius:var(--radius-sm);text-decoration:none;color:var(--text-muted);font-size:0.88rem;font-weight:500;transition:var(--transition)}
        .nav-link:hover,.nav-link.active{color:var(--text)}
        .nav-active-bar{position:absolute;bottom:-2px;left:0;right:0;height:2px;background:var(--primary);border-radius:2px}
        .nav-auth{display:flex;align-items:center;gap:10px;margin-left:auto;flex-shrink:0}
        .user-menu{position:relative;display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 12px;border-radius:var(--radius);transition:var(--transition)}
        .user-menu:hover{background:rgba(255,255,255,0.06)}
        .user-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;color:white;flex-shrink:0}
        .user-avatar.sm{width:28px;height:28px;font-size:0.8rem}
        .user-name{font-size:0.88rem;font-weight:600}
        .dropdown{position:absolute;top:calc(100% + 8px);right:0;min-width:220px;background:rgba(15,15,35,0.97);border:1px solid var(--border);border-radius:var(--radius-lg);backdrop-filter:blur(20px);box-shadow:var(--shadow-lg);overflow:hidden;z-index:100}
        .dropdown-header{padding:14px 16px;border-bottom:1px solid var(--border)}
        .dropdown-item{display:flex;align-items:center;gap:10px;padding:11px 16px;text-decoration:none;color:var(--text-muted);font-size:0.88rem;transition:var(--transition);cursor:pointer;border:none;background:none;width:100%;text-align:left;font-family:var(--font)}
        .dropdown-item:hover{background:rgba(255,255,255,0.06);color:var(--text)}
        .dropdown-item.danger:hover{background:rgba(239,68,68,0.1);color:#f87171}
        .hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px;margin-left:auto}
        .bar{width:24px;height:2px;background:var(--text);border-radius:2px;transition:all 0.3s ease;display:block}
        .bar.open:first-child{transform:translateY(7px) rotate(45deg)}
        .bar.mid.open{opacity:0}
        .bar.open:last-child{transform:translateY(-7px) rotate(-45deg)}
        .mobile-menu{background:rgba(10,10,26,0.98);border-top:1px solid var(--border);backdrop-filter:blur(20px);overflow:hidden}
        .mobile-link{display:block;padding:14px 24px;text-decoration:none;color:var(--text-muted);font-size:0.95rem;font-weight:500;transition:var(--transition);border-bottom:1px solid rgba(255,255,255,0.04)}
        .mobile-link:hover,.mobile-link.active{color:var(--primary);background:rgba(99,102,241,0.06)}
        .mobile-divider{height:1px;background:var(--border);margin:8px 0}
        .mobile-user{display:flex;align-items:center;gap:12px;padding:12px 24px}
        @media (max-width:900px){.nav-links,.nav-auth{display:none}.hamburger{display:flex}}
      `}</style>
    </motion.nav>
  )
}
