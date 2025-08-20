import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes'
import http from 'http'
import { createWebSocketServer } from './ws/webSocketServer';

dotenv.config()

export const startServer = () => {
    const app = express()
    const PORT = process.env.PORT || 4000

    app.use(cors())
    app.use(express.json())
    app.use('/api', routes)

    app.get('/', (req, res) => {
        res.send('This is the backend with http')
    })

    const server = http.createServer(app)
    createWebSocketServer(server);

    server.listen(PORT, () => {
        console.log(`🚀 Backend HTTP + WS corriendo en el puerto ${PORT}`)
    })
}

