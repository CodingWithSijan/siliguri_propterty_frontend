import { useEffect, useState, useCallback } from "react";
import BASE_URL from "../services";

interface SiteStats {
	propertiesListed: number;
	totalUsers: number;
}

export const useSiteStats = () => {
	const [stats, setStats] = useState<SiteStats>({
		propertiesListed: 0,
		totalUsers: 0,
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchStats = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await BASE_URL.get("/api/user/post/hero-section-stats");
			// API returns overall listing and user counts for homepage stats.
			setStats({
				propertiesListed: response.data?.totalApprovedListing ?? 0,
				totalUsers:
					response.data?.totalUsers ?? response.data?.totalVerifiedUsers ?? 0,
			});
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to load stats";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return { stats, loading, error, refetch: fetchStats };
};
