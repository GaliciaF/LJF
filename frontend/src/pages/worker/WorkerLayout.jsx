import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'

const nav = [
  { to:'dashboard',     icon:'🏠', label:'Dashboard' },
  { to:'profile',       icon:'👷', label:'My Profile' },
  { to:'schedule',      icon:'📅', label:'My Schedule' },
  { to:'salary',        icon:'💰', label:'Salary & Rate' },
  { to:'browse-job',    icon:'🗺️', label:'Browse Jobs' },
  { to:'applications',  icon:'✉️', label:'My Applications' },
  { to:'messages',      icon:'💬', label:'Messages' },
  { to:'notifications', icon:'🔔', label:'Notifications' },
  { to:'reviews',       icon:'⭐', label:'Rate & Review' },
  { to:'report',        icon:'🚨', label:'Report User' },
  { to:'security',      icon:'🔒', label:'Security & Privacy' },
]

// Bottom nav shows only the most important 5 items on mobile
const mobileNav = [
  { to:'dashboard',    icon:'🏠', label:'Home' },
  { to:'browse-job',   icon:'🗺️', label:'Jobs' },
  { to:'applications', icon:'✉️', label:'Applied' },
  { to:'messages',     icon:'💬', label:'Messages' },
  { to:'notifications',icon:'🔔', label:'Alerts' },
]

const c = {
  primary:    '#16a34a',
  bg:         '#f6faf7',
  surface:    '#eaf4ec',
  border:     '#d4e5d7',
  text:       '#0f172a',
  muted:      '#64748b',
  activeText: '#166534',
  activeBg:   'linear-gradient(90deg,#dcfce7,#bbf7d0)',
  headerGrad: 'linear-gradient(135deg,#16a34a,#14532d)',
  topbarBg:   'rgba(246,250,247,.95)',
}

