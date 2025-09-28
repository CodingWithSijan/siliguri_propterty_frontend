import React from "react";
import { IRentListingType } from "../../../../types/listingTypes";
import { IListingUserDetails } from "../../../../types/listingUserDetails";
import Image_UserDetails from "../../ImageDetails";
import CommonListingDetails from "../../CommonListingDetails";
import { ICommonListingDetailsType } from "../../../../types/commonListingDetailsTypes";
import {
	FaStore,
	FaCouch,
	FaCarAlt,
	FaCalendarAlt,
	FaCheckCircle,
	FaTimesCircle,
	FaClock,
	FaRupeeSign,
} from "react-icons/fa";
import { convert_ISO_Date_to_Normal } from "../../../../utils/convert_ISO_Date_to_Normal";
import PostedByUserDetails from "../../PostedByUserDetails";
import { IPostCreationDetails } from "../../../../types/postCreationDetails";
import PostCreationAndUpdateDetails from "../../PostCreationAndUpdateDetails";
import InfoItem from "../../InfoItem";

const ShopRental: React.FC<{
	listing: IRentListingType;
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
	const formatIndianCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			maximumFractionDigits: 0, // no decimals for rental prices
		}).format(amount);
	};

	const formatRentalPrice = () => {
		if (listing.pricePerFrequency && listing.frequency) {
			return `₹${formatIndianCurrency(listing.pricePerFrequency)} / ${
				listing.frequency
			}`;
		}
		return "Price on request";
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

						<div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-gray-200 p-6">
							<CommonListingDetails {...commonListingDetails} />
						</div>
					</div>

					<div className="space-y-6">
						<div className="rounded-lg p-6 border border-amber-200/60 shadow-sm">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-lg flex items-center justify-center shadow-sm">
									<FaRupeeSign className="text-white text-base" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900">
									Rental Price
								</h3>
							</div>
							<p className="text-2xl font-bold text-amber-700 mb-1">
								{formatRentalPrice()}
							</p>
							{listing.availableForDuration &&
								listing.availableForDurationUnit && (
									<p className="text-sm text-gray-600">
										Available for {listing.availableForDuration}{" "}
										{listing.availableForDurationUnit}
										{listing.availableForDuration > 1 ? "s" : ""}
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
								Shop Features
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
								{listing.shopArea && (
									<InfoItem
										icon={<FaStore className="text-blue-600" />}
										label="Shop Area"
										value={`${listing.shopArea} sq ft`}
									/>
								)}

								{listing.hasShutter !== undefined && (
									<InfoItem
										icon={
											listing.hasShutter ? (
												<FaCheckCircle className="text-green-600" />
											) : (
												<FaTimesCircle className="text-red-500" />
											)
										}
										label="Has Shutter"
										value={listing.hasShutter ? "Yes" : "No"}
									/>
								)}

								{listing.furnishing && (
									<InfoItem
										icon={<FaCouch className="text-blue-600" />}
										label="Furnishing"
										value={listing.furnishing}
										variant="secondary"
									/>
								)}

								{listing.parking !== undefined && (
									<InfoItem
										icon={<FaCarAlt className="text-blue-600" />}
										label="Parking"
										value={listing.parking ? "Available" : "Not Available"}
										variant="secondary"
									/>
								)}

								{listing.availableFrom && (
									<InfoItem
										icon={<FaCalendarAlt className="text-blue-600" />}
										label="Available From"
										value={convert_ISO_Date_to_Normal(listing.availableFrom)}
										variant="secondary"
									/>
								)}

								{listing.frequency && (
									<InfoItem
										icon={<FaClock className="text-blue-600" />}
										label="Billing Frequency"
										value={listing.frequency}
										variant="secondary"
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShopRental;
