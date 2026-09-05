import {
	resolveWestBengalLocationKey,
	WEST_BENGAL_LOCATION_MAP,
	type IWestBengalLocation,
} from "../constants/westBengalLocations";
import type { IUniversalListingType } from "../types/listingTypes";
import { getDistanceKm, type IGeoPoint } from "./geo";

export type ListingIntentFilter = "all" | "rent" | "sell";
export type ListingSort = "newest" | "priceLow" | "priceHigh" | "nearest";

export interface IListingSearchFilters {
	query: string;
	intent: ListingIntentFilter;
	category: "all" | "house" | "flat" | "shop" | "land";
	minPrice: number | null;
	maxPrice: number | null;
	locationKey: string;
	sortBy: ListingSort;
	lat: number | null;
	lng: number | null;
	radiusKm: number;
}

const toNumber = (value: unknown): number | null => {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === "string") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}

	return null;
};

export const getListingPrice = (
	listing: IUniversalListingType,
): number | null => {
	if ("pricePerFrequency" in listing) {
		return toNumber(listing.pricePerFrequency);
	}

	return (
		("totalPrice" in listing ? toNumber(listing.totalPrice) : null) ??
		("price" in listing ? toNumber(listing.price) : null) ??
		("pricePerUnit" in listing ? toNumber(listing.pricePerUnit) : null)
	);
};

export const getListingLatLng = (
	listing: IUniversalListingType,
): IGeoPoint | null => {
	const coordinates = listing.coordinates?.coordinates;
	if (!coordinates || coordinates.length !== 2) {
		return null;
	}

	const lng = toNumber(coordinates[0]);
	const lat = toNumber(coordinates[1]);

	if (lat === null || lng === null) {
		return null;
	}

	return { lat, lng };
};

const includesText = (value: string | undefined, query: string): boolean => {
	if (!value) return false;
	return value.toLowerCase().includes(query);
};

const matchesLocationText = (
	listing: IUniversalListingType,
	location: IWestBengalLocation,
): boolean => {
	const normalizedTerms = [location.label, ...location.aliases].map((term) =>
		term.toLowerCase(),
	);

	return normalizedTerms.some(
		(term) =>
			includesText(listing.location, term) ||
			includesText(listing.alternateLocation, term),
	);
};

export const applyListingFilters = (
	listings: IUniversalListingType[],
	filters: IListingSearchFilters,
): IUniversalListingType[] => {
	const sanitizedQuery = filters.query.trim().toLowerCase();
	const hasGeoCenter = filters.lat !== null && filters.lng !== null;

	const filtered = listings.filter((listing) => {
		if (filters.intent !== "all" && listing.intent !== filters.intent) {
			return false;
		}

		if (
			filters.category !== "all" &&
			listing.propertyCategory !== filters.category
		) {
			return false;
		}

		if (sanitizedQuery) {
			const match =
				includesText(listing.title, sanitizedQuery) ||
				includesText(listing.location, sanitizedQuery) ||
				includesText(listing.alternateLocation, sanitizedQuery);
			if (!match) {
				return false;
			}
		}

		const price = getListingPrice(listing);
		if (
			filters.minPrice !== null &&
			(price === null || price < filters.minPrice)
		) {
			return false;
		}
		if (
			filters.maxPrice !== null &&
			(price === null || price > filters.maxPrice)
		) {
			return false;
		}

		if (filters.locationKey) {
			const normalizedLocationKey = resolveWestBengalLocationKey(
				filters.locationKey,
			);
			const selectedLocation = WEST_BENGAL_LOCATION_MAP[normalizedLocationKey];
			if (selectedLocation) {
				const listingLocalityKey = listing.wbLocalityKey
					? resolveWestBengalLocationKey(listing.wbLocalityKey)
					: "";
				const hasExactLocalityMatch =
					listingLocalityKey === selectedLocation.value;

				const listingCoords = getListingLatLng(listing);
				if (listingCoords && !hasExactLocalityMatch) {
					const hasTextFallbackMatch = matchesLocationText(
						listing,
						selectedLocation,
					);
					const distance = getDistanceKm(listingCoords, {
						lat: selectedLocation.lat,
						lng: selectedLocation.lng,
					});
					if (distance > selectedLocation.radiusKm && !hasTextFallbackMatch) {
						return false;
					}
				} else if (
					!listingCoords &&
					!matchesLocationText(listing, selectedLocation)
				) {
					return false;
				}
			}
		}

		if (hasGeoCenter) {
			const listingCoords = getListingLatLng(listing);
			if (!listingCoords) {
				return false;
			}
			const distance = getDistanceKm(listingCoords, {
				lat: filters.lat as number,
				lng: filters.lng as number,
			});
			if (distance > filters.radiusKm) {
				return false;
			}
		}

		return true;
	});

	const sorted = [...filtered].sort((a, b) => {
		if (filters.sortBy === "newest") {
			const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
			const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
			return bTime - aTime;
		}

		if (filters.sortBy === "priceLow" || filters.sortBy === "priceHigh") {
			const aPrice = getListingPrice(a) ?? Number.MAX_SAFE_INTEGER;
			const bPrice = getListingPrice(b) ?? Number.MAX_SAFE_INTEGER;
			return filters.sortBy === "priceLow" ? aPrice - bPrice : bPrice - aPrice;
		}

		if (filters.sortBy === "nearest" && hasGeoCenter) {
			const center = { lat: filters.lat as number, lng: filters.lng as number };
			const aCoords = getListingLatLng(a);
			const bCoords = getListingLatLng(b);
			const aDistance = aCoords
				? getDistanceKm(aCoords, center)
				: Number.MAX_SAFE_INTEGER;
			const bDistance = bCoords
				? getDistanceKm(bCoords, center)
				: Number.MAX_SAFE_INTEGER;
			return aDistance - bDistance;
		}

		return 0;
	});

	return sorted;
};
