import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

// ─── 3-step forgot password flow ───────────────────────────────────────────
// Step 1: Enter email or phone  → sends OTP
// Step 2: Enter the 6-digit OTP → verifies it
// Step 3: Enter new password    → resets it
// ───────────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [step,       setStep]       = useState(1)          // 1 | 2 | 3
  const [identifier, setIdentifier] = useState('')
  const [masked,     setMasked]     = useState('')          // masked email/phone for display
  const [method,     setMethod]     = useState('')          // 'email' | 'sms'
  const [otp,        setOtp]        = useState(['','','','','',''])
  const [password,   setPassword]   = useState('')
  const [confirm,    setConfirm]    = useState('')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [success,    setSuccess]    = useState(false)

  // ── Step 1: send OTP ──────────────────────────────────────────────────────
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

  // ── OTP box helpers ───────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return           // digits only
    const updated = [...otp]
    updated[index] = value.slice(-1)           // one digit per box
    setOtp(updated)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const updated = [...otp]
    for (let i = 0; i < 6; i++) updated[i] = pasted[i] || ''
    setOtp(updated)
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus()
  }

  // ── Step 2: verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    const code = otp.join('')
    if (code.length < 6) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }
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

  // ── Step 3: reset password ────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await api.post('/forgot-password/reset', {
        identifier,
        otp: otp.join(''),
        password,
        password_confirmation: confirm,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  // ── resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setError('')
    setOtp(['','','','','',''])
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

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex bg-[#0b0a13] overflow-hidden items-center justify-center">

      {/* Background blurs — same as LoginPage */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-700 rounded-full blur-[140px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-indigo-700 rounded-full blur-[140px] opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">

          {/* ── Step indicator ── */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === s
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40'
                    : step > s
                    ? 'bg-purple-900/60 text-purple-300'
                    : 'bg-white/5 text-gray-600 border border-white/10'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`h-px w-8 transition-all duration-500 ${step > s ? 'bg-purple-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── SUCCESS screen ── */}
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-700/40 flex items-center justify-center text-3xl mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
              <p className="text-gray-400 text-sm">Redirecting you to login...</p>
            </div>
          ) : (
            <>
              {/* ── STEP 1: Enter identifier ── */}
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-1">Forgot Password</h2>
                  <p className="text-sm text-gray-400 mb-8">
                    Enter your registered email or phone number and we'll send you a reset code.
                  </p>

                  {error && <ErrorBox message={error} />}

                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Email or Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="you@example.com or 09XXXXXXXXX"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-600/40 outline-none transition"
                      />
                    </div>

                    <SubmitButton loading={loading} label="Send Reset Code" />
                  </form>

                  <p className="mt-6 text-sm text-gray-400 text-center">
                    Remember it?{' '}
                    <Link to="/login" className="text-purple-400 hover:text-purple-300 transition">
                      Sign in
                    </Link>
                  </p>
                </>
              )}

              {/* ── STEP 2: Enter OTP ── */}
              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-1">Enter OTP</h2>
                  <p className="text-sm text-gray-400 mb-2">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-sm font-semibold text-purple-400 mb-8">
                    {masked} via {method === 'email' ? '📧 Email' : '📱 SMS'}
                  </p>

                  {error && <ErrorBox message={error} />}

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    {/* OTP boxes */}
                    <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="w-11 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600/40 outline-none transition"
                        />
                      ))}
                    </div>

                    <SubmitButton loading={loading} label="Verify Code" />
                  </form>

                  <div className="mt-4 text-center space-y-2">
                    <button
                      onClick={handleResend}
                      disabled={loading}
                      className="text-sm text-purple-400 hover:text-purple-300 transition disabled:opacity-50"
                    >
                      Didn't receive it? Resend OTP
                    </button>
                    <br />
                    <button
                      onClick={() => { setStep(1); setError('') }}
                      className="text-xs text-gray-500 hover:text-gray-400 transition"
                    >
                      ← Use a different email/phone
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 3: New password ── */}
              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-1">New Password</h2>
                  <p className="text-sm text-gray-400 mb-8">
                    Choose a strong password for your account.
                  </p>

                  {error && <ErrorBox message={error} />}

                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600/40 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600/40 outline-none transition"
                      />
                    </div>

                    {/* Password strength hint */}
                    {password && (
                      <p className={`text-xs ${password.length >= 8 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {password.length >= 8 ? '✓ Strong enough' : `${8 - password.length} more characters needed`}
                      </p>
                    )}

                    <SubmitButton loading={loading} label="Reset Password" />
                  </form>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Small reusable sub-components ────────────────────────────────────────────

function ErrorBox({ message }) {
  return (
    <p className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-800 px-3 py-2 rounded-lg">
      {message}
    </p>
  )
}

function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-xl transition duration-300 shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </>
      ) : label}
    </button>
  )
}