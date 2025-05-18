import { OpenAIAnalysis } from "../models/Analysis.js";
import { getDefaultAnalysis } from "./defaultAnalysis.js";

export const transformToSchema = (rawData: any, url: string): OpenAIAnalysis => {
	const defaultResponse = getDefaultAnalysis(url);

	if (!rawData || typeof rawData !== "object") {
		console.warn("No valid data received, returning default structure");
		return defaultResponse;
	}

	return {
		url: rawData.url || url,
		purpose: rawData.purpose || defaultResponse.purpose,
		primary_content_type: rawData.primary_content_type || defaultResponse.primary_content_type,
		mobile_optimization: {
			score: Number(rawData.mobile_optimization?.score) || defaultResponse.mobile_optimization.score,
			status: rawData.mobile_optimization?.status || defaultResponse.mobile_optimization.status,
		},
		average_loading_speed: {
			milliseconds:
				Number(rawData.average_loading_speed?.milliseconds) || defaultResponse.average_loading_speed.milliseconds,
			notes: rawData.average_loading_speed?.notes || defaultResponse.average_loading_speed.notes,
		},
		ssl_certificate: {
			status: rawData.ssl_certificate?.status || defaultResponse.ssl_certificate.status,
			security_measures: rawData.ssl_certificate?.security_measures || defaultResponse.ssl_certificate.security_measures,
		},
		seo_score: {
			score: Number(rawData.seo_score?.score) || defaultResponse.seo_score.score,
			keywords: rawData.seo_score?.keywords || defaultResponse.seo_score.keywords,
			meta_tags: rawData.seo_score?.meta_tags || defaultResponse.seo_score.meta_tags,
			description: rawData.seo_score?.description || defaultResponse.seo_score.description,
			structure: rawData.seo_score?.structure || defaultResponse.seo_score.structure,
		},
		links: {
			internal_links: Number(rawData.links?.internal_links) || defaultResponse.links.internal_links,
			external_links: Number(rawData.links?.external_links) || defaultResponse.links.external_links,
		},
		accessibility: {
			score: Number(rawData.accessibility?.score) || defaultResponse.accessibility.score,
			alt_tags: rawData.accessibility?.alt_tags || defaultResponse.accessibility.alt_tags,
			aria_labels: rawData.accessibility?.aria_labels || defaultResponse.accessibility.aria_labels,
			keyboard_navigation: rawData.accessibility?.keyboard_navigation || defaultResponse.accessibility.keyboard_navigation,
		},
		bounce_rate: {
			percentage: Number(rawData.bounce_rate?.percentage) || defaultResponse.bounce_rate.percentage,
			reason: rawData.bounce_rate?.reason || defaultResponse.bounce_rate.reason,
		},
		traffic_distribution: {
			direct: Number(rawData.traffic_distribution?.direct) || defaultResponse.traffic_distribution.direct,
			social: Number(rawData.traffic_distribution?.social) || defaultResponse.traffic_distribution.social,
			referral: Number(rawData.traffic_distribution?.referral) || defaultResponse.traffic_distribution.referral,
			organic: Number(rawData.traffic_distribution?.organic) || defaultResponse.traffic_distribution.organic,
			paid: Number(rawData.traffic_distribution?.paid) || defaultResponse.traffic_distribution.paid,
		},
		traffic_geography: {
			russia: Number(rawData.traffic_geography?.russia) || defaultResponse.traffic_geography.russia,
			usa: Number(rawData.traffic_geography?.usa) || defaultResponse.traffic_geography.usa,
			europe: Number(rawData.traffic_geography?.europe) || defaultResponse.traffic_geography.europe,
			asia: Number(rawData.traffic_geography?.asia) || defaultResponse.traffic_geography.asia,
			other: Number(rawData.traffic_geography?.other) || defaultResponse.traffic_geography.other,
		},
		traffic_trends: {
			growth_percentage:
				Number(rawData.traffic_trends?.growth_percentage) || defaultResponse.traffic_trends.growth_percentage,
			notes: rawData.traffic_trends?.notes || defaultResponse.traffic_trends.notes,
		},
		traffic_seasonality: rawData.traffic_seasonality || defaultResponse.traffic_seasonality,
		performance_scores: {
			mobile: Number(rawData.performance_scores?.mobile) || defaultResponse.performance_scores.mobile,
			desktop: Number(rawData.performance_scores?.desktop) || defaultResponse.performance_scores.desktop,
		},
		quality_of_content: {
			uniqueness: rawData.quality_of_content?.uniqueness || defaultResponse.quality_of_content.uniqueness,
			relevance: rawData.quality_of_content?.relevance || defaultResponse.quality_of_content.relevance,
		},
		domain_authority: Number(rawData.domain_authority) || defaultResponse.domain_authority,
		user_engagement_metrics: {
			average_time_on_site:
				Number(rawData.user_engagement_metrics?.average_time_on_site) ||
				defaultResponse.user_engagement_metrics.average_time_on_site,
			page_views_per_session:
				Number(rawData.user_engagement_metrics?.page_views_per_session) ||
				defaultResponse.user_engagement_metrics.page_views_per_session,
			conversion_rate:
				Number(rawData.user_engagement_metrics?.conversion_rate) ||
				defaultResponse.user_engagement_metrics.conversion_rate,
			user_paths: rawData.user_engagement_metrics?.user_paths || defaultResponse.user_engagement_metrics.user_paths,
		},
		device_distribution: {
			mobile: Number(rawData.device_distribution?.mobile) || defaultResponse.device_distribution.mobile,
			desktop: Number(rawData.device_distribution?.desktop) || defaultResponse.device_distribution.desktop,
			tablet: Number(rawData.device_distribution?.tablet) || defaultResponse.device_distribution.tablet,
		},
		backlinks: {
			quantity: Number(rawData.backlinks?.quantity) || defaultResponse.backlinks.quantity,
			quality: rawData.backlinks?.quality || defaultResponse.backlinks.quality,
		},
		content_freshness: rawData.content_freshness || defaultResponse.content_freshness,
		security_vulnerabilities: {
			xss: rawData.security_vulnerabilities?.xss || defaultResponse.security_vulnerabilities.xss,
			csrf: rawData.security_vulnerabilities?.csrf || defaultResponse.security_vulnerabilities.csrf,
		},
		tech_stack: rawData.tech_stack || defaultResponse.tech_stack,
		page_size: {
			kilobytes: Number(rawData.page_size?.kilobytes) || defaultResponse.page_size.kilobytes,
			notes: rawData.page_size?.notes || defaultResponse.page_size.notes,
		},
		competitors: rawData.competitors || defaultResponse.competitors,
		market_share: Number(rawData.market_share) || defaultResponse.market_share,
		social_mentions: Number(rawData.social_mentions) || defaultResponse.social_mentions,
		domain_age: Number(rawData.domain_age) || defaultResponse.domain_age,
		server_response_time: {
			milliseconds:
				Number(rawData.server_response_time?.milliseconds) || defaultResponse.server_response_time.milliseconds,
			notes: rawData.server_response_time?.notes || defaultResponse.server_response_time.notes,
		},
		recommendations: {
			performance: rawData.recommendations?.performance || defaultResponse.recommendations.performance,
			seo: rawData.recommendations?.seo || defaultResponse.recommendations.seo,
			accessibility: rawData.recommendations?.accessibility || defaultResponse.recommendations.accessibility,
			security: rawData.recommendations?.security || defaultResponse.recommendations.security,
			content_quality: rawData.recommendations?.content_quality || defaultResponse.recommendations.content_quality,
			traffic: rawData.recommendations?.traffic || defaultResponse.recommendations.traffic,
		},
	};
};