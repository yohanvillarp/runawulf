import { Router } from "express";
import { getThings } from "../controllers/get-things.controller";

const router = Router();

router.get("/get", getThings);

export default router;
