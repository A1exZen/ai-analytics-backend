import { AnalysisResponse } from "../models/Analysis.js";

export interface AnalysisHistoryItem {
	id: string;
	url: string;
	createdAt: Date;
}

export interface AnalysisDetail extends AnalysisHistoryItem {
	data: AnalysisResponse;
}