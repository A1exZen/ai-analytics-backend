import { getPageSpeedAnalysis } from "../repositories/pageSpeedRepository.js";
import { getOpenAIAnalysis } from "../repositories/openAIRepository.js";
import { AnalysisResponse, OpenAIAnalysis } from "../models/Analysis.js";
import { transformToSchema } from "../utils/transformToSchema.js";
import { getDefaultAnalysis } from "../utils/defaultAnalysis.js";
import logger from "../utils/logger.js";
import prisma from "../db.js";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";
import { taskService } from "./taskService.js";

interface AppError extends Error {
	statusCode: number;
	message: string;
}

const createAppError = (message: string, statusCode: number): AppError => {
	const error = new Error(message) as AppError;
	error.statusCode = statusCode;
	return error;
};

export const startWebsiteAnalysis = async (url: string, req: Request): Promise<{ taskId: string }> => {
	if (!url || typeof url !== "string" || !url.startsWith("http")) {
		throw createAppError("Invalid URL provided", 400);
	}

	const userId = req.user?.userId;
	if (!userId) {
		throw createAppError("User not authenticated", 401);
	}

	const { taskId } = taskService.createTask();

	setImmediate(async () => {
		try {
			logger.info(`Starting website analysis for URL: ${url} (Task ID: ${taskId})`);

			const pageSpeedResult = await getPageSpeedAnalysis(url);
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

			taskService.updateTask(taskId, {
				status: "completed",
				result: analysisData,
			});

			logger.info(`Website analysis completed for URL: ${url} with ID: ${id} by user: ${userId}`);
		} catch (error) {
			logger.error(`Error during analysis for URL ${url}: ${(error as Error).message}`);
			taskService.updateTask(taskId, {
				status: "failed",
				error: (error as Error).message || "Failed to analyze website",
			});
		}
	});

	return { taskId };
};