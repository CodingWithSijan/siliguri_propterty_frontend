import React from "react";
import { ISellListingType } from "../../../../types/listingTypes";
import { IListingUserDetails } from "../../../../types/listingUserDetails";
import Image_UserDetails from "../../ImageDetails";
import CommonListingDetails from "../../CommonListingDetails";
import { ICommonListingDetailsType } from "../../../../types/commonListingDetailsTypes";
import { FaMapMarkerAlt, FaRulerCombined, FaRupeeSign } from "react-icons/fa";
import { formatIndianCurrency } from "../../../../utils/priceFormatHelper";
import PostedByUserDetails from "../../PostedByUserDetails";
import InfoItem from "../../InfoItem";

const LandSell: React.FC<{
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

	// Format price based on land specifics
	const formatPrice = () => {
		if (listing.pricePerUnit && listing.availableLandSpace) {
			return `₹${formatIndianCurrency(listing.pricePerUnit)} per ${
				listing.availableLandSpaceUnit || "unit"
			}`;
		}
		if (listing.totalPrice)
			return `₹${formatIndianCurrency(listing.totalPrice)}`;
		if (listing.price) return `₹${formatIndianCurrency(Number(listing.price))}`;
		return "Price on request";
	};

	return (
		<div className="w-full min-h-screen bg-white">
			<div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
						<div className="rounded-lg p-6 border border-emerald-200/60 shadow-sm">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center shadow-sm">
									<FaRupeeSign className="text-white text-base" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900">
									Land Price
								</h3>
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

						<div>
							<PostedByUserDetails userDetails={userDetails} />
						</div>

						<div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-gray-200 p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
								Land Features
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
								{listing.availableLandSpace && (
									<InfoItem
										icon={<FaMapMarkerAlt className="text-blue-600" />}
										label="Available Land"
										value={`${listing.availableLandSpace} ${
											listing.availableLandSpaceUnit || ""
										}`}
										variant="primary"
									/>
								)}

								{listing.pricePerUnit && (
									<InfoItem
										icon={<FaRupeeSign className="text-blue-600" />}
										label="Price per Unit"
										value={`₹${formatIndianCurrency(listing.pricePerUnit)}`}
										variant="primary"
									/>
								)}

								{listing.unit && (
									<InfoItem
										icon={<FaRulerCombined className="text-slate-600" />}
										label="Unit of Measurement"
										value={listing.unit}
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

export default LandSell;
