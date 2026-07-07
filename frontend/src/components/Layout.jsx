import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navLinkClass = ({ isActive }) => `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-indigo-500/20 text-indigo-200' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`

  return (
    <div className="min-h-screen bg-slate-950/70 text-slate-200">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <span className="rounded-lg bg-gradient-to-br from-indigo-400 to-cyan-400 px-2 py-1 text-slate-950">VT</span>
            <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">VideoTube</span>
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            {user && <NavLink to="/upload" className={navLinkClass}>Upload</NavLink>}
            {user && <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>}
            {!user ? (
              <>
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink to="/register" className={navLinkClass}>Register</NavLink>
              </>
            ) : (
              <button
                className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
