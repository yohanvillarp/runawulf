import type { WebSocket, RawData } from 'ws';
import { handleCheckPackages } from '../handlers/checkPackage';
import { handleInstallPackage } from '../handlers/installPackage';
import { handleExecCommand } from '../handlers/execCommand';
import { handleExecScript } from '../handlers/execScript';

export function handleMessage(ws: WebSocket, message: RawData) {
    let data;

    try {
        data = JSON.parse(message.toString());
    } catch {
        ws.send(JSON.stringify({ type: 'error', error: 'Mensaje no válido (no es JSON)' }));
        return;
    }

    const { type, payload } = data;

    switch (type) {
        case 'check-packages':
            handleCheckPackages(ws, payload?.package);
            break;
        case 'install-package':
            handleInstallPackage(ws, payload?.package);
            break;
        case 'exec-command':
            handleExecCommand(ws, payload?.command);
            break;
        case 'exec-script':
            handleExecScript(ws, `${payload?.script}.sh`, payload?.params || []);
            break;
        default:
            ws.send(JSON.stringify({ type: 'error', error: `Tipo desconocido: ${type}` }));
    }
}
