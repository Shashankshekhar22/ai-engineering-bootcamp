import { chat } from "../controllers/ai.controller.js";
import { Router } from "express";

const router = Router();

router.post("/chat", chat);

export default router;
