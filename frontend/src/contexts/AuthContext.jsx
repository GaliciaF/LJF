import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { Preferences } from '@capacitor/preferences'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const { value: token }     = await Preferences.get({ key: 'token' })
      const { value: savedUser } = await Preferences.get({ key: 'user' })

      if (token && savedUser) {
        try {
          const parsed = JSON.parse(savedUser)
          // Normalize photo on load in case it was saved under a nested key
          const normalized = normalizeUser(parsed)
          setUser(normalized)
        } catch {
          await Preferences.remove({ key: 'token' })
          await Preferences.remove({ key: 'user' })
        }
      }

      setLoading(false)
    }

    loadUser()
  }, [])

  /**
   * Ensures the top-level `photo` field is always populated.
   * The backend may store it as employer_profile.photo_path or
   * worker_profile.photo_path depending on role — we hoist it up
   * so every Avatar component can just read `user.photo`.
   */
  const normalizeUser = (u) => {
    if (!u) return u
    const photo =
      u.photo ||
      u.employer_profile?.photo_path ||
      u.worker_profile?.photo_path  ||
      null
    return { ...u, photo }
  }

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password })
    const { token, user } = response.data

    const normalized = normalizeUser(user)

    await Preferences.set({ key: 'token', value: token })
    await Preferences.set({ key: 'user',  value: JSON.stringify(normalized) })

    setUser(normalized)
    return normalized.role
  }

  const logout = async () => {
    try { await api.post('/logout') } catch {}
    finally {
      await Preferences.remove({ key: 'token' })
      await Preferences.remove({ key: 'user' })
      setUser(null)
    }
  }

  /**
   * Merges updates into the current user, persists to Preferences,
   * and triggers a re-render. Always call this after a photo upload
   * or profile save so every Avatar in the app updates instantly.
   *
   * Usage:
   *   updateUser({ photo: freshUrl })
   *   updateUser({ name: 'New Name', photo: freshUrl })
   */
  const updateUser = (updates) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      // Fire-and-forget — we don't need to await this in the setter
      Preferences.set({ key: 'user', value: JSON.stringify(updated) })
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}