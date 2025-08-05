import { useRef, useState, useEffect } from 'react'
import { WebSocketContext } from './WebSocketContext'

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = (ip: string) => {
    if (!ip || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      console.error('❌ IP no válida o vacía:', ip)
      return
    }

    //evita doble conexión
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      console.log('⛔ Ya existe una conexión WebSocket activa o en progreso.')
      return
    }

    const ws = new WebSocket(`ws://${ip}:4000`)
    socketRef.current = ws
    setSocket(ws)
    
    ws.onopen = () => {
      console.log('🟢 Conectado al WebSocket')
      setIsConnected(true)
       setIsConnecting(false)
    }

    ws.onmessage = (e) => console.log('📩', e.data)

    ws.onclose = () => {
      console.log('🔌 WebSocket cerrado')
      setIsConnected(false)
      setIsConnecting(false)
      socketRef.current = null
      setSocket(null)
    }
    ws.onerror = (e) => {
      console.error('❌ WebSocket error:', e)
      alert('No se pudo conectar con el servidor, intente con otra IP.')
      setIsConnected(false)
      setIsConnecting(false)
      localStorage.removeItem('ipServer')
      localStorage.removeItem('connected')
    }
  }

  const disconnect = () => {
    if (socketRef.current){
      console.log('Desconectando WebSocket manualmente')
      socketRef.current.close()
      socketRef.current = null
      setSocket(null)
      setIsConnected(false)
      setIsConnecting(false)
    }
  }

  //Intentar reconectar al montar el proveedor
  useEffect(() => {
    const savedIp = localStorage.getItem('ipServer')
    const connected = localStorage.getItem('connected') === 'true'

    //solo reconectar si no hay un socket activo
    const isConnectingOrOpen = socketRef.current?.readyState === WebSocket.OPEN || socketRef.current?.readyState === WebSocket.CONNECTING

    if (savedIp && connected && !isConnectingOrOpen) {
      console.log(`Intentando reconectar a ${savedIp}`)
      connect(savedIp)
      setIsConnecting(true)
    }

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current?.close()
      }
    }
  }, [])

  return (
    <WebSocketContext.Provider value={{ socket, connect,disconnect, isConnected, isConnecting}}>
      {children}
    </WebSocketContext.Provider>
  )
}
