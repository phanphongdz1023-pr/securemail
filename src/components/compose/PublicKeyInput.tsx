import { useState } from 'react'
import { cryptoService } from '../../services/cryptoService'

interface Props {
  value: string
  onChange: (val: string) => void
  onValidKey: (valid: boolean) => void
}

export function PublicKeyInput({ value, onChange, onValidKey }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState('')

  async function validateKey(pem: string) {
    if (!pem.trim()) {
      setError('')
      onValidKey(false)
      return
    }
    try {
      await cryptoService.importPublicKey(pem)
      setError('')
      onValidKey(true)
    } catch {
      setError('Invalid RSA public key. Paste a PEM-encoded RSA-2048 public key.')
      onValidKey(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800"
      >
        <span>{expanded ? '▼' : '▶'}</span>
        RSA Public Key (optional — adds asymmetric encryption)
      </button>
      {expanded && (
        <div className="mt-2">
          <textarea
            value={value}
            onChange={(e) => { onChange(e.target.value); validateKey(e.target.value) }}
            placeholder="-----BEGIN PUBLIC KEY-----&#10;...&#10;-----END PUBLIC KEY-----"
            rows={5}
            className={`w-full rounded-lg border px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500 ${error ? 'border-red-400' : 'border-slate-300'}`}
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          {value && !error && <p className="mt-1 text-xs text-green-600">✓ Valid RSA public key</p>}
        </div>
      )}
    </div>
  )
}
