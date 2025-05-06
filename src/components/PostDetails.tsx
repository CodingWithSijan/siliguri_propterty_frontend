import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";

const PostDetails: React.FC<{ post: any; onBack: () => void }> = ({
	post,
	onBack,
}) => {
	return (
		<div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
			<button onClick={onBack} className="text-blue-600 mb-4 hover:underline">
				← Back to Listings
			</button>
			<img
				src={post.pictures[0] || "https://via.placeholder.com/300"}
				alt={post.title}
				className="w-full h-64 object-cover rounded mb-4"
			/>
			<h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
			<p className="text-gray-700 mb-4">{post.description}</p>
			<div className="flex gap-4 text-sm text-gray-700 mb-2">
				<span className="flex items-center gap-1">
					<FaMapMarkerAlt className="text-red-500" /> {post.location}
				</span>
				<span className="flex items-center gap-1">
					<MdCurrencyRupee />{" "}
					{post.priceType === "negotiable"
						? `${post.priceRange.min} - ${post.priceRange.max}`
						: post.price}
				</span>
			</div>
			<div className="flex gap-4">
				<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
					Edit Post
				</button>
				<button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
					Delete Post
				</button>
			</div>
		</div>
	);
};

export default PostDetails;
