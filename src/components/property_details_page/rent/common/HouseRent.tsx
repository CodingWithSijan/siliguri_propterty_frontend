import React from "react";
import { IRentListingType } from "../../../../types/listingTypes";
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
	Calendar,
	Sofa,
	CheckCircle,
	XCircle,
	IndianRupee,
} from "lucide-react";
import { convert_ISO_Date_to_Normal } from "../../../../utils/convert_ISO_Date_to_Normal";
import PostedByUserDetails from "../../PostedByUserDetails";
import PostCreationAndUpdateDetails from "../../PostCreationAndUpdateDetails";
import { IPostCreationDetails } from "../../../../types/postCreationDetails";
import InfoItem from "../../InfoItem";
import { formatIndianCurrency } from "../../../../utils/priceFormatHelper";

const House: React.FC<{
	listing: IRentListingType;
	userDetails: IListingUserDetails | null;
}> = ({ listing, userDetails }) => {
	// House/flat specific rendering
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

	// Format rental price
	const formatRentalPrice = () => {
		if (listing.pricePerFrequency && listing.frequency) {
			return `${formatIndianCurrency(listing.pricePerFrequency)} / ${
				listing.frequency
			}`;
		}
		return "Price on request";
	};

	return (
		<div className="w-full min-h-screen bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Left column: Image, User Info, Main Details */}
					<div className="space-y-2 sm:space-y-6">
						<div className="bg-white shadow border border-gray-200 overflow-hidden">
							<Image_UserDetails
								listing_images={listing.pictures}
								listing_title={listing.title}
							/>
						</div>

						<CommonListingDetails {...commonListingDetails} />
					</div>

					{/* Right column: Rental Price + Additional Info */}
					<div className="space-y-6">
						<div className="rounded-lg p-6 border border-amber-200/60 shadow-sm">
							<div className="flex items-center gap-3 mb-3">
								<div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-lg flex items-center justify-center shadow-sm">
									<IndianRupee className="text-white w-4 h-4" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900">
									Rental Price
								</h3>
							</div>
							<p className="text-2xl font-bold text-amber-700 mb-1 flex items-center gap-1">
								<IndianRupee className="w-6 h-6" />
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
						<div className=" border border-gray-200 p-6">
							<h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
								<div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
								Features
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
								<InfoItem
									icon={<Bed className="w-5 h-5 text-slate-700" />}
									label="Bedrooms"
									value={listing.bedrooms}
									variant="primary"
								/>
								<InfoItem
									icon={<Bath className="w-5 h-5 text-slate-700" />}
									label="Bathrooms"
									value={listing.bathrooms}
									variant="primary"
								/>
								<InfoItem
									icon={<Ruler className="w-5 h-5 text-slate-700" />}
									label="Built-up Area"
									value={`${listing.builtUpArea} sq ft`}
									variant="primary"
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
									icon={<Sofa className="w-5 h-5 text-slate-700" />}
									label="Furnishing"
									value={listing.furnishing}
									variant="primary"
								/>
								<InfoItem
									icon={<Car className="w-5 h-5 text-slate-700" />}
									label="Parking"
									value={listing.parking ? "Available" : "Not Available"}
									variant="primary"
								/>
								<InfoItem
									icon={<Calendar className="w-5 h-5 text-slate-700" />}
									label="Available From"
									value={convert_ISO_Date_to_Normal(listing.availableFrom)}
									variant="primary"
								/>
								<InfoItem
									icon={
										listing.attachedBathroom ? (
											<CheckCircle className="w-5 h-5 " />
										) : (
											<XCircle className="w-5 h-5 " />
										)
									}
									label="Attached Bathroom"
									value={listing.attachedBathroom ? "Yes" : "No"}
									variant="primary"
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							<PostedByUserDetails userDetails={userDetails} />
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

export default House;
