import { useState, useEffect, useCallback } from "react";
import BASE_URL from "../services";
import { IUniversalListingType } from "../types/listingTypes";

interface UseListingsReturn {
	listings: IUniversalListingType[] | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export const useListings = (): UseListingsReturn => {
	const [listings, setListings] = useState<IUniversalListingType[] | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchListings = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await BASE_URL.get("/api/user/post/view-your-listings");
			setListings(response.data.postArray);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch listings";
			setError(errorMessage);
			setListings([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchListings();
	}, [fetchListings]);

	return { listings, loading, error, refetch: fetchListings };
};
