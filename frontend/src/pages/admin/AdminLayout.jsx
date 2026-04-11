import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'

const nav = [
  { to: 'dashboard',  icon: '⌂',  label: 'Dashboard' },
  { to: 'users',      icon: '👥', label: 'All Users' },
  { to: 'suspended',  icon: '🚫', label: 'Suspended Users' },
  { to: 'jobs',       icon: '📋', label: 'All Jobs' },
  { to: 'categories', icon: '🗂️', label: 'Service Categories' },
  { to: 'reports',    icon: '🚨', label: 'Flagged Reports' },
  { to: 'disputes',   icon: '⚖️', label: 'Handle Disputes' },
  { to: 'analytics',  icon: '📊', label: 'Full Analytics' },
  { to: 'security',   icon: '🔐', label: 'Security Controls' },
  { to: 'settings',   icon: '⚙️', label: 'System Settings' },
]

const mobileNav = [
  { to: 'dashboard',     icon: '⌂',  label: 'Home' },
  { to: 'users',         icon: '👥', label: 'Users' },
  { to: 'jobs',          icon: '📋', label: 'Jobs' },
  { to: 'reports',       icon: '🚨', label: 'Reports' },
  { to: 'notifications', icon: '🔔', label: 'Alerts' },
]

// ── Design tokens ──────────────────────────────────────────────────────────
const c = {
  sidebarBg:    '#5b3fd4',
  sidebarHover: 'rgba(255,255,255,0.12)',
  sidebarActive:'rgba(255,255,255,1)',
  bg:           '#f7f5ff',
  surface:      '#ffffff',
  border:       '#ede8fb',
  text:         '#2d2660',
  muted:        '#9089c4',
  primary:      '#7c3aed',
  primaryLight: '#f0ebff',
  danger:       '#c0374a',
  dangerLight:  '#fde8ea',
  topbarBg:     'rgba(255,255,255,0.95)',
}

// ── JobFinder Logo Icon ────────────────────────────────────────────────────
function JobFinderLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="adminLogoGrad" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(196,181,253,0.95)" />
        </linearGradient>
      </defs>
      {/* Briefcase body */}
      <rect x="8" y="22" width="56" height="42" rx="8" fill="none" stroke="url(#adminLogoGrad)" strokeWidth="4" />
      {/* Briefcase handle */}
      <path d="M26 22v-5a4 4 0 014-4h12a4 4 0 014 4v5" stroke="url(#adminLogoGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Magnifying glass circle */}
      <circle cx="36" cy="44" r="10" fill="none" stroke="url(#adminLogoGrad)" strokeWidth="3.5" />
      {/* Magnifying glass handle */}
      <line x1="43" y1="51" x2="52" y2="60" stroke="url(#adminLogoGrad)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ photo, name, size = 32 }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AD'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #b48ee8, #7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: '#fff',
      overflow: 'hidden', flexShrink: 0,
    }}>
      {photo
        ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
        : initials}
    </div>
  )
}

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ count, collapsed }) {
  if (!count) return null
  if (collapsed) {
    return (
      <span style={{
        position: 'absolute', top: 6, right: 6,
        width: 8, height: 8, borderRadius: '50%',
        background: '#ff6b6b', border: '1.5px solid #5b3fd4',
      }} />
    )
  }
  return (
    <span style={{
      background: c.dangerLight, color: c.danger,
      fontSize: 10, fontWeight: 700,
      borderRadius: 20, padding: '2px 7px',
      minWidth: 18, textAlign: 'center',
    }}>
      {count}
    </span>
  )
}

