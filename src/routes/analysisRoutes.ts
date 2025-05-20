import { Router } from "express";
import { analyze, getAnalysis, getHistory } from "../controllers/analysisController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/analyze", authenticate, analyze);
router.get("/analyze/:id", authenticate, getAnalysis);
router.get("/analyze", authenticate, getHistory);



export default router;