import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'worker'
  })
  const [error, setError] = useState('')

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

  return (
    <div className="relative min-h-screen flex bg-[#0b0a13] overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-700 rounded-full blur-[140px] opacity-30"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-indigo-700 rounded-full blur-[140px] opacity-30"></div>

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-16">
        <div className="max-w-lg z-10">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Start Your Journey <br /> With Us Today
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            Join thousands of workers and employers building opportunities in their local communities.
          </p>

          <div className="space-y-4 text-gray-300">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <p>Create your professional profile</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              <p>Apply or post jobs instantly</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
              <p>Secure and trusted platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">

          <h2 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Join Local Job Finder
          </p>

          {error && (
            <p className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-800 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {[
              ['name', 'Full Name', 'text'],
              ['email', 'Email', 'email'],
              ['password', 'Password', 'password'],
              ['password_confirmation', 'Confirm Password', 'password']
            ].map(([key, label, type]) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {label}
                </label>
               <input
  type={type}
  required
  minLength={key === 'password' || key === 'password_confirmation' ? 8 : undefined}
  maxLength={key === 'password' || key === 'password_confirmation' ? 20 : undefined}
  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600/40 outline-none transition"
  value={form[key]}
  onChange={(e) =>
    setForm({ ...form, [key]: e.target.value })
  }
/>
              </div>
            ))}

            {/* ROLE SELECTOR */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                I am a...
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'worker' })}
                  className={`py-3 rounded-xl border transition ${
                    form.role === 'worker'
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Worker
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'employer' })}
                  className={`py-3 rounded-xl border transition ${
                    form.role === 'employer'
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  Employer
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-semibold rounded-xl transition duration-300 shadow-lg shadow-purple-900/40"
            >
              Create Account
            </button>

          </form>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}