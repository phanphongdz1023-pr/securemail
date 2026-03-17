import { useEffect, useState } from 'react'
import { useMailStore } from '../store/mailStore'
import { gmailService } from '../services/gmailService'
import { cryptoService } from '../services/cryptoService'
import { SecurityDetails } from '../components/decrypt/SecurityDetails'
import { CipherPanel } from '../components/decrypt/CipherPanel'
import { DecryptForm } from '../components/decrypt/DecryptForm'
import type { CryptoPayload } from '../types'

export function MailView() {
  const { selectedMail, accessToken, decryptedContent, decryptError, setDecrypted, setDecryptError } = useMailStore()
  const [fullMail, setFullMail] = useState(selectedMail)
  const [payload, setPayload] = useState<CryptoPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [decryptedSubject, setDecryptedSubject] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedMail || !accessToken) return
    setLoading(true)
    setPayload(null)
    setDecrypted(null)
    setDecryptError(null)
    setDecryptedSubject(null)

    gmailService.getMessage(accessToken, selectedMail.id)
      .then((detail) => {
        setFullMail(detail)
        if (cryptoService.isEncryptedMail(detail.body)) {
          setPayload(JSON.parse(detail.body.trim()) as CryptoPayload)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedMail?.id])

  if (!selectedMail) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-400">
        <span className="mb-2 text-5xl">✉️</span>
        <p className="text-sm">Select a message to read</p>
      </div>
    )
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center text-slate-400">Loading...</div>
  }

  async function handleDecrypt(secret: string) {
    if (!payload) return
    try {
      let result: { body: string; subject: string }
      if (payload.mode === 'rsa') {
        result = await cryptoService.decryptWithPrivateKey(payload, secret)
      } else {
        result = await cryptoService.decrypt(payload, secret)
      }
      setDecrypted(result.body)
      setDecryptedSubject(result.subject)
    } catch {
      setDecryptError('Decryption failed. Wrong password or corrupted message.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">
          {decryptedSubject ?? selectedMail.subject}
        </h2>
        <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
          <span>From: <span className="font-medium text-slate-700">{fullMail?.from ?? selectedMail.from}</span></span>
          <span>·</span>
          <span>{new Date(selectedMail.date).toLocaleString()}</span>
        </div>
      </div>

      {/* Encrypted mail */}
      {payload && !decryptedContent && (
        <div className="space-y-4">
          <SecurityDetails payload={payload} />
          <CipherPanel payload={payload} />
          <DecryptForm mode={payload.mode} onDecrypt={handleDecrypt} error={decryptError} />
        </div>
      )}

      {/* Decrypted content */}
      {decryptedContent && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="mb-2 flex items-center gap-2 text-green-700">
            <span>✓</span>
            <span className="text-xs font-semibold uppercase tracking-wide">Decrypted</span>
          </div>
          <p className="whitespace-pre-wrap text-sm text-slate-800">{decryptedContent}</p>
        </div>
      )}

      {/* Plain (non-encrypted) mail */}
      {!payload && fullMail?.body && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="whitespace-pre-wrap text-sm text-slate-800">{fullMail.body}</p>
        </div>
      )}
    </div>
  )
}
