import axios from 'axios'
import { Preferences } from '@capacitor/preferences'

const api = axios.create({
  //baseURL: 'http://ZEL:8000/api',
  baseURL: 'http://192.168.10.82:8000/api',
  //baseURL: 'http://10.0.2.2:8000/api'
   //baseURL: 'http://localhost:8000/api',
   // baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// ✅ MAKE THIS ASYNC
api.interceptors.request.use(async (config) => {
  const { value: token } = await Preferences.get({ key: 'token' })

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ✅ ALSO UPDATE RESPONSE HANDLER
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await Preferences.remove({ key: 'token' })
      await Preferences.remove({ key: 'user' })

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api