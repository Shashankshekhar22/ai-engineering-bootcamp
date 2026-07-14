import { readRequestBody } from "../controllers/ai.controller.js";
import { Router } from "express";

const router = Router();

router.post("/chat", readRequestBody);

export default router;
