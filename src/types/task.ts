import {AnalysisResponse} from "../models/Analysis.js";

export interface Task {
	id: string;
	status: "pending" | "completed" | "failed";
	result?: AnalysisResponse;
	error?: string;
}

export interface StartTaskResponse {
	taskId: string;
}