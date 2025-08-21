import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
	FaSearch,
	FaMapMarkerAlt,
	FaHandshake,
	FaKey,
	FaHeart,
	FaStar,
	FaArrowRight,
	FaHome,
	FaUsers,
	FaShieldAlt,
} from "react-icons/fa";

const PropertyJourneySection: React.FC = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [hoveredCard, setHoveredCard] = useState<number | null>(null);
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.2 });

	const journeySteps = [
		{
			icon: FaSearch,
			title: "Discover",
			subtitle: "Find Your Dream Property",
			description:
				"Browse through our curated collection of premium properties in Siliguri",
			color: "from-blue-500 to-cyan-500",
			bgColor: "bg-blue-50",
			stats: "500+ Properties",
		},
		{
			icon: FaMapMarkerAlt,
			title: "Explore",
			subtitle: "Visit Prime Locations",
			description:
				"Explore the best neighborhoods with our interactive location guides",
			color: "from-green-500 to-emerald-500",
			bgColor: "bg-green-50",
			stats: "20+ Areas",
		},
		{
			icon: FaHandshake,
			title: "Connect",
			subtitle: "Meet Verified Owners",
			description:
				"Connect directly with property owners through our secure platform",
			color: "from-purple-500 to-pink-500",
			bgColor: "bg-purple-50",
			stats: "100% Verified",
		},
		{
			icon: FaKey,
			title: "Secure",
			subtitle: "Complete Your Deal",
			description:
				"Finalize your property transaction with complete legal security",
			color: "from-orange-500 to-red-500",
			bgColor: "bg-orange-50",
			stats: "Legal Support",
		},
	];

	const features = [
		{
			icon: FaHeart,
			title: "Personalized Matches",
			description: "AI-powered recommendations based on your preferences",
			gradient: "from-pink-400 to-rose-400",
		},
		{
			icon: FaStar,
			title: "Premium Service",
			description: "24/7 customer support for all your property needs",
			gradient: "from-yellow-400 to-orange-400",
		},
		{
			icon: FaShieldAlt,
			title: "Secure Transactions",
			description: "Bank-level security for all your property dealings",
			gradient: "from-green-400 to-teal-400",
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveStep((prev) => (prev + 1) % journeySteps.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [journeySteps.length]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	return (
		<section
			ref={ref}
			className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden"
		>
			{/* Decorative Elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					className="text-center mb-16"
				>
					<motion.div
						variants={itemVariants}
						className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/30"
					>
						<FaHome className="text-blue-500" />
						<span className="text-sm font-medium text-gray-700">
							Your Property Journey
						</span>
					</motion.div>

					<motion.h2
						variants={itemVariants}
						className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
					>
						From Dream to{" "}
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Reality
						</span>
					</motion.h2>

					<motion.p
						variants={itemVariants}
						className="text-xl text-gray-600 max-w-3xl mx-auto"
					>
						Experience a seamless property journey with our innovative platform
						designed for modern property seekers in Siliguri
					</motion.p>
				</motion.div>

				{/* Interactive Journey Steps */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
				>
					{journeySteps.map((step, index) => {
						const IconComponent = step.icon;
						const isActive = index === activeStep;

						return (
							<motion.div
								key={index}
								variants={itemVariants}
								className={`relative group cursor-pointer transition-all duration-500 ${
									isActive ? "scale-105" : "hover:scale-102"
								}`}
								onMouseEnter={() => setActiveStep(index)}
							>
								<div
									className={`relative p-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 ${
										isActive
											? "bg-white/90 border-white/50 shadow-2xl"
											: "bg-white/60 border-white/30 shadow-lg hover:bg-white/80"
									}`}
								>
									{/* Step Number */}
									<div
										className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-sm font-bold shadow-lg`}
									>
										{index + 1}
									</div>

									{/* Icon */}
									<div
										className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${
											step.color
										} flex items-center justify-center mb-4 transition-transform duration-300 ${
											isActive ? "rotate-6" : "group-hover:rotate-3"
										}`}
									>
										<IconComponent className="text-2xl text-white" />
									</div>

									{/* Content */}
									<h3 className="text-xl font-bold text-gray-900 mb-2">
										{step.title}
									</h3>
									<h4 className="text-sm font-medium text-gray-600 mb-3">
										{step.subtitle}
									</h4>
									<p className="text-gray-600 text-sm leading-relaxed mb-4">
										{step.description}
									</p>

									{/* Stats */}
									<div
										className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${step.color} text-white text-xs font-medium`}
									>
										<FaStar className="text-xs" />
										{step.stats}
									</div>

									{/* Progress Indicator */}
									{isActive && (
										<motion.div
											initial={{ scaleX: 0 }}
											animate={{ scaleX: 1 }}
											transition={{ duration: 3 }}
											className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${step.color} rounded-b-2xl origin-left`}
										/>
									)}
								</div>

								{/* Arrow for desktop */}
								{index < journeySteps.length - 1 && (
									<div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
										<FaArrowRight
											className={`text-2xl transition-colors duration-300 ${
												isActive ? "text-blue-500" : "text-gray-300"
											}`}
										/>
									</div>
								)}
							</motion.div>
						);
					})}
				</motion.div>

				{/* Feature Cards */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					className="grid grid-cols-1 md:grid-cols-3 gap-8"
				>
					{features.map((feature, index) => {
						const IconComponent = feature.icon;
						const isHovered = hoveredCard === index;

						return (
							<motion.div
								key={index}
								variants={itemVariants}
								className="group relative"
								onMouseEnter={() => setHoveredCard(index)}
								onMouseLeave={() => setHoveredCard(null)}
							>
								<div
									className={`relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-300 hover:shadow-2xl ${
										isHovered ? "scale-105" : ""
									}`}
								>
									{/* Floating Icon */}
									<div
										className={`w-14 h-14 rounded-xl bg-gradient-to-r ${
											feature.gradient
										} flex items-center justify-center mb-4 transition-transform duration-300 ${
											isHovered ? "rotate-12 scale-110" : ""
										}`}
									>
										<IconComponent className="text-xl text-white" />
									</div>

									{/* Content */}
									<h3 className="text-lg font-bold text-gray-900 mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600 text-sm leading-relaxed">
										{feature.description}
									</p>

									{/* Hover Effect */}
									{isHovered && (
										<motion.div
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl pointer-events-none"
										/>
									)}
								</div>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Call to Action */}
				<motion.div
					variants={itemVariants}
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					className="text-center mt-16"
				>
					<div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/30 shadow-lg">
						<FaUsers className="text-2xl text-blue-500" />
						<div className="text-left">
							<div className="text-sm text-gray-600">
								Ready to start your journey?
							</div>
							<div className="text-lg font-bold text-gray-900">
								Join 1000+ happy property owners
							</div>
						</div>
						<button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
							Get Started
						</button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default PropertyJourneySection;
