import { useState, useRef, useEffect } from 'react'
import { Spinner } from '../common/Spinner'

interface Props {
  mode: 'password' | 'rsa'
  onDecrypt: (secret: string) => Promise<void>  // password string OR private key PEM
  error: string | null
}

export function DecryptForm({ mode, onDecrypt, error }: Props) {
  const [secret, setSecret] = useState('')
  const [shaking, setShaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (error) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }, [error])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onDecrypt(secret)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {mode === 'password' ? (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            ref={inputRef}
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter message password"
            required
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              error ? 'border-red-400' : 'border-slate-300'
            } ${shaking ? 'animate-bounce' : ''}`}
          />
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Your RSA Private Key (PEM)</label>
          <textarea
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
            rows={5}
            required
            className={`w-full rounded-lg border px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500 ${
              error ? 'border-red-400' : 'border-slate-300'
            }`}
          />
          <p className="mt-0.5 text-xs text-slate-400">Your private key never leaves your browser.</p>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || !secret}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? <Spinner size="sm" /> : '🔓'}
        Decrypt Message
      </button>
    </form>
  )
}
