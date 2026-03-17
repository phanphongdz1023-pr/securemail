import { useEffect, useCallback } from 'react'
import { useMailStore } from '../store/mailStore'
import { gmailService } from '../services/gmailService'

export function useMail() {
  const { accessToken, currentFolder, mailList, setMailList, setLoading } = useMailStore()

  const fetchMail = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const list = await gmailService.listMessages(accessToken, currentFolder)
      setMailList(list)
    } catch (err) {
      console.error('Failed to fetch mail:', err)
    } finally {
      setLoading(false)
    }
  }, [accessToken, currentFolder])

  useEffect(() => {
    fetchMail()
  }, [fetchMail])

  return { mailList, refresh: fetchMail }
}
