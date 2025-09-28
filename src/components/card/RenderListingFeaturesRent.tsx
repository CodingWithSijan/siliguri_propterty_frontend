import React from "react";
import { IRentListingType } from "../../types/listingTypes";
import { Bed, Bath, Car, Store, Columns } from "lucide-react";

const RenderListingFeaturesRent: React.FC<{ listing: IRentListingType }> = ({
	listing,
}) => {
	const FeatureItem = ({
		icon,
		label,
	}: {
		icon: React.ReactNode;
		label: string | number | undefined;
	}) => (
		<div className="flex items-center gap-2 bg-gray-50 border border-gray-100 text-gray-800 text-sm px-3 py-1 rounded-md">
			<span className="flex items-center">{icon}</span>
			<span className="font-medium">{label}</span>
		</div>
	);

	switch (listing.propertyCategory) {
		case "flat":
		case "house":
			return (
				<div className="flex items-center gap-2">
					<FeatureItem
						icon={<Bed className="h-4 w-4 text-gray-600" />}
						label={listing.bedrooms ?? "N/A"}
					/>
					<FeatureItem
						icon={<Bath className="h-4 w-4 text-gray-600" />}
						label={listing.bathrooms ?? "N/A"}
					/>
					<FeatureItem
						icon={<Car className="h-4 w-4 text-gray-600" />}
						label={listing.parking ? "Yes" : "No"}
					/>
				</div>
			);

		case "shop":
			return (
				<div className="flex items-center gap-2">
					<FeatureItem
						icon={<Store className="h-4 w-4 text-gray-600" />}
						label={listing.hasShutter ? "Yes" : "No"}
					/>
					<FeatureItem
						icon={<Columns className="h-4 w-4 text-gray-600" />}
						label={listing.shopArea ?? "N/A"}
					/>
				</div>
			);

		default:
			return <></>;
	}
};

export default RenderListingFeaturesRent;
