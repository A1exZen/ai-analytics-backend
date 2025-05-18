import { Router } from "express";
import { analyze, getAnalysis, getHistory } from "../controllers/analysisController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// @ts-ignore
router.post("/analyze", authenticate, analyze);
// @ts-ignore
router.get("/analyze/:id", authenticate, getAnalysis);
// @ts-ignore
router.get("/analyze", authenticate, getHistory);

export default router;