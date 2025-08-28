import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { BiRupee } from "react-icons/bi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import { IRentListingType } from "../../types/listingTypes";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";
import PropertyIconHelper from "../common/PropertyIconHelper";

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
			whileHover={{ y: -4, scale: 1.01 }}
			transition={{ type: "spring", stiffness: 250, damping: 18 }}
			className="relative bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-200/60
    group w-full max-w-sm mx-auto cursor-pointer flex flex-col overflow-hidden h-[400px]"
			onClick={handleClick}
		>
			{/* Rent Tag */}
			<div className="absolute top-3 left-3 z-20">
				<span className="bg-blue-600 text-white text-[11px] px-3 py-1.5 rounded-full font-semibold tracking-wide flex items-center gap-1 shadow-sm">
					<MdSell className="text-sm" /> RENT
				</span>
			</div>

			{/* Approval / Posted */}
			<div className="absolute top-3 right-3 z-20">
				{listing.approvalStatus && userOrGlobal === "user" ? (
					<span
						className={`px-2 py-1 rounded-full text-[11px] font-semibold shadow-sm border ${
							listing.approvalStatus === "approved"
								? "bg-green-50 text-green-700 border-green-200"
								: listing.approvalStatus === "pending"
								? "bg-yellow-50 text-yellow-700 border-yellow-200"
								: "bg-red-50 text-red-700 border-red-200"
						}`}
					>
						{capitalize(listing.approvalStatus)}
					</span>
				) : (
					<span className="bg-white/90 text-gray-700 text-[11px] px-2 py-1 rounded-full shadow-sm border border-gray-200 font-medium">
						Posted on{" "}
						{listing._id
							? new Date(
									parseInt(listing._id.substring(0, 8), 16) * 1000
							  ).toLocaleDateString()
							: "-"}
					</span>
				)}
			</div>

			{/* Image */}
			<div className="relative w-full h-52 overflow-hidden">
				<img
					src={
						listing.pictures && listing.pictures.length > 0
							? listing.pictures[0]
							: propertyImagePlaceholder
					}
					alt={listing.title}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
			</div>

			{/* Content */}
			<div className="p-4 flex flex-col flex-grow justify-between min-h-[180px]">
				<div>
					{/* Category */}
					<div className="flex items-center justify-between mb-2">
						<span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200 font-medium">
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
						<FaMapMarkerAlt className="text-blue-500 text-sm" />
						<span className="truncate">{listing.location}</span>
					</div>
				</div>

				{/* Footer: Price + Duration (always bottom aligned) */}
				<div className="mt-auto">
					{/* Price */}
					{listing.pricePerFrequency && (
						<div className="mb-1">
							<span className="text-green-700 font-bold text-xl flex items-center gap-1">
								<BiRupee className="text-lg" />
								{formattedPrice}
								{listing.frequency && (
									<span className="text-sm text-gray-600 font-medium">
										/ {capitalize(listing.frequency)}
									</span>
								)}
							</span>
						</div>
					)}

					{/* Duration */}
					{listing.availableForDuration && (
						<p className="text-xs text-gray-500">
							Available for{" "}
							<span className="text-blue-700 font-medium">
								{listing.availableForDuration}{" "}
								{listing.availableForDurationUnit &&
									capitalize(listing.availableForDurationUnit) + "s"}
							</span>
						</p>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default RentListingCard;
