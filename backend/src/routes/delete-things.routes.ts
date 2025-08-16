import { Router } from "express";
import { deleteThing } from "../controllers/delete-things.controller";

const router = Router();

router.post("/delete/thing", deleteThing);

export default router;
