import { exec, spawn } from "child_process";
import path from "path";
import type { WebSocket } from "ws";

export function handleExecScript(
  ws: WebSocket,
  script?: string,
  params?: string[],
  live: boolean = false
) {
  if (!script) {
    ws.send(JSON.stringify({ type: 'error', error: 'Script no proporcionado' }));
    return;
  }

  const scriptPath = path.join(__dirname, '../../scripts', script);

  // Control de seguridad para evitar traversals
  if (!scriptPath.startsWith(path.join(__dirname, '../../scripts'))) {
    ws.send(JSON.stringify({ type: 'error', error: 'Intento de acceso a ruta no permitida' }));
    return;
  }

  if (live) {
    // Streaming: enviar línea por línea
    const child = spawn('bash', [scriptPath, ...(params || [])]);

    //  Real Time -- CPU
    child.stdout.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      lines.forEach((line: string) => {
        ws.send(JSON.stringify({
          type: 'script-result',
          script,
          output: line
        }));
      });
    });
    

    /*let buffer: string[] = [];
    child.stdout.on('data', chunk => {
      buffer.push(...chunk.toString().split('\n').filter(Boolean));
    });

    setInterval(() => {
      if (buffer.length) {
        ws.send(JSON.stringify({ type: 'script-result', script, output: buffer }));
        buffer = [];
      }
    }, 200); // cada 200ms
    */

    child.stderr.on('data', (err) => {
      ws.send(JSON.stringify({
        type: 'script-error',
        script,
        error: err.toString()
      }));
    });

    child.on('close', (code) => {
      ws.send(JSON.stringify({
        type: 'script-finished',
        script,
        code
      }));
    });

  } else {
    // Ejecución puntual: enviar todo al terminar
    const joinedParams = (params || [])
      .map(p => `"${String(p ?? '').replace(/"/g, '\\"')}"`)
      .join(' ');

    const fullCommand = `bash "${scriptPath}" ${joinedParams}`;

    exec(fullCommand, (error, stdout, stderr) => {
      if (error) {
        ws.send(JSON.stringify({
          type: 'script-error',
          script,
          error: stderr || error.message
        }));
        return;
      }

      ws.send(JSON.stringify({
        type: 'script-result',
        script,
        output: stdout.trim(),
      }));
    });
  }
}
