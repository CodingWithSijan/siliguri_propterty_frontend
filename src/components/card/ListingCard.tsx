import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { motion } from "framer-motion";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";

interface ListingType {
	_id: string;
	title: string;
	description: string;
	location: string;
	price: string;
	priceType: "negotiable" | "fixed";
	pictures: string[];
	propertyCategory: string;
	intent: string;
	duration?: string;
	createdAt: Date;
}

const intentStyles: Record<string, string> = {
	sell: "bg-red-600 text-white",
	rent: "bg-blue-600 text-white",
	buy: "bg-green-600 text-white",
	default: "bg-gray-400 text-white",
};

const intentIcons: Record<string, React.ReactNode> = {
	sell: <MdCurrencyRupee className="inline-block mr-1" />, // Rupee for sell
	rent: <FaMapMarkerAlt className="inline-block mr-1" />, // Location for rent
	buy: <span className="inline-block mr-1">🛒</span>, // Cart for buy
	default: <span className="inline-block mr-1">ℹ️</span>,
};

const ListingCard: React.FC<{ listing: ListingType; onClick: () => void }> = ({
	listing,
	onClick,
}) => {
	const renderPrice = () => {
		return formatIndianCurrency(Number(listing.price));
	};

	const intent = listing.intent?.toLowerCase() || "default";
	const intentStyle = intentStyles[intent] || intentStyles.default;
	const intentIcon = intentIcons[intent] || intentIcons.default;

	return (
		<motion.div
			whileHover={{ y: -5, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
			transition={{ type: "spring", stiffness: 300 }}
			className={`relative bg-white rounded-2xl overflow-hidden shadow-md border-2 border-blue-100 hover:border-blue-400 transition-all duration-300 group cursor-pointer`}
			onClick={onClick}
		>
			{/* Intent Ribbon */}
			<div
				className={`absolute -left-8 top-5 rotate-[-45deg] px-8 py-1 text-xs font-bold shadow-lg z-20 ${intentStyle}`}
				style={{ minWidth: "120px", textAlign: "center" }}
			>
				{intentIcon}
				{listing.intent.charAt(0).toUpperCase() + listing.intent.slice(1)}
			</div>
			{/* Your Listing Badge */}
			<span className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-xs px-3 py-1.5 rounded-full shadow-lg font-bold z-20 border border-yellow-600">
				Your Listing
			</span>
			<div className="relative aspect-[4/3] overflow-hidden">
				<img
					src={listing.pictures[0] || "https://via.placeholder.com/300"}
					alt={listing.title}
					className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-200"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
				<span className="absolute bottom-3 left-3 bg-white/90 text-blue-700 text-xs px-3 py-1.5 rounded-full shadow-lg border border-blue-200">
					{listing.propertyCategory}
				</span>
			</div>

			<div className="p-5">
				<h3 className="text-xl font-bold text-gray-800 line-clamp-1 mb-2">
					{listing.title}
				</h3>

				<div className="flex items-center gap-2 mb-3">
					<div className="flex items-center gap-1 text-sm text-gray-600">
						<FaMapMarkerAlt className="text-red-500" />
						<span className="line-clamp-1">{listing.location}</span>
					</div>
				</div>

				<p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
					{listing.description}
				</p>

				<div className="flex justify-between items-center pt-2 border-t border-gray-100">
					<div className="flex items-center text-lg font-semibold text-green-600">
						<MdCurrencyRupee className="text-xl" />
						<span>{renderPrice()}</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default ListingCard;
