import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
// import { MdSell } from "react-icons/md";
import { motion } from "framer-motion";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import { ISellListingType } from "../../types/listingTypes";
import propertyImagePlaceholder from "../../assets/looking_to_sell.png";
import { BiRupee } from "react-icons/bi";
import ActionButtons from "./ActionButtons";

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
			{/* Tilted ribbon - diagonal across top-left */}
			<div className="absolute top-3 left-0 z-20 overflow-visible pointer-events-none">
				<span className="block bg-red-600 text-white text-xs font-semibold px-8 py-1 transform -rotate-12 origin-left shadow-md -translate-x-3 pointer-events-auto">
					FOR SALE
				</span>
			</div>
			{/* Tag
			<div className="absolute top-3 left-3 z-20">
				<span className="bg-red-600 text-white text-[11px] px-3 py-1.5 rounded-full font-semibold tracking-wide flex items-center gap-1 shadow-sm">
					<MdSell className="text-sm" /> SELL
				</span>
			</div> */}

			{listing.approvalStatus && userOrGlobal === "user" && (
				<div
					className={`absolute top-3 right-3 text-[11px] px-2 py-1 rounded-full shadow-sm font-medium z-20 border ${
						userOrGlobal === "user"
							? "bg-white/90 border-gray-200 text-gray-700"
							: "bg-blue-50 border-blue-200 "
					}`}
				>
					{
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
					}
				</div>
			)}

			{/* Image */}
			<div className="w-full h-64 overflow-hidden relative">
				<img
					src={listing.pictures?.[0] || propertyImagePlaceholder}
					alt={listing.title}
					className="w-full h-full object-cover mx-auto"
				/>
				{/* gradient overlay to improve title readability */}
				<div className="absolute left-0 right-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
				{/* Title pinned to the bottom of the image */}
				<div className="absolute left-4 right-4 bottom-0 text-white pb-2">
					<h3
						className="text-white font-semibold text-base leading-snug line-clamp-2 h-[44px] mb-0 tracking-tight"
						style={{
							fontFamily:
								"Inter, Poppins, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
						}}
					>
						{listing.title}
					</h3>
				</div>
			</div>

			{/* Content */}
			<div className="p-4 pt-6 flex flex-col justify-between flex-grow">
				<div className="mt-1">
					<div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
						<FaMapMarkerAlt className="text-blue-500 text-sm" />
						<span className="">{listing.alternateLocation}</span>
					</div>
				</div>

				{/* Price Section */}
				<div className="mt-2">
					{(listing.price || listing.totalPrice) && (
						<div className="mb-1">
							<span
								className="text-green-700 font-bold text-lg flex items-center gap-1"
								style={{
									fontFamily:
										"Inter, Poppins, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
								}}
							>
								<BiRupee className="text-base" />
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
				{/* Separator line above actions */}
				<div className="w-full mt-3 border-t border-gray-100" />
				{/* Action row - favourites and share */}
				{userOrGlobal === "global" && (
					<div className="mt-3 flex items-center justify-between">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<span className="px-3 py-1 rounded-md bg-gray-50 text-gray-800 font-medium">
								{capitalize(listing.propertyCategory as string)}
							</span>
						</div>
						<span className="px-3 py-1 rounded-md bg-gray-50 text-gray-500 text-sm italic">
							Posted on{" "}
							{listing._id
								? new Date(
										parseInt(listing._id.substring(0, 8), 16) * 1000
								  ).toLocaleDateString()
								: "-"}
						</span>

						<ActionButtons listing={listing} />
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default SellListingCard;
