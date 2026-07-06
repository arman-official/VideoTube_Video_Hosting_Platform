import { Link } from 'react-router-dom'

export default function VideoCard({ video }) {
  const createdAt = video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Recently'

  return (
    <Link to={`/videos/${video._id}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-indigo-400/60">
      <img
        src={video.thumbnailPath || 'https://placehold.co/640x360?text=Video'}
        alt={video.title}
        className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-white">{video.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-400">{video.description || 'No description available yet.'}</p>
        <p className="text-xs text-slate-400">{video.owner?.username || 'Unknown'} · {video.views} views · {createdAt}</p>
      </div>
    </Link>
  )
}
