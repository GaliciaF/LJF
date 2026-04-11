import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const styles = `
  .fp-root {
    min-height: 100vh;
    background: #fffdf5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
  }
  @media (min-width: 480px) { .fp-root { padding: 24px; } }

  .fp-card {
    background: #fff;
    border: 1px solid #e5e0d0;
    border-radius: 20px;
    padding: 28px 20px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 4px 24px rgba(0,0,0,.07);
    box-sizing: border-box;
  }
  @media (min-width: 480px) { .fp-card { padding: 40px; } }

  .fp-steps {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 28px;
  }

  .fp-step-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700;
    flex-shrink: 0;
  }

  .fp-step-line {
    height: 2px; width: 28px; border-radius: 2px;
  }
  @media (min-width: 360px) { .fp-step-line { width: 36px; } }

  .fp-brand {
    display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
  }

  .fp-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
  }
  @media (min-width: 480px) { .fp-title { font-size: 20px; } }

  .fp-sub {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .fp-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #92713a;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
  }

  .fp-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e5e0d0;
    border-radius: 10px;
    font-size: 13px;
    color: #111827;
    background: #fffdf5;
    outline: none;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .fp-input:focus { border-color: #d97706; }

  .fp-pw-wrap { position: relative; }
  .fp-pw-wrap .fp-input { padding-right: 44px; }
  .fp-pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 0;
    display: flex; align-items: center; color: #9ca3af;
  }

  .fp-btn {
    width: 100%;
    padding: 12px;
    background: #d97706;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    margin-top: 8px;
    font-family: inherit;
    transition: opacity 0.15s;
  }
  .fp-btn:hover { opacity: 0.9; }
  .fp-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .fp-error {
    background: rgba(239,68,68,.08);
    border: 1px solid rgba(239,68,68,.3);
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 16px;
    color: #ef4444;
    font-size: 13px;
    font-weight: 500;
  }

  .fp-otp-row {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-bottom: 24px;
  }
  @media (min-width: 360px) { .fp-otp-row { gap: 8px; } }
  @media (min-width: 480px) { .fp-otp-row { gap: 10px; } }

  .fp-otp-input {
    width: 38px; height: 48px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    border: 1.5px solid #e5e0d0;
    border-radius: 10px;
    background: #fffdf5;
    color: #111827;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  @media (min-width: 360px) { .fp-otp-input { width: 42px; height: 50px; } }
  @media (min-width: 480px) { .fp-otp-input { width: 44px; height: 52px; font-size: 20px; } }
  .fp-otp-input:focus { border-color: #d97706; }

  .fp-field { margin-bottom: 14px; }

  .fp-pw-strength {
    font-size: 12px;
    margin-bottom: 8px;
  }

  .fp-success-icon {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: #dcfce7;
    border: 1px solid #86efac;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    margin: 0 auto 16px;
  }
`

