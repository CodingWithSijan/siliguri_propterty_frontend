import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BiRupee } from "react-icons/bi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IRentListingType } from "../../types/listingTypes";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";
import ActionButtons from "./ActionButtons";
import getDaysAgoTextFromObjectId from "../../utils/getDaysAgo";
import RenderListingFeaturesRent from "./RenderListingFeaturesRent";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import { CalendarDays, Eye } from "lucide-react";
import { buildRentSearchMetrics } from "./searchCardMetrics";

const capitalize = (str: string | undefined) =>
	str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const isImageUrl = (url: string): boolean => {
	const lower = url.toLowerCase();
	if (lower.includes("/image/upload/")) return true;
	if (lower.includes("/video/upload/")) return false;
	return /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(lower);
};

const RentListingCard: React.FC<{
	listing: IRentListingType;
	userOrGlobal: string;
	onClick?: () => void;
	variant?: "grid" | "row" | "search";
}> = ({ listing, userOrGlobal, onClick, variant = "grid" }) => {
	const isRow = variant === "row";
	const isSearch = variant === "search";
	const navigate = useNavigate();
	const handleClick = () => {
		if (onClick) {
			onClick();
		} else {
			const path =
				userOrGlobal === "global"
					? `/rentals/${listing.propertyCategory}/${listing._id}`
					: `/rentals`;
			navigate(path);
		}
	};
	const postedAgoText = getDaysAgoTextFromObjectId(listing._id);
	const searchMetrics = buildRentSearchMetrics(listing);
	const viewCount = Math.max(0, Number(listing.viewCount ?? 0));
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

	if (isSearch) {
		return (
			<motion.article
				transition={{ type: "spring", stiffness: 110, damping: 18 }}
				onClick={handleClick}
				className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md cursor-pointer md:h-[272px]"
			>
				<div className="flex flex-col md:h-full md:flex-row">
					<div className="relative h-52 w-full overflow-hidden md:h-full md:w-64 md:shrink-0">
						<img
							src={thumbnail || propertyImagePlaceholder}
							alt={listing.title}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
						/>
						<div className="absolute left-3 top-3 rounded bg-blue-900 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
							FOR RENT
						</div>
						{userOrGlobal === "global" && (
							<div className="absolute right-3 top-3 z-20">
								<ActionButtons listing={listing} />
							</div>
						)}
					</div>

					<div className="flex min-w-0 flex-1 flex-col p-4 md:h-full md:p-5">
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0">
								<h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
									{listing.title}
								</h3>
								<p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-600">
									<FaMapMarkerAlt className="text-emerald-600" />
									<span className="line-clamp-1">{locationText}</span>
								</p>
							</div>

							<div className="shrink-0 text-right">
								<p className="inline-flex items-center text-2xl font-bold text-emerald-700">
									<BiRupee className="text-xl" />
									{listing.pricePerFrequency
										? formatIndianCurrency(listing.pricePerFrequency)
										: "Price on request"}
								</p>
								<p className="text-xs text-slate-500">
									{listing.frequency
										? `per ${capitalize(listing.frequency)}`
										: ""}
								</p>
							</div>
						</div>

						<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
							{searchMetrics.map((metric) => (
								<div
									key={metric.label}
									className="rounded-lg bg-slate-50 px-2.5 py-2"
								>
									<p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
										{metric.label}
									</p>
									<p className="text-xs font-semibold text-slate-800 line-clamp-1">
										{metric.value}
									</p>
								</div>
							))}
						</div>

						<div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
							<div className="inline-flex items-center gap-2 text-xs text-slate-600">
								<CalendarDays className="h-3.5 w-3.5 text-slate-500" />
								{listing.availableForDuration
									? `Available for ${listing.availableForDuration} ${listing.availableForDurationUnit ?? "units"}`
									: "Duration not specified"}
							</div>
							<div className="flex items-center gap-2">
								<span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
									<Eye className="h-3.5 w-3.5" />
									{viewCount.toLocaleString("en-IN")} views
								</span>
								<span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
									Posted {postedAgoText}
								</span>
							</div>
						</div>

						<div className="mt-2 text-xs text-slate-600">
							<RenderListingFeaturesRent listing={listing} />
						</div>
					</div>
				</div>
			</motion.article>
		);
	}

	return (
		<motion.div
			transition={{ type: "spring", stiffness: 100, damping: 18 }}
			onClick={handleClick}
			className={`relative bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200/70 group w-full cursor-pointer overflow-hidden ${
				isRow
					? "mx-0 flex flex-col md:flex-row"
					: "mx-auto flex max-w-sm flex-col"
			}`}
			style={{ minHeight: isRow ? 220 : 420 }}
		>
			{/* Tilted ribbon - diagonal across top-left */}
			{isRow ? (
				<div className="absolute left-3 top-3 z-20 rounded bg-blue-900 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
					RENTAL
				</div>
			) : (
				<div className="absolute top-3 left-0 z-20 overflow-visible pointer-events-none">
					<span className="block bg-orange-500 text-white text-xs font-semibold px-8 py-1 transform -rotate-12 origin-left shadow-md -translate-x-3 pointer-events-auto">
						FOR RENT
					</span>
				</div>
			)}

			{/* Approval / Posted */}
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
			<div
				className={`overflow-hidden relative ${isRow ? "w-full md:w-72 shrink-0" : "w-full"}`}
				style={{ height: isRow ? 220 : 240 }}
			>
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
						className={`text-white font-semibold leading-snug line-clamp-2 mb-0 tracking-tight ${isRow ? "text-lg h-auto" : "text-base h-[44px]"}`}
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
			<div
				className={`p-3 pt-2.5 flex flex-col justify-between flex-grow ${isRow ? "md:p-4" : ""}`}
			>
				{/* Top row: features only */}
				<div className="flex items-center gap-2 mb-1">
					<RenderListingFeaturesRent listing={listing} />
				</div>

				{/* Location */}
				<div className="flex items-center gap-2 text-xs text-gray-600">
					<FaMapMarkerAlt className="text-blue-500 text-sm" />
					<span className={`text-sm ${isRow ? "line-clamp-1" : "truncate"}`}>
						{locationText}
					</span>
				</div>

				{/* Price moved below location */}
				{listing.pricePerFrequency && (
					<div className="mt-2">
						<span className="text-green-700 font-bold text-base flex items-center gap-1">
							<BiRupee className="text-base" />
							{formatIndianCurrency(listing.pricePerFrequency)}
							{listing.frequency && (
								<span className="text-sm text-gray-600 font-medium">
									/ {capitalize(listing.frequency)}
								</span>
							)}
						</span>
					</div>
				)}

				{/* Footer: Duration */}
				<div className="mt-2">
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
		</motion.div>
	);
};

export default RentListingCard;
