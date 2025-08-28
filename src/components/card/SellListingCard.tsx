import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { motion } from "framer-motion";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import { ISellListingType } from "../../types/listingTypes";
import propertyImagePlaceholder from "../../assets/looking_to_sell.png";
import PropertyIconHelper from "../common/PropertyIconHelper";
import { BiRupee } from "react-icons/bi";

const capitalize = (str: string | undefined) =>
	str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const SellListingCard: React.FC<{
	listing: ISellListingType;
	onClick: () => void;
	userOrGlobal?: string;
}> = ({ listing, onClick, userOrGlobal }) => {
	const formatPrice = () => {
		if (listing.totalPrice) {
			return formatIndianCurrency(listing.totalPrice);
		}
		if (listing.price) {
			const priceNum = Number(listing.price);
			return isNaN(priceNum) ? listing.price : formatIndianCurrency(priceNum);
		}
		return "Price on request";
	};

	return (
		<motion.div
			whileHover={{ y: -4, scale: 1.01 }}
			transition={{ type: "spring", stiffness: 250, damping: 18 }}
			onClick={onClick}
			className="relative bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-200/60
    group w-full max-w-sm mx-auto cursor-pointer flex flex-col overflow-hidden h-[400px]"
		>
			{/* Tag */}
			<div className="absolute top-3 left-3 z-20">
				<span className="bg-red-600 text-white text-[11px] px-3 py-1.5 rounded-full font-semibold tracking-wide flex items-center gap-1 shadow-sm">
					<MdSell className="text-sm" /> SELL
				</span>
			</div>

			{/* Approval / Date */}
			{listing.approvalStatus && (
				<div
					className={`absolute top-3 right-3 text-[11px] px-2 py-1 rounded-full shadow-sm font-medium z-20 border ${
						userOrGlobal === "user"
							? "bg-white/90 border-gray-200 text-gray-700"
							: "bg-blue-50 border-blue-200 "
					}`}
				>
					{userOrGlobal === "user" ? (
						<>
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
							<span>
								Posted on{" "}
								{listing._id
									? new Date(
											parseInt(listing._id.substring(0, 8), 16) * 1000
									  ).toLocaleDateString()
									: "-"}
							</span>
						</>
					) : (
						<span>
							Posted on{" "}
							{listing._id
								? new Date(
										parseInt(listing._id.substring(0, 8), 16) * 1000
								  ).toLocaleDateString()
								: "-"}
						</span>
					)}
				</div>
			)}

			{/* Image */}
			<div className="relative w-full h-52 overflow-hidden">
				<img
					src={listing.pictures?.[0] || propertyImagePlaceholder}
					alt={listing.title}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
			</div>

			{/* Content */}
			<div className="p-4 flex flex-col justify-between flex-grow">
				<div>
					{/* Category */}
					<div className="flex items-center justify-between mb-2">
						<span className="flex items-center gap-1 bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-full border border-red-200 font-medium">
							<PropertyIconHelper
								propertyCategory={listing.propertyCategory}
								className="inline-block text-xs w-4 h-4"
							/>
							{capitalize(listing.propertyCategory)}
						</span>
					</div>

					{/* Title */}
					<h3 className="text-gray-900 font-semibold text-lg leading-snug line-clamp-2 h-[48px] mb-1">
						{listing.title}
					</h3>

					{/* Location */}
					<div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
						<FaMapMarkerAlt className="text-red-500 text-sm" />
						<span className="truncate">{listing.location}</span>
					</div>
				</div>

				{/* Price Section */}
				<div className="mt-auto">
					{(listing.price || listing.totalPrice) && (
						<div className="mb-1">
							<span className="text-green-700 font-bold text-xl flex items-center gap-1">
								<BiRupee className="text-lg" />
								{formatPrice()}
								{listing.propertyCategory !== "land" && listing.unit && (
									<span className="text-sm text-gray-600 font-medium">
										/ {capitalize(listing.unit)}
									</span>
								)}
							</span>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default SellListingCard;
