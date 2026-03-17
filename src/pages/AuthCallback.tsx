import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useMailStore } from '../store/mailStore'

export function AuthCallback() {
  const navigate = useNavigate()
  const { setToken } = useMailStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')

    if (error || !code) {
      navigate('/login')
      return
    }

    authService.handleCallback(code)
      .then((token) => {
        setToken(token)
        navigate('/inbox')
      })
      .catch(() => navigate('/login'))
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mb-4 text-4xl animate-spin">🔄</div>
        <p className="text-slate-600">Completing sign-in...</p>
      </div>
    </div>
  )
}
