import { IRentListingType, ISellListingType } from "../../types/listingTypes";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";

export interface SearchCardMetric {
	label: string;
	value: string;
}

const formatLabel = (value?: string): string =>
	value
		? value
				.split("-")
				.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
				.join(" ")
		: "-";

const toNumber = (value: unknown): number | null => {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
};

const yesNo = (value?: boolean): string => {
	if (value === true) return "Yes";
	if (value === false) return "No";
	return "-";
};

export const buildSellSearchMetrics = (
	listing: ISellListingType,
): SearchCardMetric[] => {
	if (listing.propertyCategory === "land") {
		const unitLabel = listing.unit ? listing.unit : "unit";
		return [
			{
				label: "Land Area",
				value:
					listing.availableLandSpace && listing.availableLandSpaceUnit
						? `${listing.availableLandSpace} ${listing.availableLandSpaceUnit}`
						: "-",
			},
			{
				label: "Unit Price",
				value:
					toNumber(listing.pricePerUnit) !== null
						? `₹${formatIndianCurrency(Number(listing.pricePerUnit))} / ${unitLabel}`
						: "-",
			},
			{
				label: "Total Price",
				value:
					toNumber(listing.totalPrice) !== null
						? `₹${formatIndianCurrency(Number(listing.totalPrice))}`
						: listing.price
							? `₹${formatIndianCurrency(Number(listing.price))}`
							: "-",
			},
			{ label: "Locality", value: listing.wbLocalityLabel || "-" },
		];
	}

	if (listing.propertyCategory === "shop") {
		return [
			{
				label: "Shop Area",
				value: listing.shopArea ? `${listing.shopArea} sqft` : "-",
			},
			{ label: "Shutter", value: yesNo(listing.hasShutter) },
			{ label: "Furnishing", value: formatLabel(listing.furnishing) },
			{ label: "Locality", value: listing.wbLocalityLabel || "-" },
		];
	}

	return [
		{ label: "Bedrooms", value: String(listing.bedrooms ?? "-") },
		{ label: "Bathrooms", value: String(listing.bathrooms ?? "-") },
		{
			label: "Area",
			value: listing.builtUpArea ? `${listing.builtUpArea} sqft` : "-",
		},
		{ label: "Floor", value: String(listing.floor ?? "-") },
	];
};

export const buildRentSearchMetrics = (
	listing: IRentListingType,
): SearchCardMetric[] => {
	if (listing.propertyCategory === "shop") {
		return [
			{
				label: "Shop Area",
				value: listing.shopArea ? `${listing.shopArea} sqft` : "-",
			},
			{ label: "Shutter", value: yesNo(listing.hasShutter) },
			{ label: "Billing", value: formatLabel(listing.frequency) },
			{
				label: "Duration",
				value:
					listing.availableForDuration && listing.availableForDurationUnit
						? `${listing.availableForDuration} ${listing.availableForDurationUnit}${listing.availableForDuration > 1 ? "s" : ""}`
						: "-",
			},
		];
	}

	return [
		{ label: "Bedrooms", value: String(listing.bedrooms ?? "-") },
		{ label: "Bathrooms", value: String(listing.bathrooms ?? "-") },
		{
			label: "Area",
			value: listing.builtUpArea ? `${listing.builtUpArea} sqft` : "-",
		},
		{ label: "Billing", value: formatLabel(listing.frequency) },
	];
};
