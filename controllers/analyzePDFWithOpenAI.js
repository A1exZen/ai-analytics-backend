// controllers/analyzePDFWithOpenAI.js
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.IO_API_KEY,
	baseURL: "https://openrouter.ai/api/v1",
});

export const analyzePDFWithOpenAI = async (text) => {
	try {
		const prompt = `Analyze the following text and provide a summary and key insights in JSON format:\n\n${text}. Text in json should be in Russian. Returns only json, without text outside.`;

		const response = await openai.chat.completions.create({
			model: "deepseek/deepseek-r1:free",
			messages: [{ role: "user", content: prompt }],
			temperature: 0.3,
			max_tokens: 2000,
			response_format: { type: "json_object" },
		});

		return response.choices[0].message.content;
	} catch (error) {
		console.error("Ошибка при запросе к DeepSeek API:", error.message);
		throw new Error("Ошибка при анализе текста с помощью AI.");
	}
};