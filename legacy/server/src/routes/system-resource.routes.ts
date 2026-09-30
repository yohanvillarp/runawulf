import { Router } from "express"
import { SystemResourceController } from "../controllers/SystemResourceController"
const router = Router();
// Creamos una instancia
const controller = new SystemResourceController();

// Accedemos a los métodos
router.post("/create/thing", controller.createThing);
router.post("/delete/thing", controller.deleteThing);
router.get("/get", controller.getThings);
router.post("/update/thing", controller.updateThing);

export default router;