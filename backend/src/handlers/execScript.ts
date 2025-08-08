import { exec } from 'child_process';
import path from 'path';
import type { WebSocket } from 'ws';

export function handleExecScript(ws: WebSocket, script?: string, params?: string[]) {
  if (!script) {
    ws.send(JSON.stringify({ type: 'error', error: 'Script no proporcionado' }))
    return
  }

  // Ruta segura al script
  const scriptPath = path.join(__dirname, '../../scripts', script)
  
  //evita inyecciones de forma básica
  const joinedParams = (params || [])
  .map(p => `"${String(p ?? '').replace(/"/g, '\\"')}"`)
  .join(' ');


  const fullCommand = `bash ${scriptPath} ${joinedParams}`

  exec(fullCommand, (error, stdout, stderr) => {
    if(error){
        ws.send(JSON.stringify({
        type: 'script-error',
        error: stderr || error.message,
      }))
      return
    }

    ws.send(JSON.stringify({
      type: 'script-result',
      script: script,
      output: stdout.trim(),
    }))
  })
}