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
    <form onSubmit={submit} className="space-y-4 rounded border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-xl font-bold">Upload Video</h1>
      <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      <div>
        <label className="mb-1 block text-sm text-slate-300">Video file</label>
        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Thumbnail (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
      </div>
      <button className="rounded bg-indigo-600 px-4 py-2">Upload</button>
    </form>
  )
}
