import { exec } from 'child_process';
import type { WebSocket } from 'ws';

export function handleCheckPackages(ws: WebSocket, pkg?: string) {
    if (!pkg) {
        ws.send(JSON.stringify({ type: 'error', error: 'Paquete no proporcionado' }));
        return;
    }

    exec(`which ${pkg}`, (error) => {
        if (error) {
            ws.send(JSON.stringify({ type: 'missing-package', package: pkg }));
        } else {
            ws.send(JSON.stringify({ type: 'packages-ok', package: pkg }));
        }
    });
}