export default function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [masked, setMasked] = useState('')
  const [method, setMethod] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/forgot-password/send-otp', { identifier })
      setMasked(res.data.masked)
      setMethod(res.data.method)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const updated = [...otp]
    updated[index] = value.slice(-1)
    setOtp(updated)
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus()
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const updated = [...otp]
    for (let i = 0; i < 6; i++) updated[i] = pasted[i] || ''
    setOtp(updated)
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus()
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the complete 6-digit OTP.'); return }
    setLoading(true)
    try {
      await api.post('/forgot-password/verify-otp', { identifier, otp: code })
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await api.post('/forgot-password/reset', {
        identifier, otp: otp.join(''), password, password_confirmation: confirm,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setOtp(['', '', '', '', '', ''])
    setLoading(true)
    try {
      const res = await api.post('/forgot-password/send-otp', { identifier })
      setMasked(res.data.masked)
      setMethod(res.data.method)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.')
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = ({ visible }) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {visible ? (
        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
      ) : (
        <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
      )}
    </svg>
  )

  const stepDotStyle = (s) => ({
    background: step === s ? '#d97706' : step > s ? '#fde68a' : '#f3f4f6',
    color: step === s ? '#fff' : step > s ? '#92400e' : '#9ca3af',
    border: step === s ? 'none' : step > s ? '1px solid #fbbf24' : '1px solid #e5e7eb',
  })

  return (
    <>
      <style>{styles}</style>
      <div className="fp-root">
        <div className="fp-card">

          {/* Step indicator */}
          <div className="fp-steps">
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="fp-step-dot" style={stepDotStyle(s)}>{step > s ? '✓' : s}</div>
                {s < 3 && <div className="fp-step-line" style={{ background: step > s ? '#fbbf24' : '#e5e7eb' }} />}
              </div>
            ))}
          </div>

          {/* Brand */}
          <div className="fp-brand">
            <div style={{ width: '32px', height: '32px', background: '#d97706', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '16px', flexShrink: 0 }}>L</div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#92400e' }}>Local Job Finder</span>
          </div>

          {/* SUCCESS */}
          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div className="fp-success-icon">✓</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>Password Reset!</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Redirecting you to login...</div>
            </div>
          ) : (
            <>
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="fp-title">Forgot Password</div>
                  <div className="fp-sub">Enter your registered email or phone number and we'll send you a reset code.</div>
                  {error && <div className="fp-error">{error}</div>}
                  <form onSubmit={handleSendOtp}>
                    <div className="fp-field">
                      <label className="fp-label">Email or Phone Number</label>
                      <input type="text" required placeholder="you@example.com or 09XXXXXXXXX"
                        value={identifier} onChange={e => setIdentifier(e.target.value)} className="fp-input" />
                    </div>
                    <button type="submit" disabled={loading} className="fp-btn">
                      {loading ? 'Sending...' : 'Send Reset Code'}
                    </button>
                  </form>
                  <p style={{ marginTop: '20px', fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
                    Remember it?{' '}
                    <Link to="/login" style={{ color: '#d97706', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                  </p>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="fp-title">Enter OTP</div>
                  <div className="fp-sub">We sent a 6-digit code to</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#d97706', marginBottom: '24px' }}>
                    {masked} via {method === 'email' ? '📧 Email' : '📱 SMS'}
                  </div>
                  {error && <div className="fp-error">{error}</div>}
                  <form onSubmit={handleVerifyOtp}>
                    <div className="fp-otp-row" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i} id={`otp-${i}`}
                          type="text" inputMode="numeric" maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="fp-otp-input"
                        />
                      ))}
                    </div>
                    <button type="submit" disabled={loading} className="fp-btn">
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                  </form>
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <button onClick={handleResend} disabled={loading}
                      style={{ background: 'none', border: 'none', color: '#d97706', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Didn't receive it? Resend OTP
                    </button>
                    <br />
                    <button onClick={() => { setStep(1); setError('') }}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', marginTop: '6px', fontFamily: 'inherit' }}>
                      ← Use a different email/phone
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <div className="fp-title">New Password</div>
                  <div className="fp-sub">Choose a strong password for your account.</div>
                  {error && <div className="fp-error">{error}</div>}
                  <form onSubmit={handleResetPassword}>
                    <div className="fp-field">
                      <label className="fp-label">New Password</label>
                      <div className="fp-pw-wrap">
                        <input type={showPw ? 'text' : 'password'} required minLength={8}
                          placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="fp-input" />
                        <button type="button" className="fp-pw-toggle" onClick={() => setShowPw(v => !v)}>
                          <EyeIcon visible={showPw} />
                        </button>
                      </div>
                    </div>
                    <div className="fp-field">
                      <label className="fp-label">Confirm Password</label>
                      <div className="fp-pw-wrap">
                        <input type={showCf ? 'text' : 'password'} required minLength={8}
                          placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} className="fp-input" />
                        <button type="button" className="fp-pw-toggle" onClick={() => setShowCf(v => !v)}>
                          <EyeIcon visible={showCf} />
                        </button>
                      </div>
                    </div>
                    {password && (
                      <div className="fp-pw-strength" style={{ color: password.length >= 8 ? '#16a34a' : '#d97706' }}>
                        {password.length >= 8 ? '✓ Strong enough' : `${8 - password.length} more characters needed`}
                      </div>
                    )}
                    <button type="submit" disabled={loading} className="fp-btn">
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}