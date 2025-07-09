import React from "react";
import Navbar from "../header_and_footer/Navbar";
import Footer from "../header_and_footer/Footer";
import {
	FaRegEdit,
	FaRegUserCircle,
	FaBullhorn,
	FaRocket,
	FaHandshake,
	FaEnvelope,
	FaPhoneAlt,
	FaFacebook,
	FaInstagram,
} from "react-icons/fa";
import { motion } from "framer-motion";

const AboutUs: React.FC = () => {
	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
			<Navbar />
			<main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					className="text-4xl md:text-5xl font-extrabold text-blue-500 mb-6 text-center "
				>
					About Siliguri Property
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.7 }}
					className="text-lg md:text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto italic"
				>
					Siliguri Property is your trusted real estate platform dedicated to
					making property search, posting, and management effortless for
					everyone in Siliguri and beyond. Whether you are looking to rent, buy,
					or sell, our modern web app connects property owners and seekers with
					ease, transparency, and security.
				</motion.p>
				{/* Features */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100"
					>
						<FaRegEdit className="text-blue-600 text-4xl mb-3" />
						<h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
							Easy Ad Posting
						</h3>
						<p className="text-gray-600 text-base text-center">
							Post your property ad in just a few clicks. Our intuitive form
							makes it simple for anyone to list their property quickly and
							efficiently.
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100"
					>
						<FaRegUserCircle className="text-green-600 text-4xl mb-3" />
						<h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
							Personal Dashboard
						</h3>
						<p className="text-gray-600 text-base text-center">
							Manage all your listings in one place. Edit, update, or remove
							your posts anytime from your own dashboard.
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100"
					>
						<FaBullhorn className="text-pink-600 text-4xl mb-3" />
						<h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
							Promote for High Visibility
						</h3>
						<p className="text-gray-600 text-base text-center">
							Boost your posts to reach more buyers and renters. Get your
							property noticed with our promotion features.
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100"
					>
						<FaRocket className="text-yellow-500 text-4xl mb-3" />
						<h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
							Fast & Secure
						</h3>
						<p className="text-gray-600 text-base text-center">
							Enjoy a fast, secure, and modern experience. Your data and
							listings are always protected with us.
						</p>
					</motion.div>
				</div>
				{/* Mission */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					className="bg-blue-50 rounded-xl p-8 shadow-md text-center max-w-3xl mx-auto"
				>
					<FaHandshake className="mx-auto text-3xl text-blue-500 mb-3" />
					<h2 className="text-2xl font-bold text-blue-700 mb-2">Our Mission</h2>
					<p className="text-gray-700 text-base">
						To empower the people of Siliguri and nearby regions with a
						seamless, transparent, and user-friendly real estate platform. We
						believe in connecting people, simplifying property transactions, and
						building trust in every deal.
					</p>
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					className="bg-gradient-to-r from-blue-600 to-pink-500 rounded-xl p-8 shadow-lg text-center max-w-3xl mx-auto my-16"
				>
					<h2 className="text-2xl font-bold text-white mb-2">
						Ready to get started?
					</h2>
					<p className="text-white text-base mb-4">
						Join Siliguri Property today and experience the easiest way to rent,
						buy, or sell property in Siliguri.
					</p>
					<a
						href="/signup"
						className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-50 transition"
					>
						Create Your Free Account
					</a>
				</motion.div>
				{/* Contact Info */}
				<div className="mt-8 flex flex-col items-center">
					<h3 className="text-lg font-bold text-blue-700 mb-2">Contact Us</h3>
					<div className="flex flex-col md:flex-row gap-4 items-center text-gray-700">
						<span className="flex items-center gap-2">
							<FaEnvelope /> support@siliguriproperty.com
						</span>
						<span className="flex items-center gap-2">
							<FaPhoneAlt /> +91 98765 43210
						</span>
					</div>
					<div className="flex gap-4 mt-3">
						<a
							href="#"
							aria-label="Facebook"
							className="text-blue-600 hover:text-blue-800 text-xl"
						>
							<FaFacebook />
						</a>
						<a
							href="#"
							aria-label="Instagram"
							className="text-pink-500 hover:text-pink-700 text-xl"
						>
							<FaInstagram />
						</a>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default AboutUs;
