import { WebSocketServer } from 'ws';
import type { Server } from 'http';
import { handleMessage } from './wsMessageHandler';
import { spawn } from 'child_process';

export function createWebSocketServer(server: Server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('🟢 Cliente WebSocket conectado');

        ws.on('message', (message) => handleMessage(ws, message));

        ws.on('close', () => {
            console.log('🔴 Cliente WebSocket desconectado');
        });
    });

    const scriptPathSystem = 'get/get_system_info.sh';
    const scriptPathSuricata = 'get/get_suricata_logs.sh';
    const interval = 5000;

    // 1️Script del sistema cada 5 segundos
    setInterval(() => {
        const messageToSend = JSON.stringify({
            type: 'exec-script',
            payload: { script: scriptPathSystem }
        });

        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                handleMessage(client, Buffer.from(messageToSend));
            }
        });
    }, interval);

    // Script de Suricata en tiempo real, compartido para todos los clientes
    /*
    const suricataScript = spawn('/bin/bash', [`scripts/${scriptPathSuricata}`]);

    suricataScript.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(Boolean);
        console.log("hay nuevos datos");
        lines.forEach((line: string) => {
            const messageToSend = JSON.stringify({
                type: 'exec-script',
                payload: {
                    script: scriptPathSuricata,
                    output: line
                }
            });

            // Enviar a todos los clientes conectados
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    handleMessage(client, Buffer.from(messageToSend), true);
                }
            });
        });
    });

    suricataScript.stderr.on('data', (err) => {
        console.error('Error ejecutando script Suricata:', err.toString());
    });

    suricataScript.on('close', (code) => {
        console.log(`Script Suricata finalizó con código ${code}`);
    });
    */
}
