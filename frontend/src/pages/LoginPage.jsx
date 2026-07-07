import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../api'
import { useAuth } from '../context/useAuth'

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
    <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/30 md:p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Welcome back</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Sign in to VideoTube</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-indigo-400" placeholder="Email or username" value={form.identity} onChange={(e) => setForm((prev) => ({ ...prev, identity: e.target.value }))} />
        <input type="password" className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-indigo-400" placeholder="Password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        <button className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white transition hover:bg-indigo-400">Login</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">No account? <Link to="/register" className="text-indigo-300 hover:text-indigo-200">Register</Link></p>
    </section>
  )
}
