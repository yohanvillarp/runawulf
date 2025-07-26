import { Router } from 'express'
import serverRoutes from './server.routes'
import commandsRoutes from './commands.routes'

const router = Router()

router.use('/server', serverRoutes)
router.use('/commands', commandsRoutes)

export default router