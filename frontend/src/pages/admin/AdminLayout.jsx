import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const nav = [
  { section: 'Overview' },
  { to: 'dashboard', icon: '📊', label: 'Dashboard & Analytics' },

  { section: 'Users' },
  { to: 'users', icon: '👥', label: 'All Users' },
  { to: 'verifications', icon: '🪪', label: 'ID Verifications', badge: '12', badgeColor: '#a78bfa' },
  { to: 'suspended', icon: '⛔', label: 'Suspended / Banned', badge: '3', badgeColor: '#fbbf24' },

  { section: 'Jobs' },
  { to: 'jobs', icon: '📋', label: 'All Job Posts' },
  { to: 'categories', icon: '🗂️', label: 'Service Categories' },

  { section: 'Reports' },
  { to: 'reports', icon: '🚨', label: 'Flagged Reports', badge: '5', badgeColor: '#f87171' },
  { to: 'disputes', icon: '⚖️', label: 'Handle Disputes', badge: '2', badgeColor: '#a78bfa' },

  { section: 'System' },
  { to: 'analytics', icon: '📈', label: 'Full Analytics' },
  { to: 'security', icon: '🔐', label: 'Security Controls' },
  { to: 'settings', icon: '⚙️', label: 'System Settings' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials =
    user?.name
      ?.split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AD'

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '260px',
    background: 'rgba(22,21,37,.85)',
    backdropFilter: 'blur(18px)',
    borderRight: '1px solid rgba(167,139,250,.15)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 200,
    boxShadow: '0 0 40px rgba(124,58,237,.15)',
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0c0b14',
        color: '#f0eeff',
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.6)',
            zIndex: 190,
          }}
        />
      )}

      {/* SIDEBAR */}
      <nav style={sidebarStyle}>
        {/* HEADER */}
        <div
          style={{
            background: 'linear-gradient(145deg,#4c1d95,#3b0764)',
            padding: '22px 18px 18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-30px',
              top: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle,rgba(167,139,250,.25),transparent)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '-20px',
              bottom: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle,rgba(124,58,237,.2),transparent)',
            }}
          />

          {/* LOGO */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(255,255,255,.15)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '16px',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,.25)',
              }}
            >
              L
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Syne,sans-serif',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                Local Job Finder
              </div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  background: 'rgba(255,255,255,.15)',
                  border: '1px solid rgba(255,255,255,.25)',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  color: '#fff',
                  letterSpacing: '.5px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                }}
              >
                🛡️ Admin Panel
              </div>
            </div>
          </div>

          {/* USER CHIP */}
          <div
            style={{
              background: 'rgba(255,255,255,.1)',
              border: '1px solid rgba(255,255,255,.2)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,.2)',
                border: '2px solid rgba(255,255,255,.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.7)' }}>
                System Administrator
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {nav.map((item, i) =>
            item.section ? (
              <div
                key={i}
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#5a5978',
                  padding: '12px 14px 6px',
                }}
              >
                {item.section}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  textDecoration: 'none',
                  margin: '4px 0',
                  transition: 'all .25s ease',
                  color: isActive ? '#c4b5fd' : '#8b8aad',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(124,58,237,.25), rgba(124,58,237,.05))'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(167,139,250,.3)'
                    : '1px solid transparent',
                  boxShadow: isActive
                    ? '0 0 20px rgba(124,58,237,.25)'
                    : 'none',
                })}
              >
                <span style={{ width: '20px', textAlign: 'center' }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      background: item.badgeColor,
                      color: '#fff',
                      fontSize: '9px',
                      fontWeight: 700,
                      borderRadius: '20px',
                      padding: '2px 7px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          )}
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid rgba(167,139,250,.15)',
          }}
        >
          <div
            style={{
              background: 'rgba(30,29,48,.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(167,139,250,.15)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#7c3aed,#4c1d95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: '10px', color: '#8b8aad' }}>Admin</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '11px',
                fontWeight: 700,
                color: '#f87171',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* TOPBAR */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            height: '64px',
            background: 'rgba(12,11,20,.75)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(167,139,250,.15)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 28px',
            gap: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,.25)',
          }}
        >
          <span
            style={{
              fontFamily: 'Syne,sans-serif',
              fontSize: '18px',
              fontWeight: 800,
            }}
          >
            Admin Panel
          </span>

          <span style={{ fontSize: '12px', color: '#8b8aad' }}>
            Local Job Finder — Municipality of Dolores
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            <div
              style={{
                width: '8px',height: '8px',borderRadius: '50%',background: '#22c55e',}}/>
            <span style={{ fontSize: '12px', color: '#8b8aad' }}>
              System Online
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}