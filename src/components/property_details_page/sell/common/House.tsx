import React from "react";
import { ISellListingType } from "../../../../types/listingTypes";
import { IListingUserDetails } from "../../../../types/listingUserDetails";
import Image_UserDetails from "../../ImageDetails";
import CommonListingDetails from "../../CommonListingDetails";
import { ICommonListingDetailsType } from "../../../../types/commonListingDetailsTypes";
import {
	FaBed,
	FaBath,
	FaCarAlt,
	FaRulerCombined,
	FaLayerGroup,
	FaCouch,
	FaCheckCircle,
	FaTimesCircle,
	FaRupeeSign,
	FaMapMarkerAlt,
	FaStore,
} from "react-icons/fa";
import { formatIndianCurrency } from "../../../../utils/priceFormatHelper";
import PostedByUserDetails from "../../PostedByUserDetails";
import PostCreationAndUpdateDetails from "../../PostCreationAndUpdateDetails";
import { IPostCreationDetails } from "../../../../types/postCreationDetails";

const SellHouse: React.FC<{
	listing: ISellListingType;
	userDetails: IListingUserDetails | null;
}> = ({ listing, userDetails }) => {
	const commonListingDetails: ICommonListingDetailsType = {
		title: listing.title,
		description: listing.description,
		location: listing.location,
		propertyCategory: listing.propertyCategory,
		intent: listing.intent,
	};
	const listingDateDetails: IPostCreationDetails = {
		createdAt: listing.createdAt,
		updatedAt: listing.updatedAt,
	};

	// Format price based on property type
	const formatPrice = () => {
		if (listing.propertyCategory === "land") {
			if (listing.pricePerUnit && listing.availableLandSpace) {
				return `₹${formatIndianCurrency(listing.pricePerUnit)} per ${
					listing.availableLandSpaceUnit || "unit"
				}`;
			}
		}

		if (listing.totalPrice) {
			return `₹${formatIndianCurrency(listing.totalPrice)}`;
		}

		if (listing.price) {
			return `₹${formatIndianCurrency(Number(listing.price))}`;
		}

		return "Price on request";
	};

	const renderPropertySpecificFeatures = () => {
		switch (listing.propertyCategory) {
			case "house":
			case "flat":
				return (
					<>
						<InfoItem
							icon={<FaBed className="text-blue-600" />}
							label="Bedrooms"
							value={listing.bedrooms}
						/>
						<InfoItem
							icon={<FaBath className="text-blue-600" />}
							label="Bathrooms"
							value={listing.bathrooms}
						/>
						<InfoItem
							icon={<FaRulerCombined className="text-blue-600" />}
							label="Built-up Area"
							value={
								listing.builtUpArea ? `${listing.builtUpArea} sq ft` : undefined
							}
						/>
						<InfoItem
							icon={<FaLayerGroup className="text-blue-600" />}
							label="Floor"
							value={listing.floor}
							variant="secondary"
						/>
						<InfoItem
							icon={<FaCouch className="text-blue-600" />}
							label="Furnishing"
							value={listing.furnishing}
							variant="secondary"
						/>
						<InfoItem
							icon={<FaCarAlt className="text-blue-600" />}
							label="Parking"
							value={listing.parking ? "Available" : "Not Available"}
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
						/>
					</>
				);

			case "shop":
				return (
					<>
						<InfoItem
							icon={<FaStore className="text-blue-600" />}
							label="Shop Area"
							value={listing.shopArea ? `${listing.shopArea} sq ft` : undefined}
						/>
						<InfoItem
							icon={
								listing.hasShutter ? (
									<FaCheckCircle className="text-emerald-600" />
								) : (
									<FaTimesCircle className="text-red-500" />
								)
							}
							label="Has Shutter"
							value={listing.hasShutter ? "Yes" : "No"}
						/>
						<InfoItem
							icon={<FaCouch className="text-blue-600" />}
							label="Furnishing"
							value={listing.furnishing}
							variant="secondary"
						/>
					</>
				);

			case "land":
				return (
					<>
						<InfoItem
							icon={<FaMapMarkerAlt className="text-blue-600" />}
							label="Available Land"
							value={
								listing.availableLandSpace
									? `${listing.availableLandSpace} ${
											listing.availableLandSpaceUnit || ""
									  }`
									: undefined
							}
							variant="primary"
						/>
						{listing.pricePerUnit && (
							<InfoItem
								icon={<FaRupeeSign className="text-blue-600" />}
								label="Price per Unit"
								value={`₹${formatIndianCurrency(listing.pricePerUnit)}`}
								variant="primary"
							/>
						)}
						<InfoItem
							icon={<FaRulerCombined className="text-slate-600" />}
							label="Unit of Measurement"
							value={listing.unit}
							variant="secondary"
						/>
					</>
				);

			default:
				return null;
		}
	};

	return (
		<div className="w-full min-h-screen bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="space-y-6">
						<div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
							<Image_UserDetails
								listing_images={listing.pictures}
								listing_title={listing.title}
							/>
						</div>

						<div className="px-0 sm:px-0">
							<CommonListingDetails {...commonListingDetails} />
						</div>
					</div>

					<div className="space-y-6">
						<div className=" rounded-xl p-6 border border-emerald-200/60 shadow-sm">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-sm">
									<FaRupeeSign className="text-white text-base" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
							</div>
							<p className="text-2xl font-bold text-emerald-700 mb-1">
								{formatPrice()}
							</p>
							{listing.totalPrice && listing.pricePerUnit && (
								<p className="text-sm text-gray-600">
									Total: ₹{formatIndianCurrency(listing.totalPrice)}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							<PostedByUserDetails userDetails={userDetails} />
							<PostCreationAndUpdateDetails
								listingDateDetails={listingDateDetails}
							/>
						</div>

						<div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-gray-200 p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
								Property Features
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{renderPropertySpecificFeatures()}
							</div>
						</div>
					</div>
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
				};
			case "success":
				return {
					bg: "bg-emerald-50/80",
					border: "border-emerald-200/60",
				};
			case "danger":
				return {
					bg: "bg-red-50/80",
					border: "border-red-200/60",
				};
			default:
				return {
					bg: "bg-gray-50/80",
					border: "border-gray-200/60",
				};
		}
	};

	const variantClasses = getVariantClasses(variant);

	return (
		<div
			className={`group flex items-center gap-4 p-4 ${variantClasses.bg} border ${variantClasses.border} shadow-sm`}
		>
			<div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-white shadow-sm">
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
					{label}
				</span>
				<span
					className="font-semibold text-gray-900 text-sm sm:text-base truncate block"
					title={String(value)}
				>
					{value || "-"}
				</span>
			</div>
		</div>
	);
};

export default SellHouse;
