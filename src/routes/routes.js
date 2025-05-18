import { Router } from "express";
import multer from "multer";
import axios from "axios";
import { getOpenAI } from "../controllers/openAIService.js";



const router = Router();

router.post("/analyze", async (req, res) => {
	const {query} = req.body;
	try {
		const pageSpeedResponse = await axios.get(
			`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${query}&key=${process.env.PAGESPEED_API_KEY}`
		);
		const {audits, categories} = pageSpeedResponse.data.lighthouseResult;

		const metrics = {
			serverResponseTime: audits["server-response-time"]?.displayValue || "N/A",
			totalByteWeight: audits["total-byte-weight"]?.displayValue || "N/A",
			speedIndex: audits["speed-index"]?.displayValue || "N/A",
			firstContentfulPaint:
				audits["first-contentful-paint"]?.displayValue || "N/A",
			largestContentfulPaint:
				audits["largest-contentful-paint"]?.displayValue || "N/A",
			totalBlockingTime: audits["total-blocking-time"]?.displayValue || "N/A",
			interactive: audits["interactive"]?.displayValue || "N/A",
			firstMeaningfulPaint:
				audits["first-meaningful-paint"]?.displayValue || "N/A",
			cumulativeLayoutShift:
				audits["cumulative-layout-shift"]?.displayValue || "N/A",
			usesOptimizedImages:
				audits["uses-optimized-images"]?.score === 1 ? "Yes" : "No",
			networkRTT: audits["network-rtt"]?.displayValue || "N/A",
		};

		const data = {
			pageSpeed: {
				performance: categories.performance.score * 100,
				metrics,
			},
		};


		console.log(data);

		const openAIAnalysis = await getOpenAI(query);
		console.log("Итого:...............\n", openAIAnalysis)
		data.openAIAnalysis = openAIAnalysis;

		res.json({data});
	} catch (error) {
		console.error(error);
		res.status(500).json({error: "Ошибка при анализе сайта"});
	}
});

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype === "application/pdf") {
			cb(null, true);
		} else {
			cb(new Error("Пожалуйста, загрузите файл в формате PDF."), false);
		}
	},
});


export default router;
