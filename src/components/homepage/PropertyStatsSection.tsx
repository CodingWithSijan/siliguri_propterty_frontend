import React from "react";
import { motion } from "framer-motion";
import {
	FaHome,
	FaShieldAlt,
	FaSearch,
	FaBullhorn,
	FaClock,
	FaHandshake,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PropertyStatsSection: React.FC = () => {
	const navigate = useNavigate();
	const features = [
		{
			icon: <FaSearch className="text-3xl text-blue-600" />,
			title: "Easy Property Search",
			description:
				"Find your ideal property with our intuitive search filters and detailed listings",
		},
		{
			icon: <FaBullhorn className="text-3xl text-purple-600" />,
			title: "Free Property Listing",
			description:
				"List your property for free and reach genuine buyers and renters in Siliguri",
		},
		{
			icon: <FaShieldAlt className="text-3xl text-green-600" />,
			title: "Secure Platform",
			description:
				"Your data and property information are protected with modern security measures",
		},
		{
			icon: <FaClock className="text-3xl text-orange-500" />,
			title: "Quick Response",
			description:
				"Connect directly with property owners and get quick responses to your inquiries",
		},
		{
			icon: <FaHandshake className="text-3xl text-blue-600" />,
			title: "Direct Connection",
			description:
				"No middleman fees - connect directly with property owners for transparent deals",
		},
		{
			icon: <FaHome className="text-3xl text-purple-600" />,
			title: "Local Focus",
			description:
				"Specialized in Siliguri properties with local market knowledge and insights",
		},
	];

	return (
		<section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Your{" "}
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Property Platform
						</span>
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						A modern platform designed to simplify property transactions in
						Siliguri. Built with trust, transparency, and user experience in
						mind.
					</p>
				</motion.div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group"
						>
							<div className="flex justify-center mb-4">
								<div className="p-3 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
									{feature.icon}
								</div>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
								{feature.title}
							</h3>
							<p className="text-gray-600 text-sm leading-relaxed text-center">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>

				{/* Call to Action Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/30"
				>
					<div className="text-center">
						<h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							Ready to Get Started?
						</h3>
						<p className="text-gray-600 max-w-3xl mx-auto mb-8">
							Whether you're looking to buy, sell, or rent a property in
							Siliguri, our platform makes it simple and secure. Join our
							growing community today.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300"
								onClick={() => navigate("/properties")}
							>
								<FaSearch className="text-lg" />
								<span>Find Properties</span>
							</motion.button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default PropertyStatsSection;
