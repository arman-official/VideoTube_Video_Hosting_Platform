import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../api'
import VideoCard from '../components/VideoCard'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [videos, setVideos] = useState([])
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })

  useEffect(() => {
    if (!user) return
    setForm({ fullName: user.fullName, email: user.email, password: '' })
    api.get(`/videos?owner=${user._id}`).then(({ data }) => setVideos(data.data.items))
  }, [user])

  const update = async (event) => {
    event.preventDefault()
    try {
      const payload = { fullName: form.fullName, email: form.email }
      if (form.password) payload.password = form.password
      const { data } = await api.patch('/users/profile', payload)
      setUser(data.data)
      toast.success('Profile updated')
      setForm((prev) => ({ ...prev, password: '' }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  return (
    <section className="space-y-6">
      <form onSubmit={update} className="space-y-3 rounded border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-xl font-bold">Profile</h1>
        <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} />
        <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        <input type="password" className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="New password (optional)" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        <button className="rounded bg-indigo-600 px-4 py-2">Save changes</button>
      </form>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Your uploads</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => <VideoCard key={video._id} video={video} />)}
        </div>
      </div>
    </section>
  )
}
