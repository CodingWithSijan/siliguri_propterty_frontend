import React from "react";
import { FaMapMarkerAlt, FaBed, FaBath, FaLink, FaCar } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { GiSofa } from "react-icons/gi";
import { TbRulerMeasure } from "react-icons/tb";
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
	// Format price based on property type
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
			whileHover={{ y: -5 }}
			transition={{ type: "spring", stiffness: 300 }}
			className="relative bg-white rounded-md shadow-md border border-gray-200  group w-full max-w-sm mx-auto cursor-pointer"
			onClick={onClick}
		>
			{/* Sell Tag */}
			<div className="absolute top-3 left-3 z-20">
				<span className="bg-red-700 text-white text-[10px] px-3 py-1 rounded-full font-semibold tracking-wide border border-white uppercase flex items-center gap-1 shadow-md">
					<MdSell className="text-sm" /> SELL
				</span>
			</div>

			{/* Approval Status */}
			{listing.approvalStatus && userOrGlobal === "user" && (
				<div className="absolute top-3 right-3 bg-white/90 text-gray-800 text-[10px] px-2 py-1 rounded shadow font-semibold z-20 border border-gray-200">
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
					Posted on{" "}
					{listing._id
						? new Date(
								parseInt(listing._id.substring(0, 8), 16) * 1000
						  ).toLocaleDateString()
						: "-"}
				</div>
			)}
			{listing.approvalStatus && userOrGlobal === "global" && (
				<div className="absolute top-3 right-3 bg-white/90 text-blue-700 text-[10px] px-2 py-1 rounded shadow font-bold z-20 border border-gray-200">
					<span>Posted on </span>
					{listing._id
						? new Date(
								parseInt(listing._id.substring(0, 8), 16) * 1000
						  ).toLocaleDateString()
						: "-"}
				</div>
			)}
			{/* Image */}
			<div className="relative w-full h-62 overflow-hidden rounded-t-md">
				<img
					src={
						listing.pictures && listing.pictures.length > 0
							? listing.pictures[0]
							: propertyImagePlaceholder
					}
					alt={listing.title}
					className="w-full h-full object-full"
				/>
			</div>

			{/* Category */}
			<div className="flex items-center justify-between mt-2 px-3">
				<span className="flex items-center gap-1 bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full border border-red-200">
					<PropertyIconHelper
						propertyCategory={listing.propertyCategory}
						className="inline-block text-xs w-4 h-4"
					/>
					{capitalize(listing.propertyCategory)}
				</span>
			</div>

			{/* Main Content */}
			<div className="p-3">
				<h3 className="font-semibold text-gray-800 overflow-ellipsis ">
					{listing.title}
				</h3>

				<div className="flex items-center gap-2 text-sm text-gray-500 mt-1 mb-2">
					<FaMapMarkerAlt className="text-red-500" />
					<span className="">{listing.location}</span>
				</div>

				{/* Price */}
				{(listing.price || listing.totalPrice) && (
					<div className="flex flex-wrap gap-2 mb-2">
						<span className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium flex items-center">
							Price:
							<BiRupee className="text-sm" />
							{formatPrice()}
							{listing.propertyCategory != "land" &&
								listing.unit &&
								` / ${capitalize(listing.unit)}`}
						</span>
					</div>
				)}

				{/* Land Info */}
				{listing.propertyCategory === "land" && (
					<div className="flex flex-wrap gap-2 mb-2 mt-1">
						{listing.availableLandSpace && (
							<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
								<TbRulerMeasure className="text-sm" />
								Land Space: {listing.availableLandSpace}{" "}
								{capitalize(listing.availableLandSpaceUnit)}
							</span>
						)}
						{listing.pricePerUnit && (
							<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
								<BiRupee className="text-sm" />
								Per {capitalize(listing.availableLandSpaceUnit)}:{" "}
								{formatIndianCurrency(listing.pricePerUnit)}
							</span>
						)}
					</div>
				)}

				{/* House / Flat Details */}
				{(listing.propertyCategory === "house" ||
					listing.propertyCategory === "flat") && (
					<div className="flex flex-wrap gap-2 mb-2 mt-1">
						<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
							<FaBed className="text-sm" />
							Bedrooms: {listing.bedrooms ?? 0}
						</span>
						<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
							<FaBath className="text-sm" />
							Bathrooms: {listing.bathrooms ?? 0}
						</span>
						<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
							<FaLink className="text-sm" />
							<FaBath className="text-sm" />
							{listing.attachedBathroom
								? "Attached Bathroom"
								: "No attached Bathroom"}
						</span>
						<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs capitalize">
							<GiSofa className="text-sm" />
							{listing.furnishing || "-"}
						</span>
						<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
							<FaCar className="text-sm" />
							{listing.parking ? "Parking available" : "Parking not available"}
						</span>
					</div>
				)}

				{/* Shop Details */}
				{listing.propertyCategory === "shop" && (
					<div className="flex flex-wrap gap-2 mb-2 mt-1">
						<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
							<TbRulerMeasure className="text-sm" />
							Area: {listing.shopArea ?? "-"} sq ft
						</span>
						<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs capitalize">
							<GiSofa className="text-sm" />
							{listing.furnishing || "-"}
						</span>
						<span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
							<FaLink className="text-sm" />
							Shutter: {listing.hasShutter ? "Yes" : "No"}
						</span>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default SellListingCard;
