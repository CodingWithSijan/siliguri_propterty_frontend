import React, { useEffect, useState } from "react";
import BASE_URL from "../services";
import ListingCard from "./ListingCard";
import { showError } from "../utils/toastUtils";

interface ListingType {
	_id: string;
	title: string;
	description: string;
	location: string;
	price: string;
	priceType: "negotiable" | "fixed";
	priceRange?: { min: string; max: string };
	pictures: string[];
	propertyCategory: string;
	intent: string;
	duration?: string;
	createdAt: Date;
}

const AllPosts: React.FC = () => {
	const [posts, setPosts] = useState<ListingType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const response = await BASE_URL.get("/global-post/all-posts");
				console.log(response.data.posts);
				setPosts(response.data.posts);
			} catch (error) {
				showError("Failed to fetch posts.");
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	return (
		<div className="max-w-7xl mx-auto px-4 py-6">
			<h2 className="text-2xl font-bold text-center mb-6">
				Explore Properties
			</h2>
			{loading ? (
				<p className="text-center text-gray-500">Loading posts...</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{posts.map((post) => (
						<ListingCard
							key={post._id}
							listing={post}
							onClick={() => console.log(`Clicked on post: ${post.title}`)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default AllPosts;
