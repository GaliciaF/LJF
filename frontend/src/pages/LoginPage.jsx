import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@400;500;600;700&display=swap');

  .login-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    font-family: 'Quicksand', sans-serif;
    min-height: 100vh;
    display: flex;
    background: #fef6fb;
    overflow: hidden;
    position: relative;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.55;
    animation: drift 8s ease-in-out infinite alternate;
  }
  .blob-1 { width: 420px; height: 420px; background: #f9c6e0; top: -120px; left: -100px; animation-delay: 0s; }
  .blob-2 { width: 350px; height: 350px; background: #c7e9fb; bottom: -80px; right: -80px; animation-delay: -3s; }
  .blob-3 { width: 260px; height: 260px; background: #d4f5e2; top: 40%; left: 30%; animation-delay: -5s; }
  .blob-4 { width: 200px; height: 200px; background: #ffe8b0; top: 10%; right: 20%; animation-delay: -2s; }

  @keyframes drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, 20px) scale(1.08); }
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.18;
    animation: floatUp 6s ease-in-out infinite alternate;
  }
  .shape-1 { width: 18px; height: 18px; background: #e879a0; top: 20%; left: 12%; }
  .shape-2 { width: 12px; height: 12px; background: #60c5f7; top: 65%; left: 8%; animation-delay: -2s; }
  .shape-3 { width: 22px; height: 22px; background: #a78bfa; top: 80%; left: 40%; animation-delay: -4s; border-radius: 4px; }
  .shape-4 { width: 14px; height: 14px; background: #f59e0b; top: 15%; right: 15%; animation-delay: -1s; }
  .shape-5 { width: 10px; height: 10px; background: #34d399; top: 50%; right: 8%; animation-delay: -3s; }

  @keyframes floatUp {
    from { transform: translateY(0); opacity: 0.18; }
    to   { transform: translateY(-18px); opacity: 0.3; }
  }

  /* Left panel — hidden on small screens */
  .left-panel {
    display: none;
    width: 50%;
    padding: 60px 56px;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
  }
  @media (min-width: 768px) { .left-panel { display: flex; } }

  .left-illustration { width: 100%; max-width: 380px; margin: 0 auto 40px; }

  .brand-title {
    font-family: 'Nunito', sans-serif;
    font-size: clamp(26px, 3vw, 38px);
    font-weight: 900;
    line-height: 1.15;
    color: #2d1b4e;
    margin-bottom: 14px;
  }
  .brand-title span { color: #e879a0; }
  .brand-sub { font-size: 15px; color: #7c6f90; line-height: 1.7; margin-bottom: 32px; max-width: 340px; }

  .feature-list { display: flex; flex-direction: column; gap: 12px; }
  .feature-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #4a3f62; font-weight: 600; }
  .feature-dot { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }

  /* Right panel — full width on mobile */
  .right-panel {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    position: relative;
    z-index: 2;
    min-height: 100vh;
  }
  @media (min-width: 768px) {
    .right-panel { width: 50%; padding: 32px 20px; }
  }

  .card {
    width: 100%;
    max-width: 420px;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(24px);
    border: 1.5px solid rgba(255,255,255,0.9);
    border-radius: 24px;
    padding: 32px 24px;
    box-shadow: 0 8px 32px rgba(232,121,160,0.10), 0 2px 8px rgba(0,0,0,0.06);
    animation: slideUp 0.5s cubic-bezier(.22,1,.36,1) both;
  }
  @media (min-width: 480px) { .card { padding: 44px 40px; border-radius: 28px; } }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-greeting { font-family: 'Nunito', sans-serif; font-size: clamp(22px, 5vw, 30px); font-weight: 900; color: #2d1b4e; margin-bottom: 4px; }
  .card-sub { font-size: 13.5px; color: #9b8eb0; margin-bottom: 30px; font-weight: 500; }

  .error-box { background: #fff0f4; border: 1.5px solid #fbc9d8; border-radius: 12px; padding: 10px 14px; font-size: 13px; color: #c0365c; margin-bottom: 18px; font-weight: 600; }

  .field { margin-bottom: 18px; }
  .field label { display: block; font-size: 11.5px; font-weight: 700; color: #9b8eb0; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 8px; }
  .field input {
    width: 100%; padding: 12px 16px;
    background: #faf7ff; border: 1.5px solid #ede8f7; border-radius: 14px;
    font-size: 14px; font-family: 'Quicksand', sans-serif; font-weight: 600; color: #2d1b4e;
    outline: none; transition: border-color .2s, box-shadow .2s; box-sizing: border-box;
  }
  .field input:focus { border-color: #e879a0; background: #fff; box-shadow: 0 0 0 4px rgba(232,121,160,0.12); }
  .field input::placeholder { color: #c4b8d8; font-weight: 500; }

  .pw-wrap { position: relative; }
  .pw-wrap input { padding-right: 46px; }
  .pw-toggle {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #c4b8d8;
    display: flex; align-items: center; padding: 4px; border-radius: 8px; transition: color .2s;
  }
  .pw-toggle:hover { color: #e879a0; }

  .forgot-row { display: flex; justify-content: flex-end; margin-top: -6px; margin-bottom: 22px; }
  .forgot-row a { font-size: 12.5px; font-weight: 700; color: #bf7ae0; text-decoration: none; }
  .forgot-row a:hover { color: #e879a0; }

  .submit-btn {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #f472b6 0%, #e879a0 50%, #c026d3 100%);
    color: #fff; border: none; border-radius: 14px;
    font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
    cursor: pointer; box-shadow: 0 4px 18px rgba(232,121,160,0.40);
    transition: opacity .2s, transform .15s;
  }
  .submit-btn:hover { opacity: 0.93; transform: translateY(-1px); }

  .register-row { margin-top: 22px; text-align: center; font-size: 13.5px; color: #9b8eb0; font-weight: 600; }
  .register-row a { color: #e879a0; text-decoration: none; font-weight: 700; }

  /* Blocked screens */
  .blocked-root {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #fef6fb; position: relative; overflow: hidden;
    font-family: 'Quicksand', sans-serif; padding: 16px; box-sizing: border-box;
  }
  .blocked-card {
    background: rgba(255,255,255,0.88); backdrop-filter: blur(20px);
    border: 1.5px solid rgba(255,255,255,0.9); border-radius: 24px;
    padding: 36px 24px; max-width: 440px; width: 100%; text-align: center;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08); position: relative; z-index: 2;
  }
  @media (min-width: 480px) { .blocked-card { padding: 48px 40px; border-radius: 28px; } }

  .blocked-icon { font-size: 48px; margin-bottom: 16px; }
  .blocked-title { font-family:'Nunito',sans-serif; font-size: clamp(20px,4vw,24px); font-weight:900; color:#2d1b4e; margin-bottom:10px; }
  .blocked-sub { font-size:13.5px; color:#7c6f90; margin-bottom:24px; line-height:1.6; }
  .blocked-reason { background:#fff0f7; border:1.5px solid #fbc9d8; border-radius:14px; padding:14px 16px; text-align:left; margin-bottom:16px; }
  .blocked-reason-label { font-size:10.5px; font-weight:700; color:#e879a0; text-transform:uppercase; letter-spacing:.8px; margin-bottom:5px; }
  .blocked-reason-text { font-size:13.5px; color:#4a3f62; font-weight:600; }
  .blocked-until { background:#f3e8ff; border:1.5px solid #d8b4fe; border-radius:14px; padding:14px 16px; margin-bottom:24px; }
  .blocked-until-label { font-size:10.5px; font-weight:700; color:#9333ea; text-transform:uppercase; letter-spacing:.8px; margin-bottom:5px; }
  .blocked-until-val { font-size: clamp(16px,3vw,18px); font-weight:800; color:#2d1b4e; font-family:'Nunito',sans-serif; }
  .blocked-back {
    width:100%; padding:13px; background: linear-gradient(135deg,#f472b6,#c026d3);
    color:#fff; border:none; border-radius:14px;
    font-family:'Nunito',sans-serif; font-size:15px; font-weight:800; cursor:pointer;
  }
  .blocked-back-ghost {
    width:100%; padding:13px; background: #faf7ff; color:#9b8eb0;
    border:1.5px solid #ede8f7; border-radius:14px;
    font-family:'Nunito',sans-serif; font-size:15px; font-weight:800; cursor:pointer;
  }
`

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [blocked, setBlocked] = useState(null)

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBlocked(null)
    try {
      const role = await login(form.email, form.password)
      navigate(`/${role}`)
    } catch (err) {
      const data = err.response?.data
      if (err.response?.status === 403 && data?.status) {
        setBlocked(data)
      } else {
        setError(data?.message || 'Login failed')
      }
    }
  }

  if (blocked?.status === 'suspended') {
    return (
      <>
        <style>{styles}</style>
        <div className="blocked-root">
          <div className="blob blob-1" /><div className="blob blob-2" />
          <div className="blocked-card">
            <div className="blocked-icon">🚫</div>
            <div className="blocked-title">Account Suspended</div>
            <p className="blocked-sub">Your account has been temporarily suspended and you cannot sign in at this time.</p>
            {blocked.suspension_reason && (
              <div className="blocked-reason">
                <div className="blocked-reason-label">Reason</div>
                <div className="blocked-reason-text">{blocked.suspension_reason}</div>
              </div>
            )}
            {blocked.suspended_until && (
              <div className="blocked-until">
                <div className="blocked-until-label">Access Restored On</div>
                <div className="blocked-until-val">{blocked.suspended_until}</div>
              </div>
            )}
            <p style={{ fontSize: '12px', color: '#9b8eb0', marginBottom: '18px' }}>If you believe this is a mistake, please contact support.</p>
            <button className="blocked-back" onClick={() => setBlocked(null)}>← Back to Login</button>
          </div>
        </div>
      </>
    )
  }

  if (blocked?.status === 'banned') {
    return (
      <>
        <style>{styles}</style>
        <div className="blocked-root">
          <div className="blob" style={{ width: '380px', height: '380px', background: '#ffd0d0', top: '-100px', left: '-80px', opacity: .5 }} />
          <div className="blob" style={{ width: '300px', height: '300px', background: '#ffc8c8', bottom: '-60px', right: '-60px', opacity: .4 }} />
          <div className="blocked-card" style={{ borderColor: 'rgba(252,165,165,0.5)' }}>
            <div className="blocked-icon">⛔</div>
            <div className="blocked-title">Permanently Banned</div>
            <p className="blocked-sub">Your account has been permanently banned and you can no longer access this platform.</p>
            {blocked.suspension_reason && (
              <div className="blocked-reason" style={{ background: '#fff5f5', borderColor: '#fca5a5' }}>
                <div className="blocked-reason-label" style={{ color: '#ef4444' }}>Reason</div>
                <div className="blocked-reason-text">{blocked.suspension_reason}</div>
              </div>
            )}
            <div style={{ background: '#fff5f5', border: '1.5px solid #fca5a5', borderRadius: '14px', padding: '12px 16px', marginBottom: '22px' }}>
              <p style={{ fontSize: '12.5px', color: '#ef4444', fontWeight: 600 }}>This decision is permanent. If you believe this is a mistake, contact support.</p>
            </div>
            <button className="blocked-back-ghost" onClick={() => setBlocked(null)}>← Back to Login</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="blob blob-3" /><div className="blob blob-4" />
        <div className="shape shape-1" /><div className="shape shape-2" />
        <div className="shape shape-3" /><div className="shape shape-4" />
        <div className="shape shape-5" />

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="left-illustration">
            <svg viewBox="0 0 380 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="380" height="280" rx="24" fill="#fef0fa"/>
              <circle cx="310" cy="60" r="38" fill="#ffe8a0" opacity=".7"/>
              <circle cx="310" cy="60" r="26" fill="#ffd166"/>
              <ellipse cx="80" cy="55" rx="42" ry="18" fill="white" opacity=".85"/>
              <ellipse cx="105" cy="48" rx="30" ry="20" fill="white" opacity=".85"/>
              <ellipse cx="60" cy="52" rx="24" ry="14" fill="white" opacity=".85"/>
              <rect x="0" y="210" width="380" height="70" rx="0" fill="#d4f5e2" opacity=".7"/>
              <rect x="0" y="228" width="380" height="52" fill="#b8edcc" opacity=".5"/>
              <rect x="30" y="120" width="70" height="110" rx="6" fill="#f9c6e0"/>
              <rect x="40" y="130" width="16" height="18" rx="3" fill="white" opacity=".7"/>
              <rect x="64" y="130" width="16" height="18" rx="3" fill="white" opacity=".7"/>
              <rect x="52" y="185" width="26" height="45" rx="4" fill="white" opacity=".6"/>
              <rect x="130" y="90" width="90" height="140" rx="6" fill="#c7e9fb"/>
              <rect x="142" y="102" width="18" height="20" rx="3" fill="white" opacity=".7"/>
              <rect x="170" y="102" width="18" height="20" rx="3" fill="white" opacity=".7"/>
              <rect x="160" y="192" width="30" height="38" rx="4" fill="white" opacity=".5"/>
              <rect x="250" y="140" width="60" height="90" rx="6" fill="#e8d5fb"/>
              <rect x="260" y="152" width="14" height="16" rx="3" fill="white" opacity=".7"/>
              <rect x="265" y="202" width="22" height="28" rx="3" fill="white" opacity=".5"/>
              <circle cx="108" cy="198" r="13" fill="#ffd5b8"/>
              <rect x="98" y="210" width="20" height="28" rx="6" fill="#f472b6"/>
              <rect x="92" y="214" width="10" height="20" rx="5" fill="#f9a8d4"/>
              <rect x="116" y="214" width="10" height="20" rx="5" fill="#f9a8d4"/>
              <rect x="100" y="236" width="8" height="16" rx="4" fill="#fbbf24"/>
              <rect x="112" y="236" width="8" height="16" rx="4" fill="#fbbf24"/>
              <rect x="122" y="218" width="18" height="14" rx="3" fill="#60a5fa"/>
              <circle cx="340" cy="195" r="13" fill="#ffd5b8"/>
              <rect x="330" y="207" width="20" height="28" rx="6" fill="#34d399"/>
              <rect x="324" y="211" width="10" height="20" rx="5" fill="#6ee7b7"/>
              <rect x="346" y="211" width="10" height="20" rx="5" fill="#6ee7b7"/>
              <rect x="332" y="233" width="8" height="16" rx="4" fill="#fbbf24"/>
              <rect x="344" y="233" width="8" height="16" rx="4" fill="#fbbf24"/>
            </svg>
          </div>
          <h1 className="brand-title">Find Local Jobs<br /><span>Faster & Easier</span></h1>
          <p className="brand-sub">A modern platform connecting local workers and employers with speed, simplicity, and security.</p>
          <div className="feature-list">
            <div className="feature-item"><div className="feature-dot" style={{ background: '#fde8f3' }}>🚀</div>Post jobs in seconds</div>
            <div className="feature-item"><div className="feature-dot" style={{ background: '#e0f2fe' }}>🤝</div>Hire trusted workers nearby</div>
            <div className="feature-item"><div className="feature-dot" style={{ background: '#f3e8ff' }}>🔒</div>Simple and secure login system</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="card">

            {/* JobFinder Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '18px' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="briefGrad" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                {/* Briefcase body */}
                <rect x="8" y="22" width="56" height="42" rx="8" fill="none" stroke="url(#briefGrad)" strokeWidth="3.5" />
                {/* Briefcase handle */}
                <path d="M26 22v-5a4 4 0 014-4h12a4 4 0 014 4v5" stroke="url(#briefGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Magnifying glass circle */}
                <circle cx="36" cy="44" r="10" fill="none" stroke="url(#briefGrad)" strokeWidth="3" />
                {/* Magnifying glass handle */}
                <line x1="43" y1="51" x2="52" y2="60" stroke="url(#briefGrad)" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: '20px',
                background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.3px',
                marginTop: '6px'
              }}>
                LocalJobFinder
              </div>
            </div>

            <div className="card-greeting">Welcome Back!</div>
            <p className="card-sub">Sign in to continue your journey</p>

            {error && <div className="error-box">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email</label>
                <input type="email" required placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label>Password</label>
                <div className="pw-wrap">
                  <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                    minLength={8} maxLength={20} value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} />
                  <button type="button" className="pw-toggle" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="forgot-row">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <button type="submit" className="submit-btn">Sign In ✨</button>
            </form>

            <div className="register-row">
              No account? <Link to="/register">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}