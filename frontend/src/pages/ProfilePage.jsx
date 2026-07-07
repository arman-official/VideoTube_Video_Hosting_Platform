import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../api'
import VideoCard from '../components/VideoCard'
import { useAuth } from '../context/useAuth'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [videos, setVideos] = useState([])
  const [form, setForm] = useState({ fullName: null, email: null, password: '' })

  useEffect(() => {
    if (!user) return
    api.get(`/videos?owner=${user._id}`).then(({ data }) => setVideos(data.data.items))
  }, [user])

  const update = async (event) => {
    event.preventDefault()
    try {
      const payload = {}
      const nextFullName = form.fullName ?? user.fullName
      const nextEmail = form.email ?? user.email
      if (nextFullName !== user.fullName) payload.fullName = nextFullName
      if (nextEmail !== user.email) payload.email = nextEmail
      if (form.password) payload.password = form.password
      if (!Object.keys(payload).length) {
        toast('No profile changes detected')
        return
      }
      const { data } = await api.patch('/users/profile', payload)
      setUser(data.data)
      toast.success('Profile updated')
      setForm({ fullName: null, email: null, password: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  return (
    <section className="space-y-6">
      <form onSubmit={update} className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">My account</p>
        <h1 className="text-2xl font-bold text-white">Profile settings</h1>
        <input className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-indigo-400" value={form.fullName ?? user?.fullName ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} />
        <input className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-indigo-400" value={form.email ?? user?.email ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        <input type="password" className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-indigo-400" placeholder="New password (optional)" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        <button className="rounded-xl bg-indigo-500 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-400">Save changes</button>
      </form>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Your uploads</h2>
        {videos.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => <VideoCard key={video._id} video={video} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/50 p-8 text-center text-slate-400">You have not uploaded videos yet.</div>
        )}
      </div>
    </section>
  )
}
