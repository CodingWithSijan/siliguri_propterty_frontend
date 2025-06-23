import React, { useState, useEffect } from "react";
import HeroSectionImage1Background from "../../assets/image1_hero_section.jpg";
import HeroSectionImage2Background from "../../assets/image2_hero_section.jpg";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection: React.FC = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const slides = [
		{
			image: HeroSectionImage1Background,
			text: "Find your dream property today!",
			subtext: "Discover the perfect home in Siliguri",
		},
		{
			image: HeroSectionImage2Background,
			text: "Exclusive deals on properties!",
			subtext: "Premium listings at competitive prices",
		},
		{
			image: HeroSectionImage1Background,
			text: "Your perfect home awaits!",
			subtext: "Let us help you find your ideal property",
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);
		return () => clearInterval(interval);
	}, [slides.length]);

	return (
		<div className="relative h-screen w-full overflow-hidden bg-gray-900">
			{/* Carousel */}
			<div className="absolute inset-0">
				<AnimatePresence initial={false}>
					<motion.div
						key={currentSlide}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 1 }}
						className="absolute inset-0"
					>
						<div className="absolute inset-0 bg-black/40 z-10" />
						<img
							src={slides[currentSlide].image}
							alt={slides[currentSlide].text}
							className="w-full h-full object-cover"
						/>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Content */}
			<div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-center mb-8"
				>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
						{slides[currentSlide].text}
					</h1>
					<p className="text-xl text-gray-200">
						{slides[currentSlide].subtext}
					</p>
				</motion.div>

				{/* Search Bar */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="w-full max-w-3xl"
				>
					<div className="flex w-full gap-4 justify-center items-center">
						<button className="p-4 bg-blue-600 text-white font-bold rounded-lg">
							Browse Properties
						</button>
						<button className="p-4 bg-white text-blue-600 border-2 border-blue-600 font-bold rounded-lg">
							List Your Property
						</button>
					</div>
				</motion.div>

				{/* Carousel Indicators */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
								index === currentSlide
									? "bg-white w-8"
									: "bg-white/50 hover:bg-white/75"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