function Avatar({ photo, name, size = 34, borderColor = 'rgba(255,255,255,.4)' }) {
  const [failed, setFailed] = useState(false)
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'WK'
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:c.headerGrad, border:`2px solid ${borderColor}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*.36, fontWeight:700, color:'#fff', overflow:'hidden', flexShrink:0 }}>
      {photo && !failed
        ? <img src={photo} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={() => setFailed(true)} />
        : initials
      }
    </div>
  )
}

export default function WorkerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed,    setCollapsed]    = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [isMobile,     setIsMobile]     = useState(window.innerWidth < 768)
  const [unreadCount,  setUnreadCount]  = useState(0)

  // Detect screen size
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    api.get('/worker/notifications')
      .then(res => {
        const notifs = res.data.data ?? res.data
        setUnreadCount(notifs.filter(n => !n.read_at).length)
      }).catch(() => {})
  }, [])

  const handleLogout = async () => { await logout(); navigate('/login') }

  const SIDEBAR_W  = collapsed ? '68px' : '260px'
  const CONTENT_ML = collapsed ? '68px' : '260px'

  // ── MOBILE LAYOUT ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:c.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        {/* Mobile Top Bar */}
        <div style={{ position:'sticky', top:0, zIndex:200, height:'56px', background:c.topbarBg, backdropFilter:'blur(14px)', borderBottom:`1px solid ${c.border}`, display:'flex', alignItems:'center', padding:'0 16px', gap:'10px' }}>
          <button onClick={() => setMobileOpen(true)}
            style={{ width:'36px', height:'36px', borderRadius:'10px', background:'transparent', border:`1.5px solid ${c.border}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px', flexShrink:0 }}>
            <span style={{ width:'16px', height:'2px', background:c.muted, borderRadius:'2px', display:'block' }} />
            <span style={{ width:'10px', height:'2px', background:c.muted, borderRadius:'2px', display:'block' }} />
            <span style={{ width:'16px', height:'2px', background:c.muted, borderRadius:'2px', display:'block' }} />
          </button>
          <span style={{ fontFamily:'Syne,sans-serif', fontSize:'16px', fontWeight:800, color:c.text, flex:1 }}>Worker Portal</span>
          <div style={{ position:'relative' }}>
            <Avatar photo={user?.photo} name={user?.name} size={32} borderColor={c.border} />
            {unreadCount > 0 && (
              <span style={{ position:'absolute', top:'-2px', right:'-2px', width:'10px', height:'10px', borderRadius:'50%', background:'#ef4444', border:'2px solid #fff' }} />
            )}
          </div>
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileOpen && (
          <div style={{ position:'fixed', inset:0, zIndex:300 }}>
            {/* Backdrop */}
            <div onClick={() => setMobileOpen(false)}
              style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.4)' }} />
            {/* Drawer */}
            <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'280px', background:c.surface, display:'flex', flexDirection:'column', boxShadow:'4px 0 24px rgba(0,0,0,.15)', overflowY:'auto' }}>
              {/* Drawer Header */}
              <div style={{ background:c.headerGrad, padding:'20px 18px', flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
                  <div style={{ width:'36px', height:'36px', background:'rgba(255,255,255,.2)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'16px', color:'#fff', border:'1.5px solid rgba(255,255,255,.3)' }}>L</div>
                  <div>
                    <div style={{ fontFamily:'Syne,sans-serif', fontSize:'15px', fontWeight:800, color:'#fff' }}>Local Job Finder</div>
                    <div style={{ fontSize:'9px', fontWeight:700, background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.3)', borderRadius:'20px', padding:'2px 8px', color:'#fff', letterSpacing:'.5px', textTransform:'uppercase', display:'inline-block' }}>👷 Worker</div>
                  </div>
                </div>
                <div style={{ background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', borderRadius:'12px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px' }}>
                  <Avatar photo={user?.photo} name={user?.name} size={34} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'13px', fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
                    <div style={{ fontSize:'10px', color:'rgba(255,255,255,.8)' }}>Worker Account</div>
                  </div>
                </div>
              </div>

              {/* Drawer Nav */}
              <div style={{ flex:1, padding:'10px' }}>
                {nav.map(item => (
                  <NavLink key={item.to} to={item.to}
                    onClick={() => { if (item.to === 'notifications') setUnreadCount(0) }}
                    style={({ isActive }) => ({
                      display:'flex', alignItems:'center', gap:'12px',
                      padding:'10px 14px', borderRadius:'12px', fontSize:'14px',
                      fontWeight:isActive ? 600 : 500, textDecoration:'none',
                      margin:'2px 0', color:isActive ? c.activeText : c.muted,
                      background:isActive ? c.activeBg : 'transparent',
                    })}>
                    <span style={{ fontSize:'18px', width:'22px', textAlign:'center' }}>{item.icon}</span>
                    <span style={{ flex:1 }}>{item.label}</span>
                    {item.to === 'notifications' && unreadCount > 0 && (
                      <span style={{ background:c.primary, color:'#fff', fontSize:'10px', fontWeight:700, borderRadius:'20px', padding:'2px 7px' }}>{unreadCount}</span>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Drawer Footer */}
              <div style={{ padding:'14px', borderTop:`1px solid ${c.border}`, flexShrink:0 }}>
                <button onClick={handleLogout} style={{ width:'100%', padding:'11px', background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'10px', color:'#ef4444', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>
                  ↩ Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div style={{ flex:1, paddingBottom:'70px' }}>
          <Outlet />
        </div>

        {/* Mobile Bottom Nav */}
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, background:'#fff', borderTop:`1px solid ${c.border}`, display:'flex', boxShadow:'0 -2px 12px rgba(0,0,0,.08)' }}>
          {mobileNav.map(item => (
            <NavLink key={item.to} to={item.to}
              onClick={() => { if (item.to === 'notifications') setUnreadCount(0) }}
              style={({ isActive }) => ({
                flex:1, display:'flex', flexDirection:'column', alignItems:'center',
                justifyContent:'center', padding:'8px 4px', textDecoration:'none',
                color:isActive ? c.primary : c.muted,
                borderTop:isActive ? `2px solid ${c.primary}` : '2px solid transparent',
                background:isActive ? 'rgba(22,163,74,.04)' : 'transparent',
                position:'relative',
              })}>
              <span style={{ fontSize:'20px', lineHeight:1, marginBottom:'3px' }}>{item.icon}</span>
              <span style={{ fontSize:'10px', fontWeight:600 }}>{item.label}</span>
              {item.to === 'notifications' && unreadCount > 0 && (
                <span style={{ position:'absolute', top:'6px', right:'calc(50% - 18px)', background:'#ef4444', color:'#fff', fontSize:'9px', fontWeight:700, borderRadius:'20px', padding:'1px 5px', minWidth:'16px', textAlign:'center' }}>{unreadCount}</span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    )
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:c.bg, color:c.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Sidebar */}
      <nav style={{ position:'fixed', top:0, left:0, bottom:0, width:SIDEBAR_W, background:c.surface, borderRight:`1px solid ${c.border}`, display:'flex', flexDirection:'column', zIndex:200, boxShadow:'4px 0 20px rgba(0,0,0,.04)', transition:'width .25s ease', overflow:'hidden' }}>

        <div style={{ background:c.headerGrad, padding:collapsed?'16px 0':'22px 18px', position:'relative', overflow:'hidden', transition:'padding .25s', flexShrink:0 }}>
          <div style={{ position:'absolute', right:'-30px', top:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,.08)' }} />
          {collapsed ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', position:'relative', zIndex:1 }}>
              <Avatar photo={user?.photo} name={user?.name} size={34} />
            </div>
          ) : (
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                <div style={{ width:'38px', height:'38px', background:'rgba(255,255,255,.2)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'16px', color:'#fff', border:'1.5px solid rgba(255,255,255,.3)', flexShrink:0 }}>L</div>
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:'17px', fontWeight:800, color:'#fff', whiteSpace:'nowrap' }}>Local Job Finder</div>
                  <div style={{ fontSize:'9px', fontWeight:700, background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.3)', borderRadius:'20px', padding:'2px 8px', color:'#fff', letterSpacing:'.6px', textTransform:'uppercase', display:'inline-block' }}>👷 Worker</div>
                </div>
              </div>
              <div style={{ background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', borderRadius:'14px', padding:'12px', display:'flex', alignItems:'center', gap:'12px' }}>
                <Avatar photo={user?.photo} name={user?.name} size={36} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
                  <div style={{ fontSize:'10px', color:'rgba(255,255,255,.8)' }}>Worker Account</div>
                </div>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#86efac', flexShrink:0 }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:collapsed?'10px 6px':'12px' }}>
          {nav.map(item => (
            <NavLink key={item.to} to={item.to}
              title={collapsed ? item.label : undefined}
              onClick={() => { if (item.to === 'notifications') setUnreadCount(0) }}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:'12px',
                padding:collapsed?'10px 0':'9px 14px',
                justifyContent:collapsed?'center':'flex-start',
                borderRadius:'12px', fontSize:'13px',
                fontWeight:isActive?600:500, textDecoration:'none',
                margin:'3px 0', transition:'all .2s ease',
                color:isActive?c.activeText:c.muted,
                background:isActive?c.activeBg:'transparent',
                borderRight:isActive&&!collapsed?`3px solid ${c.primary}`:'3px solid transparent',
              })}>
              <span style={{ fontSize:'17px', width:'20px', textAlign:'center', flexShrink:0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  {item.label}
                  {item.to === 'notifications' && unreadCount > 0 && (
                    <span style={{ background:c.primary, color:'#fff', fontSize:'9px', fontWeight:700, borderRadius:'20px', padding:'2px 7px', marginLeft:'4px' }}>{unreadCount}</span>
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div style={{ padding:collapsed?'10px 6px':'14px', borderTop:`1px solid ${c.border}`, flexShrink:0 }}>
          {collapsed ? (
            <div style={{ display:'flex', justifyContent:'center' }}>
              <button onClick={handleLogout} title="Sign out" style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'10px', width:'40px', height:'40px', color:'#ef4444', cursor:'pointer', fontSize:'16px' }}>↩</button>
            </div>
          ) : (
            <div style={{ background:'#dcfce7', borderRadius:'14px', padding:'12px', display:'flex', alignItems:'center', gap:'12px' }}>
              <Avatar photo={user?.photo} name={user?.name} size={34} borderColor={c.border} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'13px', fontWeight:600, color:c.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize:'10px', color:c.muted }}>Worker</div>
              </div>
              <button onClick={handleLogout} style={{ background:'none', border:'none', fontSize:'11px', fontWeight:700, color:'#ef4444', cursor:'pointer', whiteSpace:'nowrap' }}>Sign out</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div style={{ marginLeft:CONTENT_ML, flex:1, display:'flex', flexDirection:'column', transition:'margin-left .25s ease' }}>
        <div style={{ position:'sticky', top:0, zIndex:100, height:'64px', background:c.topbarBg, backdropFilter:'blur(14px)', borderBottom:`1px solid ${c.border}`, display:'flex', alignItems:'center', padding:'0 24px', gap:'12px' }}>
          <button onClick={() => setCollapsed(v => !v)}
            style={{ width:'36px', height:'36px', borderRadius:'10px', background:'transparent', border:`1.5px solid ${c.border}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px', flexShrink:0, transition:'all .2s' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <span style={{ display:'block', width:'16px', height:'2px', background:c.muted, borderRadius:'2px' }} />
            <span style={{ display:'block', width:'10px', height:'2px', background:c.muted, borderRadius:'2px' }} />
            <span style={{ display:'block', width:'16px', height:'2px', background:c.muted, borderRadius:'2px' }} />
          </button>
          <span style={{ fontFamily:'Syne,sans-serif', fontSize:'18px', fontWeight:800, color:c.text, flex:1 }}>Worker Portal</span>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <Avatar photo={user?.photo} name={user?.name} size={34} borderColor={c.border} />
            <span style={{ fontSize:'13px', fontWeight:600, color:c.text }}>{user?.name}</span>
          </div>
        </div>
        <div style={{ flex:1 }}><Outlet /></div>
      </div>
    </div>
  )
}