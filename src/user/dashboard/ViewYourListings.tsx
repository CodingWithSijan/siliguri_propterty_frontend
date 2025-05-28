import { useEffect, useState } from "react";
import BASE_URL from "../../services";
import ListingCard from "../../components/card/ListingCard";
import PostDetails from "../../components/homepage/PostDetails";
import { showError } from "../../utils/toastUtils";
import SellListingCard from "../../components/card/SellListingCard";
import RentListingCard from "../../components/card/RentListingCard";
import BuyListingCard from "../../components/card/BuyListingCard";
import { ListingType } from "../../types/listingTypes";

const ViewYourListings = () => {
	const [listings, setListings] = useState<ListingType[]>([]);
	const [selectedPost, setSelectedPost] = useState<ListingType | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchListings = async () => {
			try {
				setLoading(true);
				const response = await BASE_URL.get(
					"/api/user/post/view-your-listings"
				);
				setListings(response.data.postArray);
				console.log(response.data.postArray);
			} catch {
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
					{listings.map((listing) => {
						switch (listing.intent?.toLowerCase()) {
							case "sell":
								return (
									<SellListingCard
										key={listing._id}
										listing={listing}
										onClick={() => setSelectedPost(listing)}
									/>
								);
							case "rent":
								return (
									<RentListingCard
										key={listing._id}
										listing={listing}
										onClick={() => setSelectedPost(listing)}
									/>
								);
							case "buy":
								return (
									<BuyListingCard
										key={listing._id}
										listing={listing}
										onClick={() => setSelectedPost(listing)}
									/>
								);
							default:
								return (
									<ListingCard
										key={listing._id}
										listing={listing}
										onClick={() => setSelectedPost(listing)}
									/>
								);
						}
					})}
				</div>
			)}
		</div>
	);
};

export default ViewYourListings;
