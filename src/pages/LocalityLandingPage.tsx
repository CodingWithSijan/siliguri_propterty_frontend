import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/header_and_footer/Navbar";
import Footer from "../components/header_and_footer/Footer";
import { WEST_BENGAL_LOCATIONS } from "../constants/westBengalLocations";
import { applySeoMeta } from "../utils/seo";

type LocalityOverride = {
	intro: string;
	highlights: string[];
	nearbyKeys: string[];
};

type LocalityPageConfig = {
	slug: string;
	name: string;
	locationKey: string;
	intro: string;
	highlights: string[];
	nearbyKeys: string[];
};

const slugFromLocationKey = (value: string) => value.replace(/_/g, "-");

const DEFAULT_NEARBY_KEYS = [
	"siliguri",
	"matigara",
	"bagdogra",
	"pradhan_nagar",
	"sevoke_road",
	"new_jalpaiguri",
];

const LOCALITY_OVERRIDES: Record<string, LocalityOverride> = {
	siliguri: {
		intro:
			"Siliguri is the gateway market for North Bengal with strong demand for residential homes, flats, plots and commercial spaces.",
		highlights: [
			"Strong buyer demand for houses and flats",
			"Growing demand for land and gated community projects",
			"Active rental market near schools, hospitals and transport hubs",
		],
		nearbyKeys: ["matigara", "bagdogra", "pradhan_nagar", "sevoke_road"],
	},
	matigara: {
		intro:
			"Matigara is a fast-expanding residential zone with new apartment projects, plotted developments and easy connectivity to central Siliguri.",
		highlights: [
			"High growth corridor for end-users and investors",
			"Good inventory mix: flats, houses and plots",
			"Preferred area for families seeking quieter surroundings",
		],
		nearbyKeys: ["siliguri", "dagapur", "uttorayon", "bagdogra"],
	},
	bagdogra: {
		intro:
			"Bagdogra attracts buyers and renters due to airport access, highway connectivity and rising commercial opportunities.",
		highlights: [
			"Airport proximity supports residential and commercial demand",
			"Strong plot and land search volume",
			"Good option for long-term appreciation",
		],
		nearbyKeys: ["siliguri", "matigara", "fulbari", "salugara"],
	},
	pradhan_nagar: {
		intro:
			"Pradhan Nagar is a central urban pocket with strong rental demand and excellent connectivity to offices, rail and lifestyle zones.",
		highlights: [
			"Premium central location",
			"Consistent rental demand across flats and houses",
			"Popular for professionals and small families",
		],
		nearbyKeys: ["sevoke_road", "hill_cart_road", "hakimpara", "siliguri"],
	},
	sevoke_road: {
		intro:
			"Sevoke Road is one of Siliguri's most active urban stretches with premium apartments, retail frontage and high daily footfall.",
		highlights: [
			"High visibility commercial zones",
			"Strong demand for modern flats",
			"Excellent access to core city areas",
		],
		nearbyKeys: ["pradhan_nagar", "hakimpara", "sf_road", "siliguri"],
	},
};

const getDefaultIntro = (name: string) =>
	`${name} is an active property pocket in the Siliguri market with demand across buy, sale and rental searches.`;

const getDefaultHighlights = (name: string) => [
	`${name} has consistent search demand from local buyers and renters`,
	`Listings in ${name} include houses, flats, shops and land options`,
	`Useful for comparing pricing trends with nearby Siliguri localities`,
];

const buildLocalityConfig = (): LocalityPageConfig[] => {
	return WEST_BENGAL_LOCATIONS.map((location) => {
		const override = LOCALITY_OVERRIDES[location.value];
		return {
			slug: slugFromLocationKey(location.value),
			name: location.label,
			locationKey: location.value,
			intro: override?.intro ?? getDefaultIntro(location.label),
			highlights: override?.highlights ?? getDefaultHighlights(location.label),
			nearbyKeys:
				override?.nearbyKeys ??
				DEFAULT_NEARBY_KEYS.filter((value) => value !== location.value).slice(
					0,
					4,
				),
		};
	});
};

