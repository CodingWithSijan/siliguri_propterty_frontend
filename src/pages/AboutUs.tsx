import React from "react";
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
import Navbar from "../components/header_and_footer/Navbar";
import Footer from "../components/header_and_footer/Footer";

const AboutUs: React.FC = () => {
	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			<Navbar />

			<main className="flex-1 w-full max-w-6xl mx-auto px-4 py-16">
				{/* Heading */}
				<h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 text-center">
					About Siliguri Property
				</h1>
				<p className="text-lg md:text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
					Siliguri Property is your trusted real estate platform dedicated to
					making property search, posting, and management effortless for
					everyone in Siliguri and beyond. Whether you are looking to rent, buy,
					or sell, our modern web app connects property owners and seekers with
					ease, transparency, and security.
				</p>

				{/* Features Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
					{/* Feature Card */}
					{[
						{
							icon: <FaRegEdit className="text-blue-600 text-4xl" />,
							title: "Easy Ad Posting",
							desc: "Post your property ad in just a few clicks. Our intuitive form makes it simple for anyone to list their property quickly and efficiently.",
						},
						{
							icon: <FaRegUserCircle className="text-green-600 text-4xl" />,
							title: "Personal Dashboard",
							desc: "Manage all your listings in one place. Edit, update, or remove your posts anytime from your own dashboard.",
						},
						{
							icon: <FaBullhorn className="text-pink-600 text-4xl" />,
							title: "Promote for High Visibility",
							desc: "Boost your posts to reach more buyers and renters. Get your property noticed with our promotion features.",
						},
						{
							icon: <FaRocket className="text-yellow-500 text-4xl" />,
							title: "Fast & Secure",
							desc: "Enjoy a fast, secure, and modern experience. Your data and listings are always protected with us.",
						},
					].map((feature, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center border border-gray-200 text-center"
						>
							{feature.icon}
							<h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
								{feature.title}
							</h3>
							<p className="text-gray-600 text-sm">{feature.desc}</p>
						</div>
					))}
				</div>

				{/* Mission Section */}
				<div className="bg-white rounded-2xl p-8 shadow-md text-center mb-16 border border-gray-200">
					<FaHandshake className="mx-auto text-3xl text-blue-600 mb-3" />
					<h2 className="text-2xl font-bold text-gray-800 mb-2">Our Mission</h2>
					<p className="text-gray-600 text-base max-w-2xl mx-auto">
						To empower the people of Siliguri and nearby regions with a
						seamless, transparent, and user-friendly real estate platform. We
						believe in connecting people, simplifying property transactions, and
						building trust in every deal.
					</p>
				</div>

				{/* Call to Action */}
				<div className="bg-blue-600 rounded-2xl p-8 shadow-lg text-center mb-16">
					<h2 className="text-2xl font-bold text-white mb-2">
						Ready to get started?
					</h2>
					<p className="text-white text-base mb-4">
						Join Siliguri Property today and experience the easiest way to rent,
						buy, or sell property in Siliguri.
					</p>
					<a
						href="/signup"
						className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
					>
						Create Your Free Account
					</a>
				</div>

				{/* Contact Info */}
				<div className="flex flex-col items-center mb-12">
					<h3 className="text-lg font-bold text-gray-800 mb-2">Contact Us</h3>
					<div className="flex flex-col md:flex-row gap-6 items-center text-gray-700">
						<span className="flex items-center gap-2">
							<FaEnvelope /> support@siliguriproperty.com
						</span>
						<span className="flex items-center gap-2">
							<FaPhoneAlt /> +91 98765 43210
						</span>
					</div>
					<div className="flex gap-4 mt-4">
						<a href="#" aria-label="Facebook" className="text-blue-600 text-xl">
							<FaFacebook />
						</a>
						<a
							href="#"
							aria-label="Instagram"
							className="text-pink-500 text-xl"
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
