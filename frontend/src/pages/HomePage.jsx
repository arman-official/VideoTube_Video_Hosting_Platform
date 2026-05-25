import { useEffect, useState } from 'react'
import { api } from '../api'
import VideoCard from '../components/VideoCard'

export default function HomePage() {
  const [q, setQ] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchVideos = async (query = '') => {
    setLoading(true)
    try {
      const { data } = await api.get(`/videos${query ? `?q=${encodeURIComponent(query)}` : ''}`)
      setVideos(data.data.items)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const { data } = await api.get('/videos')
        if (active) setVideos(data.data.items)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="space-y-6">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search videos"
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
        />
        <button className="rounded bg-indigo-600 px-4 py-2" onClick={() => fetchVideos(q)}>Search</button>
      </div>
      {loading ? <p>Loading videos...</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => <VideoCard key={video._id} video={video} />)}
        </div>
      )}
    </section>
  )
}
