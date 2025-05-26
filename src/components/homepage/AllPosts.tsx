import React, { useState, useEffect } from "react";
import ListingCard from "../card/ListingCard";
import BASE_URL from "../../services";
import PostDetails from "./PostDetails";
import { motion } from "framer-motion";

const AllPosts: React.FC = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedPost, setSelectedPost] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchPosts();
		console.log(posts);
	}, []);

	const fetchPosts = async () => {
		try {
			setLoading(true);
			const response = await BASE_URL.get("/global-post/all-posts");
			setPosts(response.data.posts);
		} catch (error) {
			setError("Failed to fetch posts. Please try again later.");
			console.error("Error fetching posts:", error);
		} finally {
			setLoading(false);
		}
	};

	if (selectedPost) {
		return (
			<PostDetails post={selectedPost} onBack={() => setSelectedPost(null)} />
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-3xl font-bold text-gray-900 mb-8 text-center"
			>
				Featured Properties
			</motion.h2>

			{loading ? (
				<div className="flex flex-col items-center justify-center py-12">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
					<p className="text-gray-600">Loading properties...</p>
				</div>
			) : error ? (
				<div className="text-center py-12">
					<div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
						{error}
					</div>
				</div>
			) : posts.length === 0 ? (
				<div className="text-center py-12">
					<div className="bg-gray-50 text-gray-600 p-8 rounded-xl">
						<h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
						<p>Be the first to list a property!</p>
					</div>
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
				>
					{posts.map((post, index) => (
						<motion.div
							key={post._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<ListingCard
								listing={post}
								onClick={() => setSelectedPost(post)}
							/>
						</motion.div>
					))}
				</motion.div>
			)}
		</div>
	);
};

export default AllPosts;
