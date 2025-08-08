import { exec } from 'child_process';
import type { WebSocket } from 'ws';

export function handleExecCommand(ws: WebSocket, command?: string) {
    if (!command) {
        ws.send(JSON.stringify({ type: 'error', error: 'Comando no proporcionado' }))
        return
    }

    exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
            ws.send(JSON.stringify({
                type: 'exec-error',
                error: stderr || error?.message || 'Error desconocido'
            }))

        } else {
            ws.send(JSON.stringify({ type: 'exec-result', output: stdout }))
        }
    })
}