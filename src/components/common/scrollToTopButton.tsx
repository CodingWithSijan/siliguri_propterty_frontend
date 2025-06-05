import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			setVisible(window.scrollY > 300);
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (!visible) return null;

	return (
		<button
			onClick={scrollToTop}
			className="fixed bottom-5 right-5 z-50 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-400 transition-colors duration-300"
			aria-label="Scroll to top"
		>
			<FaArrowUp />
		</button>
	);
};

export default ScrollToTopButton;
