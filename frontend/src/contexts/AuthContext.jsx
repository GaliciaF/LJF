import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { Preferences } from '@capacitor/preferences'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const loadUser = async () => {
    const { value: token } = await Preferences.get({ key: 'token' })
    const { value: savedUser } = await Preferences.get({ key: 'user' })
  console.log('token:', token)        
  console.log('savedUser:', savedUser)
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        await Preferences.remove({ key: 'token' })
        await Preferences.remove({ key: 'user' })
      }
    }

    setLoading(false)
  }

  loadUser()
}, [])

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password })
    const { token, user } = response.data
    await Preferences.set({
    key: 'token',
    value: token,
  })

  await Preferences.set({
    key: 'user',
    value: JSON.stringify(user),
  })

  setUser(user)
  return user.role
}

  const logout = async () => {
    try { await api.post('/logout') } catch {}
    finally {
  await Preferences.remove({ key: 'token' })
await Preferences.remove({ key: 'user' })
      setUser(null)
    }
  }

  // Call this any time the profile photo or name changes
  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates }
Preferences.set({
  key: 'user',
  value: JSON.stringify(updated),
})      
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