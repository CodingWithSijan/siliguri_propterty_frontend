import React from "react";
import { ISellListingType } from "../../../../types/listingTypes";
import { IListingUserDetails } from "../../../../types/listingUserDetails";
import Image_UserDetails from "../../ImageDetails";
import CommonListingDetails from "../../CommonListingDetails";
import { ICommonListingDetailsType } from "../../../../types/commonListingDetailsTypes";
import {
	Bed,
	Bath,
	Car,
	Ruler,
	Layers,
	Sofa,
	CheckCircle,
	XCircle,
	IndianRupee,
	MapPin,
	Store,
	Home,
	Calendar,
	User,
} from "lucide-react";
import { formatIndianCurrency } from "../../../../utils/priceFormatHelper";
import PostedByUserDetails from "../../PostedByUserDetails";
import PostCreationAndUpdateDetails from "../../PostCreationAndUpdateDetails";
import InfoItem from "../../InfoItem";
import { IPostCreationDetails } from "../../../../types/postCreationDetails";

const HouseSell: React.FC<{
	listing: ISellListingType;
	userDetails: IListingUserDetails | null;
}> = ({ listing, userDetails }) => {
	const commonListingDetails: ICommonListingDetailsType = {
		title: listing.title,
		description: listing.description,
		location: listing.location,
		alternateLocation: listing.alternateLocation,
		propertyCategory: listing.propertyCategory,
		intent: listing.intent,
	};

	const listingDateDetails: IPostCreationDetails = {
		createdAt: listing.createdAt,
		updatedAt: listing.updatedAt,
	};

	// Price logic stays as-is
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
							icon={<Bed className="w-5 h-5 text-slate-600" />}
							label="Bedrooms"
							value={listing.bedrooms}
						/>
						<InfoItem
							icon={<Bath className="w-5 h-5 text-slate-600" />}
							label="Bathrooms"
							value={listing.bathrooms}
						/>
						<InfoItem
							icon={<Ruler className="w-5 h-5 text-slate-600" />}
							label="Built-up Area"
							value={
								listing.builtUpArea ? `${listing.builtUpArea} sq ft` : undefined
							}
						/>
						{listing.propertyCategory === "house" && (
							<InfoItem
								icon={<Layers className="w-5 h-5 text-slate-600" />}
								label="Floor"
								value={listing.floor}
								variant="secondary"
							/>
						)}

						<InfoItem
							icon={<Sofa className="w-5 h-5 text-slate-600" />}
							label="Furnishing"
							value={listing.furnishing}
							variant="secondary"
						/>
						<InfoItem
							icon={<Car className="w-5 h-5 text-slate-600" />}
							label="Parking"
							value={listing.parking ? "Available" : "Not Available"}
							variant="secondary"
						/>
						<InfoItem
							icon={
								listing.attachedBathroom ? (
									<CheckCircle className="w-5 h-5 text-emerald-600" />
								) : (
									<XCircle className="w-5 h-5 text-rose-500" />
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
							icon={<Store className="w-5 h-5 text-slate-600" />}
							label="Shop Area"
							value={listing.shopArea ? `${listing.shopArea} sq ft` : undefined}
						/>
						<InfoItem
							icon={
								listing.hasShutter ? (
									<CheckCircle className="w-5 h-5 text-emerald-600" />
								) : (
									<XCircle className="w-5 h-5 text-rose-500" />
								)
							}
							label="Has Shutter"
							value={listing.hasShutter ? "Yes" : "No"}
						/>
						<InfoItem
							icon={<Sofa className="w-5 h-5 text-slate-600" />}
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
							icon={<MapPin className="w-5 h-5 text-slate-600" />}
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
								icon={<IndianRupee className="w-5 h-5 text-slate-600" />}
								label="Price per Unit"
								value={`₹${formatIndianCurrency(listing.pricePerUnit)}`}
								variant="primary"
							/>
						)}
						<InfoItem
							icon={<Ruler className="w-5 h-5 text-slate-600" />}
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
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
					{/* Left Section - Images & Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Images */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
							<Image_UserDetails
								listing_images={listing.pictures}
								listing_title={listing.title}
							/>
						</div>

						{/* Common Property Details */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
							<CommonListingDetails {...commonListingDetails} />
						</div>

						{/* Features */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-slate-100 rounded-xl">
									<Home className="w-5 h-5 text-slate-700" />
								</div>
								<h3 className="text-xl font-semibold text-slate-900">
									Property Features
								</h3>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
								{renderPropertySpecificFeatures()}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Price Card (unchanged) */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 top-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-emerald-100 rounded-xl">
									<IndianRupee className="w-5 h-5 text-emerald-700" />
								</div>
								<h3 className="text-lg font-semibold text-slate-900">Price</h3>
							</div>
							<div className="space-y-2">
								<p className="text-2xl font-bold text-emerald-700">
									{formatPrice()}
								</p>
								{listing.totalPrice && listing.pricePerUnit && (
									<p className="text-sm text-slate-600">
										Total: ₹{formatIndianCurrency(listing.totalPrice)}
									</p>
								)}
							</div>
						</div>

						{/* Posted By */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-blue-100 rounded-xl">
									<User className="w-5 h-5 text-blue-700" />
								</div>
								<h3 className="text-lg font-semibold text-slate-900">
									Posted By
								</h3>
							</div>
							<PostedByUserDetails userDetails={userDetails} />
						</div>

						{/* Listing Info */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-amber-100 rounded-xl">
									<Calendar className="w-5 h-5 text-amber-700" />
								</div>
								<h3 className="text-lg font-semibold text-slate-900">
									Listing Info
								</h3>
							</div>
							<PostCreationAndUpdateDetails
								listingDateDetails={listingDateDetails}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HouseSell;
