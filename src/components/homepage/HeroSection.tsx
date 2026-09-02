import React, { useState, useEffect } from "react";
import HeroSectionImage1Background from "../../assets/image1_hero_section.jpg";
import HeroSectionImage2Background from "../../assets/image2_hero_section.jpg";
import { motion, AnimatePresence } from "framer-motion";
import HomepagePropertySearchFilter from "./HomepagePropertySearchFilter";
import { useSiteStats } from "../../hooks/use-SiteStats";

const HeroSection: React.FC = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const { stats } = useSiteStats();
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
		<div className="relative min-h-[88vh] w-full overflow-hidden bg-slate-900">
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
			<div className="relative z-20 min-h-[88vh] flex flex-col items-center justify-center px-4 py-12">
				{/* Hero Text */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-center mb-12 hidden sm:block max-w-4xl"
				>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">
						{slides[currentSlide].text}
					</h1>
					<p className="text-lg md:text-xl text-slate-100/95 drop-shadow-md">
						{slides[currentSlide].subtext}
					</p>
				</motion.div>

				{/* Interactive Search Filter */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="w-full max-w-6xl px-2 sm:px-4 pt-12 sm:pt-0"
				>
					<div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/25 shadow-2xl p-1">
						<div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl">
							<HomepagePropertySearchFilter />
						</div>
					</div>
				</motion.div>

				{/* Interactive Stats or Quick Actions */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6"
				>
					<div className="bg-white/12 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 shadow-lg">
						<div className="text-center">
							<div className="text-2xl font-bold text-white">
								{stats.propertiesListed}+
							</div>
							<div className="text-sm text-slate-100/95">Properties Listed</div>
						</div>
					</div>
					<div className="bg-white/12 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 shadow-lg">
						<div className="text-center">
							<div className="text-2xl font-bold text-white">
								{stats.happyCustomers}+
							</div>
							<div className="text-sm text-slate-100/95">Happy Customers</div>
						</div>
					</div>
					<div className="bg-white/12 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 shadow-lg">
						<div className="text-center">
							<div className="text-2xl font-bold text-white">20+</div>
							<div className="text-sm text-slate-100/95">Areas Covered</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default HeroSection;
