import type { CryptoPayload } from '../../types'

interface Props { payload: CryptoPayload }

export function SecurityDetails({ payload }: Props) {
  const isRsa = payload.mode === 'rsa'
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-600">
      <p className="mb-1.5 font-semibold text-slate-800 not-italic">🔐 Security Details</p>
      <div className="space-y-1">
        <p><span className="text-indigo-600">Encryption:</span> AES-256-GCM</p>
        {/* PBKDF2 is only used in password mode — not in RSA mode */}
        {!isRsa && (
          <p><span className="text-indigo-600">Key derivation:</span> PBKDF2-SHA256 · 100,000 iterations</p>
        )}
        {isRsa && (
          <p><span className="text-indigo-600">Key derivation:</span> N/A (asymmetric RSA mode)</p>
        )}
        <p><span className="text-indigo-600">Key wrapping:</span> {isRsa ? 'RSA-OAEP 2048-bit' : 'AES-KW 256-bit'}</p>
        <p><span className="text-indigo-600">Mode:</span> {isRsa ? 'RSA Public Key' : 'Password (PBKDF2 + AES-KW)'}</p>
        <p><span className="text-indigo-600">Version:</span> SecureMail {payload.version}</p>
      </div>
    </div>
  )
}
