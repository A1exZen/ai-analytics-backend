// import axios from "axios";
// import logger from "../utils/logger.js";
// import { VirusTotalResult } from "../models/Analysis.js";
// import { config } from "../config/env.js";
//
// export const getVirusTotalAnalysis = async (url: string): Promise<VirusTotalResult> => {
// 	try {
// 		logger.info(`Starting VirusTotal analysis for URL: ${url}`);
//
// 		const scanResponse = await axios.post(
// 			"https://www.virustotal.com/api/v3/urls",
// 			{ url },
// 			{
// 				headers: {
// 					"x-apikey": config.VIRUSTOTAL_API_KEY,
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);
//
// 		const scanId = scanResponse.data.data.id;
//
// 		const reportResponse = await axios.get(
// 			`https://www.virustotal.com/api/v3/analyses/${scanId}`,
// 			{
// 				headers: {
// 					"x-apikey": config.VIRUSTOTAL_API_KEY,
// 				},
// 			}
// 		);
//
// 		const { stats, status } = reportResponse.data.data.attributes;
// 		const positives = stats.malicious + stats.suspicious;
// 		const total = stats.harmless + stats.malicious + stats.suspicious + stats.undetected;
//
// 		const result: VirusTotalResult = {
// 			status,
// 			positives,
// 			total,
// 			isMalicious: positives > 0,
// 		};
//
// 		logger.info(`VirusTotal analysis completed for URL: ${url}`);
// 		return result;
// 	} catch (error) {
// 		logger.error(`Error during VirusTotal analysis for URL ${url}: ${(error as Error).message}`);
// 		throw new Error(`Failed to perform VirusTotal analysis: ${(error as Error).message}`);
// 	}
// };