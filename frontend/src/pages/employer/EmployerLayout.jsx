import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'

const nav = [
  { to:'dashboard',     icon:'🏠', label:'Dashboard' },
  { to:'profile',       icon:'👷', label:'Employer Profile' },
  { to:'create-job',    icon:'📢', label:'Post a Job' },
  { to:'jobs',          icon:'📋', label:'My Job Posts' },
  { to:'applicants',    icon:'👥', label:'Review Applicants' },
  { to:'workers',       icon:'🔍', label:'Browse Workers' },
  { to:'messages',      icon:'💬', label:'Messages' },
  { to:'notifications', icon:'🔔', label:'Notifications' },
  { to:'reviews',       icon:'⭐', label:'Rate Workers' },
  { to:'report',        icon:'🚨', label:'Report User' },
  { to:'security',      icon:'🔒', label:'Security & Privacy' },
]

const mobileNav = [
  { to:'dashboard',     icon:'🏠', label:'Home' },
  { to:'jobs',          icon:'📋', label:'My Jobs' },
  { to:'applicants',    icon:'👥', label:'Applicants' },
  { to:'messages',      icon:'💬', label:'Messages' },
  { to:'notifications', icon:'🔔', label:'Alerts' },
]

const c = {
  primary:    '#d97706',
  bg:         '#fffdf5',
  surface:    '#f5efe2',
  border:     '#e2d8c4',
  text:       '#111827',
  muted:      '#6b7280',
  activeText: '#b45309',
  activeBg:   'linear-gradient(90deg,#fef3c7,#fde68a)',
  headerGrad: 'linear-gradient(135deg,#d97706,#b45309)',
  topbarBg:   'rgba(255,253,245,.92)',
}

