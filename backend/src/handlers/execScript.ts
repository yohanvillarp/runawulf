import { exec } from 'child_process';
import path from 'path';
import type { WebSocket } from 'ws';

export function handleExecScript(ws: WebSocket, script?: string, params?: string[]) {

  if (!script) {
    ws.send(JSON.stringify({ type: 'error', error: 'Script no proporcionado' }));
    return;
  }

  // 1. Separar la ruta del nombre del archivo
  const scriptDir = path.dirname(script);
  const scriptFile = path.basename(script);

  // 2. Construir la ruta completa del script de manera segura
  const scriptPath = path.join(__dirname, '../../scripts', scriptDir, scriptFile);

  // 3. Agregar un control de seguridad adicional para evitar traversals
  if (!scriptPath.startsWith(path.join(__dirname, '../../scripts'))) {
    ws.send(JSON.stringify({ type: 'error', error: 'Intento de acceso a ruta no permitida' }));
    return;
  }
  
  // Evita inyecciones de forma básica
  const joinedParams = (params || [])
    .map(p => `"${String(p ?? '').replace(/"/g, '\\"')}"`)
    .join(' ');

  const fullCommand = `bash "${scriptPath}" ${joinedParams}`;

  exec(fullCommand, (error, stdout, stderr) => {
    if (error) {
      ws.send(JSON.stringify({
        type: 'script-error',
        error: stderr || error.message,
      }));
      return;
    }

    ws.send(JSON.stringify({
      type: 'script-result',
      script: script,
      output: stdout.trim(),
    }));
  });
}