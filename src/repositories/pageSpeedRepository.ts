import axios from "axios";
import { config } from "../config/env.js";
import { PageSpeedMetrics, PageSpeedResult } from "../models/Analysis.js";
import logger from "../utils/logger.js";

export const getPageSpeedAnalysis = async (url: string): Promise<PageSpeedResult> => {
	if (!config.pageSpeedApiKey) {
		logger.error("PageSpeed API key is not configured");
		throw new Error("PageSpeed API key is not configured");
	}

	try {
		logger.info(`Fetching PageSpeed analysis for URL: ${url}`);
		const response = await axios.get(
			`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${config.pageSpeedApiKey}`
		);
		const { audits, categories } = response.data.lighthouseResult;

		const metrics: PageSpeedMetrics = {
			serverResponseTime: audits["server-response-time"]?.displayValue || "N/A",
			totalByteWeight: audits["total-byte-weight"]?.displayValue || "N/A",
			speedIndex: audits["speed-index"]?.displayValue || "N/A",
			firstContentfulPaint: audits["first-contentful-paint"]?.displayValue || "N/A",
			largestContentfulPaint: audits["largest-contentful-paint"]?.displayValue || "N/A",
			totalBlockingTime: audits["total-blocking-time"]?.displayValue || "N/A",
			interactive: audits["interactive"]?.displayValue || "N/A",
			firstMeaningfulPaint: audits["first-meaningful-paint"]?.displayValue || "N/A",
			cumulativeLayoutShift: audits["cumulative-layout-shift"]?.displayValue || "N/A",
			usesOptimizedImages: audits["uses-optimized-images"]?.score === 1 ? "Yes" : "No",
			networkRTT: audits["network-rtt"]?.displayValue || "N/A",
		};

		logger.info(`PageSpeed analysis completed for URL: ${url}`);
		return {
			performance: categories.performance.score * 100,
			metrics,
		};
	} catch (error) {
		logger.error(`Error fetching PageSpeed analysis for URL ${url}: ${(error as Error).message}`);
		throw new Error(`Failed to fetch PageSpeed analysis: ${(error as Error).message}`);
	}
};