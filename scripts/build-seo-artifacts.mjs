import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const distDir = path.join(cwd, "dist");
const publicDir = path.join(cwd, "public");

const FALLBACK_ORIGIN = "https://siliguriproperty.in";
const TRACKING_PARAM_PREFIXES = ["utm_", "fbclid", "gclid", "ref", "source"];

const INDEXABLE_PROPERTY_QUERY_KEYS = new Set([
	"intent",
	"category",
	"location",
]);
const SELL_CATEGORIES = ["house", "flat", "shop", "land"];
const RENT_CATEGORIES = ["house", "flat", "shop"];
const CURATED_LOCALITIES = [
	"siliguri",
	"matigara",
	"bagdogra",
	"pradhan-nagar",
	"sevoke-road",
	"eastern-bypass",
	"new-jalpaiguri",
	"salugara",
	"dagapur",
	"fulbari",
	"hakimpara",
	"hill-cart-road",
];

const readExistingLocalitySlugs = async () => {
	try {
		const sitemap = await fs.readFile(
			path.join(publicDir, "sitemap.xml"),
			"utf8",
		);
		const matches = [
			...sitemap.matchAll(
				/<loc>https:\/\/siliguriproperty\.in\/locality\/([^<]+)<\/loc>/g,
			),
		];
		return matches.map((match) => match[1].trim()).filter(Boolean);
	} catch {
		return [];
	}
};

const normalizeBaseUrl = (value, fallback) => {
	const raw = String(value || "").trim();
	if (!raw) {
		return fallback;
	}

	try {
		const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
		parsed.hash = "";
		parsed.search = "";
		return parsed.toString().replace(/\/$/, "");
	} catch {
		return fallback;
	}
};

const siteOrigin = normalizeBaseUrl(
	process.env.SEO_SITE_ORIGIN || process.env.VITE_FRONTEND_URL,
	FALLBACK_ORIGIN,
);

const backendBase = normalizeBaseUrl(
	process.env.SEO_BACKEND_URL ||
		process.env.VITE_BACKEND_URL ||
		"http://localhost:5000",
	"http://localhost:5000",
).replace(/\/api$/, "");

const escapeHtml = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");

const stripHtml = (value) =>
	String(value || "")
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();

const toSlug = (value) =>
	String(value || "")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-");

const normalizeCanonicalPath = (pathWithQuery) => {
	const url = new URL(pathWithQuery, `${siteOrigin}/`);
	url.hash = "";
	url.pathname = url.pathname.replace(/\/+/g, "/").replace(/\/$/, "") || "/";

	for (const key of [...url.searchParams.keys()]) {
		const lowered = key.toLowerCase();
		if (
			TRACKING_PARAM_PREFIXES.some(
				(prefix) => lowered === prefix || lowered.startsWith(prefix),
			)
		) {
			url.searchParams.delete(key);
		}
	}

	if (url.pathname === "/properties") {
		for (const key of [...url.searchParams.keys()]) {
			if (!INDEXABLE_PROPERTY_QUERY_KEYS.has(key)) {
				url.searchParams.delete(key);
			}
		}
	}

	const sortedEntries = [...url.searchParams.entries()].sort(([a], [b]) =>
		a.localeCompare(b),
	);
	url.search = "";
	for (const [key, value] of sortedEntries) {
		if (String(value).trim()) {
			url.searchParams.append(key, value.trim());
		}
	}

	return `${url.pathname}${url.search}`;
};

const absoluteUrl = (pathWithQuery) =>
	`${siteOrigin}${normalizeCanonicalPath(pathWithQuery)}`;

const safeDate = (value) => {
	if (!value) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	return date.toISOString();
};

