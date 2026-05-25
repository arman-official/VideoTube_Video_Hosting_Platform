import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import toast from 'react-hot-toast'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export default function VideoDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  const load = async () => {
    const [videoRes, commentRes] = await Promise.all([
      api.get(`/videos/${id}`),
      api.get(`/videos/${id}/comments`)
    ])
    setVideo(videoRes.data.data)
    setComments(commentRes.data.data)
  }

  useEffect(() => {
    load()
  }, [id])

  const addComment = async () => {
    if (!commentText.trim()) return
    try {
      await api.post(`/videos/${id}/comments`, { text: commentText })
      setCommentText('')
      await load()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment')
    }
  }

  if (!video) return <p>Loading...</p>

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-lg">
        <ReactPlayer url={`/api/v1/videos/${video._id}/stream`} controls width="100%" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="text-sm text-slate-400">{video.owner?.username} · {video.views} views</p>
        <p className="text-slate-300">{video.description}</p>
      </div>

      <div className="space-y-3 rounded border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-lg font-semibold">Comments</h2>
        {user && (
          <div className="flex gap-2">
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Add a comment" />
            <button onClick={addComment} className="rounded bg-indigo-600 px-4">Post</button>
          </div>
        )}
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment._id} className="rounded bg-slate-950 p-3 text-sm">
              <p className="font-semibold text-indigo-300">{comment.owner?.username}</p>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
