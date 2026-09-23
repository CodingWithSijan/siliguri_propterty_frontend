import React from "react";
import siliguri_property_logo_noBG from "../../assets/logo_siliguri_property.png";
import {
	FaMapMarkerAlt,
	FaFacebookF,
	FaInstagram,
	FaWhatsapp,
	FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
	return (
		<footer className="bg-[#0a1023] text-slate-100">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<div className="flex items-center gap-3">
							<img
								src={siliguri_property_logo_noBG}
								alt="Siliguri Property Logo"
								className="h-10 w-10 rounded-md bg-white p-1"
							/>
							<p className="text-xl font-semibold">
								Siliguri<span className="text-emerald-400">Property</span>
							</p>
						</div>
						<p className="mt-4 text-sm leading-relaxed text-slate-400">
							A Siliguri-focused platform to buy, rent and sell verified real
							estate listings.
						</p>
						<div className="mt-4 flex gap-2 text-slate-300">
							<span className="rounded-full bg-white/10 p-2">
								<FaFacebookF />
							</span>
							<span className="rounded-full bg-white/10 p-2">
								<FaInstagram />
							</span>
							<span className="rounded-full bg-white/10 p-2">
								<FaWhatsapp />
							</span>
							<span className="rounded-full bg-white/10 p-2">
								<FaYoutube />
							</span>
						</div>
					</div>

					<div>
						<h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
							Explore
						</h4>
						<ul className="mt-4 space-y-2 text-sm text-slate-400">
							<li>
								<Link to="/buys" className="hover:text-white">
									Buy Property
								</Link>
							</li>
							<li>
								<Link to="/rentals" className="hover:text-white">
									Rent Property
								</Link>
							</li>
							<li>
								<Link to="/buys/land" className="hover:text-white">
									Plots and Land
								</Link>
							</li>
							<li>
								<Link to="/buys/shop" className="hover:text-white">
									Commercial
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
							Company
						</h4>
						<ul className="mt-4 space-y-2 text-sm text-slate-400">
							<li>
								<Link to="/about" className="hover:text-white">
									About Us
								</Link>
							</li>
							<li>
								<Link to="/privacy" className="hover:text-white">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link to="/terms" className="hover:text-white">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link to="/properties" className="hover:text-white">
									All Listings
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
							Get in touch
						</h4>
						<ul className="mt-4 space-y-3 text-sm text-slate-400">
							<li className="inline-flex items-center gap-2">
								<FaMapMarkerAlt /> Siliguri, West Bengal
							</li>
							<li>
								Use your dashboard messages to connect with listing owners and
								support.
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-500 sm:flex-row">
					<div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
						<p>
							© {new Date().getFullYear()} SiliguriProperty. All rights
							reserved.
						</p>
						<a
							href="https://my-portfolio-murex-iota-66.vercel.app/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-slate-400 hover:text-slate-300"
						>
							Buildwave Solutions
						</a>
					</div>
					<div className="flex items-center gap-4">
						<Link to="/privacy" className="hover:text-slate-300">
							Privacy Policy
						</Link>
						<Link to="/terms" className="hover:text-slate-300">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