function Avatar({ photo, name, size = 34, borderColor = 'rgba(255,255,255,.4)' }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'EM'
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:c.headerGrad, border:`2px solid ${borderColor}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*.36, fontWeight:700, color:'#fff', overflow:'hidden', flexShrink:0 }}>
      {photo
        ? <img src={photo} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => e.target.style.display='none'} />
        : initials}
    </div>
  )
}

export default function EmployerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 768)
  const [unreadCount, setUnreadCount] = useState(0)

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
    api.get('/employer/notifications')
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
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:c.bg, color:c.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        {/* Mobile Top Bar */}
        <div style={{ position:'sticky', top:0, zIndex:200, height:'56px', background:c.topbarBg, backdropFilter:'blur(12px)', borderBottom:`1px solid ${c.border}`, display:'flex', alignItems:'center', padding:'0 14px', gap:'10px' }}>
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu"
            style={{ width:'36px', height:'36px', borderRadius:'10px', background:'transparent', border:`1.5px solid ${c.border}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px', flexShrink:0 }}>
            <span style={{ width:'16px', height:'2px', background:c.muted, borderRadius:'2px', display:'block' }} />
            <span style={{ width:'10px', height:'2px', background:c.muted, borderRadius:'2px', display:'block' }} />
            <span style={{ width:'16px', height:'2px', background:c.muted, borderRadius:'2px', display:'block' }} />
          </button>
          <span style={{ fontFamily:'Syne,sans-serif', fontSize:'16px', fontWeight:800, color:c.text, flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Employer Portal</span>
          <NavLink to="notifications" onClick={() => setUnreadCount(0)}
            style={{ position:'relative', color:c.muted, textDecoration:'none', fontSize:'18px', lineHeight:1, flexShrink:0 }}>
            🔔
            {unreadCount > 0 && <span style={{ position:'absolute', top:'-3px', right:'-3px', width:'9px', height:'9px', borderRadius:'50%', background:'#16a34a', border:'2px solid #fffdf5' }} />}
          </NavLink>
          <Avatar photo={user?.photo} name={user?.name} size={32} borderColor={c.border} />
        </div>

        {/* Drawer */}
        {mobileOpen && (
          <div style={{ position:'fixed', inset:0, zIndex:300 }}>
            <div onClick={() => setMobileOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.4)', backdropFilter:'blur(2px)' }} />
            <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'min(300px, 82vw)', background:c.surface, display:'flex', flexDirection:'column', boxShadow:'6px 0 32px rgba(0,0,0,.12)', overflowY:'auto' }}>
              {/* Drawer Header */}
              <div style={{ background:c.headerGrad, padding:'20px 16px', flexShrink:0, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', right:'-20px', top:'-20px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
                    <div style={{ width:'34px', height:'34px', background:'rgba(255,255,255,.2)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'15px', color:'#fff', border:'1.5px solid rgba(255,255,255,.3)', flexShrink:0 }}>L</div>
                    <div>
                      <div style={{ fontFamily:'Syne,sans-serif', fontSize:'14px', fontWeight:800, color:'#fff', whiteSpace:'nowrap' }}>Local Job Finder</div>
                      <div style={{ fontSize:'9px', fontWeight:700, background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.3)', borderRadius:'20px', padding:'2px 8px', color:'#fff', letterSpacing:'.5px', textTransform:'uppercase', display:'inline-block' }}>🏠 Employer</div>
                    </div>
                    <button onClick={() => setMobileOpen(false)}
                      style={{ marginLeft:'auto', background:'rgba(255,255,255,.15)', border:'none', borderRadius:'8px', width:'28px', height:'28px', color:'#fff', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
                  </div>
                  <div style={{ background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', borderRadius:'12px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px' }}>
                    <Avatar photo={user?.photo} name={user?.name} size={34} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'12px', fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
                      <div style={{ fontSize:'10px', color:'rgba(255,255,255,.8)' }}>Employer Account</div>
                    </div>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#fef08a', flexShrink:0 }} />
                  </div>
                </div>
              </div>
              {/* Drawer Nav */}
              <div style={{ flex:1, padding:'10px', overflowY:'auto' }}>
                {nav.map(item => (
                  <NavLink key={item.to} to={item.to}
                    onClick={() => { if (item.to === 'notifications') setUnreadCount(0) }}
                    style={({ isActive }) => ({
                      display:'flex', alignItems:'center', gap:'12px',
                      padding:'10px 12px', borderRadius:'10px', fontSize:'13px',
                      fontWeight:isActive?600:500, textDecoration:'none', margin:'2px 0',
                      color:isActive?c.activeText:c.muted,
                      background:isActive?c.activeBg:'transparent',
                      borderRight:isActive?`3px solid ${c.primary}`:'3px solid transparent',
                    })}>
                    <span style={{ fontSize:'16px', width:'20px', textAlign:'center', flexShrink:0 }}>{item.icon}</span>
                    <span style={{ flex:1 }}>{item.label}</span>
                    {item.to === 'notifications' && unreadCount > 0 && (
                      <span style={{ background:'#16a34a', color:'#fff', fontSize:'10px', fontWeight:700, borderRadius:'20px', padding:'2px 7px', minWidth:'18px', textAlign:'center' }}>{unreadCount}</span>
                    )}
                  </NavLink>
                ))}
              </div>
              {/* Drawer Footer */}
              <div style={{ padding:'12px', borderTop:`1px solid ${c.border}`, flexShrink:0 }}>
                <div style={{ background:'#fde68a', borderRadius:'12px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                  <Avatar photo={user?.photo} name={user?.name} size={30} borderColor={c.border} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'12px', fontWeight:600, color:c.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
                    <div style={{ fontSize:'10px', color:c.muted }}>Employer</div>
                  </div>
                </div>
                <button onClick={handleLogout}
                  style={{ width:'100%', padding:'10px', background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'10px', color:'#ef4444', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>
                  ↩ Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ flex:1, paddingBottom:'70px' }}><Outlet /></div>

        {/* Mobile Bottom Nav */}
        <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, height:'60px', background:'#fff', borderTop:`1px solid ${c.border}`, display:'flex', boxShadow:'0 -2px 12px rgba(0,0,0,.07)' }}>
          {mobileNav.map(item => (
            <NavLink key={item.to} to={item.to}
              onClick={() => { if (item.to === 'notifications') setUnreadCount(0) }}
              style={({ isActive }) => ({
                flex:1, display:'flex', flexDirection:'column', alignItems:'center',
                justifyContent:'center', padding:'6px 2px', textDecoration:'none',
                color:isActive?c.activeText:c.muted,
                borderTop:isActive?`2px solid ${c.primary}`:'2px solid transparent',
                background:isActive?'rgba(217,119,6,.04)':'transparent', position:'relative',
              })}>
              <span style={{ fontSize:'19px', lineHeight:1, marginBottom:'3px' }}>{item.icon}</span>
              <span style={{ fontSize:'9px', fontWeight:600, whiteSpace:'nowrap' }}>{item.label}</span>
              {item.to === 'notifications' && unreadCount > 0 && (
                <span style={{ position:'absolute', top:'5px', right:'calc(50% - 16px)', background:'#16a34a', color:'#fff', fontSize:'9px', fontWeight:700, borderRadius:'20px', padding:'1px 4px', minWidth:'14px', textAlign:'center' }}>{unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    )
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:c.bg, color:c.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <nav style={{ position:'fixed', top:0, left:0, bottom:0, width:SIDEBAR_W, background:c.surface, borderRight:`1px solid ${c.border}`, display:'flex', flexDirection:'column', zIndex:200, boxShadow:'2px 0 12px rgba(0,0,0,.03)', transition:'width .25s ease', overflow:'hidden' }}>
        <div style={{ background:c.headerGrad, padding:collapsed?'16px 0':'20px 18px 18px', position:'relative', overflow:'hidden', transition:'padding .25s', flexShrink:0 }}>
          <div style={{ position:'absolute', right:'-20px', top:'-20px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
          {collapsed ? (
            <div style={{ display:'flex', justifyContent:'center', position:'relative', zIndex:1 }}>
              <Avatar photo={user?.photo} name={user?.name} size={34} />
            </div>
          ) : (
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
                <div style={{ width:'36px', height:'36px', background:'rgba(255,255,255,.2)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'16px', color:'#fff', border:'1.5px solid rgba(255,255,255,.3)', flexShrink:0 }}>L</div>
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:'16px', fontWeight:800, color:'#fff', whiteSpace:'nowrap' }}>Local Job Finder</div>
                  <div style={{ fontSize:'9px', fontWeight:700, background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.3)', borderRadius:'20px', padding:'2px 8px', color:'#fff', letterSpacing:'.5px', textTransform:'uppercase', display:'inline-block' }}>🏠 Employer</div>
                </div>
              </div>
              <div style={{ background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', borderRadius:'12px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px' }}>
                <Avatar photo={user?.photo} name={user?.name} size={32} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'12px', fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
                  <div style={{ fontSize:'10px', color:'rgba(255,255,255,.8)' }}>Employer Account</div>
                </div>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#fef08a', flexShrink:0 }} />
              </div>
            </div>
          )}
        </div>
        {/* Nav links — minHeight:0 is critical: lets this flex child shrink so footer always stays visible */}
        <div style={{ flex:1, minHeight:0, overflowY:'auto', overflowX:'hidden', padding:collapsed?'10px 6px':'10px' }}>
          {nav.map(item => (
            <div key={item.to} style={{ position:'relative' }}>
              <NavLink to={item.to} title={collapsed?item.label:undefined}
                onClick={() => { if (item.to === 'notifications') setUnreadCount(0) }}
                style={({ isActive }) => ({
                  display:'flex', alignItems:'center', gap:'10px',
                  padding:collapsed?'10px 0':'8px 12px',
                  justifyContent:collapsed?'center':'flex-start',
                  borderRadius:'10px', fontSize:'13px',
                  fontWeight:isActive?600:500, textDecoration:'none',
                  margin:'1px 0', transition:'all .2s ease',
                  color:isActive?c.activeText:c.muted,
                  background:isActive?c.activeBg:'transparent',
                  borderRight:isActive&&!collapsed?`3px solid ${c.primary}`:'3px solid transparent',
                })}>
                <span style={{ fontSize:'15px', width:'20px', textAlign:'center', flexShrink:0 }}>{item.icon}</span>
                {!collapsed && <span style={{ flex:1, whiteSpace:'nowrap' }}>{item.label}</span>}
                {!collapsed && item.to === 'notifications' && unreadCount > 0 && (
                  <span style={{ background:'#16a34a', color:'#fff', borderRadius:'20px', padding:'1px 7px', fontSize:'11px', fontWeight:700, minWidth:'18px', textAlign:'center' }}>{unreadCount}</span>
                )}
                {collapsed && item.to === 'notifications' && unreadCount > 0 && (
                  <span style={{ position:'absolute', top:'6px', right:'6px', width:'8px', height:'8px', borderRadius:'50%', background:'#16a34a' }} />
                )}
              </NavLink>
            </div>
          ))}
        </div>

        {/* Footer — always visible, never scrolls away */}
        <div style={{ padding:collapsed?'10px 6px':'12px', borderTop:`1px solid ${c.border}`, flexShrink:0, background:c.surface }}>
          {collapsed ? (
            <div style={{ display:'flex', justifyContent:'center' }}>
              <button onClick={handleLogout} title="Sign out"
                style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'10px', width:'40px', height:'40px', color:'#ef4444', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                ↩
              </button>
            </div>
          ) : (
            <div style={{ background:'#fde68a', borderRadius:'12px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px' }}>
              <Avatar photo={user?.photo} name={user?.name} size={32} borderColor={c.border} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'12px', fontWeight:600, color:c.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize:'10px', color:c.muted }}>Employer</div>
              </div>
              <button
                onClick={handleLogout}
                style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.25)', borderRadius:'8px', padding:'5px 10px', fontSize:'11px', fontWeight:700, color:'#ef4444', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
      <div style={{ marginLeft:CONTENT_ML, flex:1, display:'flex', flexDirection:'column', transition:'margin-left .25s ease', minWidth:0 }}>
        <div style={{ position:'sticky', top:0, zIndex:100, height:'64px', background:c.topbarBg, backdropFilter:'blur(12px)', borderBottom:`1px solid ${c.border}`, display:'flex', alignItems:'center', padding:'0 24px', gap:'12px' }}>
          <button onClick={() => setCollapsed(v => !v)}
            style={{ width:'36px', height:'36px', borderRadius:'10px', background:'transparent', border:`1.5px solid ${c.border}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px', flexShrink:0 }}
            title={collapsed?'Expand sidebar':'Collapse sidebar'}>
            <span style={{ display:'block', width:'16px', height:'2px', background:c.muted, borderRadius:'2px' }} />
            <span style={{ display:'block', width:'10px', height:'2px', background:c.muted, borderRadius:'2px' }} />
            <span style={{ display:'block', width:'16px', height:'2px', background:c.muted, borderRadius:'2px' }} />
          </button>
          <span style={{ fontFamily:'Syne,sans-serif', fontSize:'18px', fontWeight:800, color:c.text, flex:1 }}>Employer Portal</span>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <Avatar photo={user?.photo} name={user?.name} size={34} borderColor={c.border} />
            <span style={{ fontSize:'13px', fontWeight:600, color:c.text }}>{user?.name}</span>
          </div>
        </div>
        <div style={{ flex:1 }}><Outlet /></div>
      </div>
    </div>
  )
}