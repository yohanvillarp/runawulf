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

    // Intervalo de 5 segundos para enviar métricas
    const interval = 5000;
    setInterval(() => {
        const messageToSend = JSON.stringify({
            type: 'exec-script',
            payload: {
                script: "get/get_system_info.sh",
            }
        });
        // Enviar a todos los clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                handleMessage(client, Buffer.from(messageToSend));
            }
        });
    }, interval);
}