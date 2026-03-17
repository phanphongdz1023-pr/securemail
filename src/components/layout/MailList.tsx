import { useMailStore } from '../../store/mailStore'
import { EncryptedBadge } from '../common/Badge'
import type { MailMeta } from '../../types'

function SkeletonRow() {
  return (
    <div className="animate-pulse border-b border-slate-100 px-4 py-3">
      <div className="mb-1.5 h-3 w-1/3 rounded bg-slate-200" />
      <div className="mb-1 h-3 w-2/3 rounded bg-slate-200" />
      <div className="h-2.5 w-1/4 rounded bg-slate-200" />
    </div>
  )
}

function MailRow({
  mail,
  selected,
  onClick,
}: {
  mail: MailMeta
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
        selected ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''
      } ${!mail.isRead ? 'font-semibold' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm text-slate-800">{mail.from}</span>
        <div className="flex shrink-0 items-center gap-1">
          {mail.isEncrypted && <EncryptedBadge />}
          <span className="text-xs text-slate-400">
            {new Date(mail.date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
      <p className="mt-0.5 truncate text-sm text-slate-600">{mail.subject}</p>
      <p className="mt-0.5 truncate text-xs text-slate-400">{mail.snippet}</p>
    </button>
  )
}

export function MailList() {
  const { mailList, selectedMail, isLoading, setSelected } = useMailStore()

  if (isLoading) {
    return (
      <div className="w-80 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
        {[...Array(5)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  if (mailList.length === 0) {
    return (
      <div className="w-80 shrink-0 border-r border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400 gap-2">
        <span className="text-4xl">📭</span>
        <p className="text-sm">No messages</p>
      </div>
    )
  }

  return (
    <div className="w-80 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
      {mailList.map((mail) => (
        <MailRow
          key={mail.id}
          mail={mail}
          selected={selectedMail?.id === mail.id}
          onClick={() =>
            setSelected({
              ...mail,
              to: '',
              body: '',
              headers: {},
            })
          }
        />
      ))}
    </div>
  )
}
