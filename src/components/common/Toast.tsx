import { useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const colors =
    type === 'success'
      ? 'bg-green-50 border-green-200 text-green-800'
      : 'bg-red-50 border-red-200 text-red-800'

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${colors}`}
      >
        <span>{type === 'success' ? '✓' : '✕'}</span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onDismiss}
          className="ml-2 opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// Toast manager — add to App root

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error'
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message, type }])
    },
    []
  )

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const ToastContainer = (): ReactNode => (
    <>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onDismiss={() => dismissToast(t.id)}
        />
      ))}
    </>
  )

  return { showToast, ToastContainer }
}
