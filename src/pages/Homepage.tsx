import Footer from "../components/header_and_footer/Footer";
import Navbar from "../components/header_and_footer/Navbar";
import HeroSection from "../components/homepage/HeroSection";
import NewListings from "../components/homepage/NewListings";
import PropertyStatsSection from "../components/homepage/PropertyStatsSection";

const Homepage = () => {
	return (
		<div className="overflow-x-hidden">
			<Navbar />
			<HeroSection />
			<NewListings />
			<PropertyStatsSection />
			<Footer />
		</div>
	);
};

export default Homepage;
