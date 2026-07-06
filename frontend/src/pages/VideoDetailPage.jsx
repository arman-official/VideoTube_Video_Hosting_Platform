import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import toast from 'react-hot-toast'
import { api } from '../api'
import { useAuth } from '../context/useAuth'

export default function VideoDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const [videoRes, commentRes] = await Promise.all([
          api.get(`/videos/${id}`),
          api.get(`/videos/${id}/comments`)
        ])
        if (active) {
          setVideo(videoRes.data.data)
          setComments(commentRes.data.data)
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const addComment = async () => {
    if (!commentText.trim()) return
    try {
      await api.post(`/videos/${id}/comments`, { text: commentText })
      setCommentText('')
      const [videoRes, commentRes] = await Promise.all([
        api.get(`/videos/${id}`),
        api.get(`/videos/${id}/comments`)
      ])
      setVideo(videoRes.data.data)
      setComments(commentRes.data.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment')
    }
  }

  if (loading || !video) return <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center">Loading...</p>

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg shadow-black/30">
        <ReactPlayer url={`/api/v1/videos/${video._id}/stream`} controls width="100%" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h1 className="text-2xl font-bold text-white">{video.title}</h1>
        <p className="mt-2 text-sm text-slate-400">{video.owner?.username} · {video.views} views</p>
        <p className="mt-4 text-slate-300">{video.description || 'No description provided.'}</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-white">Comments</h2>
        {user && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              placeholder="Add a comment"
            />
            <button onClick={addComment} className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">Post</button>
          </div>
        )}
        {comments.length ? (
          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment._id} className="rounded-xl border border-white/5 bg-slate-950/80 p-3 text-sm">
                <p className="font-semibold text-indigo-300">{comment.owner?.username}</p>
                <p className="mt-1 text-slate-300">{comment.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No comments yet.</p>
        )}
      </div>
    </section>
  )
}
