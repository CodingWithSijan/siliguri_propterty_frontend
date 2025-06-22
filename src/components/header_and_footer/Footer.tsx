import React from "react";
import siliguri_property_logo_noBG from "../../assets/logo_siliguri_property.png";

const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-100 border-t border-gray-200 py-6 w-full">
			<div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<img
						src={siliguri_property_logo_noBG}
						alt="Siliguri Property Logo"
						className="h-8 w-8 object-contain"
					/>
					<span className="font-semibold text-gray-700 text-lg">
						Siliguri Property
					</span>
				</div>
				<div className="text-gray-500 text-sm text-center md:text-right">
					&copy; {new Date().getFullYear()} Siliguri Property. All rights
					reserved.
				</div>
				<div className="flex gap-4">
					<a
						href="/about"
						className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
					>
						About Us
					</a>
					<a
						href="/contact"
						className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
					>
						Contact
					</a>
					<a
						href="/privacy"
						className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
					>
						Privacy Policy
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
