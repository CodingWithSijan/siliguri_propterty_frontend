import React, { useState, useEffect } from "react";
import axios from "axios";
import { showError } from "../../utils/toastUtils";
import ListingCard from "../../components/ListingCard"; // Reusable card component
import PostDetails from "../../components/PostDetails"; // Component for editing/deleting posts
import BASE_URL from "../../services";

const ViewYourListings: React.FC = () => {
	const [listings, setListings] = useState([]);
	const [selectedPost, setSelectedPost] = useState(null);
	const [loading, setLoading] = useState(false);

	// Fetch user listings
	useEffect(() => {
		try {
			const fetchListings = async () => {
				// setLoading(true);
				try {
					const response = await BASE_URL.get(
						"/api/users/post/view-your-listings"
					);
					console.log(response.data.postArray);

					setListings(response.data.postArray);
				} catch (error: any) {
					console.log("View Your Listings Error: ", error.message);
					showError("Failed to fetch your listings.");
				} finally {
					// setLoading(false);
				}
			};

			fetchListings();
		} catch (error: any) {
			console.log("View Your Listings Error: ", error.message);
			showError("Error Fetching Listings");
		}
	}, []);

	// Handle card click to view/edit/delete post
	const handleCardClick = (post: any) => {
		setSelectedPost(post);
	};

	// Handle back to listings
	const handleBack = () => {
		setSelectedPost(null);
	};

	return (
		<div className="max-w-7xl mx-auto p-6">
			{loading ? (
				<p className="text-center text-gray-500">Loading your listings...</p>
			) : selectedPost ? (
				<PostDetails post={selectedPost} onBack={handleBack} />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{listings.map((listing) => (
						<ListingCard
							key={listing._id}
							listing={listing}
							onClick={() => handleCardClick(listing)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ViewYourListings;
