import { createContext } from 'react'

type WebSocketContextType = {
  socket: WebSocket | null;
  connect: (ip: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connect: () => {},
  isConnected: false,
  isConnecting: false,
})
