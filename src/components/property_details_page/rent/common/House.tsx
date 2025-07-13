import React from "react";
import { IRentListingType } from "../../../../types/listingTypes";
import { IListingUserDetails } from "../../../../types/listingUserDetails";
import Image_UserDetails from "../../Image_UserDetails";
import CommonListingDetails from "../../CommonListingDetails";
import { ICommonListingDetailsType } from "../../../../types/commonListingDetailsTypes";
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
} from "react-icons/fa";
import { convert_ISO_Date_to_Normal } from "../../../../utils/convert_ISO_Date_to_Normal";

const House: React.FC<{
	listing: IRentListingType;
	userDetails: IListingUserDetails | null;
}> = ({ listing, userDetails }) => {
	const commonListingDetails: ICommonListingDetailsType = {
		title: listing.title,
		description: listing.description,
		location: listing.location,
		propertyCategory: listing.propertyCategory,
		intent: listing.intent,
	};

	return (
		<div className="w-[80vw] md:w-[60vw] border border-gray-200 bg-white">
			{/* Top Image + User Info */}
			<Image_UserDetails
				user={userDetails}
				listing_images={listing.pictures}
				listing_title={listing.title}
			/>

			{/* Main Details */}
			<CommonListingDetails {...commonListingDetails} />

			{/* Additional Info Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-6 px-6 py-4 text-sm sm:text-base text-gray-800 border-t border-gray-200">
				<InfoItem icon={<FaBed />} label="Bedrooms" value={listing.bedrooms} />
				<InfoItem
					icon={<FaBath />}
					label="Bathrooms"
					value={listing.bathrooms}
				/>
				<InfoItem
					icon={<FaRulerCombined />}
					label="Built-up Area"
					value={`${listing.builtUpArea} sq ft`}
				/>
				<InfoItem icon={<FaLayerGroup />} label="Floor" value={listing.floor} />
				<InfoItem
					icon={<FaCouch />}
					label="Furnishing"
					value={listing.furnishing}
				/>
				<InfoItem
					icon={<FaCarAlt />}
					label="Parking"
					value={listing.parking ? "Available" : "Not Available"}
				/>
				<InfoItem
					icon={<FaCalendarAlt />}
					label="Available From"
					value={convert_ISO_Date_to_Normal(listing.availableFrom)}
				/>
				<InfoItem
					icon={
						listing.attachedBathroom ? (
							<FaCheckCircle className="text-green-600" />
						) : (
							<FaTimesCircle className="text-red-500" />
						)
					}
					label="Attached Bathroom"
					value={listing.attachedBathroom ? "Yes" : "No"}
				/>
			</div>
		</div>
	);
};

// ✅ Reusable subcomponent for info items
const InfoItem: React.FC<{
	icon: React.ReactNode;
	label: string;
	value: string | number | undefined | "" | null;
}> = ({ icon, label, value }) => (
	<div className="flex items-center gap-3">
		<div className="text-blue-700">{icon}</div>
		<div>
			<span className="block text-xs uppercase text-gray-500">{label}</span>
			<span className="font-medium">{value}</span>
		</div>
	</div>
);

export default House;
