import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../api'
import { useAuth } from '../context/useAuth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' })

  const submit = async (event) => {
    event.preventDefault()
    try {
      const { data } = await api.post('/auth/register', form)
      login(data.data)
      toast.success('Account created')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/30 md:p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Get started</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Create your account</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-cyan-400" placeholder="Full name" value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} />
        <input className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-cyan-400" placeholder="Username" value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} />
        <input className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-cyan-400" placeholder="Email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        <input type="password" className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-cyan-400" placeholder="Password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        <button className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">Create account</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">Already have an account? <Link to="/login" className="text-indigo-300 hover:text-indigo-200">Login</Link></p>
    </section>
  )
}
