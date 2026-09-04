import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
// import { MdSell } from "react-icons/md";
import { motion } from "framer-motion";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import { ISellListingType } from "../../types/listingTypes";
import propertyImagePlaceholder from "../../assets/looking_to_sell.png";
import { BiRupee } from "react-icons/bi";
import ActionButtons from "./ActionButtons";
import { getDaysAgoTextFromObjectId } from "../../utils/getDaysAgo";
import RenderListingFeaturesSell from "./RenderListingFeaturesSell";
import { useNavigate } from "react-router-dom";

const capitalize = (str: string | undefined) =>
	str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const isImageUrl = (url: string): boolean => {
	const lower = url.toLowerCase();
	if (lower.includes("/image/upload/")) return true;
	if (lower.includes("/video/upload/")) return false;
	return /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(lower);
};

const SellListingCard: React.FC<{
	listing: ISellListingType;
	onClick?: () => void;
	userOrGlobal?: string;
}> = ({ listing, userOrGlobal, onClick }) => {
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
	const navigate = useNavigate();
	const handleClick = () => {
		if (onClick) {
			onClick();
		} else {
			const path =
				userOrGlobal === "global"
					? `/buys/${listing.propertyCategory}/${listing._id}`
					: `/buys`;
			navigate(path);
		}
	};
	const postedAgoText = getDaysAgoTextFromObjectId(listing._id);
	const thumbnail = listing.pictures?.find((url) => isImageUrl(url));
	const localityText =
		listing.wbLocalityLabel?.trim() || listing.location?.trim() || "";
	const exactAddressText = listing.alternateLocation?.trim() || "";
	const locationText =
		localityText &&
		exactAddressText &&
		localityText.toLowerCase() !== exactAddressText.toLowerCase()
			? `${localityText} | ${exactAddressText}`
			: localityText || exactAddressText || "Location not provided";

	return (
		<motion.div
			transition={{ type: "spring", stiffness: 100, damping: 18 }}
			onClick={handleClick}
			className="relative bg-white rounded-md shadow-md hover:shadow-lg border border-gray-200/60 group w-full max-w-sm mx-auto cursor-pointer flex flex-col overflow-hidden"
			style={{ minHeight: 420 }}
		>
			{/* Tilted ribbon - diagonal across top-left */}
			<div className="absolute top-3 left-0 z-20 overflow-visible pointer-events-none">
				<span className="block bg-blue-500 text-white text-xs font-semibold px-8 py-1 transform -rotate-12 origin-left shadow-md -translate-x-3 pointer-events-auto">
					FOR SALE
				</span>
			</div>

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
						</>
					}
				</div>
			)}

			{/* Image */}
			<div className="w-full overflow-hidden relative" style={{ height: 240 }}>
				<img
					src={thumbnail || propertyImagePlaceholder}
					alt={listing.title}
					className="w-full h-full object-cover mx-auto"
				/>
				{/* Share button moved to top-right of card (show for global view to avoid overlap with user-status pill) */}
				{userOrGlobal === "global" && (
					// keep action buttons inside image area but slightly inset so they don't overlap status pills
					<div className="absolute top-2 right-2 z-30 pointer-events-auto">
						<ActionButtons listing={listing} />
					</div>
				)}
				{/* gradient overlay to improve title readability */}
				<div className="absolute left-0 right-0 bottom-0 h-36 bg-gradient-to-t from-black/70 to-transparent" />
				{/* Title pinned to the bottom of the image */}
				<div className="absolute left-3 right-3 bottom-0 text-white pb-1">
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
			<div className="p-2 pt-2.5 flex flex-col justify-between flex-grow">
				{/* Top row: features only */}
				<div className="flex items-center gap-2 mb-1">
					<RenderListingFeaturesSell listing={listing} />
				</div>

				{/* Location */}
				<div className="flex items-center gap-2 text-xs text-gray-600">
					<FaMapMarkerAlt className="text-blue-500 text-sm" />
					<span className="text-sm truncate">{locationText}</span>
				</div>

				{/* Price moved below location */}
				{(listing.price || listing.totalPrice) && (
					<div className="mt-2">
						<span className="text-green-700 font-bold text-base flex items-center gap-1">
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

				{/* Separator line above actions */}
				<div className="w-full mt-2 border-t border-gray-100" />
				{userOrGlobal === "global" && (
					<div className="mt-1 flex items-center justify-between">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<span className="px-3 py-1 rounded-md bg-gray-50 text-gray-800 font-medium">
								{capitalize(listing.propertyCategory as string)}
							</span>
						</div>
						<span className="px-3 rounded-md bg-gray-50 text-gray-500 text-xs font-bold">
							Posted {postedAgoText}
						</span>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default SellListingCard;
