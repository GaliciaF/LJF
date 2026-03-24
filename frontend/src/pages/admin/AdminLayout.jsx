import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'

const nav = [
  { to:'dashboard',     icon:'🏠', label:'Dashboard' },
  { to:'users',         icon:'👥', label:'All Users' },
  { to:'verifications', icon:'🪪', label:'ID Verifications' },
  { to:'suspended',     icon:'🚫', label:'Suspended Users' },
  { to:'jobs',          icon:'📋', label:'All Jobs' },
  { to:'categories',    icon:'🗂️', label:'Service Categories' },
  { to:'reports',       icon:'🚨', label:'Flagged Reports' },
  { to:'disputes',      icon:'⚖️', label:'Handle Disputes' },
  { to:'analytics',     icon:'📊', label:'Full Analytics' },
  { to:'security',      icon:'🔐', label:'Security Controls' },
  { to:'settings',      icon:'⚙️', label:'System Settings' },
  { to:'notifications', icon:'🔔', label:'Notifications' },
]

const c = {
  primary:    '#7c3aed',
  bg:         '#0c0b14',
  surface:    '#12111f',
  border:     '#2a2940',
  text:       '#f0eeff',
  muted:      '#8b8aad',
  activeText: '#a78bfa',
  activeBg:   'rgba(124,58,237,.15)',
  headerGrad: 'linear-gradient(135deg,#7c3aed,#4c1d95)',
  topbarBg:   'rgba(12,11,20,.9)',
}

function Avatar({ photo, name, size = 34, borderColor = 'rgba(255,255,255,.25)' }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AD'
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:c.headerGrad, border:`2px solid ${borderColor}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*.36, fontWeight:700, color:'#fff', overflow:'hidden', flexShrink:0 }}>
      {photo
        ? <img src={photo} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => e.target.style.display='none'} />
        : initials
      }
    </div>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
const [unreadCount, setUnreadCount] = useState(0)
useEffect(() => {
    api.get('/admin/notifications')
      .then(res => {
        const notifs = res.data.data ?? res.data
        setUnreadCount(notifs.filter(n => !n.read_at).length)
      }).catch(() => {})
  }, [])
  const handleLogout = async () => { await logout(); navigate('/login') }

  const SIDEBAR_W  = collapsed ? '68px' : '260px'
  const CONTENT_ML = collapsed ? '68px' : '260px'

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:c.bg, color:c.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Sidebar */}
      <nav style={{ position:'fixed', top:0, left:0, bottom:0, width:SIDEBAR_W, background:c.surface, borderRight:`1px solid ${c.border}`, display:'flex', flexDirection:'column', zIndex:200, boxShadow:'4px 0 20px rgba(0,0,0,.3)', transition:'width .25s ease', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ background:c.headerGrad, padding:collapsed?'16px 0':'20px 18px', position:'relative', overflow:'hidden', transition:'padding .25s', flexShrink:0 }}>
          <div style={{ position:'absolute', right:'-20px', top:'-20px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,.08)' }} />

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
                  <div style={{ fontSize:'9px', fontWeight:700, background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.3)', borderRadius:'20px', padding:'2px 8px', color:'#fff', letterSpacing:'.5px', textTransform:'uppercase', display:'inline-block' }}>🔐 Admin</div>
                </div>
              </div>
              <div style={{ background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', borderRadius:'12px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px' }}>
                <Avatar photo={user?.photo} name={user?.name} size={32} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'12px', fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
                  <div style={{ fontSize:'10px', color:'rgba(255,255,255,.7)' }}>Admin Account</div>
                </div>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#a78bfa', flexShrink:0 }} />
              </div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:collapsed?'10px 6px':'10px' }}>
  {nav.map(item => (
    <NavLink key={item.to} to={item.to}
      title={collapsed ? item.label : undefined}
      onClick={() => { if (item.to === 'notifications') setUnreadCount(0) }}
      style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:'10px',
                padding:collapsed?'10px 0':'8px 12px',
                justifyContent:collapsed?'center':'flex-start',
                borderRadius:'10px', fontSize:'13px',
                fontWeight:isActive?600:500, textDecoration:'none',
                margin:'1px 0', transition:'all .15s ease',
                color:isActive?c.activeText:c.muted,
                background:isActive?c.activeBg:'transparent',
                borderRight:isActive&&!collapsed?`3px solid ${c.primary}`:'3px solid transparent',
              })}>
              <span style={{ fontSize:'15px', width:'20px', textAlign:'center', flexShrink:0 }}>{item.icon}</span>
              {!collapsed && <span style={{ flex:1, whiteSpace:'nowrap' }}>{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ padding:collapsed?'10px 6px':'12px', borderTop:`1px solid ${c.border}`, flexShrink:0 }}>
          {collapsed ? (
            <div style={{ display:'flex', justifyContent:'center' }}>
              <button onClick={handleLogout} title="Sign out" style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'10px', width:'40px', height:'40px', color:'#ef4444', cursor:'pointer', fontSize:'16px' }}>↩</button>
            </div>
          ) : (
            <div style={{ background:'rgba(124,58,237,.15)', borderRadius:'12px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px', border:`1px solid rgba(124,58,237,.3)` }}>
              <Avatar photo={user?.photo} name={user?.name} size={32} borderColor={c.border} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'12px', fontWeight:600, color:c.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize:'10px', color:c.muted }}>Administrator</div>
              </div>
              <button onClick={handleLogout} style={{ background:'none', border:'none', fontSize:'11px', fontWeight:700, color:'#ef4444', cursor:'pointer' }}>Sign out</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div style={{ marginLeft:CONTENT_ML, flex:1, display:'flex', flexDirection:'column', transition:'margin-left .25s ease' }}>

        {/* Top bar */}
        <div style={{ position:'sticky', top:0, zIndex:100, height:'64px', background:c.topbarBg, backdropFilter:'blur(14px)', borderBottom:`1px solid ${c.border}`, display:'flex', alignItems:'center', padding:'0 24px', gap:'12px' }}>

          {/* Toggle button */}
          <button onClick={() => setCollapsed(v => !v)}
            style={{ width:'36px', height:'36px', borderRadius:'10px', background:'transparent', border:`1.5px solid ${c.border}`, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px', flexShrink:0 }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <span style={{ display:'block', width:'16px', height:'2px', background:c.muted, borderRadius:'2px' }} />
            <span style={{ display:'block', width:'10px', height:'2px', background:c.muted, borderRadius:'2px' }} />
            <span style={{ display:'block', width:'16px', height:'2px', background:c.muted, borderRadius:'2px' }} />
          </button>

          <span style={{ fontFamily:'Syne,sans-serif', fontSize:'18px', fontWeight:800, color:c.text, flex:1 }}>Admin Portal</span>
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