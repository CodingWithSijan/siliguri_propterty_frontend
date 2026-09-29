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
}

export const applySeoMeta = ({
	title,
	description,
	canonicalPath,
	keywords,
	imageUrl = "https://siliguriproperty.in/logo_siliguri_property.png",
	ogType = "website",
}: SeoMetaInput) => {
	const origin = getSiteOrigin();
	const absoluteUrl = `${origin}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;

	document.title = title;
	setMetaTag('meta[name="description"]', "name", "description", description);
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
