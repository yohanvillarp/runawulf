import { useContext } from 'react'
import { WebSocketContext } from '@/shared/api/WebSocketContext'

export const useWebSocket = () => useContext(WebSocketContext)
