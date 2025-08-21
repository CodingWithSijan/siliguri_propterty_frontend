import React from "react";
import { FaMapMarkerAlt, FaBed, FaBath, FaLink, FaCar } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { GiSofa } from "react-icons/gi";
import { TbRulerMeasure } from "react-icons/tb";
import { motion } from "framer-motion";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import { IRentListingType } from "../../types/listingTypes";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";
import PropertyIconHelper from "../common/PropertyIconHelper";
import { BiRupee } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const capitalize = (str: string | undefined) =>
	str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const RentListingCard: React.FC<{
	listing: IRentListingType;
	userOrGlobal: string;
	onClick?: () => void;
}> = ({ listing, userOrGlobal, onClick }) => {
	const priceNum = Number(listing.pricePerFrequency);
	const formattedPrice = isNaN(priceNum)
		? listing.pricePerFrequency
		: formatIndianCurrency(priceNum);

	const navigate = useNavigate();
	const handleClick = () => {
		if (onClick) {
			onClick();
		} else {
			const path =
				userOrGlobal === "global" ? `/rentals/${listing._id}` : `/rentals`;
			navigate(path);
		}
	};
	return (
		<motion.div
			whileHover={{ y: -5 }}
			transition={{ type: "spring", stiffness: 300 }}
			className="relative bg-white rounded-md shadow-md border border-gray-200 group w-full max-w-sm mx-auto cursor-pointer h-full flex flex-col"
			onClick={handleClick}
		>
			{/* Rent Tag */}
			<div className="absolute top-3 left-3 z-20">
				<span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-semibold tracking-wide border border-white uppercase flex items-center gap-1 shadow-md">
					<MdSell className="text-sm" /> RENT
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
				<span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full border border-blue-200">
					<PropertyIconHelper
						propertyCategory={listing.propertyCategory}
						className="inline-block text-xs w-4 h-4"
					/>
					{capitalize(listing.propertyCategory)}
				</span>
			</div>

			{/* Main Content */}
			<div className="p-3 flex-grow flex flex-col justify-between">
				<div>
					<div className="flex items-center gap-2 text-sm text-gray-500 mt-1 mb-2">
						<FaMapMarkerAlt className="text-blue-500" />
						<span>{listing.location}</span>
					</div>

					{/* Price */}
					{listing.pricePerFrequency && (
						<div className="flex flex-wrap items-center gap-2 mb-2">
							<span className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
								Rent:
								<BiRupee className="text-sm" />
								{formattedPrice}
								{listing.frequency && " / " + capitalize(listing.frequency)}
							</span>
						</div>
					)}

					{/* Available For */}
					{listing.availableForDuration && (
						<div className="text-xs text-gray-600 mb-2">
							Available For:{" "}
							<span className="text-blue-700 font-semibold">
								{listing.availableForDuration}
								{listing.availableForDurationUnit &&
									" " + capitalize(listing.availableForDurationUnit) + "s"}
							</span>
						</div>
					)}
				</div>

				<div>
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
								{listing.parking
									? "Parking available"
									: "Parking not available"}
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
			</div>
		</motion.div>
	);
};

export default RentListingCard;
