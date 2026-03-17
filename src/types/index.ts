export interface User {
  id: string
  email: string
  name: string
  picture: string
}

export interface MailMeta {
  id: string
  threadId: string
  from: string
  subject: string       // decrypted display subject (after decrypt) or '[SecureMail] encrypted message' before
  date: string
  snippet: string
  isEncrypted: boolean  // parsed from X-Encrypted header
  isRead: boolean
}

export interface MailDetail extends MailMeta {
  to: string
  body: string          // raw body — may be JSON CryptoPayload string
  headers: Record<string, string>
}

export interface CryptoPayload {
  version: string             // '1.0'
  mode: 'password' | 'rsa'   // determines decryption path
  subject: string             // encrypted subject
  ciphertext: string          // base64 — AES-GCM encrypted body
  iv: string                  // base64, 12 bytes — body encryption IV
  encryptedKey: string        // base64 — AES key wrapped by AES-KW or RSA-OAEP
  salt: string | null         // base64, 16 bytes — PBKDF2 salt; null when mode === 'rsa'
}
