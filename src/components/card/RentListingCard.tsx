import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { motion } from "framer-motion";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import { IRentListingType } from "../../types/listingTypes";
import PropertyIconHelper from "../common/PropertyIconHelper";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";
const capitalize = (str: string | undefined) =>
	str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const RentListingCard: React.FC<{
	listing: IRentListingType;
	onClick: () => void;
	userOrGlobal: string;
}> = ({ listing, onClick, userOrGlobal }) => {
	const priceNum = Number(listing.price);
	const formattedPrice = isNaN(priceNum)
		? listing.price
		: formatIndianCurrency(priceNum);

	return (
		<motion.div
			whileHover={{ y: -5 }}
			transition={{ type: "spring", stiffness: 300 }}
			className="relative bg-white rounded-xl overflow-hidden shadow-md border-2  hover:border-blue-400 transition-all duration-300 group w-full max-w-xs mx-auto cursor-pointer"
			onClick={onClick}
		>
			<div className="absolute top-3 left-3 flex items-center gap-2 z-20">
				<span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg font-extrabold tracking-wide border-2 border-white uppercase flex items-center gap-1 opacity-90">
					<MdSell className="inline-block text-base" /> RENT
				</span>
			</div>
			<div className="absolute top-2 right-2 bg-white/90 text-gray-800 text-[10px] px-2 py-1 rounded shadow font-semibold z-20 border border-gray-200">
				{listing.approvalStatus && userOrGlobal === "user" && (
					<span
						className={`mr-2 font-bold ${
							listing.approvalStatus === "approved"
								? "text-green-600"
								: listing.approvalStatus === "pending"
								? "text-yellow-600"
								: "text-red-600"
						}`}
					>
						{capitalize(listing.approvalStatus)}
					</span>
				)}
				Posted on{" "}
				{listing._id
					? new Date(
							parseInt(listing._id.substring(0, 8), 16) * 1000
					  ).toLocaleDateString()
					: "-"}
			</div>
			<div className="relative w-full h-50 overflow-hidden rounded-t-xl">
				<img
					src={
						listing.pictures && listing.pictures.length > 0
							? listing.pictures[0]
							: propertyImagePlaceholder
					}
					alt={listing.title}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
				/>
			</div>
			<div className="flex items-center justify-between mt-1 px-2">
				<span className="flex items-center gap-1 bg-white/90 text-blue-700 text-xs px-2 py-1 rounded-full shadow-sm border border-blue-200 w-fit">
					<PropertyIconHelper
						propertyCategory={listing.propertyCategory}
						className="inline-block text-xs mr-1 w-4 h-4"
					/>
					{capitalize(listing.propertyCategory)}
				</span>
			</div>
			<div className="p-2 pt-1">
				<h3 className="text-base font-bold text-gray-800 mb-1">
					{listing.title}
				</h3>
				<div className="flex items-center gap-2 mb-1">
					<FaMapMarkerAlt className="text-blue-500" />
					<span className="text-xs text-gray-600 line-clamp-1">
						{listing.location}
					</span>
				</div>

				<div className="flex flex-wrap gap-1 mb-1">
					{listing.price && (
						<span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
							Rent:{" "}
							<span className="text-green-700 font-bold">
								{formattedPrice}{" "}
								{listing.duration && " / " + capitalize(listing.duration)}
							</span>
						</span>
					)}

					{listing.rentRole && (
						<span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
							{listing.rentRole === "owner"
								? "Listed By Owner"
								: "Looking for a Property"}
						</span>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default RentListingCard;
