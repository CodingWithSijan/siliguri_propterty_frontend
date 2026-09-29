import { useEffect } from "react";
import Footer from "../components/header_and_footer/Footer";
import Navbar from "../components/header_and_footer/Navbar";
import HeroSection from "../components/homepage/HeroSection";
import NewListings from "../components/homepage/NewListings";
import PropertyStatsSection from "../components/homepage/PropertyStatsSection";
import { applySeoMeta } from "../utils/seo";

const Homepage = () => {
	useEffect(() => {
		applySeoMeta({
			title:
				"Siliguri Property | Buy, Rent, Sell Houses, Flats and Land in Siliguri",
			description:
				"Search properties in Siliguri including houses for sale, land for sale, flats, shops and rentals across nearby localities like Matigara, Bagdogra, Pradhan Nagar and Sevoke Road.",
			canonicalPath: "/",
			keywords:
				"properties in siliguri, siliguri property, land in siliguri, house for sale in siliguri, land for sale in siliguri, flats in siliguri, rent in siliguri, siliguri localities",
		});
	}, []);

	return (
		<div className="overflow-x-hidden bg-white">
			<a
				href="#homepage-main"
				className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-emerald-700 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
			>
				Skip to main content
			</a>
			<Navbar />
			<main id="homepage-main" className="w-full" aria-label="Homepage content">
				<HeroSection />
				<section className="bg-white py-5 sm:py-8" aria-label="Latest listings">
					<NewListings />
				</section>
				<section
					className="bg-slate-50 py-6 sm:py-8"
					aria-label="Property insights"
				>
					<PropertyStatsSection />
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default Homepage;
