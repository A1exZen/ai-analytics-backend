import OpenAI from "openai";
import { config } from "../config/env.js";
import { promptParts } from "../constants/prompts.js";
import { OpenAIAnalysis } from "../models/Analysis.js";
import { getDefaultAnalysis } from "../utils/defaultAnalysis.js";

export const getOpenAIAnalysis = async (url: string): Promise<OpenAIAnalysis> => {
	const openai = new OpenAI({
		apiKey: config.openRouterApiKey,
		baseURL: "https://openrouter.ai/api/v1",
	});

	const prompts = promptParts(url);
	const result = getDefaultAnalysis(url);

	for (let i = 0; i < prompts.length; i++) {
		const prompt = prompts[i];
		console.log(`Sending prompt part ${i + 1}`);

		const response = await openai.chat.completions.create({
			model: "deepseek/deepseek-r1:free",
			messages: [{ role: "user", content: prompt }],
			temperature: 0.3,
			max_tokens: 2500,
			response_format: { type: "json_object" },
		});

		console.log("Full API response:", JSON.stringify(response, null, 2));

		const content = response.choices[0].message.content;
		console.log("Raw response from OpenRouter:", content);

		let parsedContent: any;
		try {
			const jsonMatch = content?.match(/```json\s*([\s\S]*?)(?:\s*```|$)/);
			if (jsonMatch) {
				console.log("Extracting JSON from markdown:", jsonMatch[1]);
				parsedContent = JSON.parse(jsonMatch[1]);
			} else {
				console.log("Parsing as plain JSON");
				if (content != null) {
					parsedContent = JSON.parse(content);
				}
			}
		} catch (parseError) {
			console.error("Failed to parse content as JSON:", (parseError as Error).message);
			console.log("Raw content:", content);
			continue;
		}

		Object.assign(result, parsedContent);
	}

	return result;
};