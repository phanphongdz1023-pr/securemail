import type { CryptoPayload } from '../../types'

interface Props { payload: CryptoPayload }

export function CipherPanel({ payload }: Props) {
  const preview = JSON.stringify(payload, null, 2)
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-900 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Encrypted Payload</p>
      <pre className="overflow-x-auto text-xs text-green-400 leading-relaxed">
        {preview.length > 400 ? preview.slice(0, 400) + '\n  ...' : preview}
      </pre>
    </div>
  )
}
