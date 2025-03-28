import { Router } from "express";
import multer from "multer";
import axios from "axios";
import { analyzePDFWithOpenAI } from "../controllers/analyzePDFWithOpenAI.js";
import { getOpenAI } from "../controllers/openAIService.js";
import PDFParser from "pdf2json";



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

router.post("/analyze-pdf", upload.single("pdf"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "Файл не предоставлен." });
		}

		console.log("Размер буфера файла:", req.file.buffer.length, "байт");

		const pdfParser = new PDFParser();
		const pdfBuffer = req.file.buffer;

		return new Promise((resolve, reject) => {
			pdfParser.on("pdfParser_dataError", (err) =>
				reject(new Error(`Ошибка парсинга PDF: ${err.message}`))
			);
			pdfParser.on("pdfParser_dataReady", (pdfData) => {

				let textContent = pdfParser.getRawTextContent()
					.replace(/[^\x20-\x7E]/g, "")
					.trim();

				const maxTextLength = 2000;
				if (textContent.length > maxTextLength) {
					textContent = textContent.substring(0, maxTextLength) + "...";
				}

				if (!textContent) {
					return reject(new Error("Не удалось извлечь текст из PDF."));
				}

				resolve(textContent);
			});

			pdfParser.parseBuffer(pdfBuffer);
		})
			.then(async (textContent) => {

				const analysis = await analyzePDFWithOpenAI(textContent);

				let formattedAnalysis;
				try {
					const parsedAnalysis = JSON.parse(analysis);
					formattedAnalysis = `Summary: ${parsedAnalysis.summary || "Н/Д"}\n\nKey Insights:\n${
						parsedAnalysis.insights ? parsedAnalysis.insights.join("\n") : "Н/Д"
					}`;
				} catch (error) {
					console.error("Ошибка парсинга ответа от DeepSeek:", error.message);
					return res.status(500).json({ error: "Ошибка при обработке ответа от AI." });
				}

				res.json({ analysis: formattedAnalysis });
			})
			.catch((error) => {
				console.error("Ошибка при анализе PDF:", error.message);
				if (error.message.includes("PDF")) {
					res.status(400).json({ error: error.message });
				} else {
					res.status(500).json({ error: "Произошла ошибка при анализе PDF." });
				}
			});
	} catch (error) {
		console.error("Общая ошибка при анализе PDF:", error.message);
		res.status(500).json({ error: "Произошла ошибка при анализе PDF." });
	}
});

export default router;
