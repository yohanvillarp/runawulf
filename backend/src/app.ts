import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes'

dotenv.config()

export const startServer = () => {
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use('/api',routes)
    const PORT = process.env.PORT || 4000

    app.get('/', (req, res) => {
        res.send('This is the backend')
    })

    app.listen(PORT, () => {
        console.log(`🚀 Backend running on port ${PORT}`)
    })
}