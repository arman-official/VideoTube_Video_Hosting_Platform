import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ identity: '', password: '' })

  const submit = async (event) => {
    event.preventDefault()
    try {
      const payload = form.identity.includes('@')
        ? { email: form.identity, password: form.password }
        : { username: form.identity, password: form.password }
      const { data } = await api.post('/auth/login', payload)
      login(data.data)
      toast.success('Welcome back!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-xl font-bold">Login</h1>
      <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Email or username" value={form.identity} onChange={(e) => setForm((prev) => ({ ...prev, identity: e.target.value }))} />
      <input type="password" className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
      <button className="w-full rounded bg-indigo-600 py-2">Login</button>
      <p className="text-sm text-slate-400">No account? <Link to="/register" className="text-indigo-300">Register</Link></p>
    </form>
  )
}
