import React from "react";
import siliguri_property_logo_noBG from "../../assets/logo_siliguri_property.png";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer: React.FC = () => {
	return (
		<footer className="bg-slate-900 text-white">
			<div className="max-w-7xl mx-auto px-4 py-12">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Company Brand Section */}
					<div>
						<div className="flex items-center gap-4 mb-6">
							<div className="bg-white p-2 rounded-lg">
								<img
									src={siliguri_property_logo_noBG}
									alt="Siliguri Property Logo"
									className="h-10 w-10 object-contain"
								/>
							</div>
							<div>
								<h2 className="text-2xl font-bold text-white">
									Siliguri Property
								</h2>
								<p className="text-slate-300 text-sm">
									Premium Property Solutions
								</p>
							</div>
						</div>
						<p className="text-slate-300 leading-relaxed mb-6 max-w-md">
							Your premier destination for finding the perfect property in
							Siliguri. We specialize in connecting property owners with genuine
							buyers and renters through our trusted platform.
						</p>
					</div>

					{/* Contact Info Section */}
					<div>
						<h3 className="text-lg font-semibold text-white mb-6 relative">
							Get In Touch
							<div className="absolute bottom-0 left-0 w-8 h-0.5 bg-blue-400 mt-2"></div>
						</h3>
						<div className="space-y-4">
							<div className="flex items-center gap-3 text-slate-300">
								<FaMapMarkerAlt className="text-blue-400 flex-shrink-0" />
								<span className="text-sm">Siliguri, West Bengal, India</span>
							</div>
							<div className="flex items-center gap-3 text-slate-300">
								<FaPhone className="text-blue-400 flex-shrink-0" />
								<span className="text-sm">+91 XXXXX XXXXX</span>
							</div>
							<div className="flex items-center gap-3 text-slate-300">
								<FaEnvelope className="text-blue-400 flex-shrink-0" />
								<span className="text-sm">info@siliguriproperty.com</span>
							</div>
						</div>

						{/* Quick Links */}
						<div className="mt-6 flex flex-wrap gap-4">
							<a
								href="/about"
								className="text-slate-300 hover:text-white transition-colors text-sm"
							>
								About
							</a>
							<a
								href="/contact"
								className="text-slate-300 hover:text-white transition-colors text-sm"
							>
								Contact
							</a>
							<a
								href="/privacy"
								className="text-slate-300 hover:text-white transition-colors text-sm"
							>
								Privacy
							</a>
							<a
								href="/terms"
								className="text-slate-300 hover:text-white transition-colors text-sm"
							>
								Terms
							</a>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-slate-700 pt-6">
					<div className="flex flex-col items-center justify-center gap-2 text-center">
						<div className="text-slate-400 text-sm">
							© {new Date().getFullYear()} Siliguri Property. All rights
							reserved.
						</div>
						<div className="flex items-center gap-2 text-slate-400 text-sm">
							<span>Developer: </span>
							<a
								className="text-white font-medium"
								target="_blank"
								href="https://my-portfolio-murex-iota-66.vercel.app/"
							>
								Sijan Pradhan
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
