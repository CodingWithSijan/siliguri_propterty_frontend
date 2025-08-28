import React from "react";
import { motion, useInView } from "framer-motion";
import {
	FaSearch,
	FaMapMarkerAlt,
	FaHandshake,
	FaHeart,
	FaShieldAlt,
	FaClock,
	FaHome,
} from "react-icons/fa";
import { useRef } from "react";

const WhyChooseUsSection: React.FC = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.3 });

	const features = [
		{
			icon: FaSearch,
			title: "Easy Property Search",
			description:
				"Find properties in Siliguri with our simple and intuitive search filters",
			color: "from-blue-500 to-blue-600",
			bgColor: "bg-blue-50",
		},
		{
			icon: FaMapMarkerAlt,
			title: "Local Expertise",
			description:
				"Deep knowledge of Siliguri's neighborhoods and property market trends",
			color: "from-green-500 to-green-600",
			bgColor: "bg-green-50",
		},
		{
			icon: FaHandshake,
			title: "Direct Contact",
			description:
				"Connect directly with property owners without any middleman complications",
			color: "from-purple-500 to-purple-600",
			bgColor: "bg-purple-50",
		},
		{
			icon: FaHeart,
			title: "Personalized Service",
			description:
				"We understand your needs and help you find the perfect property match",
			color: "from-pink-500 to-pink-600",
			bgColor: "bg-pink-50",
		},
		{
			icon: FaShieldAlt,
			title: "Verified Listings",
			description:
				"All properties are verified to ensure you get accurate information",
			color: "from-indigo-500 to-indigo-600",
			bgColor: "bg-indigo-50",
		},
		{
			icon: FaClock,
			title: "Quick Response",
			description:
				"Fast and responsive customer support to help with your queries",
			color: "from-orange-500 to-orange-600",
			bgColor: "bg-orange-50",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	return (
		<section
			ref={ref}
			className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					className="text-center mb-16"
				>
					<motion.div
						variants={itemVariants}
						className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-6"
					>
						<FaHome className="text-blue-600" />
						<span className="text-sm font-medium text-blue-700">
							Why Choose Siliguri Property
						</span>
					</motion.div>

					<motion.h2
						variants={itemVariants}
						className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
					>
						Making Property Search{" "}
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Simple & Reliable
						</span>
					</motion.h2>

					<motion.p
						variants={itemVariants}
						className="text-lg text-gray-600 max-w-2xl mx-auto"
					>
						We're building a trusted platform to connect property seekers with
						owners in Siliguri. Our goal is to make your property search
						experience smooth and hassle-free.
					</motion.p>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
				>
					{features.map((feature, index) => {
						const IconComponent = feature.icon;

						return (
							<motion.div key={index} variants={itemVariants}>
								<div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
									<div
										className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
									>
										<IconComponent className="text-xl text-white" />
									</div>

									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600 text-sm leading-relaxed">
										{feature.description}
									</p>
								</div>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
};

export default WhyChooseUsSection;
