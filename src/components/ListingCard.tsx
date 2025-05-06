import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";

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
		if (listing.priceType === "negotiable" && listing.priceRange) {
			return `${listing.priceRange.min} - ${listing.priceRange.max}`;
		} else {
			return listing.price;
		}
	};

	return (
		<div
			onClick={onClick}
			className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer group"
		>
			<div className="relative overflow-hidden h-48">
				<img
					src={listing.pictures[0] || "https://via.placeholder.com/300"}
					alt={listing.title}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<span className="absolute top-2 left-2 bg-sky-600 text-white text-xs px-3 py-1 rounded-full shadow">
					{listing.propertyCategory}
				</span>
				<span className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
					{listing.intent}
				</span>
			</div>
			<div className="p-4">
				<h3 className="text-lg font-semibold text-gray-800 truncate">
					{listing.title}
				</h3>
				<div className="flex justify-between items-center mt-2">
					<div className="flex items-center gap-1 text-sm text-sky-600">
						<FaMapMarkerAlt className="text-red-500" />
						{listing.location}
					</div>
					<div className="flex items-center text-green-600 font-medium text-sm">
						<MdCurrencyRupee className="text-lg" />
						{renderPrice()}
					</div>
				</div>
				<p className="text-sm text-gray-600 mt-2 line-clamp-2">
					{listing.description}
				</p>
			</div>
		</div>
	);
};

export default ListingCard;
