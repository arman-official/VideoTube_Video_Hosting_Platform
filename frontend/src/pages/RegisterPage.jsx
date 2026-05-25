import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

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
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-xl font-bold">Register</h1>
      <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Full name" value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} />
      <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Username" value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} />
      <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
      <input type="password" className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
      <button className="w-full rounded bg-indigo-600 py-2">Create account</button>
      <p className="text-sm text-slate-400">Already have an account? <Link to="/login" className="text-indigo-300">Login</Link></p>
    </form>
  )
}
