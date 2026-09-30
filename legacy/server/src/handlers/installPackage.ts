import { exec } from 'child_process';
import type { WebSocket } from 'ws';

export function handleInstallPackage(ws: WebSocket, pkg?: string) {
    if (!pkg) {
        ws.send(JSON.stringify({ type: 'error', error: 'Nombre del paquete no proporcionado' }))
        return
    }

    exec(`sudo apt-get install -y ${pkg}`, (error, stdout, stderr) => {
        if (error || stderr) {
            ws.send(JSON.stringify({
                type: 'install-failed',
                package: pkg,
                error: stderr || (error ? error.message : 'Error desconocido')
            }))

        } else {
            ws.send(JSON.stringify({ type: 'install-success', package: pkg, output: stdout }))
        }
    })
}