export const promptParts = (url: string) => [
	// Часть 1: Базовая информация и SEO
	`
    You are an expert website analyst. Analyze the website at the following URL: ${url}.
    Provide a detailed analysis with precise numerical metrics for the following:
    - Purpose of the website and its primary content type.
    - Mobile optimization and responsiveness score (out of 100).
    - Estimated average loading speed in milliseconds.
    - SSL certificate status and details of security measures.
    - SEO score (out of 100) based on the presence of keywords, meta tags, descriptions, and structure.
    - Number of internal links and external links on the page.

    Return the analysis as a valid JSON object with the following structure and English keys. All text values (strings) must be in Russian. Wrap the JSON in a markdown code block like this:
    \`\`\`json
    {
        "url": "string",
        "purpose": "string",
        "primary_content_type": "string",
        "mobile_optimization": {
            "score": number,
            "status": "string"
        },
        "average_loading_speed": {
            "milliseconds": number,
            "notes": "string"
        },
        "ssl_certificate": {
            "status": "string",
            "security_measures": "string"
        },
        "seo_score": {
            "score": number,
            "keywords": "string",
            "meta_tags": "string",
            "description": "string",
            "structure": "string"
        },
        "links": {
            "internal_links": number,
            "external_links": number
        }
    }
    \`\`\`
    **Important**: Return ONLY the markdown code block with the JSON inside. Do not include any additional text, explanations, comments, headers, or reasoning outside the markdown code block. Ensure all numbers are integers or decimals, not strings. Ensure the JSON is valid and matches the structure exactly.
  `,

	// Часть 2: Доступность, отскоки, трафик
	`
    You are an expert website analyst. Analyze the website at the following URL: ${url}.
    Provide a detailed analysis with precise numerical metrics for the following:
    - Accessibility score (out of 100), including alt tags usage, ARIA labels, and keyboard navigation support.
    - Bounce rate (percentage) based on typical user interaction patterns.
    - Estimated traffic distribution (percentages for direct, social, referral, organic, and paid traffic).
    - Estimated geographic traffic distribution (percentages for Russia, USA, Europe, Asia, and other regions).

    Return the analysis as a valid JSON object with the following structure and English keys. All text values (strings) must be in Russian. Wrap the JSON in a markdown code block like this:
    \`\`\`json
    {
        "accessibility": {
            "score": number,
            "alt_tags": "string",
            "aria_labels": "string",
            "keyboard_navigation": "string"
        },
        "bounce_rate": {
            "percentage": number,
            "reason": "string"
        },
        "traffic_distribution": {
            "direct": number,
            "social": number,
            "referral": number,
            "organic": number,
            "paid": number
        },
        "traffic_geography": {
            "russia": number,
            "usa": number,
            "europe": number,
            "asia": number,
            "other": number
        }
    }
    \`\`\`
    **Important**: Return ONLY the markdown code block with the JSON inside. Do not include any additional text, explanations, comments, headers, or reasoning outside the markdown code block. Ensure all numbers are integers or decimals, not strings. Ensure the JSON is valid and matches the structure exactly.
  `,

	// Часть 3: Остальные метрики
	`
    You are an expert website analyst. Analyze the website at the following URL: ${url}.
    Provide a detailed analysis with precise numerical metrics for the following:
    - Traffic trends (estimated growth or decline percentage over the past year and notes).
    - Traffic seasonality (indicate peak months or periods).
    - Performance scores for mobile and desktop.
    - Quality of content (based on uniqueness and relevance).
    - Domain authority (out of 100).
    - User engagement metrics, such as average time on site, page views per session, conversion rate, and typical user paths.
    - Device distribution (percentages for mobile, desktop, and tablet users).
    - Backlinks quantity and quality.
    - Content freshness (indicating how recent the content is).
    - Security vulnerabilities, such as cross-site scripting (XSS) and cross-site request forgery (CSRF).
    - Technological stack (e.g., CMS, frameworks, or server technologies used).
    - Average page size of the homepage in kilobytes.
    - Main competitors in the niche and estimated market share (percentage).
    - Estimated social media mentions or shares.
    - Domain age in years.
    - Server response time in milliseconds.
    - Recommendations to improve performance, SEO, accessibility, security, content quality, and traffic.

    Return the analysis as a valid JSON object with the following structure and English keys. All text values (strings) must be in Russian. Wrap the JSON in a markdown code block like this:
    \`\`\`json
    {
        "traffic_trends": {
            "growth_percentage": number,
            "notes": "string"
        },
        "traffic_seasonality": "string",
        "performance_scores": {
            "mobile": number,
            "desktop": number
        },
        "quality_of_content": {
            "uniqueness": "string",
            "relevance": "string"
        },
        "domain_authority": number,
        "user_engagement_metrics": {
            "average_time_on_site": number,
            "page_views_per_session": number,
            "conversion_rate": number,
            "user_paths": "string"
        },
        "device_distribution": {
            "mobile": number,
            "desktop": number,
            "tablet": number
        },
        "backlinks": {
            "quantity": number,
            "quality": "string"
        },
        "content_freshness": "string",
        "security_vulnerabilities": {
            "xss": "string",
            "csrf": "string"
        },
        "tech_stack": "string",
        "page_size": {
            "kilobytes": number,
            "notes": "string"
        },
        "competitors": "string",
        "market_share": number,
        "social_mentions": number,
        "domain_age": number,
        "server_response_time": {
            "milliseconds": number,
            "notes": "string"
        },
        "recommendations": {
            "performance": "string",
            "seo": "string",
            "accessibility": "string",
            "security": "string",
            "content_quality": "string",
            "traffic": "string"
        }
    }
    \`\`\`
    **Important**: Return ONLY the markdown code block with the JSON inside. Do not include any additional text, explanations, comments, headers, or reasoning outside the markdown code block. Ensure all numbers are integers or decimals, not strings. Ensure the JSON is valid and matches the structure exactly.
  `,
];