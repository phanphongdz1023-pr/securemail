import type { MailMeta, MailDetail, User } from '../types'

const BASE = import.meta.env.VITE_GMAIL_API_BASE as string

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

async function apiFetch(url: string, token: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(token), ...options?.headers },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Gmail API error ${res.status}: ${JSON.stringify(err)}`)
  }
  return res.json()
}

function parseMailMeta(msg: Record<string, unknown>): MailMeta {
  const headers = (msg.payload as Record<string, unknown>)?.headers as Array<{name: string, value: string}> ?? []
  const h = (name: string) => headers.find((x) => x.name.toLowerCase() === name.toLowerCase())?.value ?? ''

  return {
    id: msg.id as string,
    threadId: msg.threadId as string,
    from: h('From'),
    subject: h('Subject'),
    date: h('Date'),
    snippet: (msg.snippet as string) ?? '',
    isEncrypted: h('X-Encrypted') === 'true',
    isRead: !((msg.labelIds as string[]) ?? []).includes('UNREAD'),
  }
}

function extractBody(payload: Record<string, unknown>): string {
  // Handle multipart or single part
  const data = (payload.body as Record<string, string>)?.data
  if (data) return atob(data.replace(/-/g, '+').replace(/_/g, '/'))
  const parts = (payload.parts as Array<Record<string, unknown>>) ?? []
  for (const part of parts) {
    const partData = (part.body as Record<string, string>)?.data
    if (partData) return atob(partData.replace(/-/g, '+').replace(/_/g, '/'))
  }
  return ''
}

export const gmailService = {
  async listMessages(token: string, folder: 'inbox' | 'sent' | 'trash'): Promise<MailMeta[]> {
    const labelMap = { inbox: 'label:inbox', sent: 'label:sent', trash: 'label:trash' }
    const data = await apiFetch(`${BASE}/messages?q=${labelMap[folder]}&maxResults=50`, token)
    if (!data.messages) return []

    // Fetch each message detail in parallel (limited to first 20)
    const ids: string[] = data.messages.slice(0, 20).map((m: {id: string}) => m.id)
    const details = await Promise.all(
      ids.map((id) => apiFetch(`${BASE}/messages/${id}?format=metadata&metadataHeaders=From,Subject,Date,X-Encrypted`, token))
    )
    return details.map(parseMailMeta)
  },

  async getMessage(token: string, id: string): Promise<MailDetail> {
    const msg = await apiFetch(`${BASE}/messages/${id}?format=full`, token)
    const meta = parseMailMeta(msg)
    const body = extractBody(msg.payload as Record<string, unknown>)
    const headers: Record<string, string> = {}
    const rawHeaders = (msg.payload as Record<string, unknown>)?.headers as Array<{name: string, value: string}> ?? []
    rawHeaders.forEach((h) => { headers[h.name] = h.value })
    return { ...meta, to: headers['To'] ?? '', body, headers }
  },

  async sendMessage(token: string, raw: string): Promise<void> {
    await apiFetch(`${BASE}/messages/send`, token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    })
  },

  async getProfile(token: string): Promise<User> {
    const data = await apiFetch(`${BASE}/profile`, token)
    return {
      id: data.emailAddress,
      email: data.emailAddress,
      name: data.emailAddress.split('@')[0],
      picture: '',
    }
  },
}
