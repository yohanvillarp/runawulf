import { Router } from 'express'
import verifyAdminRoutes from './verify-admin.routes'
import systemResourceRouter from '../routes/system-resource.routes'

const router = Router()

router.use('/admin', verifyAdminRoutes);
router.use('/system', systemResourceRouter);

export default router