const fetchListings = async () => {
	const endpoint = `${backendBase}/api/user/post/view-all-approved-posts`;
	try {
		const response = await fetch(endpoint, {
			headers: { Accept: "application/json" },
		});
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		const payload = await response.json();
		const rows = Array.isArray(payload?.postArray) ? payload.postArray : [];
		return rows.filter(
			(row) => row && row._id && row.intent && row.propertyCategory,
		);
	} catch (error) {
		console.warn(
			`SEO build: failed to fetch listings from ${endpoint}. Continuing without listing pages.`,
			error,
		);
		return [];
	}
};

const buildListingPath = (listing) => {
	const intentSegment = listing.intent === "rent" ? "rentals" : "buys";
	const category = toSlug(listing.propertyCategory);
	return `/${intentSegment}/${category}/${listing._id}`;
};

const buildListingTitle = (listing) => {
	const title = stripHtml(listing.title);
	if (title.length > 8) {
		return title;
	}
	const category = toSlug(listing.propertyCategory);
	const locality = stripHtml(
		listing.wbLocalityLabel ||
			listing.alternateLocation ||
			listing.location ||
			"Siliguri",
	);
	const prefix =
		category === "land"
			? "Land"
			: category === "flat"
				? "Flat"
				: category === "house"
					? "House"
					: "Property";
	return `${prefix} in ${locality}`;
};

const buildListingDescription = (listing) => {
	const cleaned = stripHtml(listing.description);
	if (cleaned.length > 40) {
		return cleaned.slice(0, 180);
	}
	const locality = stripHtml(
		listing.wbLocalityLabel ||
			listing.alternateLocation ||
			listing.location ||
			"Siliguri",
	);
	const action = listing.intent === "rent" ? "for rent" : "for sale";
	return `${buildListingTitle(listing)} ${action} in ${locality}. View listing details, photos and owner contact on Siliguri Property.`;
};

