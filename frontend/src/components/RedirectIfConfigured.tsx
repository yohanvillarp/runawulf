// src/components/RedirectIfConfigured.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { useWebSocket } from '../context/useWebSocket'
import Loader from './Loader'

export default function RedirectIfConfigured({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isConnected, isConnecting } = useWebSocket()

  const isLocalConnected = localStorage.getItem('connected') === 'true'
  const isInInitialSetup = location.pathname === '/initial-setup'

  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (!isConnecting) {
      if (isLocalConnected && isConnected && isInInitialSetup) {
        navigate('/', { replace: true })
      } else {
        setShouldRender(true) // ahora sí puede renderizar children
      }
    }
  }, [isConnecting, isConnected, isInInitialSetup, isLocalConnected, navigate])

  if (isConnecting && isLocalConnected && isInInitialSetup) {
    return <Loader />
  }

  // Evita renderizar children hasta que se decida
  if (!shouldRender) return null

  return <>{children}</>
}