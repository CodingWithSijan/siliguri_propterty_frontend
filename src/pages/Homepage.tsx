import Navbar from "../components/header_and_footer/Navbar";
import AllPostsHomepage from "../components/homepage/AllPostsHomepage";
import HeroSection from "../components/homepage/HeroSection";

const Homepage = () => {
	return (
		<div>
			<Navbar />
			<HeroSection />
			<AllPostsHomepage />
		</div>
	);
};

export default Homepage;
