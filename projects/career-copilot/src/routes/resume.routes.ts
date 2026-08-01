import { Router } from "express";
import { analyze } from "../controllers/resume.controller.js";

const router = Router();

router.post("/analyze", analyze);

export default router;
