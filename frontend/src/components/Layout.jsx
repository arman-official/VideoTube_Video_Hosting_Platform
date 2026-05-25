import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold text-indigo-400">VideoTube</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className="hover:text-indigo-300">Home</NavLink>
            {user && <NavLink to="/upload" className="hover:text-indigo-300">Upload</NavLink>}
            {user && <NavLink to="/profile" className="hover:text-indigo-300">Profile</NavLink>}
            {!user ? (
              <>
                <NavLink to="/login" className="hover:text-indigo-300">Login</NavLink>
                <NavLink to="/register" className="hover:text-indigo-300">Register</NavLink>
              </>
            ) : (
              <button
                className="rounded bg-slate-800 px-3 py-1 hover:bg-slate-700"
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
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}
