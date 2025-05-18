// import axios from "axios";
// import logger from "../utils/logger.js";
// import { SecurityHeadersResult } from "../models/Analysis.js";
//
// export const getSecurityHeadersAnalysis = async (url: string): Promise<SecurityHeadersResult> => {
// 	try {
// 		logger.info(`Starting Security Headers analysis for URL: ${url}`);
// 		const response = await axios.get(`https://securityheaders.com/?q=${encodeURIComponent(url)}&followRedirects=on`, {
// 			headers: {
// 				"User-Agent": "YourApp/1.0",
// 			},
// 		});
//
// 		const grade = response.data.match(/<div class="grade">([^<]+)</)?.[1] || "N/A";
// 		const headers = response.data.match(/<td class="header">([^<]+)</g)?.map((h: string) => h.replace('<td class="header">', '').replace('</', '')) || [];
// 		const status = response.data.includes("All tests completed") ? "Completed" : "Failed";
//
// 		const result: SecurityHeadersResult = {
// 			grade,
// 			headers,
// 			status,
// 		};
//
// 		logger.info(`Security Headers analysis completed for URL: ${url}`);
// 		return result;
// 	} catch (error) {
// 		logger.error(`Error during Security Headers analysis for URL ${url}: ${(error as Error).message}`);
// 		throw new Error(`Failed to perform Security Headers analysis: ${(error as Error).message}`);
// 	}
// };