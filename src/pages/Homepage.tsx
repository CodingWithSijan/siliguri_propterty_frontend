import Footer from "../components/header_and_footer/Footer";
import Navbar from "../components/header_and_footer/Navbar";
import HeroSection from "../components/homepage/HeroSection";
import NewListings from "../components/homepage/NewListings";
import PropertyStatsSection from "../components/homepage/PropertyStatsSection";

const Homepage = () => {
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
				<section
					className="bg-white py-8 sm:py-10"
					aria-label="Latest listings"
				>
					<NewListings />
				</section>
				<section
					className="bg-slate-50 py-8 sm:py-10"
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
