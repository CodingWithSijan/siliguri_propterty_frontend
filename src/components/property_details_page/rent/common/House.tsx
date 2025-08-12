import React from "react";
import { IRentListingType } from "../../../../types/listingTypes";
import { IListingUserDetails } from "../../../../types/listingUserDetails";
import Image_UserDetails from "../../Image_UserDetails";
import CommonListingDetails from "../../CommonListingDetails";
import { ICommonListingDetailsType } from "../../../../types/commonListingDetailsTypes";
import ShopRental from "../shop/ShopRental";
import LandRental from "../land/LandRental";
import {
	FaBed,
	FaBath,
	FaCarAlt,
	FaRulerCombined,
	FaLayerGroup,
	FaCalendarAlt,
	FaCouch,
	FaCheckCircle,
	FaTimesCircle,
	FaRupeeSign,
} from "react-icons/fa";
import { convert_ISO_Date_to_Normal } from "../../../../utils/convert_ISO_Date_to_Normal";
import { formatIndianCurrency } from "../../../../utils/priceFormatHelper";

const House: React.FC<{
	listing: IRentListingType;
	userDetails: IListingUserDetails | null;
}> = ({ listing, userDetails }) => {
	// Route to appropriate component based on property category
	if (listing.propertyCategory === "shop") {
		return <ShopRental listing={listing} userDetails={userDetails} />;
	}

	if (listing.propertyCategory === "land") {
		return <LandRental listing={listing} userDetails={userDetails} />;
	}

	// Default to house/flat rendering
	const commonListingDetails: ICommonListingDetailsType = {
		title: listing.title,
		description: listing.description,
		location: listing.location,
		propertyCategory: listing.propertyCategory,
		intent: listing.intent,
	};

	// Format rental price
	const formatRentalPrice = () => {
		if (listing.pricePerFrequency && listing.frequency) {
			return `₹${formatIndianCurrency(listing.pricePerFrequency)} per ${
				listing.frequency
			}`;
		}
		return "Price on request";
	};

	return (
		<div className="w-full max-w-4xl mx-auto bg-white rounded-none sm:rounded-xl shadow-xl border-0 sm:border border-gray-200 overflow-hidden">
			{/* Top Image + User Info */}
			<Image_UserDetails
				user={userDetails}
				listing_images={listing.pictures}
				listing_title={listing.title}
			/>

			{/* Main Details */}
			<div className="px-6 sm:px-8">
				<CommonListingDetails {...commonListingDetails} />
			</div>

			{/* Rental Price Section */}
			<div className="px-6 sm:px-8 pb-6">
				<div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-6 border border-amber-200/60 shadow-sm">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-xl flex items-center justify-center shadow-sm">
							<FaRupeeSign className="text-white text-base" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900">
							Rental Price
						</h3>
					</div>
					<p className="text-2xl font-bold text-amber-700 mb-1">
						{formatRentalPrice()}
					</p>
					{listing.availableForDuration && listing.availableForDurationUnit && (
						<p className="text-sm text-gray-600">
							Available for {listing.availableForDuration}{" "}
							{listing.availableForDurationUnit}
							{listing.availableForDuration > 1 ? "s" : ""}
						</p>
					)}
				</div>
			</div>

			{/* Additional Info Grid */}
			<div className="bg-gradient-to-br from-slate-50 to-gray-100 border-t border-gray-200 p-6 sm:p-8">
				<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
					<div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
					Property Features
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<InfoItem
						icon={<FaBed className="text-blue-600" />}
						label="Bedrooms"
						value={listing.bedrooms}
						variant="primary"
					/>
					<InfoItem
						icon={<FaBath className="text-blue-600" />}
						label="Bathrooms"
						value={listing.bathrooms}
						variant="primary"
					/>
					<InfoItem
						icon={<FaRulerCombined className="text-blue-600" />}
						label="Built-up Area"
						value={`${listing.builtUpArea} sq ft`}
						variant="primary"
					/>
					<InfoItem
						icon={<FaLayerGroup className="text-slate-600" />}
						label="Floor"
						value={listing.floor}
						variant="secondary"
					/>
					<InfoItem
						icon={<FaCouch className="text-slate-600" />}
						label="Furnishing"
						value={listing.furnishing}
						variant="secondary"
					/>
					<InfoItem
						icon={<FaCarAlt className="text-slate-600" />}
						label="Parking"
						value={listing.parking ? "Available" : "Not Available"}
						variant="secondary"
					/>
					<InfoItem
						icon={<FaCalendarAlt className="text-slate-600" />}
						label="Available From"
						value={convert_ISO_Date_to_Normal(listing.availableFrom)}
						variant="secondary"
					/>
					<InfoItem
						icon={
							listing.attachedBathroom ? (
								<FaCheckCircle className="text-emerald-600" />
							) : (
								<FaTimesCircle className="text-red-500" />
							)
						}
						label="Attached Bathroom"
						value={listing.attachedBathroom ? "Yes" : "No"}
						variant={listing.attachedBathroom ? "success" : "danger"}
					/>
				</div>
			</div>
		</div>
	);
};

// ✅ Reusable subcomponent for info items
const InfoItem: React.FC<{
	icon: React.ReactNode;
	label: string;
	value: string | number | undefined | "" | null;
	variant?: "primary" | "secondary" | "success" | "danger";
}> = ({ icon, label, value, variant = "secondary" }) => {
	const getVariantClasses = (variant: string) => {
		switch (variant) {
			case "primary":
				return {
					bg: "bg-blue-50/80",
					border: "border-blue-200/60",
					hover: "hover:bg-blue-100/80 hover:border-blue-300/60",
				};
			case "success":
				return {
					bg: "bg-emerald-50/80",
					border: "border-emerald-200/60",
					hover: "hover:bg-emerald-100/80 hover:border-emerald-300/60",
				};
			case "danger":
				return {
					bg: "bg-red-50/80",
					border: "border-red-200/60",
					hover: "hover:bg-red-100/80 hover:border-red-300/60",
				};
			default:
				return {
					bg: "bg-gray-50/80",
					border: "border-gray-200/60",
					hover: "hover:bg-gray-100/80 hover:border-gray-300/60",
				};
		}
	};

	const variantClasses = getVariantClasses(variant);

	return (
		<div
			className={`group flex items-center gap-4 p-4 ${variantClasses.bg} rounded-xl border ${variantClasses.border} ${variantClasses.hover} transition-all duration-300 shadow-sm hover:shadow-md`}
		>
			<div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 transition-colors duration-200">
					{label}
				</span>
				<span
					className="font-semibold text-gray-900 text-sm sm:text-base truncate block transition-colors duration-200"
					title={String(value)}
				>
					{value || "N/A"}
				</span>
			</div>
		</div>
	);
};

export default House;
