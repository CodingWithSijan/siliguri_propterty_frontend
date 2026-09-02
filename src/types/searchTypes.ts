import type { ListingIntentFilter, ListingSort } from "../utils/listingSearch";

export interface IListingSearchState {
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
	page: number;
}
