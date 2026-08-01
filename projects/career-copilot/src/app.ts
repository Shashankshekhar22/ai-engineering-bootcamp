import express from "express";
import aiRoutes from "./routes/ai.routes.js";
import resumeRoutes from "./routes/resume.routes.js";

const app = express();

app.use(express.json());
app.use("/api/ai", aiRoutes);
app.use("/api/resume", resumeRoutes);

export default app;