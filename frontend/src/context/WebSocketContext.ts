import { createContext } from 'react'

type WebSocketContextType = {
  socket: WebSocket | null;
  connect: (ip: string) => void;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connect: () => {},
  disconnect: () => {},
  isConnected: false,
  isConnecting: false,
})
