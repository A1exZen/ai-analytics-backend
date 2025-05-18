import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import logger from "../utils/logger.js";
import { LighthouseResult } from "../models/Analysis.js";

export const getLighthouseAnalysis = async (url: string): Promise<LighthouseResult> => {
	try {
		logger.info(`Starting Lighthouse analysis for URL: ${url}`);

		const browser = await puppeteer.launch({
			headless: "new",
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const { port } = new URL(browser.wsEndpoint());
		const lighthouseConfig = {
			extends: "lighthouse:default",
			settings: {
				onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
			},
		};

		const { lhr } = await lighthouse(url, {
			port: parseInt(port),
			output: "json",
			logLevel: "info",
		}, lighthouseConfig);

		await browser.close();

		const performance = Math.round(lhr.categories.performance.score * 100);
		const accessibility = Math.round(lhr.categories.accessibility.score * 100);
		const bestPractices = Math.round(lhr.categories["best-practices"].score * 100);
		const seo = Math.round(lhr.categories.seo.score * 100);

		const metrics = {
			firstContentfulPaint: lhr.audits["first-contentful-paint"]?.displayValue || "N/A",
			largestContentfulPaint: lhr.audits["largest-contentful-paint"]?.displayValue || "N/A",
			totalBlockingTime: lhr.audits["total-blocking-time"]?.displayValue || "N/A",
			cumulativeLayoutShift: lhr.audits["cumulative-layout-shift"]?.displayValue || "N/A",
			speedIndex: lhr.audits["speed-index"]?.displayValue || "N/A",
		};

		const result: LighthouseResult = {
			performance,
			accessibility,
			bestPractices,
			seo,
			metrics,
		};

		logger.info(`Lighthouse analysis completed for URL: ${url}`);
		return result;
	} catch (error) {
		logger.error(`Error during Lighthouse analysis for URL ${url}: ${(error as Error).message}`);
		throw new Error(`Failed to perform Lighthouse analysis: ${(error as Error).message}`);
	}
};