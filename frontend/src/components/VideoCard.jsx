import { Link } from 'react-router-dom'

export default function VideoCard({ video }) {
  return (
    <Link to={`/videos/${video._id}`} className="block overflow-hidden rounded-lg border border-slate-800 bg-slate-900 hover:border-indigo-500">
      <img
        src={video.thumbnailPath || 'https://placehold.co/640x360?text=Video'}
        alt={video.title}
        className="h-44 w-full object-cover"
      />
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-semibold">{video.title}</h3>
        <p className="text-xs text-slate-400">{video.owner?.username} · {video.views} views</p>
      </div>
    </Link>
  )
}
