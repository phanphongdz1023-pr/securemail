import { useMailStore } from '../../store/mailStore'

const folders = [
  { id: 'inbox' as const, label: 'Inbox', icon: '📥' },
  { id: 'sent' as const, label: 'Sent', icon: '📤' },
  { id: 'trash' as const, label: 'Trash', icon: '🗑️' },
]

export function Sidebar() {
  const { currentFolder, setFolder, toggleCompose } = useMailStore()

  return (
    <aside className="flex w-16 flex-col items-center gap-1 border-r border-slate-200 bg-slate-50 py-4 md:w-48 md:items-start md:px-3">
      <button
        onClick={toggleCompose}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
      >
        <span className="text-base">✏️</span>
        <span className="hidden md:inline">Compose</span>
      </button>

      {folders.map((f) => (
        <button
          key={f.id}
          onClick={() => setFolder(f.id)}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors md:justify-start ${
            currentFolder === f.id
              ? 'bg-indigo-100 font-semibold text-indigo-700'
              : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
          }`}
        >
          <span>{f.icon}</span>
          <span className="hidden md:inline">{f.label}</span>
        </button>
      ))}
    </aside>
  )
}
