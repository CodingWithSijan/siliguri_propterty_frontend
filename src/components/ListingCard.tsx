import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { motion } from "framer-motion";

interface ListingType {
	_id: string;
	title: string;
	description: string;
	location: string;
	price: string;
	priceType: "negotiable" | "fixed";
	priceRange?: { min: string; max: string };
	pictures: string[];
	propertyCategory: string;
	intent: string;
	duration?: string;
	createdAt: Date;
}

const ListingCard: React.FC<{ listing: ListingType; onClick: () => void }> = ({
	listing,
	onClick,
}) => {
	const renderPrice = () => {
		if (listing.priceRange) {
			return `${listing.priceRange.min} - ${listing.priceRange.max}`;
		}
		return listing.price;
	};

	return (
		<motion.div
			whileHover={{ y: -5 }}
			transition={{ type: "spring", stiffness: 300 }}
			className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
			onClick={onClick}
		>
			<div className="relative aspect-[4/3] overflow-hidden">
				<img
					src={listing.pictures[0] || "https://via.placeholder.com/300"}
					alt={listing.title}
					className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
				<span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
					{listing.propertyCategory}
				</span>
				<span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
					{listing.intent}
				</span>
			</div>

			<div className="p-4">
				<h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-2">
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
					<button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
						View Details →
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default ListingCard;
