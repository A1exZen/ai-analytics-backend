import { AnalysisResponse } from "../models/Analysis.js"

export interface AnalysisHistoryItem {
	id: string
	url: string
	createdAt: Date
}

export interface AnalysisDetail extends AnalysisHistoryItem {
	data: AnalysisResponse
}

export interface GetAllAnalysesResponse {
	id: string
	url: string
	data: AnalysisResponse
	createdAt: Date
}
