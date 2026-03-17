import { Avatar } from '../common/Avatar'
import { useAuth } from '../../hooks/useAuth'

export function TopBar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-indigo-700">🔒 SecureMail</span>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">{user.email}</span>
          <Avatar name={user.name} picture={user.picture} size={32} />
          <button
            onClick={logout}
            className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
