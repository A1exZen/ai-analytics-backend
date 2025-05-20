import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import logger from "../utils/logger.js";
import {
	startWebsiteAnalysis
} from "../services/analysisService.js";
import { AnalysisResponse } from "../models/Analysis.js";
import prisma from "../db.js";
import {Task} from "../types/task.js";
import {taskService} from "../services/taskService.js";

interface StartAnalysisRequestBody {
	query: string;
}

interface StartAnalysisResponse {
	taskId: string;
}

interface TaskStatusResponse extends Task {
	status: "pending" | "completed" | "failed";
	result?: AnalysisResponse;
	error?: string;
}


export const startAnalysis = async (req: Request<{}, {}, StartAnalysisRequestBody>, res: Response<StartAnalysisResponse>) => {
	try {
		const { query } = req.body;
		const { taskId } = await startWebsiteAnalysis(query, req);
		res.status(202).json({ taskId });
	} catch (error: unknown) {
		const err = error as { statusCode?: number; message: string };
		logger.error(`Error starting analysis: ${err.message}`);
		res.status(err.statusCode || 500).json();
	}
};

export const getTaskStatus = async (req: Request<{ id: string }>, res: Response<TaskStatusResponse>) => {
	try {
		const { id } = req.params;
		const task = taskService.getTask(id);
		if (!task) {
			res.status(404).json();
			return;
		}
		res.status(200).json(task);
	} catch (error: unknown) {
		const err = error as { message: string };
		logger.error(`Error getting task status: ${err.message}`);
		res.status(500).json();
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

export const getAllAnalyses = async (req: Request, res: Response) => {
	try {
		const analyses = await prisma.analysis.findMany({
			select: { id: true, url: true, createdAt: true, data: true },
		});
		res.status(200).json(analyses);
	} catch (error) {
		logger.error(`Error fetching all analyses: ${(error as Error).message}`);
		res.status(500).json({ error: "Failed to fetch all analyses" });
	}
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
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
