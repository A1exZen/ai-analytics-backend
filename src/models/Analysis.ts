// Модель для ответа PageSpeed Insights
export interface PageSpeedMetrics {
	serverResponseTime: string;
	totalByteWeight: string;
	speedIndex: string;
	firstContentfulPaint: string;
	largestContentfulPaint: string;
	totalBlockingTime: string;
	interactive: string;
	firstMeaningfulPaint: string;
	cumulativeLayoutShift: string;
	usesOptimizedImages: string;
	networkRTT: string;
}

export interface PageSpeedResult {
	performance: number;
	metrics: PageSpeedMetrics;
}

// Модель для анализа OpenAI (упрощённая для примера, добавьте остальные поля)
export interface MobileOptimization {
	score: number;
	status: string;
}

export interface AverageLoadingSpeed {
	milliseconds: number;
	notes: string;
}

export interface SSLCertificate {
	status: string;
	security_measures: string;
}

export interface SEOScore {
	score: number;
	keywords: string;
	meta_tags: string;
	description: string;
	structure: string;
}

export interface Links {
	internal_links: number;
	external_links: number;
}

export interface Accessibility {
	score: number;
	alt_tags: string;
	aria_labels: string;
	keyboard_navigation: string;
}

export interface BounceRate {
	percentage: number;
	reason: string;
}

export interface TrafficDistribution {
	direct: number;
	social: number;
	referral: number;
	organic: number;
	paid: number;
}

export interface TrafficGeography {
	russia: number;
	usa: number;
	europe: number;
	asia: number;
	other: number;
}

export interface TrafficTrends {
	growth_percentage: number;
	notes: string;
}

export interface PerformanceScores {
	mobile: number;
	desktop: number;
}

export interface QualityOfContent {
	uniqueness: string;
	relevance: string;
}

export interface UserEngagementMetrics {
	average_time_on_site: number;
	page_views_per_session: number;
	conversion_rate: number;
	user_paths: string;
}

export interface DeviceDistribution {
	mobile: number;
	desktop: number;
	tablet: number;
}

export interface Backlinks {
	quantity: number;
	quality: string;
}

export interface SecurityVulnerabilities {
	xss: string;
	csrf: string;
}

export interface PageSize {
	kilobytes: number;
	notes: string;
}

export interface Recommendations {
	performance: string;
	seo: string;
	accessibility: string;
	security: string;
	content_quality: string;
	traffic: string;
}

export interface OpenAIAnalysis {
	url: string;
	purpose: string;
	primary_content_type: string;
	mobile_optimization: MobileOptimization;
	average_loading_speed: AverageLoadingSpeed;
	ssl_certificate: SSLCertificate;
	seo_score: SEOScore;
	links: Links;
	accessibility: Accessibility;
	bounce_rate: BounceRate;
	traffic_distribution: TrafficDistribution;
	traffic_geography: TrafficGeography;
	traffic_trends: TrafficTrends;
	traffic_seasonality: string;
	performance_scores: PerformanceScores;
	quality_of_content: QualityOfContent;
	domain_authority: number;
	user_engagement_metrics: UserEngagementMetrics;
	device_distribution: DeviceDistribution;
	backlinks: Backlinks;
	content_freshness: string;
	security_vulnerabilities: SecurityVulnerabilities;
	tech_stack: string;
	page_size: PageSize;
	competitors: string;
	market_share: number;
	social_mentions: number;
	domain_age: number;
	server_response_time: AverageLoadingSpeed;
	recommendations: Recommendations;
}


export interface LighthouseMetrics {
	firstContentfulPaint: string;
	largestContentfulPaint: string;
	totalBlockingTime: string;
	cumulativeLayoutShift: string;
	speedIndex: string;
}

export interface LighthouseResult {
	performance: number;
	accessibility: number;
	bestPractices: number;
	seo: number;
	metrics: LighthouseMetrics;
}


export interface AnalysisResponse {
	pageSpeed: PageSpeedResult;
	openAIAnalysis: OpenAIAnalysis;
	lighthouse: LighthouseResult;
}