const buildStaticPages = async (listings) => {
	const knownLocalitySlugs = new Set([
		...CURATED_LOCALITIES,
		...(await readExistingLocalitySlugs()),
	]);

	const pages = [
		{
			path: "/",
			title: "Properties in Siliguri | Buy, Rent & Sell | Siliguri Property",
			description:
				"Find houses, flats, shops and land listings in Siliguri. Explore localities, compare asking prices and connect directly with owners.",
			h1: "Properties in Siliguri",
			intro:
				"Browse buy and rental listings across Siliguri localities with clear details, photos, and direct enquiry options.",
			links: [
				{ href: "/buys", label: "Properties for Sale" },
				{ href: "/rentals", label: "Rental Properties" },
				{ href: "/buys/land", label: "Land for Sale" },
				{ href: "/locality/matigara", label: "Property in Matigara" },
			],
			robots: "index, follow",
		},
		{
			path: "/properties",
			title: "All Property Listings in Siliguri | Buy & Rent",
			description:
				"Explore all active public property listings in Siliguri including land, flats, houses and shops for sale or rent.",
			h1: "All Property Listings in Siliguri",
			intro:
				"Use filters to refine listings by locality, category and asking price.",
			links: [
				{
					href: "/properties?intent=sell&category=land&location=siliguri",
					label: "Land for Sale in Siliguri",
				},
				{
					href: "/properties?location=matigara",
					label: "Listings in Matigara",
				},
				{
					href: "/properties?location=bagdogra",
					label: "Listings in Bagdogra",
				},
			],
			robots: "index, follow",
		},
		{
			path: "/buys",
			title: "Property for Sale in Siliguri | Houses, Flats, Land",
			description:
				"Browse properties for sale in Siliguri including houses, flats, shops and land listings across key localities.",
			h1: "Properties for Sale in Siliguri",
			intro: "Compare sale listings by property type and location.",
			links: SELL_CATEGORIES.map((category) => ({
				href: `/buys/${category}`,
				label: `${category[0].toUpperCase()}${category.slice(1)} for Sale`,
			})),
			robots: "index, follow",
		},
		{
			path: "/rentals",
			title: "Rental Properties in Siliguri | Flats, Houses & Shops",
			description:
				"Find rental properties in Siliguri including flats, houses and shops in active localities.",
			h1: "Rental Properties in Siliguri",
			intro:
				"Discover rental options and connect directly with listing owners.",
			links: RENT_CATEGORIES.map((category) => ({
				href: `/rentals/${category}`,
				label: `${category[0].toUpperCase()}${category.slice(1)} for Rent`,
			})),
			robots: "index, follow",
		},
		{
			path: "/about",
			title: "About Siliguri Property",
			description:
				"Learn about Siliguri Property and how the platform helps buyers, renters and property owners connect.",
			h1: "About Siliguri Property",
			intro: "Marketplace information, trust details and support direction.",
			links: [{ href: "/", label: "Homepage" }],
			robots: "index, follow",
		},
		{
			path: "/privacy",
			title: "Privacy Policy | Siliguri Property",
			description: "Read how Siliguri Property handles user data and privacy.",
			h1: "Privacy Policy",
			intro: "Data usage, retention and contact details for privacy queries.",
			links: [{ href: "/terms", label: "Terms of Service" }],
			robots: "index, follow",
		},
		{
			path: "/terms",
			title: "Terms of Service | Siliguri Property",
			description:
				"Read the platform terms for using Siliguri Property listings and enquiry tools.",
			h1: "Terms of Service",
			intro: "Usage policies and responsibilities for platform participants.",
			links: [{ href: "/privacy", label: "Privacy Policy" }],
			robots: "index, follow",
		},
	];

	for (const category of SELL_CATEGORIES) {
		const label = category[0].toUpperCase() + category.slice(1);
		pages.push({
			path: `/buys/${category}`,
			title: `${label} for Sale in Siliguri | Prices & Localities`,
			description: `Browse ${category} listings for sale in Siliguri and compare asking prices by locality.`,
			h1: `${label} for Sale in Siliguri`,
			intro: `Explore active ${category} sale listings and nearby locality options.`,
			links: [
				{ href: "/buys", label: "All Sale Listings" },
				{ href: "/locality/siliguri", label: "Siliguri Locality Guide" },
			],
			robots: "index, follow",
		});
	}

	for (const category of RENT_CATEGORIES) {
		const label = category[0].toUpperCase() + category.slice(1);
		pages.push({
			path: `/rentals/${category}`,
			title: `${label} for Rent in Siliguri | Listings & Areas`,
			description: `Find ${category} rental listings in Siliguri and compare options by locality.`,
			h1: `${label} for Rent in Siliguri`,
			intro: `View active ${category} rentals with direct owner contact options.`,
			links: [
				{ href: "/rentals", label: "All Rental Listings" },
				{ href: "/locality/matigara", label: "Property in Matigara" },
			],
			robots: "index, follow",
		});
	}

	for (const slug of knownLocalitySlugs) {
		const label = slug
			.split("-")
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(" ");
		pages.push({
			path: `/locality/${slug}`,
			title: `Property in ${label}, Siliguri | Flats, Houses & Land`,
			description: `Explore property listings in ${label}, Siliguri including flats, houses, shops and land options.`,
			h1: `Property in ${label}`,
			intro: `Browse listings and compare asking prices in and around ${label}.`,
			links: [
				{ href: "/properties", label: "All Listings" },
				{ href: "/buys/land", label: "Land for Sale" },
			],
			robots: "index, follow",
		});
	}

	for (const listing of listings) {
		const listingPath = buildListingPath(listing);
		const locality = stripHtml(
			listing.wbLocalityLabel ||
				listing.alternateLocation ||
				listing.location ||
				"Siliguri",
		);
		const category = toSlug(listing.propertyCategory);
		const isRent = listing.intent === "rent";
		const actionLabel = isRent ? "Rent" : "Sale";
		pages.push({
			path: listingPath,
			title: `${buildListingTitle(listing)} | Siliguri Property`,
			description: buildListingDescription(listing),
			h1: buildListingTitle(listing),
			intro: `${actionLabel} listing in ${locality}.`,
			links: [
				{
					href: isRent ? `/rentals/${category}` : `/buys/${category}`,
					label: `${category[0].toUpperCase()}${category.slice(1)} ${isRent ? "for Rent" : "for Sale"}`,
				},
				{
					href: `/locality/${toSlug(String(locality).replace(/_/g, "-"))}`,
					label: `More in ${locality}`,
				},
			],
			robots: "index, follow",
			lastmod: safeDate(listing.updatedAt || listing.createdAt),
		});
	}

	return pages;
};

