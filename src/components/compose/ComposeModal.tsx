import { useState } from 'react'
import { useMailStore } from '../../store/mailStore'
import { cryptoService } from '../../services/cryptoService'
import { gmailService } from '../../services/gmailService'
import { buildMimeMessage } from '../../utils/mimeBuilder'
import { PublicKeyInput } from './PublicKeyInput'
import { PasswordLock } from './PasswordLock'
import { Spinner } from '../common/Spinner'

interface Props { onSent: () => void }

export function ComposeModal({ onSent }: Props) {
  const { toggleCompose, user, accessToken } = useMailStore()
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [isValidKey, setIsValidKey] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const canSend = to && subject && body && password.length >= 8 && password === confirm

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!canSend || !user || !accessToken) return
    setSending(true)
    setError('')
    try {
      let payload
      if (isValidKey && publicKey.trim()) {
        payload = await cryptoService.encryptWithPublicKey(body, publicKey, subject)
      } else {
        payload = await cryptoService.encrypt(body, password, subject)
      }
      const raw = buildMimeMessage(user.email, to, payload)
      await gmailService.sendMessage(accessToken, raw)
      toggleCompose()
      onSent()
    } catch (err) {
      setError('Failed to send. Check the recipient address and try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">🔒 New Encrypted Message</h2>
          <button onClick={toggleCompose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={handleSend} className="space-y-4 p-5">
          {/* To */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">To *</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              placeholder="recipient@gmail.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Subject (will be encrypted)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-0.5 text-xs text-amber-600">⚠️ Subject is encrypted — not visible in email header</p>
          </div>

          {/* Body */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Message *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={4}
              placeholder="Your message..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Public Key */}
          <PublicKeyInput value={publicKey} onChange={setPublicKey} onValidKey={setIsValidKey} />

          {/* Mode badge */}
          <p className="text-xs text-slate-500">
            Encryption mode: <span className="font-semibold text-indigo-700">{isValidKey ? '🔒 Password + RSA' : '🔒 Password only'}</span>
          </p>

          {/* Password */}
          <PasswordLock
            password={password}
            confirm={confirm}
            onPasswordChange={setPassword}
            onConfirmChange={setConfirm}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={toggleCompose} className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSend || sending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {sending ? <Spinner size="sm" /> : '🔒'}
              {sending ? 'Encrypting...' : 'Encrypt & Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
