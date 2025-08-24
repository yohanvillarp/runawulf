import { Router } from 'express'
import verifyAdminRoutes from './verify-admin.routes'
import getThingsRoutes from './get-things.route'
import createThing from './create-things.routes'
import deleteThing from './delete-things.routes'
import { updateThing } from '../controllers/update-things.controller'
import systemResourceRouter from '../routes/system-resource.routes'

const router = Router()

router.use('/admin', verifyAdminRoutes);
router.use('/system', systemResourceRouter);

export default router