const mergeUniquePages = (pages) => {
	const map = new Map();
	for (const page of pages) {
		const canonicalPath = normalizeCanonicalPath(page.path);
		if (!map.has(canonicalPath)) {
			map.set(canonicalPath, {
				...page,
				path: canonicalPath,
			});
		}
	}
	return [...map.values()];
};

const xmlEscape = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&apos;");

const buildSitemapXml = (pages) => {
	const rows = pages
		.filter((page) => page.robots !== "noindex, follow")
		.map((page) => {
			const loc = xmlEscape(absoluteUrl(page.path));
			const lastmod = page.lastmod
				? `\n    <lastmod>${xmlEscape(page.lastmod)}</lastmod>`
				: "";
			return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
		})
		.join("\n");

	return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${rows}\n</urlset>\n`;
};

const ensureDir = async (targetFilePath) => {
	await fs.mkdir(path.dirname(targetFilePath), { recursive: true });
};

const injectMeta = (html, page) => {
	const canonical = absoluteUrl(page.path);
	const title = escapeHtml(page.title);
	const description = escapeHtml(page.description);
	const robots = escapeHtml(page.robots || "index, follow");

	let next = html;
	next = next.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
	next = next.replace(
		/<meta\s+name=\"description\"\s+content=\"[^\"]*\"\s*\/>/i,
		`<meta name=\"description\" content=\"${description}\" />`,
	);
	next = next.replace(
		/<link\s+rel=\"canonical\"\s+href=\"[^\"]*\"\s*\/>/i,
		`<link rel=\"canonical\" href=\"${canonical}\" />`,
	);
	next = next.replace(
		/<meta\s+name=\"robots\"\s+content=\"[^\"]*\"\s*\/>/i,
		`<meta name=\"robots\" content=\"${robots}\" />`,
	);
	next = next.replace(
		/<meta\s+name=\"googlebot\"\s+content=\"[^\"]*\"\s*\/>/i,
		`<meta name=\"googlebot\" content=\"${robots}\" />`,
	);
	next = next.replace(
		/<meta\s+property=\"og:url\"\s+content=\"[^\"]*\"\s*\/>/i,
		`<meta property=\"og:url\" content=\"${canonical}\" />`,
	);
	next = next.replace(
		/<meta\s+property=\"og:title\"\s+content=\"[^\"]*\"\s*\/>/i,
		`<meta property=\"og:title\" content=\"${title}\" />`,
	);
	next = next.replace(
		/<meta\s+property=\"og:description\"\s+content=\"[^\"]*\"\s*\/>/i,
		`<meta property=\"og:description\" content=\"${description}\" />`,
	);
	next = next.replace(
		/<meta\s+name=\"twitter:url\"\s+content=\"[^\"]*\"\s*\/>/i,
		`<meta name=\"twitter:url\" content=\"${canonical}\" />`,
	);
	next = next.replace(
		/<meta\s+name=\"twitter:title\"\s+content=\"[^\"]*\"\s*\/>/i,
		`<meta name=\"twitter:title\" content=\"${title}\" />`,
	);
	next = next.replace(
		/<meta\s+name=\"twitter:description\"\s+content=\"[^\"]*\"\s*\/>/i,
		`<meta name=\"twitter:description\" content=\"${description}\" />`,
	);

	return next;
};

