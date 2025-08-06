import { createContext } from 'react'

export type ServerMessage = {
  type: string;
  script: string;
  [key: string]: unknown;
}

type WebSocketContextType = {
  socket: WebSocket | null;
  connect: (ip: string) => void;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  lastMessage: ServerMessage | null;
}

export const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connect: () => {},
  disconnect: () => {},
  isConnected: false,
  isConnecting: false,
  lastMessage: null,
})
