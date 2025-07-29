import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes'
import { exec } from 'child_process';
import { WebSocketServer } from 'ws'
import http from 'http'

dotenv.config()

export const startServer = () => {
    const app = express()
    const PORT = process.env.PORT || 4000

    app.use(cors())
    app.use(express.json())
    app.use('/api',routes)
    

    app.get('/', (req, res) => {
        res.send('This is the backend with WebSockets')
    })

    // crear servidor HTTP base
    const server = http.createServer(app)

    // WebSocket server
    const wss = new WebSocketServer( {server} )

    wss.on('connection', (ws) => {
        console.log(' Cliente WebSocket conectado ')

        ws.on('message', (message) => {
            const msg = message.toString()
            console.log(`Mensaje recibido: ${msg}`)

            // Ejecutar el comando
            exec(msg, (error, stdout, stderr) => {
                if (error){
                    ws.send(`Error: ${error.message}`)
                    return
                }
                if (stderr){
                    ws.send(`Stderr: ${stderr}`)
                    return
                }
                ws.send(`Resultado: ${stdout}`)
            })
        })

        ws.on('close', () => {
            console.log(' Cliente WebSocket desconectado ')
        })
    })


    server.listen(PORT, () => {
        console.log(`🚀 Backend HTTP + WS corriendo en el puerto ${PORT}`)
    })
}