import { ISellListingType } from "../types/listingTypes";

export const buildListingUrl = (listing: ISellListingType) => {
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	if (listing._id) return `${origin}/buys/${listing._id}`;
	return origin || "/";
};
