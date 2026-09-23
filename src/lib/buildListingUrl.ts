import { IUniversalListingType } from "../types/listingTypes";

export const buildListingUrl = (listing: IUniversalListingType) => {
	const backendBase = String(import.meta.env.VITE_BACKEND_URL || "").replace(
		/\/$/,
		"",
	);

	if (listing._id && backendBase) {
		return `${backendBase}/api/user/post/share/${listing._id}`;
	}

	const origin = typeof window !== "undefined" ? window.location.origin : "";
	return origin || "/";
};
