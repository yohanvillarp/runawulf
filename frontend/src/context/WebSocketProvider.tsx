import { useRef, useState, useEffect } from 'react'
import { WebSocketContext } from './WebSocketContext'
import type { ServerMessage } from './WebSocketContext'
import Swal from 'sweetalert2'
import { WEBSOCKET_CONNECTION_TIMEOUT_MS } from '../constants/timeouts'

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null)

  const connect = (ip: string) => {
    if (!ip || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      console.error('IP no válida o vacía:', ip)
      return
    }

    if (socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      console.log('Ya existe una conexión WebSocket activa o en progreso.')
      return
    }

    const ws = new WebSocket(`ws://${ip}:4000`)
    socketRef.current = ws
    setSocket(ws)
    setIsConnecting(true)

    // Timeout manual de 3 segundos
    const timeoutId = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        console.warn('Tiempo de espera agotado, cerrando WebSocket...')
        ws.close()
        setIsConnecting(false)
        setIsConnected(false)
        socketRef.current = null
      }
    },  WEBSOCKET_CONNECTION_TIMEOUT_MS)

    ws.onopen = () => {
      clearTimeout(timeoutId)
      console.log('Conectado al WebSocket')
      setIsConnected(true)
      setIsConnecting(false)
    }

    ws.onerror = (e) => {
      clearTimeout(timeoutId)
      console.error('WebSocket error:', e)
      Swal.fire({
        icon: "error",
        title: "Conexión fallida",
        text: "No fue posible establecer comunicación con el servidor. Verifique la IP e intente nuevamente.",
      });
      setIsConnected(false)
      setIsConnecting(false)
      localStorage.removeItem('ipServer')
      localStorage.removeItem('connected')
    }

    ws.onclose = () => {
      clearTimeout(timeoutId)
      console.log('🔌 WebSocket cerrado')
      setIsConnected(false)
      setIsConnecting(false)
      socketRef.current = null
      setSocket(null)
    }

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data && typeof data === 'object' && 'type' in data) {
          setLastMessage(data as ServerMessage)
          console.log('📩 Mensaje válido recibido:', data)
        } else {
          console.warn('Mensaje inválido recibido:', data)
        }
      } catch (error) {
        console.error('Error al parsear mensaje WebSocket:', error)
      }
    }
  }


  const disconnect = () => {
    if (socketRef.current) {
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
    <WebSocketContext.Provider value={{ socket, connect, disconnect, isConnected, isConnecting, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}