// ── Sidebar Nav Item ───────────────────────────────────────────────────────
function SideNavItem({ item, collapsed, badge, onClick }) {
  return (
    <div style={{ position: 'relative' }}>
      <NavLink
        to={item.to}
        title={collapsed ? item.label : undefined}
        onClick={onClick}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : 10,
          padding: collapsed ? '11px 0' : '9px 12px',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: isActive ? 600 : 500,
          textDecoration: 'none',
          margin: '2px 0',
          color: isActive ? c.sidebarBg : 'rgba(255,255,255,0.6)',
          background: isActive ? '#fff' : 'transparent',
          transition: 'all 0.15s ease',
          cursor: 'pointer',
        })}
      >
        {({ isActive }) => (
          <>
            <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0, lineHeight: 1 }}>
              {item.icon}
            </span>
            {!collapsed && (
              <>
                <span style={{ flex: 1, whiteSpace: 'nowrap', color: isActive ? c.sidebarBg : 'rgba(255,255,255,0.75)' }}>
                  {item.label}
                </span>
                <Badge count={badge} collapsed={false} />
              </>
            )}
            {collapsed && <Badge count={badge} collapsed />}
          </>
        )}
      </NavLink>
    </div>
  )
}

// ── Main Layout ────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed,      setCollapsed]      = useState(true)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [isMobile,       setIsMobile]       = useState(window.innerWidth < 768)
  const [unreadCount,    setUnreadCount]    = useState(0)
  const [pendingReports, setPendingReports] = useState(0)

  useEffect(() => {
    const handle = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setMobileOpen(false)
    }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    api.get('/admin/notifications')
      .then(res => {
        const notifs = res.data.data ?? res.data
        setUnreadCount(notifs.filter(n => !n.read_at).length)
      }).catch(() => {})

    api.get('/admin/reports', { params: { status: 'pending' } })
      .then(res => {
        const reports = res.data.data ?? res.data
        setPendingReports(reports.length)
      }).catch(() => {})
  }, [])

  const handleLogout = async () => { await logout(); navigate('/login') }

  const SIDEBAR_W  = collapsed ? '64px' : '220px'
  const CONTENT_ML = collapsed ? '64px' : '220px'

  // ── MOBILE LAYOUT ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', minHeight: '100vh',
        background: c.bg, color: c.text,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}>
        {/* Mobile Top Bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 200, height: 56,
          background: c.topbarBg, backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center',
          padding: '0 14px', gap: 10,
          boxShadow: '0 1px 8px rgba(91,63,212,0.08)',
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'transparent', border: `1px solid ${c.border}`,
              cursor: 'pointer', display: 'flex',
              flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4, flexShrink: 0,
            }}
          >
            <span style={{ width: 16, height: 2, background: c.muted, borderRadius: 2, display: 'block' }} />
            <span style={{ width: 10, height: 2, background: c.muted, borderRadius: 2, display: 'block' }} />
            <span style={{ width: 16, height: 2, background: c.muted, borderRadius: 2, display: 'block' }} />
          </button>

          {/* Logo in mobile topbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="24" height="24" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mobileLogoGrad" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <rect x="8" y="22" width="56" height="42" rx="8" fill="none" stroke="url(#mobileLogoGrad)" strokeWidth="4" />
              <path d="M26 22v-5a4 4 0 014-4h12a4 4 0 014 4v5" stroke="url(#mobileLogoGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="36" cy="44" r="10" fill="none" stroke="url(#mobileLogoGrad)" strokeWidth="3.5" />
              <line x1="43" y1="51" x2="52" y2="60" stroke="url(#mobileLogoGrad)" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          <span style={{ fontWeight: 700, fontSize: 15, color: c.text, flex: 1 }}>
            Admin Portal
          </span>

          <NavLink
            to="notifications"
            onClick={() => setUnreadCount(0)}
            style={{ position: 'relative', color: c.muted, textDecoration: 'none', fontSize: 18, lineHeight: 1 }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 8, height: 8, borderRadius: '50%',
                background: '#ff6b6b', border: `1.5px solid ${c.bg}`,
              }} />
            )}
          </NavLink>
          <Avatar photo={user?.photo} name={user?.name} size={30} />
        </div>

        {/* Drawer Overlay */}
        {mobileOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
            <div
              onClick={() => setMobileOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(45,38,96,0.4)', backdropFilter: 'blur(2px)' }}
            />
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: 'min(280px, 80vw)',
              background: '#fff',
              display: 'flex', flexDirection: 'column',
              boxShadow: '8px 0 32px rgba(91,63,212,0.18)',
              overflowY: 'auto',
            }}>
              {/* Drawer Header */}
              <div style={{
                background: c.sidebarBg,
                padding: '20px 16px', flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  {/* Logo + name */}
                  <JobFinderLogo size={32} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>JobFinder</div>
                    <div style={{
                      fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '.5px',
                      background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)',
                      borderRadius: 20, padding: '2px 8px', display: 'inline-block', marginTop: 2,
                    }}>
                      🔐 ADMIN
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    style={{
                      marginLeft: 'auto', background: 'rgba(255,255,255,0.15)',
                      border: 'none', borderRadius: 8, width: 28, height: 28,
                      color: '#fff', cursor: 'pointer', fontSize: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 10, padding: '10px 12px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <Avatar photo={user?.photo} name={user?.name} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>Administrator</div>
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#c4b5fd' }} />
                </div>
              </div>

              {/* Drawer Nav */}
              <div style={{ flex: 1, padding: '10px', overflowY: 'auto', background: '#fff' }}>
                {nav.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => { setMobileOpen(false); if (item.to === 'notifications') setUnreadCount(0) }}
                    style={({ isActive }) => ({
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '9px 12px', borderRadius: 9, fontSize: 13,
                      fontWeight: isActive ? 600 : 500, textDecoration: 'none',
                      margin: '2px 0', cursor: 'pointer',
                      color: isActive ? c.primary : c.muted,
                      background: isActive ? c.primaryLight : 'transparent',
                      borderLeft: isActive ? `3px solid ${c.primary}` : '3px solid transparent',
                    })}
                  >
                    <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.to === 'reports' && pendingReports > 0 && (
                      <span style={{ background: c.dangerLight, color: c.danger, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '2px 7px' }}>
                        {pendingReports}
                      </span>
                    )}
                    {item.to === 'notifications' && unreadCount > 0 && (
                      <span style={{ background: c.dangerLight, color: c.danger, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '2px 7px' }}>
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Drawer Footer */}
              <div style={{ padding: '12px', borderTop: `1px solid ${c.border}`, flexShrink: 0 }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '10px',
                    background: 'rgba(192,55,74,0.07)',
                    border: `1px solid rgba(192,55,74,0.18)`,
                    borderRadius: 9, color: c.danger,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  ↩ Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div style={{ flex: 1, paddingBottom: 68 }}>
          <Outlet />
        </div>

        {/* Mobile Bottom Nav */}
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
          height: 60, background: '#fff',
          borderTop: `1px solid ${c.border}`,
          display: 'flex', backdropFilter: 'blur(14px)',
          boxShadow: '0 -2px 16px rgba(91,63,212,0.08)',
        }}>
          {mobileNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => { if (item.to === 'notifications') setUnreadCount(0) }}
              style={({ isActive }) => ({
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '6px 2px', textDecoration: 'none',
                color: isActive ? c.primary : c.muted,
                borderTop: isActive ? `2px solid ${c.primary}` : '2px solid transparent',
                background: isActive ? c.primaryLight : 'transparent',
                position: 'relative',
              })}
            >
              <span style={{ fontSize: 19, lineHeight: 1, marginBottom: 3 }}>{item.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap' }}>{item.label}</span>
              {item.to === 'notifications' && unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 5, right: 'calc(50% - 16px)',
                  background: '#ff6b6b', color: '#fff',
                  fontSize: 9, fontWeight: 700, borderRadius: 20,
                  padding: '1px 4px', minWidth: 14, textAlign: 'center',
                }}>
                  {unreadCount}
                </span>
              )}
              {item.to === 'reports' && pendingReports > 0 && (
                <span style={{
                  position: 'absolute', top: 5, right: 'calc(50% - 16px)',
                  background: '#ff6b6b', color: '#fff',
                  fontSize: 9, fontWeight: 700, borderRadius: 20,
                  padding: '1px 4px', minWidth: 14, textAlign: 'center',
                }}>
                  {pendingReports}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    )
  }

  // ── DESKTOP LAYOUT ───────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: c.bg, color: c.text,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Sidebar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: SIDEBAR_W,
        background: c.sidebarBg,
        display: 'flex', flexDirection: 'column',
        zIndex: 200,
        transition: 'width 0.22s ease',
        overflow: 'hidden',
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: collapsed ? '16px 0' : '18px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
          transition: 'padding 0.22s',
        }}>
          {collapsed ? (
            /* Collapsed: show only the logo icon centered */
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <JobFinderLogo size={34} />
            </div>
          ) : (
            /* Expanded: logo icon + "JobFinder" text + ADMIN badge */
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <JobFinderLogo size={34} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
                  LocalJobFinder
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '.5px',
                  background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)',
                  borderRadius: 20, padding: '2px 8px', display: 'inline-block', marginTop: 2,
                }}>
                  🔐 ADMIN
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Card (expanded only) */}
        {!collapsed && (
          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 10, padding: '9px 11px',
              display: 'flex', alignItems: 'center', gap: 9,
            }}>
              <Avatar photo={user?.photo} name={user?.name} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Administrator</div>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#c4b5fd', flexShrink: 0 }} />
            </div>
          </div>
        )}

        {/* Nav Items */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: collapsed ? '10px 8px' : '10px 12px',
        }}>
          {nav.map(item => (
            <SideNavItem
              key={item.to}
              item={item}
              collapsed={collapsed}
              badge={
                item.to === 'reports' ? pendingReports :
                item.to === 'notifications' ? unreadCount : 0
              }
              onClick={() => { if (item.to === 'notifications') setUnreadCount(0) }}
            />
          ))}
        </div>

        {/* Sidebar Footer */}
        <div style={{
          padding: collapsed ? '10px 8px' : '12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
        }}>
          {collapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <button
                onClick={handleLogout}
                title="Sign out"
                style={{
                  background: 'rgba(255,107,107,0.15)',
                  border: '1px solid rgba(255,107,107,0.25)',
                  borderRadius: 9, width: 40, height: 40,
                  color: '#ffb3b3', cursor: 'pointer',
                  fontSize: 16, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                ↩
              </button>
              <Avatar photo={user?.photo} name={user?.name} size={30} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10, padding: '9px 11px',
                display: 'flex', alignItems: 'center', gap: 9,
              }}>
                <Avatar photo={user?.photo} name={user?.name} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Administrator</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '9px',
                  background: 'rgba(255,107,107,0.12)',
                  border: '1px solid rgba(255,107,107,0.22)',
                  borderRadius: 9, color: '#ffb3b3',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
              >
                ↩ Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Area */}
      <div style={{
        marginLeft: CONTENT_ML, flex: 1,
        display: 'flex', flexDirection: 'column',
        transition: 'margin-left 0.22s ease',
        minWidth: 0,
      }}>
        {/* Topbar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          height: 56, background: c.topbarBg,
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center',
          padding: '0 20px', gap: 12,
          boxShadow: '0 1px 8px rgba(91,63,212,0.07)',
        }}>
          {/* Hamburger Toggle */}
          <button
            onClick={() => setCollapsed(v => !v)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'transparent', border: `1px solid ${c.border}`,
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4, flexShrink: 0,
            }}
          >
            <span style={{ display: 'block', width: 16, height: 2, background: c.muted, borderRadius: 2 }} />
            <span style={{ display: 'block', width: 10, height: 2, background: c.muted, borderRadius: 2 }} />
            <span style={{ display: 'block', width: 16, height: 2, background: c.muted, borderRadius: 2 }} />
          </button>

          <span style={{ fontWeight: 700, fontSize: 15, color: c.text, flex: 1 }}>
            Admin Portal
          </span>

          {/* Notification Bell */}
          <NavLink
            to="notifications"
            onClick={() => setUnreadCount(0)}
            style={{ position: 'relative', textDecoration: 'none', fontSize: 18, lineHeight: 1, color: c.muted }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 8, height: 8, borderRadius: '50%',
                background: '#ff6b6b', border: `1.5px solid #fff`,
              }} />
            )}
          </NavLink>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar photo={user?.photo} name={user?.name} size={32} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: c.text, lineHeight: 1.3 }}>{user?.name}</div>
              <div style={{ fontSize: 10, color: c.muted }}>Administrator</div>
            </div>
          </div>
        </div>

        {/* Outlet */}
        <div style={{ flex: 1, background: c.bg }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}