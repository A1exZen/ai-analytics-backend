import { Router } from "express"
import {
	getAllAnalyses,
	getAnalysis,
	getHistory,
	getTaskStatus,
	startAnalysis,
} from "../controllers/analysisController.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

router.get("/analyze/all", authenticate, getAllAnalyses)
router.post("/analyze/start", authenticate, startAnalysis)
router.get("/analyze/status/:id", authenticate, getTaskStatus)
router.get("/analyze/:id", authenticate, getAnalysis)
router.get("/analyze", authenticate, getHistory)

export default router
