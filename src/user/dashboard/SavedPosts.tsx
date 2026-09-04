import React, { useEffect, useState } from "react";
import BASE_URL from "../../services";
import type {
	IRentListingType,
	ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import RentListingCard from "../../components/card/RentListingCard";
import SellListingCard from "../../components/card/SellListingCard";
import { showError } from "../../utils/toastUtils";

const SavedPosts: React.FC = () => {
	const [savedPosts, setSavedPosts] = useState<IUniversalListingType[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchSavedPosts = async () => {
			try {
				setLoading(true);
				const response = await BASE_URL.get("/api/users/saved-posts");
				setSavedPosts(response.data.postArray ?? []);
			} catch {
				showError("Failed to load saved posts");
				setSavedPosts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchSavedPosts();
	}, []);

	return (
		<div className="mx-auto w-full max-w-7xl px-2 py-4 md:px-4 md:py-6">
			<div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
				<h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
					Saved Posts
				</h1>
				<p className="mt-1 text-sm text-slate-600">
					All properties you bookmarked for quick access.
				</p>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<div
							key={index}
							className="h-72 animate-pulse rounded-xl bg-slate-200"
						/>
					))}
				</div>
			) : savedPosts.length === 0 ? (
				<div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
					No saved posts yet. Tap the heart icon on any listing to save it.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{savedPosts.map((post) =>
						post.intent === "rent" ? (
							<RentListingCard
								key={post._id}
								listing={post as IRentListingType}
								userOrGlobal="global"
							/>
						) : (
							<SellListingCard
								key={post._id}
								listing={post as ISellListingType}
								userOrGlobal="global"
							/>
						),
					)}
				</div>
			)}
		</div>
	);
};

export default SavedPosts;
