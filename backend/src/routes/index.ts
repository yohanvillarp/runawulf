import { Router } from 'express'
import verifyAdminRoutes from './verify-admin.routes'

const router = Router()

router.use('/admin', verifyAdminRoutes)

export default router