import React, { useEffect, useState } from "react";
import BASE_URL from "../../services";
import ListingCard from "../../components/ListingCard";
import PostDetails from "../../components/PostDetails";
import { showError } from "../../utils/toastUtils";

const ViewYourListings = () => {
	const [listings, setListings] = useState<any[]>([]);
	const [selectedPost, setSelectedPost] = useState<any | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchListings = async () => {
			try {
				setLoading(true);
				const response = await BASE_URL.get(
					"/api/users/post/view-your-listings"
				);
				setListings(response.data.postArray);
			} catch (error: any) {
				showError("Failed to fetch listings");
			} finally {
				setLoading(false);
			}
		};
		fetchListings();
	}, []);

	return (
		<div className="max-w-7xl mx-auto px-4 py-6">
			{loading ? (
				<p className="text-center text-gray-500">Loading your listings...</p>
			) : selectedPost ? (
				<PostDetails post={selectedPost} onBack={() => setSelectedPost(null)} />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{listings.map((listing) => (
						<ListingCard
							key={listing._id}
							listing={listing}
							onClick={() => setSelectedPost(listing)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ViewYourListings;
