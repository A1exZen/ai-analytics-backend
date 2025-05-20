import puppeteer from "puppeteer";
import lighthouse, { RunnerResult } from "lighthouse";
import logger from "../utils/logger.js";
import { LighthouseResult } from "../models/Analysis.js";

export const getLighthouseAnalysis = async (url: string): Promise<LighthouseResult> => {
	try {
		logger.info(`Starting Lighthouse analysis for URL: ${url}`);

		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const wsEndpoint = browser.wsEndpoint();
		const urlObject = new URL(wsEndpoint);
		const port = parseInt(urlObject.port);

		const lighthouseConfig = {
			extends: "lighthouse:default",
			settings: {
				onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
			},
		};

		const result = await lighthouse(url, {
			port,
			output: "json",
			logLevel: "info",
		}, lighthouseConfig);

		if (!result) {
			await browser.close();
			throw new Error("Lighthouse returned undefined result.");
		}

		const { lhr } = result;

		const performance = Math.round((lhr.categories.performance.score ?? 0) * 100);
		const accessibility = Math.round((lhr.categories.accessibility.score ?? 0) * 100);
		const bestPractices = Math.round((lhr.categories["best-practices"].score ?? 0) * 100);
		const seo = Math.round((lhr.categories.seo.score ?? 0) * 100);

		const metrics = {
			firstContentfulPaint: lhr.audits["first-contentful-paint"]?.displayValue || "N/A",
			largestContentfulPaint: lhr.audits["largest-contentful-paint"]?.displayValue || "N/A",
			totalBlockingTime: lhr.audits["total-blocking-time"]?.displayValue || "N/A",
			cumulativeLayoutShift: lhr.audits["cumulative-layout-shift"]?.displayValue || "N/A",
			speedIndex: lhr.audits["speed-index"]?.displayValue || "N/A",
		};

		const resultObj: LighthouseResult = {
			performance,
			accessibility,
			bestPractices,
			seo,
			metrics,
		};

		await browser.close();
		logger.info(`Lighthouse analysis completed for URL: ${url}`);
		return resultObj;
	} catch (error) {
		logger.error(`Error during Lighthouse analysis for URL ${url}: ${(error as Error).message}`);
		throw new Error(`Failed to perform Lighthouse analysis: ${(error as Error).message}`);
	}
};
