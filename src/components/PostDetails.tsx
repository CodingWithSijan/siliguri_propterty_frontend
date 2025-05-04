import React from "react";
import { ListingType } from "./ListingCard";

const PostDetails: React.FC<{ post: ListingType; onBack: () => void }> = ({
	post,
	onBack,
}) => {
	return (
		<div className="bg-white shadow-md rounded-lg p-6">
			<button onClick={onBack} className="text-blue-600 hover:underline mb-4">
				← Back to Listings
			</button>
			<img
				src={post.pictures[0] || "https://via.placeholder.com/300"}
				alt={post.title}
				className="w-full h-60 object-cover rounded-md mb-4"
			/>
			<h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
			<p className="text-gray-600 mb-4">{post.description}</p>
			<div className="flex space-x-4">
				<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
					Edit Post
				</button>
				<button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
					Delete Post
				</button>
			</div>
		</div>
	);
};

export default PostDetails;
