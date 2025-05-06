import Navbar from "./header_and_footer/Navbar";
import HeroSection from "./components/HeroSection";
import AllPosts from "./components/AllPosts";

const Homepage = () => {
	return (
		<div>
			<Navbar />
			<HeroSection />
			<AllPosts />
		</div>
	);
};

export default Homepage;
