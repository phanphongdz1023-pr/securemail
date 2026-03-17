interface Props {
  label?: string
}

export function EncryptedBadge({ label = '🔒' }: Props) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
      {label}
    </span>
  )
}
