import { useEffect, useState } from 'react'
import { api } from '../api'
import VideoCard from '../components/VideoCard'

export default function HomePage() {
  const [q, setQ] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const hasSearch = q.trim().length > 0

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
    <section className="space-y-8">
      <div className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/20 via-slate-900/70 to-cyan-500/20 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-200">Welcome to VideoTube</p>
        <h1 className="max-w-3xl text-2xl font-bold text-white md:text-4xl">Discover stories, tutorials, and creators from around the world.</h1>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search videos, creators, or topics"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
          />
          <button className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400" onClick={() => fetchVideos(q)}>Search</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{hasSearch ? 'Search Results' : 'Trending uploads'}</h2>
        <p className="text-sm text-slate-400">{videos.length} video{videos.length === 1 ? '' : 's'}</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-300">Loading videos...</div>
      ) : videos.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => <VideoCard key={video._id} video={video} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/50 p-10 text-center text-slate-400">
          No videos found. Try another search.
        </div>
      )}
    </section>
  )
}
