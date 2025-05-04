import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import HeroSectionImage1Background from "../assets/image1_hero_section.jpg";
import HeroSectionImage2Background from "../assets/image2_hero_section.jpg";
const HeroSection: React.FC = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const slides = [
		{
			image: HeroSectionImage1Background,
			text: "Find your dream property today!",
		},
		{
			image: HeroSectionImage2Background,
			text: "Exclusive deals on properties!",
		},
		{
			image: HeroSectionImage1Background,
			text: "Your perfect home awaits!",
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [slides.length]);

	return (
		<div className="relative w-[100vw] h-[500px] bg-gray-100">
			{/* Search Bar */}
			<div className="absolute top-8 left-1/2 transform opacity-70 -translate-x-1/2 z-10 w-3/4 sm:w-2.5/4 md:w-[40%]">
				<div className="flex items-center bg-white shadow-md rounded-md overflow-hidden">
					<span className="p-2 text-gray-500">
						<FaSearch />
					</span>
					<input
						type="text"
						placeholder="Search for properties..."
						className="flex-grow p-2 text-sm focus:outline-none"
					/>
					<button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700">
						Search
					</button>
				</div>
			</div>

			{/* Carousel */}
			<div className="w-full h-full overflow-hidden relative">
				{slides.map((slide, index) => (
					<div
						key={index}
						className={`absolute inset-0 transition-opacity duration-1000 ${
							index === currentSlide ? "opacity-100" : "opacity-0"
						}`}
					>
						<img
							src={slide.image}
							alt={slide.text}
							className="w-full h-full object-cover sm:object-center"
						/>
						<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md">
							{slide.text}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default HeroSection;
