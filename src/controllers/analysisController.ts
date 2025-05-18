import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import logger from "../utils/logger.js";
import { analyzeWebsite } from "../services/analysisService.js";
import { AnalysisResponse } from "../models/Analysis.js";
import prisma from "../db.js";

const AnalyzeRequestSchema = z.object({
	query: z.string().url("Некорректный URL"),
});

interface AppError extends Error {
	statusCode: number;
	message: string;
}

const createAppError = (message: string, statusCode: number): AppError => {
	const error = new Error(message) as AppError;
	error.statusCode = statusCode;
	return error;
};

export const analyze: (req: Request, res: Response, next: NextFunction) => void = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { query } = AnalyzeRequestSchema.parse(req.body);

		logger.info(`Analyzing website: ${query}`);
		const { id, data } = await analyzeWebsite(query, req);

		logger.info(`Analysis completed for: ${query} with ID: ${id}`);
		res.status(200).json({ id, data });
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.warn(`Validation error: ${error.message}`);
			res.status(400).json({ error: "Некорректный запрос", details: error.errors });
			return;
		}

		const appError = error instanceof Error ? createAppError(error.message, 500) : createAppError("Ошибка при анализе сайта", 500);
		logger.error(`Controller error: ${appError.message}`);
		res.status(appError.statusCode).json({ error: appError.message });
	}
};

export const getAnalysis: (req: Request, res: Response, next: NextFunction) => void = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const userId = req.user?.userId;
		const analysis = await prisma.analysis.findFirst({
			where: { id, userId },
		});
		if (!analysis) {
			res.status(404).json({ error: "Analysis not found or you do not have access" });
			return;
		}
		res.status(200).json(analysis.data);
	} catch (error) {
		logger.error(`Error fetching analysis with ID ${req.params.id}: ${(error as Error).message}`);
		res.status(500).json({ error: "Failed to fetch analysis" });
	}
};

export const getHistory: (req: Request, res: Response, next: NextFunction) => void = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user?.userId;
		const analyses = await prisma.analysis.findMany({
			where: { userId },
			select: { id: true, url: true, createdAt: true },
		});
		res.status(200).json(analyses);
	} catch (error) {
		logger.error(`Error fetching history: ${(error as Error).message}`);
		res.status(500).json({ error: "Failed to fetch history" });
	}
};