const buildSeoBody = (page) => {
	const links = (page.links || [])
		.filter((item) => item && item.href && item.label)
		.map(
			(item) =>
				`<li><a href=\"${escapeHtml(item.href)}\">${escapeHtml(item.label)}</a></li>`,
		)
		.join("\n");

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: page.title,
		description: page.description,
		url: absoluteUrl(page.path),
	};

	return `
<div id=\"seo-static\" style=\"max-width:960px;margin:24px auto;padding:0 16px;font-family:Manrope,Arial,sans-serif;color:#0f172a;line-height:1.6;\">
  <nav aria-label=\"Breadcrumb\" style=\"font-size:14px;margin-bottom:12px;\"><a href=\"/\">Home</a> <span style=\"color:#64748b;\">/</span> <span>${escapeHtml(page.h1)}</span></nav>
  <main>
    <h1 style=\"font-size:32px;line-height:1.2;margin:0 0 10px;\">${escapeHtml(page.h1)}</h1>
    <p style=\"margin:0 0 12px;color:#334155;\">${escapeHtml(page.intro || page.description)}</p>
    ${links ? `<section><h2 style=\"font-size:20px;margin:14px 0 8px;\">Explore Related Pages</h2><ul>${links}</ul></section>` : ""}
  </main>
  <script type=\"application/ld+json\">${JSON.stringify(jsonLd)}</script>
</div>`;
};

const writePageHtml = async (baseHtml, page) => {
	let html = injectMeta(baseHtml, page);
	html = html.replace(
		'<div id="root"></div>',
		`<div id=\"root\">${buildSeoBody(page)}</div>`,
	);

	const outputPath =
		page.path === "/"
			? path.join(distDir, "index.html")
			: path.join(distDir, page.path.replace(/^\//, ""), "index.html");

	await ensureDir(outputPath);
	await fs.writeFile(outputPath, html, "utf8");
};

const writeNotFoundPage = async (baseHtml) => {
	const notFoundPage = {
		path: "/404",
		title: "Page Not Found | Siliguri Property",
		description: "The requested page was not found.",
		h1: "Page Not Found",
		intro: "This page does not exist or is no longer available.",
		links: [{ href: "/", label: "Go to Homepage" }],
		robots: "noindex, follow",
	};
	let html = injectMeta(baseHtml, notFoundPage);
	html = html.replace(
		'<div id="root"></div>',
		`<div id=\"root\">${buildSeoBody(notFoundPage)}</div>`,
	);
	await fs.writeFile(path.join(distDir, "404.html"), html, "utf8");
};

const main = async () => {
	const baseHtml = await fs.readFile(path.join(distDir, "index.html"), "utf8");
	const listings = await fetchListings();

	const allPages = mergeUniquePages(await buildStaticPages(listings));
	const indexablePages = allPages.filter(
		(page) => page.robots !== "noindex, follow",
	);

	await Promise.all(allPages.map((page) => writePageHtml(baseHtml, page)));
	await writeNotFoundPage(baseHtml);

	const sitemapXml = buildSitemapXml(indexablePages);
	await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemapXml, "utf8");
	await fs.writeFile(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");

	const report = {
		generatedAt: new Date().toISOString(),
		siteOrigin,
		backendBase,
		pageCount: allPages.length,
		listingCount: listings.length,
		routes: allPages.map((page) => ({
			path: page.path,
			title: page.title,
			robots: page.robots || "index, follow",
		})),
	};
	await fs.writeFile(
		path.join(distDir, "seo-report.json"),
		JSON.stringify(report, null, 2),
		"utf8",
	);
	await fs.writeFile(
		path.join(publicDir, "seo-report.json"),
		JSON.stringify(report, null, 2),
		"utf8",
	);

	console.log(
		`SEO build complete. Generated ${allPages.length} static public pages and sitemap entries.`,
	);
};

main().catch((error) => {
	console.error("Failed to build SEO artifacts", error);
	process.exitCode = 1;
});
