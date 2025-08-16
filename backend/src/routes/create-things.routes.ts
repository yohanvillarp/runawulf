import { Router } from "express";
import { createThing } from "../controllers/create-things.controller";

const router = Router();

router.post("/create/thing", createThing);

export default router;
