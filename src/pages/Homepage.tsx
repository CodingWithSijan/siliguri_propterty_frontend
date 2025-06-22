import Footer from "../components/header_and_footer/Footer";
import Navbar from "../components/header_and_footer/Navbar";
import HeroSection from "../components/homepage/HeroSection";
import HomepageAboutWebapp from "../components/homepage/HomepageAboutWebapp";
import HomepagePropertySearchFilter from "../components/homepage/HomepagePropertySearchFilter";
import NewListings from "../components/homepage/NewListings";

const Homepage = () => {
	return (
		<div>
			<Navbar />
			<HeroSection />
			<HomepagePropertySearchFilter />
			<NewListings />
			<HomepageAboutWebapp />
			<Footer />
		</div>
	);
};

export default Homepage;
