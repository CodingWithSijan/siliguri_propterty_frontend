import { ISellListingType } from "../types/listingTypes";

export const buildListingUrl = (listing: ISellListingType) => {
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	if (listing._id && listing.propertyCategory) {
		return `${origin}/buys/${listing.propertyCategory}/${listing._id}`;
	}
	return origin || "/";
};
