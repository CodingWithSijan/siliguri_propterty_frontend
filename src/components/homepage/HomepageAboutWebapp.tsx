import React from "react";
import {
	FaBullhorn,
	FaRegEdit,
	FaRegUserCircle,
	FaRocket,
} from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
	{
		icon: <FaRegEdit className="text-blue-500 text-4xl mb-2" />,
		title: "Easy Ad Posting",
		desc: "Post your property ad in just a few clicks. Our intuitive form makes it simple for anyone to list their property quickly.",
	},
	{
		icon: <FaRegUserCircle className="text-blue-500 text-4xl mb-2" />,
		title: "Personal Dashboard",
		desc: "Manage all your listings in one place. Edit, update, or remove your posts anytime from your own dashboard.",
	},
	{
		icon: <FaBullhorn className="text-blue-500 text-4xl mb-2" />,
		title: "Promote for High Visibility",
		desc: "Boost your posts to reach more buyers and renters. Get your property noticed with our promotion features.",
	},
	{
		icon: <FaRocket className="text-blue-500 text-4xl mb-2" />,
		title: "Fast & Secure",
		desc: "Enjoy a fast, secure, and modern experience. Your data and listings are always protected with us.",
	},
];

const HomepageAboutWebapp: React.FC = () => {
	return (
		<section className="w-full bg-blue-50 py-16 px-4 flex flex-col items-center">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="text-3xl md:text-4xl font-bold text-blue-700 mb-8 text-center"
			>
				Why Choose Siliguri Property?
			</motion.h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
				{features.map((f) => (
					<div
						key={f.title}
						className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center border border-gray-200 h-full"
					>
						<div className="mb-3">{f.icon}</div>
						<h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
							{f.title}
						</h3>
						<p className="text-gray-600 text-base text-center">{f.desc}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default HomepageAboutWebapp;
