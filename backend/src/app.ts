import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes'
import { exec } from 'child_process'
import { WebSocketServer, WebSocket } from 'ws'
import http from 'http'
import path from 'path'

dotenv.config()

export const startServer = () => {
    const app = express()
    const PORT = process.env.PORT || 4000

    app.use(cors())
    app.use(express.json())
    app.use('/api', routes)

    app.get('/', (req, res) => {
        res.send('This is the backend with WebSockets')
    })

    const server = http.createServer(app)
    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws) => {
        console.log('🟢 Cliente WebSocket conectado')

        ws.on('message', (message) => {
            let data

            // 1. Intentar parsear el mensaje como JSON
            try {
                data = JSON.parse(message.toString())
            } catch (error) {
                console.warn('⚠️ Mensaje no válido (no es JSON):', message.toString())
                ws.send(JSON.stringify({ type: 'error', error: 'Mensaje no válido (no es JSON)' }))
                return
            }

            const { type, payload } = data

            switch (type) {
                case 'check-packages':
                    handleCheckPackages(ws, payload?.package)
                    break

                case 'install-package':
                    handleInstallPackage(ws, payload?.package)
                    break

                case 'exec-command':
                    handleExecCommand(ws, payload?.command)
                    break

                case 'exec-script':
                    handleExecScript(ws, payload?.script+".sh", payload?.params || [])
                    break

                default:
                    ws.send(JSON.stringify({ type: 'error', error: `Tipo desconocido: ${type}` }))
                    break
            }
        })

        ws.on('close', () => {
            console.log('🔴 Cliente WebSocket desconectado')
        })
    })

    server.listen(PORT, () => {
        console.log(`🚀 Backend HTTP + WS corriendo en el puerto ${PORT}`)
    })
}


function handleCheckPackages(ws: WebSocket, pkg?: string) {
    const packageToCheck = pkg

    exec(`which ${packageToCheck}`, (error) => {
        if (error) {
            ws.send(JSON.stringify({ type: 'missing-package', package: packageToCheck }))
        } else {
            ws.send(JSON.stringify({ type: 'packages-ok', package: packageToCheck }))
        }
    })
}


function handleInstallPackage(ws: WebSocket, pkg?: string) {
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

function handleExecCommand(ws: WebSocket, command?: string) {
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

export function handleExecScript(ws: WebSocket, script?: string, params?: string[]) {
  if (!script) {
    ws.send(JSON.stringify({ type: 'error', error: 'Script no proporcionado' }))
    return
  }

  // Ruta segura al script
  const scriptPath = path.join(__dirname, '../scripts', script)
  
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
