import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../api'

export default function UploadPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [video, setVideo] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    if (!video) {
      toast.error('Select a video file')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('video', video)
    if (thumbnail) formData.append('thumbnail', thumbnail)

    try {
      const { data } = await api.post('/videos/upload', formData)
      toast.success('Video uploaded')
      navigate(`/videos/${data.data._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Creator studio</p>
      <h1 className="text-2xl font-bold text-white">Upload your next video</h1>
      <input className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-indigo-400" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-indigo-400" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-300">Video file</label>
        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} required />
      </div>
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-300">Thumbnail (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
      </div>
      <button className="rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400">Upload</button>
    </form>
  )
}
