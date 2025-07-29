import { useRef, useState, useEffect } from 'react'
import { WebSocketContext } from './WebSocketContext'

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  const connect = (ip: string) => {
    if (socketRef.current) return
    const ws = new WebSocket(`ws://${ip}:4000`)
    socketRef.current = ws
    setSocket(ws)

    ws.onopen = () => console.log('🟢 Conectado al WebSocket')
    ws.onmessage = (e) => console.log('📩', e.data)
    ws.onclose = () => {
      console.log('🔌 WebSocket cerrado')
      socketRef.current = null
      setSocket(null)
    }
    ws.onerror = (e) => console.error('❌ WebSocket error:', e)
  }

  useEffect(() => {
    return () => {
      socketRef.current?.close()
    }
  }, [])

  return (
    <WebSocketContext.Provider value={{ socket, connect }}>
      {children}
    </WebSocketContext.Provider>
  )
}
