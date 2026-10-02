const getSiteOrigin = () => {
	const envOrigin = String(import.meta.env.VITE_FRONTEND_URL ?? "").trim();
	if (envOrigin) {
		return envOrigin.replace(/\/$/, "");
	}

	if (typeof window !== "undefined" && window.location?.origin) {
		return window.location.origin.replace(/\/$/, "");
	}

	return "https://siliguriproperty.in";
};

const TRACKING_PARAM_PREFIXES = ["utm_", "gclid", "fbclid", "ref", "source"];

const normalizeCanonicalPath = (canonicalPath: string): string => {
	const origin = getSiteOrigin();
	const parsed = new URL(
		canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`,
		`${origin}/`,
	);

	parsed.hash = "";
	parsed.pathname =
		parsed.pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";

	for (const key of [...parsed.searchParams.keys()]) {
		const lowered = key.toLowerCase();
		if (
			TRACKING_PARAM_PREFIXES.some(
				(prefix) => lowered === prefix || lowered.startsWith(prefix),
			)
		) {
			parsed.searchParams.delete(key);
		}
	}

	const sorted = [...parsed.searchParams.entries()].sort(([a], [b]) =>
		a.localeCompare(b),
	);
	parsed.search = "";
	for (const [key, value] of sorted) {
		if (String(value).trim()) {
			parsed.searchParams.set(key, String(value).trim());
		}
	}

	return `${parsed.pathname}${parsed.search}`;
};

const setMetaTag = (
	selector: string,
	attrName: "name" | "property",
	key: string,
	content: string,
) => {
	let meta = document.querySelector(selector) as HTMLMetaElement | null;
	if (!meta) {
		meta = document.createElement("meta");
		meta.setAttribute(attrName, key);
		document.head.appendChild(meta);
	}
	meta.setAttribute("content", content);
};

export interface SeoMetaInput {
	title: string;
	description: string;
	canonicalPath: string;
	keywords?: string;
	imageUrl?: string;
	ogType?: "website" | "article";
	robots?: string;
}

export const applySeoMeta = ({
	title,
	description,
	canonicalPath,
	keywords,
	imageUrl = "https://siliguriproperty.in/logo_siliguri_property.png",
	ogType = "website",
	robots = "index, follow",
}: SeoMetaInput) => {
	const origin = getSiteOrigin();
	const normalizedCanonicalPath = normalizeCanonicalPath(canonicalPath);
	const absoluteUrl = `${origin}${normalizedCanonicalPath}`;

	document.title = title;
	setMetaTag('meta[name="description"]', "name", "description", description);
	setMetaTag('meta[name="robots"]', "name", "robots", robots);
	setMetaTag('meta[name="googlebot"]', "name", "googlebot", robots);
	if (keywords) {
		setMetaTag('meta[name="keywords"]', "name", "keywords", keywords);
	}

	setMetaTag('meta[property="og:title"]', "property", "og:title", title);
	setMetaTag(
		'meta[property="og:description"]',
		"property",
		"og:description",
		description,
	);
	setMetaTag('meta[property="og:url"]', "property", "og:url", absoluteUrl);
	setMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
	setMetaTag('meta[property="og:image"]', "property", "og:image", imageUrl);

	setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
	setMetaTag(
		'meta[name="twitter:description"]',
		"name",
		"twitter:description",
		description,
	);
	setMetaTag('meta[name="twitter:url"]', "name", "twitter:url", absoluteUrl);
	setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);

	let canonical = document.querySelector(
		'link[rel="canonical"]',
	) as HTMLLinkElement | null;
	if (!canonical) {
		canonical = document.createElement("link");
		canonical.setAttribute("rel", "canonical");
		document.head.appendChild(canonical);
	}
	canonical.setAttribute("href", absoluteUrl);
};
