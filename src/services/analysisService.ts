import {getPageSpeedAnalysis} from "../repositories/pageSpeedRepository.js";
import {getOpenAIAnalysis} from "../repositories/openAIRepository.js";
import {AnalysisResponse, OpenAIAnalysis} from "../models/Analysis.js";
import {transformToSchema} from "../utils/transformToSchema.js";
import {getDefaultAnalysis} from "../utils/defaultAnalysis.js";
import logger from "../utils/logger.js";
import prisma from "../db.js";
import {v4 as uuidv4} from "uuid";
import {Request} from "express";
// import {getLighthouseAnalysis} from "./lighthouseService.js";

interface AppError extends Error {
	statusCode: number;
	message: string;
}

const createAppError = (message: string, statusCode: number): AppError => {
	const error = new Error(message) as AppError;
	error.statusCode = statusCode;
	return error;
};

export const analyzeWebsite = async (url: string, req: Request): Promise<{
	id: string;
	data: AnalysisResponse
}> => {
	if (!url || typeof url !== "string" || !url.startsWith("http")) {
		throw createAppError("Invalid URL provided", 400);
	}

	try {
		logger.info(`Starting website analysis for URL: ${url}`);
		const pageSpeedResult = await getPageSpeedAnalysis(url);
		let openAIAnalysis: OpenAIAnalysis;

		try {
			const rawOpenAIAnalysis = await getOpenAIAnalysis(url);
			openAIAnalysis = transformToSchema(rawOpenAIAnalysis, url);
		} catch (error) {
			logger.error(`Error fetching OpenAI analysis for URL ${url}: ${(error as Error).message}`);
			openAIAnalysis = getDefaultAnalysis(url);
		}

		// let lighthouseResult;
		// try {
		// 	lighthouseResult = await getLighthouseAnalysis(url);
		// } catch (error) {
		// 	logger.error(`Error fetching Lighthouse analysis for URL ${url}: ${(error as Error).message}`);
		// 	lighthouseResult = {
		// 		performance: 0,
		// 		accessibility: 0,
		// 		bestPractices: 0,
		// 		seo: 0,
		// 		metrics: {
		// 			firstContentfulPaint: "N/A",
		// 			largestContentfulPaint: "N/A",
		// 			totalBlockingTime: "N/A",
		// 			cumulativeLayoutShift: "N/A",
		// 			speedIndex: "N/A",
		// 		},
		// 	};
		// }

		// let securityHeadersResult;
		// try {
		// 	securityHeadersResult = await getSecurityHeadersAnalysis(url);
		// } catch (error) {
		// 	logger.error(`Error fetching Security Headers analysis for URL ${url}: ${(error as Error).message}`);
		// 	securityHeadersResult = {
		// 		grade: "N/A",
		// 		headers: [],
		// 		status: "Failed",
		// 	};
		// }

		// let virusTotalResult;
		// try {
		// 	virusTotalResult = await getVirusTotalAnalysis(url);
		// } catch (error) {
		// 	logger.error(`Error fetching VirusTotal analysis for URL ${url}: ${(error as Error).message}`);
		// 	virusTotalResult = {
		// 		status: "failed",
		// 		positives: 0,
		// 		total: 0,
		// 		isMalicious: false,
		// 	};
		// }

		const analysisData: AnalysisResponse = {
			pageSpeed: pageSpeedResult,
			openAIAnalysis
		};

		const id = uuidv4();
		const userId = req.user?.userId;

		if (!userId) {
			throw createAppError("User not authenticated", 401);
		}

		await prisma.analysis.create({
			data: {
				id,
				url,
				data: JSON.stringify(analysisData),
				userId,
			},
		});

		logger.info(`Website analysis completed for URL: ${url} with ID: ${id} by user: ${userId}`);
		return {id, data: analysisData};
	} catch (error) {
		logger.error(`Error during analysis for URL ${url}: ${(error as Error).message}`);
		throw createAppError("Failed to analyze website", 500);
	}
};