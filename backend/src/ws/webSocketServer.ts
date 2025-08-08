import { WebSocketServer } from 'ws';
import type { Server } from 'http';
import { handleMessage } from './wsMessageHandler';

export function createWebSocketServer(server: Server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('🟢 Cliente WebSocket conectado');

        ws.on('message', (message) => handleMessage(ws, message));

        ws.on('close', () => {
            console.log('🔴 Cliente WebSocket desconectado');
        });
    });
}
