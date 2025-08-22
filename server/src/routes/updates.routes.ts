import { Router } from "express";
import { updateThing } from "../controllers/update-things.controller";

const router = Router();

router.get("/update", updateThing);

export default router;
