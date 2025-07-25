import { Router } from 'express'
import { getServerStatus } from '../controllers/server.controller'

const router = Router()

router.get('/status', getServerStatus)

export default router