import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@400;500;600;700&display=swap');

  .reg-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    font-family: 'Quicksand', sans-serif;
    min-height: 100vh;
    display: flex;
    background: #f3fbf6;
    overflow: hidden;
    position: relative;
  }

  .reg-blob {
    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.55;
    animation: regDrift 8s ease-in-out infinite alternate;
  }
  .reg-blob-1 { width:400px;height:400px;background:#b8f0d4;top:-120px;left:-100px; }
  .reg-blob-2 { width:340px;height:340px;background:#c7e9fb;bottom:-80px;right:-80px;animation-delay:-3s; }
  .reg-blob-3 { width:260px;height:260px;background:#fde8f3;top:35%;left:28%;animation-delay:-5s; }
  .reg-blob-4 { width:190px;height:190px;background:#ffe8b0;top:8%;right:18%;animation-delay:-2s; }

  @keyframes regDrift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(28px,18px) scale(1.07); }
  }

  .reg-shape { position:absolute; opacity:0.18; animation:regFloat 6s ease-in-out infinite alternate; border-radius:50%; }
  .reg-shape-1{width:18px;height:18px;background:#34d399;top:18%;left:10%;}
  .reg-shape-2{width:12px;height:12px;background:#60c5f7;top:68%;left:7%;animation-delay:-2s;}
  .reg-shape-3{width:20px;height:20px;background:#f472b6;top:82%;left:38%;animation-delay:-4s;border-radius:4px;}
  .reg-shape-4{width:14px;height:14px;background:#fbbf24;top:12%;right:14%;animation-delay:-1s;}
  .reg-shape-5{width:10px;height:10px;background:#a78bfa;top:52%;right:7%;animation-delay:-3s;}

  @keyframes regFloat {
    from { transform:translateY(0); opacity:.18; }
    to   { transform:translateY(-16px); opacity:.28; }
  }

  /* Left panel */
  .reg-left {
    display: none;
    width: 50%;
    padding: 60px 56px;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
  }
  @media(min-width:768px){ .reg-left { display:flex; } }

  .reg-illustration { width:100%;max-width:370px;margin:0 auto 36px; }

  .reg-brand-title {
    font-family:'Nunito',sans-serif;
    font-size: clamp(24px,3vw,36px);
    font-weight:900; color:#1a3d2b; line-height:1.18; margin-bottom:12px;
  }
  .reg-brand-title span { color:#16a34a; }
  .reg-brand-sub { font-size:14.5px;color:#4d7a60;line-height:1.7;margin-bottom:28px;max-width:330px; }

  .reg-features { display:flex;flex-direction:column;gap:12px; }
  .reg-feature-item { display:flex;align-items:center;gap:12px;font-size:14px;color:#2d5a3d;font-weight:600; }
  .reg-feature-dot { width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0; }

  /* Right panel */
  .reg-right {
    width:100%;
    display:flex;align-items:center;justify-content:center;
    padding: 24px 16px;
    position:relative;z-index:2;
    min-height: 100vh;
  }
  @media(min-width:768px){ .reg-right{ width:50%; padding: 32px 20px; } }

  .reg-card {
    width:100%;max-width:430px;
    background:rgba(255,255,255,0.84);
    backdrop-filter:blur(24px);
    border:1.5px solid rgba(255,255,255,0.92);
    border-radius:24px;
    padding: 28px 20px;
    box-shadow:0 8px 32px rgba(22,163,74,.10),0 2px 8px rgba(0,0,0,.06);
    animation:regSlideUp .5s cubic-bezier(.22,1,.36,1) both;
  }
  @media(min-width:480px){ .reg-card { padding: 40px 38px; border-radius:28px; } }

  @keyframes regSlideUp {
    from{opacity:0;transform:translateY(26px);}
    to{opacity:1;transform:translateY(0);}
  }

  .reg-card-title { font-family:'Nunito',sans-serif;font-size:clamp(22px,5vw,28px);font-weight:900;color:#1a3d2b;margin-bottom:4px; }
  .reg-card-sub { font-size:13px;color:#7aad8e;margin-bottom:24px;font-weight:500; }

  .reg-error { background:#fff0f4;border:1.5px solid #fbc9d8;border-radius:12px;padding:10px 14px;font-size:13px;color:#c0365c;margin-bottom:16px;font-weight:600; }

  .reg-field { margin-bottom:14px; }
  .reg-field label { display:block;font-size:11px;font-weight:700;color:#7aad8e;text-transform:uppercase;letter-spacing:.8px;margin-bottom:7px; }
  .reg-field input {
    width:100%;padding:12px 16px;
    background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:13px;
    font-size:14px;font-family:'Quicksand',sans-serif;font-weight:600;color:#1a3d2b;
    outline:none;transition:border-color .2s,box-shadow .2s;box-sizing:border-box;
  }
  .reg-field input:focus { border-color:#16a34a;background:#fff;box-shadow:0 0 0 4px rgba(22,163,74,.12); }
  .reg-field input::placeholder{color:#a7d4b8;font-weight:500;}

  .reg-pw-wrap{position:relative;}
  .reg-pw-wrap input{padding-right:44px;}
  .reg-pw-toggle{
    position:absolute;right:12px;top:50%;transform:translateY(-50%);
    background:none;border:none;cursor:pointer;color:#a7d4b8;
    display:flex;align-items:center;padding:3px;transition:color .2s;
  }
  .reg-pw-toggle:hover{color:#16a34a;}

  .reg-role-label { display:block;font-size:11px;font-weight:700;color:#7aad8e;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px; }
  .reg-role-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
  .reg-role-btn {
    padding:12px 8px;border-radius:14px;border:2px solid #bbf7d0;background:#f0fdf4;
    font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;color:#4d7a60;
    cursor:pointer;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:5px;
  }
  @media(min-width:360px){ .reg-role-btn { padding:13px 10px; } }
  .reg-role-btn:hover{border-color:#16a34a;background:#dcfce7;}
  .reg-role-btn.active-worker{background:#dcfce7;border-color:#16a34a;color:#15803d;box-shadow:0 0 0 3px rgba(22,163,74,.15);}
  .reg-role-btn.active-employer{background:#dbeafe;border-color:#3b82f6;color:#1d4ed8;box-shadow:0 0 0 3px rgba(59,130,246,.15);}
  .reg-role-emoji{font-size:20px;}
  @media(min-width:360px){ .reg-role-emoji{font-size:22px;} }

  .reg-submit {
    width:100%;padding:13px;
    background:linear-gradient(135deg,#22c55e 0%,#16a34a 50%,#15803d 100%);
    color:#fff;border:none;border-radius:14px;
    font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;
    cursor:pointer;box-shadow:0 4px 18px rgba(22,163,74,.38);
    transition:opacity .2s,transform .15s;margin-top:4px;
  }
  .reg-submit:hover{opacity:.93;transform:translateY(-1px);}

  .reg-signin-row{margin-top:20px;text-align:center;font-size:13.5px;color:#7aad8e;font-weight:600;}
  .reg-signin-row a{color:#16a34a;text-decoration:none;font-weight:700;}
`

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'worker' })
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPwConf, setShowPwConf] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/register', form)
      navigate('/login')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : 'Registration failed')
    }
  }

  const EyeIcon = ({ visible }) => visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">
        <div className="reg-blob reg-blob-1" /><div className="reg-blob reg-blob-2" />
        <div className="reg-blob reg-blob-3" /><div className="reg-blob reg-blob-4" />
        <div className="reg-shape reg-shape-1" /><div className="reg-shape reg-shape-2" />
        <div className="reg-shape reg-shape-3" /><div className="reg-shape reg-shape-4" />
        <div className="reg-shape reg-shape-5" />

        {/* LEFT PANEL */}
        <div className="reg-left">
          <div className="reg-illustration">
            <svg viewBox="0 0 370 270" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="370" height="270" rx="22" fill="#edfdf5"/>
              <circle cx="310" cy="55" r="36" fill="#fef08a" opacity=".7"/>
              <circle cx="310" cy="55" r="24" fill="#fde047"/>
              <ellipse cx="75" cy="52" rx="40" ry="17" fill="white" opacity=".88"/>
              <ellipse cx="98" cy="45" rx="28" ry="19" fill="white" opacity=".88"/>
              <rect x="0" y="205" width="370" height="65" fill="#bbf7d0" opacity=".7"/>
              <rect x="22" y="115" width="72" height="115" rx="6" fill="#fce7f3"/>
              <rect x="32" y="126" width="16" height="18" rx="3" fill="white" opacity=".75"/>
              <rect x="56" y="126" width="16" height="18" rx="3" fill="white" opacity=".75"/>
              <rect x="40" y="185" width="28" height="45" rx="4" fill="white" opacity=".55"/>
              <rect x="122" y="85" width="92" height="145" rx="6" fill="#dcfce7"/>
              <rect x="134" y="98" width="18" height="20" rx="3" fill="white" opacity=".75"/>
              <rect x="162" y="98" width="18" height="20" rx="3" fill="white" opacity=".75"/>
              <rect x="152" y="188" width="32" height="42" rx="4" fill="white" opacity=".5"/>
              <rect x="244" y="135" width="62" height="95" rx="6" fill="#dbeafe"/>
              <rect x="254" y="148" width="14" height="16" rx="3" fill="white" opacity=".75"/>
              <rect x="259" y="200" width="22" height="30" rx="3" fill="white" opacity=".5"/>
              <circle cx="100" cy="193" r="12" fill="#fcd9b6"/>
              <rect x="91" y="204" width="18" height="26" rx="5" fill="#22c55e"/>
              <rect x="85" y="207" width="9" height="18" rx="4" fill="#4ade80"/>
              <rect x="106" y="207" width="9" height="18" rx="4" fill="#4ade80"/>
              <rect x="93" y="228" width="7" height="14" rx="3" fill="#fbbf24"/>
              <rect x="104" y="228" width="7" height="14" rx="3" fill="#fbbf24"/>
              <circle cx="332" cy="190" r="12" fill="#fcd9b6"/>
              <rect x="323" y="201" width="18" height="26" rx="5" fill="#f472b6"/>
              <rect x="317" y="204" width="9" height="18" rx="4" fill="#f9a8d4"/>
              <rect x="338" y="204" width="9" height="18" rx="4" fill="#f9a8d4"/>
              <rect x="325" y="225" width="7" height="14" rx="3" fill="#fbbf24"/>
              <rect x="336" y="225" width="7" height="14" rx="3" fill="#fbbf24"/>
            </svg>
          </div>
          <h1 className="reg-brand-title">Start Your Journey<br /><span>With Us Today</span></h1>
          <p className="reg-brand-sub">Join thousands of workers and employers building opportunities in their local communities.</p>
          <div className="reg-features">
            <div className="reg-feature-item"><div className="reg-feature-dot" style={{ background: '#dcfce7' }}>✍️</div>Create your professional profile</div>
            <div className="reg-feature-item"><div className="reg-feature-dot" style={{ background: '#dbeafe' }}>⚡</div>Apply or post jobs instantly</div>
            <div className="reg-feature-item"><div className="reg-feature-dot" style={{ background: '#f3e8ff' }}>🔒</div>Secure and trusted platform</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="reg-right">
          <div className="reg-card">

            {/* JobFinder Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '18px' }}>
              <svg width="68" height="68" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="regBriefGrad" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                {/* Briefcase body */}
                <rect x="8" y="22" width="56" height="42" rx="8" fill="none" stroke="url(#regBriefGrad)" strokeWidth="3.5" />
                {/* Briefcase handle */}
                <path d="M26 22v-5a4 4 0 014-4h12a4 4 0 014 4v5" stroke="url(#regBriefGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Magnifying glass circle */}
                <circle cx="36" cy="44" r="10" fill="none" stroke="url(#regBriefGrad)" strokeWidth="3" />
                {/* Magnifying glass handle */}
                <line x1="43" y1="51" x2="52" y2="60" stroke="url(#regBriefGrad)" strokeWidth="3.5" strokeLinecap="round" />
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

            <div className="reg-card-title">Create Account</div>
            <p className="reg-card-sub">Join Local Job Finder today</p>

            {error && <div className="reg-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="reg-field">
                <label>Full Name</label>
                <input type="text" required placeholder="Juan dela Cruz"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="reg-field">
                <label>Email</label>
                <input type="email" required placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="reg-field">
                <label>Password</label>
                <div className="reg-pw-wrap">
                  <input type={showPw ? 'text' : 'password'} required minLength={8} maxLength={20} placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <button type="button" className="reg-pw-toggle" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                    <EyeIcon visible={showPw} />
                  </button>
                </div>
              </div>
              <div className="reg-field">
                <label>Confirm Password</label>
                <div className="reg-pw-wrap">
                  <input type={showPwConf ? 'text' : 'password'} required minLength={8} maxLength={20} placeholder="••••••••"
                    value={form.password_confirmation} onChange={e => setForm({ ...form, password_confirmation: e.target.value })} />
                  <button type="button" className="reg-pw-toggle" onClick={() => setShowPwConf(p => !p)} tabIndex={-1}>
                    <EyeIcon visible={showPwConf} />
                  </button>
                </div>
              </div>

              <label className="reg-role-label">I am a...</label>
              <div className="reg-role-grid">
                <button type="button" className={`reg-role-btn ${form.role === 'worker' ? 'active-worker' : ''}`}
                  onClick={() => setForm({ ...form, role: 'worker' })}>
                  <span className="reg-role-emoji">👷</span>Worker
                </button>
                <button type="button" className={`reg-role-btn ${form.role === 'employer' ? 'active-employer' : ''}`}
                  onClick={() => setForm({ ...form, role: 'employer' })}>
                  <span className="reg-role-emoji">🏢</span>Employer
                </button>
              </div>

              <button type="submit" className="reg-submit">Create Account 🌟</button>
            </form>

            <div className="reg-signin-row">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}