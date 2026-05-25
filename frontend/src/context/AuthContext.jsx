import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        const { data } = await api.get('/users/profile')
        setUser(data.data)
      } catch {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [token])

  const login = (payload) => {
    localStorage.setItem('token', payload.token)
    setToken(payload.token)
    setUser(payload.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ token, user, loading, login, logout, setUser }), [token, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