const LOCALITY_CONFIGS = buildLocalityConfig();
const LOCALITY_BY_SLUG = Object.fromEntries(
	LOCALITY_CONFIGS.map((config) => [config.slug, config]),
) as Record<string, LocalityPageConfig>;
const LOCALITY_BY_KEY = Object.fromEntries(
	LOCALITY_CONFIGS.map((config) => [config.locationKey, config]),
) as Record<string, LocalityPageConfig>;

const LocalityLandingPage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const locality = slug ? LOCALITY_BY_SLUG[slug] : undefined;

	const nearbyLocalities = useMemo(() => {
		if (!locality) return [];
		return locality.nearbyKeys
			.map((nearbyKey) => LOCALITY_BY_KEY[nearbyKey])
			.filter(Boolean)
			.slice(0, 6);
	}, [locality]);

	useEffect(() => {
		if (!locality) {
			return;
		}

		const title = `${locality.name} Property in Siliguri | Houses, Flats, Land for Sale and Rent`;
		const description = `Explore ${locality.name} property listings in Siliguri including houses for sale, flats, land and rental options. Compare local prices and connect directly with owners.`;
		applySeoMeta({
			title,
			description,
			canonicalPath: `/locality/${locality.slug}`,
			keywords: `${locality.name.toLowerCase()} property, ${locality.name.toLowerCase()} house for sale, ${locality.name.toLowerCase()} land for sale, properties in siliguri, siliguri property`,
		});

		const scriptId = "locality-collection-jsonld";
		const existing = document.getElementById(scriptId);
		if (existing) {
			existing.remove();
		}

		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: `${locality.name} Property Listings`,
			description,
			url: `https://siliguriproperty.in/locality/${locality.slug}`,
			about: {
				"@type": "Place",
				name: locality.name,
				containedInPlace: "Siliguri, West Bengal",
			},
		};

		const script = document.createElement("script");
		script.id = scriptId;
		script.type = "application/ld+json";
		script.text = JSON.stringify(jsonLd);
		document.head.appendChild(script);

		return () => {
			script.remove();
		};
	}, [locality]);

	if (!locality) {
		return <Navigate to="/properties" replace />;
	}

	const queryBase = `location=${locality.locationKey}`;
	const quickLinks = [
		{
			label: `All Properties in ${locality.name}`,
			to: `/properties?${queryBase}`,
		},
		{
			label: `House for Sale in ${locality.name}`,
			to: `/properties?intent=sell&category=house&${queryBase}`,
		},
		{
			label: `Land for Sale in ${locality.name}`,
			to: `/properties?intent=sell&category=land&${queryBase}`,
		},
		{
			label: `Flats for Sale in ${locality.name}`,
			to: `/properties?intent=sell&category=flat&${queryBase}`,
		},
		{
			label: `Shops and Commercial in ${locality.name}`,
			to: `/properties?intent=sell&category=shop&${queryBase}`,
		},
		{
			label: `Rental Property in ${locality.name}`,
			to: `/properties?intent=rent&${queryBase}`,
		},
	];

	return (
		<div className="bg-slate-50">
			<Navbar />
			<main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
						Siliguri Locality Guide
					</p>
					<h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-4xl">
						Property in {locality.name}, Siliguri
					</h1>
					<p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
						{locality.intro}
					</p>
				</section>

				<section className="mt-6 grid gap-4 md:grid-cols-3">
					{locality.highlights.map((highlight) => (
						<article
							key={highlight}
							className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
						>
							<p className="text-sm font-semibold text-slate-800">
								{highlight}
							</p>
						</article>
					))}
				</section>

				<section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
					<h2 className="text-xl font-bold text-slate-900">
						Popular searches in {locality.name}
					</h2>
					<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{quickLinks.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
							>
								{link.label}
							</Link>
						))}
					</div>
				</section>

				<section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
					<h2 className="text-lg font-bold text-slate-900">
						Nearby localities in Siliguri
					</h2>
					<p className="mt-1 text-sm text-slate-600">
						Explore nearby market pockets often searched by buyers and renters.
					</p>
					<div className="mt-4 flex flex-wrap gap-2">
						{nearbyLocalities.map((nearby) => (
							<Link
								key={nearby.locationKey}
								to={`/locality/${nearby.slug}`}
								className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
							>
								{nearby.name}
							</Link>
						))}
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default LocalityLandingPage;
