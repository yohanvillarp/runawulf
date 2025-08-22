import { Router } from 'express'
import verifyAdminRoutes from './verify-admin.routes'
import getThingsRoutes from './get-things.route'
import createThing from './create-things.routes'
import deleteThing from './delete-things.routes'
import { updateThing } from '../controllers/update-things.controller'

const router = Router()

router.use('/admin', verifyAdminRoutes)
router.use('/system', getThingsRoutes)
router.use('/system', createThing)
router.use('/system', deleteThing)
router.use('/system', updateThing)

export default router