import {getPageSpeedAnalysis} from "../repositories/pageSpeedRepository.js";
import {getOpenAIAnalysis} from "../repositories/openAIRepository.js";
import {AnalysisResponse, OpenAIAnalysis} from "../models/Analysis.js";
import {transformToSchema} from "../utils/transformToSchema.js";
import {getDefaultAnalysis} from "../utils/defaultAnalysis.js";
import logger from "../utils/logger.js";
import prisma from "../db.js";
import {v4 as uuidv4} from "uuid";
import {Request} from "express";
import { tasks } from "../app.js";

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

export const analyzeWebsite = async (
	url: string,
	req: Request
): Promise<{ id: string; taskId: string }> => {
	if (!url || typeof url !== "string" || !url.startsWith("http")) {
		throw createAppError("Invalid URL provided", 400);
	}

	try {
		logger.info(`Starting website analysis for URL: ${url}`);
		const taskId = uuidv4();
		const userId = req.user?.userId;

		if (!userId) {
			throw createAppError("User not authenticated", 401);
		}

		tasks.set(taskId, { taskId, status: "pending" });

		setImmediate(async () => {
			try {
				logger.info(`Analyzing PageSpeed for URL: ${url}`);
				const pageSpeedResult = await getPageSpeedAnalysis(url);
				tasks.set(taskId, { taskId, status: "pending", result: { pageSpeed: pageSpeedResult } as AnalysisResponse });

				logger.info(`Analyzing OpenAI for URL: ${url}`);
				let openAIAnalysis: OpenAIAnalysis;
				try {
					const rawOpenAIAnalysis = await getOpenAIAnalysis(url);
					openAIAnalysis = transformToSchema(rawOpenAIAnalysis, url);
				} catch (error) {
					logger.error(`Error fetching OpenAI analysis for URL ${url}: ${(error as Error).message}`);
					openAIAnalysis = getDefaultAnalysis(url);
				}
				const analysisData: AnalysisResponse = {
					pageSpeed: pageSpeedResult,
					openAIAnalysis,
				};

				const id = uuidv4();
				await prisma.analysis.create({
					data: {
						id,
						url,
						data: JSON.stringify(analysisData),
						userId,
					},
				});

				tasks.set(taskId, { taskId, status: "completed", result: analysisData });
				logger.info(`Website analysis completed for URL: ${url} with ID: ${id} by user: ${userId}`);
			} catch (error) {
				logger.error(`Error during analysis for URL ${url}: ${(error as Error).message}`);
				tasks.set(taskId, { taskId, status: "failed", error: (error as Error).message });
			}
		});

		return { id: uuidv4(), taskId };
	} catch (error) {
		logger.error(`Error during analysis initiation for URL ${url}: ${(error as Error).message}`);
		throw createAppError("Failed to initiate website analysis", 500);
	}
};