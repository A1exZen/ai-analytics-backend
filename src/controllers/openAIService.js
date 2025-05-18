// import OpenAI from "openai";
// import dotenv from "dotenv";
//
// dotenv.config();
//
// export const getOpenAI = async (url) => {
//
// 	if (!url || typeof url !== "string" || !url.startsWith("http")) {
// 		throw new Error("Invalid URL provided");
// 	}
//
// 	const openai = new OpenAI({
// 		apiKey: process.env.IO_API_KEY,
// 		baseURL: "https://openrouter.ai/api/v1",
// 	});
//
// 	const promptParts = [
// 		// Часть 1: Базовая информация и SEO
// 		`
//         You are an expert website analyst. Analyze the website at the following URL: ${url}.
//         Provide a detailed analysis with precise numerical metrics for the following:
//         - Purpose of the website and its primary content type.
//         - Mobile optimization and responsiveness score (out of 100).
//         - Estimated average loading speed in milliseconds.
//         - SSL certificate status and details of security measures.
//         - SEO score (out of 100) based on the presence of keywords, meta tags, descriptions, and structure.
//         - Number of internal links and external links on the page.
//
//         Return the analysis as a valid JSON object with the following structure and English keys. All text values (strings) must be in Russian. Wrap the JSON in a markdown code block like this:
//         \`\`\`json
//         {
//             "url": "string",
//             "purpose": "string",
//             "primary_content_type": "string",
//             "mobile_optimization": {
//                 "score": number,
//                 "status": "string"
//             },
//             "average_loading_speed": {
//                 "milliseconds": number,
//                 "notes": "string"
//             },
//             "ssl_certificate": {
//                 "status": "string",
//                 "security_measures": "string"
//             },
//             "seo_score": {
//                 "score": number,
//                 "keywords": "string",
//                 "meta_tags": "string",
//                 "description": "string",
//                 "structure": "string"
//             },
//             "links": {
//                 "internal_links": number,
//                 "external_links": number
//             }
//         }
//         \`\`\`
//         **Important**: Return ONLY the markdown code block with the JSON inside. Do not include any additional text, explanations, comments, headers, or reasoning outside the markdown code block. Ensure all numbers are integers or decimals, not strings. Ensure the JSON is valid and matches the structure exactly.
//         `,
//
// 		// Часть 2: Доступность, отскоки, трафик
// 		`
//         You are an expert website analyst. Analyze the website at the following URL: ${url}.
//         Provide a detailed analysis with precise numerical metrics for the following:
//         - Accessibility score (out of 100), including alt tags usage, ARIA labels, and keyboard navigation support.
//         - Bounce rate (percentage) based on typical user interaction patterns.
//         - Estimated traffic distribution (percentages for direct, social, referral, organic, and paid traffic).
//         - Estimated geographic traffic distribution (percentages for Russia, USA, Europe, Asia, and other regions).
//
//         Return the analysis as a valid JSON object with the following structure and English keys. All text values (strings) must be in Russian. Wrap the JSON in a markdown code block like this:
//         \`\`\`json
//         {
//             "accessibility": {
//                 "score": number,
//                 "alt_tags": "string",
//                 "aria_labels": "string",
//                 "keyboard_navigation": "string"
//             },
//             "bounce_rate": {
//                 "percentage": number,
//                 "reason": "string"
//             },
//             "traffic_distribution": {
//                 "direct": number,
//                 "social": number,
//                 "referral": number,
//                 "organic": number,
//                 "paid": number
//             },
//             "traffic_geography": {
//                 "russia": number,
//                 "usa": number,
//                 "europe": number,
//                 "asia": number,
//                 "other": number
//             }
//         }
//         \`\`\`
//         **Important**: Return ONLY the markdown code block with the JSON inside. Do not include any additional text, explanations, comments, headers, or reasoning outside the markdown code block. Ensure all numbers are integers or decimals, not strings. Ensure the JSON is valid and matches the structure exactly.`,
//
// 		// Часть 3: Остальные метрики
// 		`
//         You are an expert website analyst. Analyze the website at the following URL: ${url}.
//         Provide a detailed analysis with precise numerical metrics for the following:
//         - Traffic trends (estimated growth or decline percentage over the past year and notes).
//         - Traffic seasonality (indicate peak months or periods).
//         - Performance scores for mobile and desktop.
//         - Quality of content (based on uniqueness and relevance).
//         - Domain authority (out of 100).
//         - User engagement metrics, such as average time on site, page views per session, conversion rate, and typical user paths.
//         - Device distribution (percentages for mobile, desktop, and tablet users).
//         - Backlinks quantity and quality.
//         - Content freshness (indicating how recent the content is).
//         - Security vulnerabilities, such as cross-site scripting (XSS) and cross-site request forgery (CSRF).
//         - Technological stack (e.g., CMS, frameworks, or server technologies used).
//         - Average page size of the homepage in kilobytes.
//         - Main competitors in the niche and estimated market share (percentage).
//         - Estimated social media mentions or shares.
//         - Domain age in years.
//         - Server response time in milliseconds.
//         - Recommendations to improve performance, SEO, accessibility, security, content quality, and traffic.
//
//         Return the analysis as a valid JSON object with the following structure and English keys. All text values (strings) must be in Russian. Wrap the JSON in a markdown code block like this:
//         \`\`\`json
//         {
//             "traffic_trends": {
//                 "growth_percentage": number,
//                 "notes": "string"
//             },
//             "traffic_seasonality": "string",
//             "performance_scores": {
//                 "mobile": number,
//                 "desktop": number
//             },
//             "quality_of_content": {
//                 "uniqueness": "string",
//                 "relevance": "string"
//             },
//             "domain_authority": number,
//             "user_engagement_metrics": {
//                 "average_time_on_site": number,
//                 "page_views_per_session": number,
//                 "conversion_rate": number,
//                 "user_paths": "string"
//             },
//             "device_distribution": {
//                 "mobile": number,
//                 "desktop": number,
//                 "tablet": number
//             },
//             "backlinks": {
//                 "quantity": number,
//                 "quality": "string"
//             },
//             "content_freshness": "string",
//             "security_vulnerabilities": {
//                 "xss": "string",
//                 "csrf": "string"
//             },
//             "tech_stack": "string",
//             "page_size": {
//                 "kilobytes": number,
//                 "notes": "string"
//             },
//             "competitors": "string",
//             "market_share": number,
//             "social_mentions": number,
//             "domain_age": number,
//             "server_response_time": {
//                 "milliseconds": number,
//                 "notes": "string"
//             },
//             "recommendations": {
//                 "performance": "string",
//                 "seo": "string",
//                 "accessibility": "string",
//                 "security": "string",
//                 "content_quality": "string",
//                 "traffic": "string"
//             }
//         }
//         \`\`\`
//         **Important**: Return ONLY the markdown code block with the JSON inside. Do not include any additional text, explanations, comments, headers, or reasoning outside the markdown code block. Ensure all numbers are integers or decimals, not strings. Ensure the JSON is valid and matches the structure exactly.`,
// 	];
//
// 	const finalResponse = getDefaultAnalysis(url);
//
// 	try {
// 		for (let i = 0; i < promptParts.length; i++) {
// 			const prompt = promptParts[i];
// 			console.log(`Sending prompt part ${i + 1}`);
//
// 			const response = await openai.chat.completions.create({
// 				model: "deepseek/deepseek-r1:free",
// 				messages: [{ role: "user", content: prompt }],
// 				temperature: 0.3,
// 				max_tokens: 2500,
// 				response_format: { type: "json_object" },
// 			});
//
// 			console.log("Full API response:", JSON.stringify(response, null, 2));
//
// 			let content = response.choices[0].message.content;
// 			console.log("Raw response from OpenRouter:", content);
//
// 			let parsedContent;
//
// 			try {
// 				const jsonMatch = content.match(/```json\s*([\s\S]*?)(?:\s*```|$)/);
// 				if (jsonMatch) {
// 					console.log("Extracting JSON from markdown:", jsonMatch[1]);
// 					parsedContent = JSON.parse(jsonMatch[1]);
// 				} else {
// 					console.log("Parsing as plain JSON");
// 					parsedContent = JSON.parse(content);
// 				}
// 			} catch (parseError) {
// 				console.error("Failed to parse content as JSON:", parseError.message);
// 				console.log("Raw content:", content);
// 				continue;
// 			}
//
// 			Object.assign(finalResponse, parsedContent);
// 		}
//
// 		const validatedResponse = transformToSchema(finalResponse, url);
// 		console.log("Final response:", JSON.stringify(validatedResponse, null, 2));
//
// 		return validatedResponse;
// 	} catch (error) {
// 		console.error("Error fetching data from OpenRouter API:", error.message, error.stack);
// 		return getDefaultAnalysis(url);
// 	}
// };
//
// function getDefaultAnalysis(url) {
// 	return {
// 		url,
// 		purpose: "Не удалось определить",
// 		primary_content_type: "Не удалось определить",
// 		mobile_optimization: { score: 0, status: "Не удалось определить" },
// 		average_loading_speed: { milliseconds: 0, notes: "Не удалось определить" },
// 		ssl_certificate: { status: "Не удалось определить", security_measures: "Не удалось определить" },
// 		seo_score: {
// 			score: 0,
// 			keywords: "Не удалось определить",
// 			meta_tags: "Не удалось определить",
// 			description: "Не удалось определить",
// 			structure: "Не удалось определить",
// 		},
// 		links: { internal_links: 0, external_links: 0 },
// 		accessibility: {
// 			score: 0,
// 			alt_tags: "Не удалось определить",
// 			aria_labels: "Не удалось определить",
// 			keyboard_navigation: "Не удалось определить",
// 		},
// 		bounce_rate: { percentage: 0, reason: "Не удалось определить" },
// 		traffic_distribution: { direct: 0, social: 0, referral: 0, organic: 0, paid: 0 },
// 		traffic_geography: { russia: 0, usa: 0, europe: 0, asia: 0, other: 0 },
// 		traffic_trends: { growth_percentage: 0, notes: "Не удалось определить" },
// 		traffic_seasonality: "Не удалось определить",
// 		performance_scores: { mobile: 0, desktop: 0 },
// 		quality_of_content: { uniqueness: "Не удалось определить", relevance: "Не удалось определить" },
// 		domain_authority: 0,
// 		user_engagement_metrics: {
// 			average_time_on_site: 0,
// 			page_views_per_session: 0,
// 			conversion_rate: 0,
// 			user_paths: "Не удалось определить",
// 		},
// 		device_distribution: { mobile: 0, desktop: 0, tablet: 0 },
// 		backlinks: { quantity: 0, quality: "Не удалось определить" },
// 		content_freshness: "Не удалось определить",
// 		security_vulnerabilities: { xss: "Не удалось определить", csrf: "Не удалось определить" },
// 		tech_stack: "Не удалось определить",
// 		page_size: { kilobytes: 0, notes: "Не удалось определить" },
// 		competitors: "Не удалось определить",
// 		market_share: 0,
// 		social_mentions: 0,
// 		domain_age: 0,
// 		server_response_time: { milliseconds: 0, notes: "Не удалось определить" },
// 		recommendations: {
// 			performance: "Не удалось определить",
// 			seo: "Не удалось определить",
// 			accessibility: "Не удалось определить",
// 			security: "Не удалось определить",
// 			content_quality: "Не удалось определить",
// 			traffic: "Не удалось определить",
// 		},
// 	};
// }
//
// function transformToSchema(rawData, url) {
// 	const defaultResponse = getDefaultAnalysis(url);
//
// 	if (!rawData || typeof rawData !== "object") {
// 		console.warn("No valid data received, returning default structure");
// 		return defaultResponse;
// 	}
//
// 	return {
// 		url: rawData.url || url,
// 		purpose: rawData.purpose || defaultResponse.purpose,
// 		primary_content_type: rawData.primary_content_type || defaultResponse.primary_content_type,
// 		mobile_optimization: {
// 			score: Number(rawData.mobile_optimization?.score) || defaultResponse.mobile_optimization.score,
// 			status: rawData.mobile_optimization?.status || defaultResponse.mobile_optimization.status,
// 		},
// 		average_loading_speed: {
// 			milliseconds:
// 				Number(rawData.average_loading_speed?.milliseconds) || defaultResponse.average_loading_speed.milliseconds,
// 			notes: rawData.average_loading_speed?.notes || defaultResponse.average_loading_speed.notes,
// 		},
// 		ssl_certificate: {
// 			status: rawData.ssl_certificate?.status || defaultResponse.ssl_certificate.status,
// 			security_measures: rawData.ssl_certificate?.security_measures || defaultResponse.ssl_certificate.security_measures,
// 		},
// 		seo_score: {
// 			score: Number(rawData.seo_score?.score) || defaultResponse.seo_score.score,
// 			keywords: rawData.seo_score?.keywords || defaultResponse.seo_score.keywords,
// 			meta_tags: rawData.seo_score?.meta_tags || defaultResponse.seo_score.meta_tags,
// 			description: rawData.seo_score?.description || defaultResponse.seo_score.description,
// 			structure: rawData.seo_score?.structure || defaultResponse.seo_score.structure,
// 		},
// 		links: {
// 			internal_links: Number(rawData.links?.internal_links) || defaultResponse.links.internal_links,
// 			external_links: Number(rawData.links?.external_links) || defaultResponse.links.external_links,
// 		},
// 		accessibility: {
// 			score: Number(rawData.accessibility?.score) || defaultResponse.accessibility.score,
// 			alt_tags: rawData.accessibility?.alt_tags || defaultResponse.accessibility.alt_tags,
// 			aria_labels: rawData.accessibility?.aria_labels || defaultResponse.accessibility.aria_labels,
// 			keyboard_navigation: rawData.accessibility?.keyboard_navigation || defaultResponse.accessibility.keyboard_navigation,
// 		},
// 		bounce_rate: {
// 			percentage: Number(rawData.bounce_rate?.percentage) || defaultResponse.bounce_rate.percentage,
// 			reason: rawData.bounce_rate?.reason || defaultResponse.bounce_rate.reason,
// 		},
// 		traffic_distribution: {
// 			direct: Number(rawData.traffic_distribution?.direct) || defaultResponse.traffic_distribution.direct,
// 			social: Number(rawData.traffic_distribution?.social) || defaultResponse.traffic_distribution.social,
// 			referral: Number(rawData.traffic_distribution?.referral) || defaultResponse.traffic_distribution.referral,
// 			organic: Number(rawData.traffic_distribution?.organic) || defaultResponse.traffic_distribution.organic,
// 			paid: Number(rawData.traffic_distribution?.paid) || defaultResponse.traffic_distribution.paid,
// 		},
// 		traffic_geography: {
// 			russia: Number(rawData.traffic_geography?.russia) || defaultResponse.traffic_geography.russia,
// 			usa: Number(rawData.traffic_geography?.usa) || defaultResponse.traffic_geography.usa,
// 			europe: Number(rawData.traffic_geography?.europe) || defaultResponse.traffic_geography.europe,
// 			asia: Number(rawData.traffic_geography?.asia) || defaultResponse.traffic_geography.asia,
// 			other: Number(rawData.traffic_geography?.other) || defaultResponse.traffic_geography.other,
// 		},
// 		traffic_trends: {
// 			growth_percentage:
// 				Number(rawData.traffic_trends?.growth_percentage) || defaultResponse.traffic_trends.growth_percentage,
// 			notes: rawData.traffic_trends?.notes || defaultResponse.traffic_trends.notes,
// 		},
// 		traffic_seasonality: rawData.traffic_seasonality || defaultResponse.traffic_seasonality,
// 		performance_scores: {
// 			mobile: Number(rawData.performance_scores?.mobile) || defaultResponse.performance_scores.mobile,
// 			desktop: Number(rawData.performance_scores?.desktop) || defaultResponse.performance_scores.desktop,
// 		},
// 		quality_of_content: {
// 			uniqueness: rawData.quality_of_content?.uniqueness || defaultResponse.quality_of_content.uniqueness,
// 			relevance: rawData.quality_of_content?.relevance || defaultResponse.quality_of_content.relevance,
// 		},
// 		domain_authority: Number(rawData.domain_authority) || defaultResponse.domain_authority,
// 		user_engagement_metrics: {
// 			average_time_on_site:
// 				Number(rawData.user_engagement_metrics?.average_time_on_site) ||
// 				defaultResponse.user_engagement_metrics.average_time_on_site,
// 			page_views_per_session:
// 				Number(rawData.user_engagement_metrics?.page_views_per_session) ||
// 				defaultResponse.user_engagement_metrics.page_views_per_session,
// 			conversion_rate:
// 				Number(rawData.user_engagement_metrics?.conversion_rate) ||
// 				defaultResponse.user_engagement_metrics.conversion_rate,
// 			user_paths: rawData.user_engagement_metrics?.user_paths || defaultResponse.user_engagement_metrics.user_paths,
// 		},
// 		device_distribution: {
// 			mobile: Number(rawData.device_distribution?.mobile) || defaultResponse.device_distribution.mobile,
// 			desktop: Number(rawData.device_distribution?.desktop) || defaultResponse.device_distribution.desktop,
// 			tablet: Number(rawData.device_distribution?.tablet) || defaultResponse.device_distribution.tablet,
// 		},
// 		backlinks: {
// 			quantity: Number(rawData.backlinks?.quantity) || defaultResponse.backlinks.quantity,
// 			quality: rawData.backlinks?.quality || defaultResponse.backlinks.quality,
// 		},
// 		content_freshness: rawData.content_freshness || defaultResponse.content_freshness,
// 		security_vulnerabilities: {
// 			xss: rawData.security_vulnerabilities?.xss || defaultResponse.security_vulnerabilities.xss,
// 			csrf: rawData.security_vulnerabilities?.csrf || defaultResponse.security_vulnerabilities.csrf,
// 		},
// 		tech_stack: rawData.tech_stack || defaultResponse.tech_stack,
// 		page_size: {
// 			kilobytes: Number(rawData.page_size?.kilobytes) || defaultResponse.page_size.kilobytes,
// 			notes: rawData.page_size?.notes || defaultResponse.page_size.notes,
// 		},
// 		competitors: rawData.competitors || defaultResponse.competitors,
// 		market_share: Number(rawData.market_share) || defaultResponse.market_share,
// 		social_mentions: Number(rawData.social_mentions) || defaultResponse.social_mentions,
// 		domain_age: Number(rawData.domain_age) || defaultResponse.domain_age,
// 		server_response_time: {
// 			milliseconds:
// 				Number(rawData.server_response_time?.milliseconds) || defaultResponse.server_response_time.milliseconds,
// 			notes: rawData.server_response_time?.notes || defaultResponse.server_response_time.notes,
// 		},
// 		recommendations: {
// 			performance: rawData.recommendations?.performance || defaultResponse.recommendations.performance,
// 			seo: rawData.recommendations?.seo || defaultResponse.recommendations.seo,
// 			accessibility: rawData.recommendations?.accessibility || defaultResponse.recommendations.accessibility,
// 			security: rawData.recommendations?.security || defaultResponse.recommendations.security,
// 			content_quality: rawData.recommendations?.content_quality || defaultResponse.recommendations.content_quality,
// 			traffic: rawData.recommendations?.traffic || defaultResponse.recommendations.traffic,
// 		},
// 	};
// }