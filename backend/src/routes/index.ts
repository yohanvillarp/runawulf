import { Router } from 'express'
import verifyAdminRoutes from './verify-admin.routes'
import getThingsRoutes from './get-things.route'

const router = Router()

router.use('/admin', verifyAdminRoutes)
router.use('/system', getThingsRoutes)

export default router