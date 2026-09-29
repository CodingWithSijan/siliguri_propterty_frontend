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
import { buildSellSearchMetrics } from "./searchCardMetrics";
import { Eye } from "lucide-react";

const capitalize = (str: string | undefined) =>
	str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const toNumber = (value: unknown): number | null => {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === "string") {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return null;
};

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
	variant?: "grid" | "row" | "search";
}> = ({ listing, userOrGlobal, onClick, variant = "grid" }) => {
	const isRow = variant === "row";
	const isSearch = variant === "search";
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
	const searchMetrics = buildSellSearchMetrics(listing);
	const landUnit = capitalize(listing.unit);
	const landUnitPrice = toNumber(listing.pricePerUnit);
	const landTotalPrice =
		toNumber(listing.totalPrice) ?? toNumber(listing.price) ?? null;
	const viewCount = Math.max(0, Number(listing.viewCount ?? 0));
	const ownerName = listing.user?.name?.trim() || "Listing Owner";
	const ownerAvatar = listing.user?.avatar?.trim() || "";
	const ownerInitial = ownerName.charAt(0).toUpperCase();
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
				className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:min-h-[272px] lg:h-[272px] lg:min-h-0"
			>
				<div className="flex flex-col md:h-full md:flex-row">
					<div className="relative h-52 w-full overflow-hidden md:h-full md:w-64 md:shrink-0">
						<img
							src={thumbnail || propertyImagePlaceholder}
							alt={listing.title}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
						/>
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/75 via-slate-900/35 to-transparent" />
						<div className="absolute left-3 top-3 rounded bg-emerald-700 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
							FOR SALE
						</div>
						{userOrGlobal === "global" && (
							<div className="absolute right-3 top-3 z-20">
								<ActionButtons listing={listing} />
							</div>
						)}
						<div className="absolute bottom-3 left-3 right-3 z-10">
							<div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/30 bg-black/35 px-2.5 py-1 text-white backdrop-blur-sm">
								<div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-800">
									{ownerAvatar ? (
										<img
											src={ownerAvatar}
											alt={`${ownerName} avatar`}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											{ownerInitial}
										</div>
									)}
								</div>
								<p className="line-clamp-1 min-w-0 text-xs font-medium text-white/95">
									{ownerName}
								</p>
							</div>
						</div>
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
								{listing.propertyCategory === "land" ? (
									<div>
										<p className="inline-flex items-center text-xl font-bold text-emerald-700">
											<BiRupee className="text-xl" />
											{landUnitPrice !== null
												? formatIndianCurrency(landUnitPrice)
												: formatPrice()}
											{landUnitPrice !== null && landUnit && (
												<span className="ml-1 text-sm font-semibold text-slate-600">
													/ {landUnit}
												</span>
											)}
										</p>
										<p className="mt-1 text-xs font-medium text-slate-500">
											Total: ₹
											{landTotalPrice !== null
												? formatIndianCurrency(landTotalPrice)
												: "Price on request"}
										</p>
									</div>
								) : (
									<>
										<p className="inline-flex items-center text-xl font-bold text-emerald-700">
											<BiRupee className="text-xl" />
											{formatPrice()}
										</p>
										{listing.unit && (
											<p className="text-xs text-slate-500">
												per {capitalize(listing.unit)}
											</p>
										)}
									</>
								)}
							</div>
						</div>

						<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
							{searchMetrics.map((metric) => (
								<div
									key={metric.label}
									className="rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-2"
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

						<div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 lg:flex-row lg:items-center lg:justify-between">
							<div className="inline-flex min-w-0 items-center gap-2 text-xs text-slate-600" />
							<div className="flex min-w-0 flex-col items-start gap-2 text-xs text-slate-600 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-3 lg:gap-y-1">
								<span className="inline-flex w-fit min-w-0 max-w-full items-start gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">
									<Eye className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
									<span>
										{viewCount.toLocaleString("en-IN")}{" "}
										{viewCount === 1 ? "person" : "people"} viewed this property
									</span>
								</span>
								<span className="self-end rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 lg:self-auto">
									Posted {postedAgoText}
								</span>
							</div>
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
			className={`relative overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg group w-full cursor-pointer ${
				isRow
					? "mx-0 flex flex-col md:flex-row"
					: "mx-auto flex max-w-sm flex-col"
			}`}
			style={{ minHeight: isRow ? 220 : 420 }}
		>
			{/* Tilted ribbon - diagonal across top-left */}
			{isRow ? (
				<div className="absolute left-3 top-3 z-20 rounded bg-emerald-700 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
					FOR SALE
				</div>
			) : (
				<div className="absolute top-3 left-0 z-20 overflow-visible pointer-events-none">
					<span className="block bg-blue-500 text-white text-xs font-semibold px-8 py-1 transform -rotate-12 origin-left shadow-md -translate-x-3 pointer-events-auto">
						FOR SALE
					</span>
				</div>
			)}

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
				<div className="absolute left-3 right-3 bottom-12 z-10">
					<div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-slate-900/45 px-2.5 py-1 text-white backdrop-blur-md">
						<div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-800">
							{ownerAvatar ? (
								<img
									src={ownerAvatar}
									alt={`${ownerName} avatar`}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center">
									{ownerInitial}
								</div>
							)}
						</div>
						<p className="line-clamp-1 min-w-0 text-xs font-medium text-white/95">
							{ownerName}
						</p>
					</div>
				</div>
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
					<RenderListingFeaturesSell listing={listing} />
				</div>

				{/* Location */}
				<div className="flex items-center gap-2 text-xs text-gray-600">
					<FaMapMarkerAlt className="text-blue-500 text-sm" />
					<span className={`text-sm ${isRow ? "line-clamp-1" : "truncate"}`}>
						{locationText}
					</span>
				</div>

				{/* Price moved below location */}
				{(listing.price || listing.totalPrice) && (
					<div className="mt-2">
						{listing.propertyCategory === "land" ? (
							<>
								<span className="flex items-center gap-1 text-base font-bold text-green-700">
									<BiRupee className="text-lg" />
									{landUnitPrice !== null
										? formatIndianCurrency(landUnitPrice)
										: formatPrice()}
									{landUnitPrice !== null && landUnit && (
										<span className="text-sm text-gray-600 font-semibold">
											/ {landUnit}
										</span>
									)}
								</span>
								<p className="mt-1 text-xs font-medium text-gray-600">
									Total: ₹
									{landTotalPrice !== null
										? formatIndianCurrency(landTotalPrice)
										: "Price on request"}
								</p>
							</>
						) : (
							<span className="flex items-center gap-1 text-sm font-bold text-green-700">
								<BiRupee className="text-base" />
								{formatPrice()}
								{listing.unit && (
									<span className="text-sm text-gray-600 font-medium">
										/ {capitalize(listing.unit)}
									</span>
								)}
							</span>
						)}
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
