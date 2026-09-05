import React from "react";
import siliguri_property_logo_noBG from "../../assets/logo_siliguri_property.png";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer: React.FC = () => {
	return (
		<footer className="bg-slate-950 text-slate-200">
			<div className="max-w-7xl mx-auto px-4 py-16">
				<div className="grid gap-10 lg:grid-cols-3">
					<div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/20">
						<div className="flex items-center gap-4 mb-5">
							<div className="bg-white p-3 rounded-2xl">
								<img
									src={siliguri_property_logo_noBG}
									alt="Siliguri Property Logo"
									className="h-10 w-10 object-contain"
								/>
							</div>
							<div>
								<h2 className="text-xl font-semibold text-white">
									Siliguri Property
								</h2>
								<p className="text-sm text-slate-400">
									Buy, rent, and sell with confidence.
								</p>
							</div>
						</div>
						<p className="text-sm leading-relaxed text-slate-300">
							Your trusted property marketplace in Siliguri, connecting local
							buyers, sellers, and renters with verified listings and expert
							support.
						</p>
					</div>

					<div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/20">
						<h3 className="text-lg font-semibold text-white mb-4">
							Quick Navigation
						</h3>
						<div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
							<a
								href="/properties"
								className="block rounded-2xl px-3 py-2 hover:bg-slate-800 hover:text-white transition"
							>
								Properties
							</a>
							<a
								href="/rentals"
								className="block rounded-2xl px-3 py-2 hover:bg-slate-800 hover:text-white transition"
							>
								Rentals
							</a>
							<a
								href="/buys"
								className="block rounded-2xl px-3 py-2 hover:bg-slate-800 hover:text-white transition"
							>
								For Sale
							</a>
							<a
								href="/about"
								className="block rounded-2xl px-3 py-2 hover:bg-slate-800 hover:text-white transition"
							>
								About Us
							</a>
							<a
								href="/login"
								className="block rounded-2xl px-3 py-2 hover:bg-slate-800 hover:text-white transition"
							>
								Login
							</a>
							<a
								href="/signup"
								className="block rounded-2xl px-3 py-2 hover:bg-slate-800 hover:text-white transition"
							>
								Sign Up
							</a>
						</div>
					</div>

					<div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/20">
						<h3 className="text-lg font-semibold text-white mb-4">
							Contact Us
						</h3>
						<div className="space-y-4 text-sm text-slate-300">
							<div className="flex items-start gap-3">
								<FaMapMarkerAlt className="mt-1 text-blue-400" />
								<span>Siliguri, West Bengal, India</span>
							</div>
							<div className="flex items-start gap-3">
								<FaPhone className="mt-1 text-blue-400" />
								<span>
									<a href="tel:+918101543210" className="hover:text-white transition">
										+91 81015 43210
									</a>
									<br />
									<a href="tel:+918101243210" className="hover:text-white transition">
										+91 81012 43210
									</a>
								</span>
							</div>
							<div className="flex items-start gap-3">
								<FaEnvelope className="mt-1 text-blue-400" />
								<a href="mailto:siliguriproperty@gmail.com" className="hover:text-white transition">
									siliguriproperty@gmail.com
								</a>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
					<p>© {new Date().getFullYear()} Siliguri Property. All rights reserved.</p>
					<p className="mt-2">
						Built by
						<a
							className="text-white font-medium ml-1"
							href="https://my-portfolio-murex-iota-66.vercel.app/"
							target="_blank"
							rel="noopener noreferrer"
						>
							sijan
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
