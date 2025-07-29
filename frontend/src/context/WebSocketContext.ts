import { createContext } from 'react'

type WebSocketContextType = {
  socket: WebSocket | null
  connect: (ip: string) => void
}

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connect: () => {}
})
