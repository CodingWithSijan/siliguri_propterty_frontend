import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSectionImage1Background from "../../assets/image1_hero_section.jpg";
import HeroSectionImage2Background from "../../assets/image2_hero_section.jpg";
import HomepagePropertySearchFilter from "./HomepagePropertySearchFilter";
import { useSiteStats } from "../../hooks/use-SiteStats";
import { WEST_BENGAL_LOCATIONS } from "../../constants/westBengalLocations";

const HeroSection: React.FC = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const { stats } = useSiteStats();

	const slides = [
		{
			image: HeroSectionImage1Background,
			title: "Find your next home in Siliguri, made simple.",
			shortSubtitle:
				"Verified flats, plots, houses and commercial spaces with local insights.",
			subtitle:
				"Verified flats, plots, houses and commercial spaces to buy, rent or sell with confidence, backed by local experts who know the city.",
		},
		{
			image: HeroSectionImage2Background,
			title: "Discover verified property options across every neighborhood.",
			shortSubtitle:
				"Area-first filters, clear pricing, and practical listing details.",
			subtitle:
				"Search with area-first filters, practical pricing ranges and clear listing details.",
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5500);
		return () => clearInterval(timer);
	}, [slides.length]);

	return (
		<section className="w-full bg-white">
			<div className="relative w-full overflow-hidden border-y border-slate-200">
				<div className="absolute inset-0">
					<AnimatePresence initial={false}>
						<motion.div
							key={currentSlide}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.9 }}
							className="absolute inset-0"
						>
							<img
								src={slides[currentSlide].image}
								alt={slides[currentSlide].title}
								className="h-full w-full object-cover"
							/>
						</motion.div>
					</AnimatePresence>
				</div>
				<div className="absolute inset-0 z-10 bg-gradient-to-r from-emerald-950/82 via-emerald-900/52 to-amber-600/28" />

				<div className="relative z-20 min-h-[500px] w-full px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-10 md:px-12 md:pb-12 md:pt-14">
					<div className="mx-auto grid max-w-7xl items-start gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
						<div className="order-2 rounded-2xl border border-white/20 bg-black/15 p-4 backdrop-blur-[1px] sm:p-5 lg:order-1 lg:col-span-6 lg:p-0 lg:border-0 lg:bg-transparent lg:backdrop-blur-0">
							<span className="mb-3 inline-flex w-fit rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-semibold tracking-wide text-white sm:mb-4 sm:text-[11px]">
								{stats.propertiesListed}+ verified listings across Siliguri
							</span>
							<h1 className="max-w-3xl text-2xl font-extrabold leading-tight text-white drop-shadow sm:text-3xl md:text-5xl lg:text-6xl">
								{slides[currentSlide].title}
							</h1>
							<p className="mt-3 max-w-2xl text-sm text-emerald-50 sm:hidden">
								{slides[currentSlide].shortSubtitle}
							</p>
							<p className="mt-3 hidden max-w-2xl text-base text-emerald-50 sm:block md:mt-4 md:text-lg lg:text-xl">
								{slides[currentSlide].subtitle}
							</p>
							<div className="mt-4 flex items-center gap-2 sm:mt-5">
								{slides.map((slide, index) => (
									<button
										key={slide.title}
										type="button"
										onClick={() => setCurrentSlide(index)}
										aria-label={`Go to slide ${index + 1}`}
										className={`h-2.5 rounded-full transition-all ${
											currentSlide === index
												? "w-7 bg-white"
												: "w-2.5 bg-white/50 hover:bg-white/70"
										}`}
									/>
								))}
							</div>
						</div>

						<div className="order-1 w-full rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl lg:order-2 lg:col-span-6">
							<HomepagePropertySearchFilter />
						</div>
					</div>
				</div>

				<div className="relative z-20 border-t border-white/10 bg-emerald-950/95 px-6 py-4 text-emerald-50 md:px-12">
					<div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
						<div>
							<p className="text-2xl font-bold">{stats.propertiesListed}+</p>
							<p className="text-xs text-emerald-100">Active listings</p>
						</div>
						<div>
							<p className="text-2xl font-bold">{stats.happyCustomers}+</p>
							<p className="text-xs text-emerald-100">Verified users</p>
						</div>
						<div>
							<p className="text-2xl font-bold">
								{WEST_BENGAL_LOCATIONS.length}+
							</p>
							<p className="text-xs text-emerald-100">Localities covered</p>
						</div>
						<div>
							<p className="inline-flex items-center gap-1 text-2xl font-bold">
								<Star className="h-5 w-5 text-emerald-300" />
								Live
							</p>
							<p className="text-xs text-emerald-100">Updated listing feed</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
