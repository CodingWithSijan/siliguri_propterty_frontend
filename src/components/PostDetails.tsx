import React, { useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const PostDetails: React.FC<{ post: any; onBack: () => void }> = ({
	post,
	onBack,
}) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	return (
		<div className="max-w-4xl mx-auto p-6">
			<button
				onClick={onBack}
				className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
			>
				<FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
				<span>Back to Listings</span>
			</button>

			<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
				{/* Image Gallery */}
				<div className="relative aspect-video bg-gray-100">
					<img
						src={
							post.pictures[currentImageIndex] ||
							"https://via.placeholder.com/800x400"
						}
						alt={post.title}
						className="w-full h-full object-cover"
					/>

					{/* Thumbnails */}
					{post.pictures.length > 1 && (
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/30 backdrop-blur-sm rounded-full">
							{post.pictures.map((pic: string, idx: number) => (
								<button
									key={idx}
									onClick={() => setCurrentImageIndex(idx)}
									className={`w-2 h-2 rounded-full transition-colors ${
										idx === currentImageIndex ? "bg-white" : "bg-white/50"
									}`}
								/>
							))}
						</div>
					)}
				</div>

				<div className="p-6">
					<div className="flex flex-wrap gap-4 items-start justify-between mb-6">
						<h1 className="text-2xl md:text-3xl font-bold text-gray-800">
							{post.title}
						</h1>
						<div className="flex items-center text-2xl font-bold text-green-600">
							<MdCurrencyRupee className="text-3xl" />
							<span>{post.price}</span>
							{post.priceType === "negotiable" && (
								<span className="text-sm font-normal ml-2 text-gray-500">
									(Negotiable)
								</span>
							)}
						</div>
					</div>

					<div className="grid gap-6 mb-8">
						<div className="flex items-center gap-2 text-gray-600">
							<FaMapMarkerAlt className="text-red-500" />
							<span>{post.location}</span>
						</div>

						<div className="flex items-center gap-2 text-gray-600">
							<FaCalendarAlt className="text-blue-500" />
							<span>
								Posted on {new Date(post.createdAt).toLocaleDateString()}
							</span>
						</div>

						<div className="flex flex-wrap gap-2">
							<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
								{post.propertyCategory}
							</span>
							<span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
								{post.intent}
							</span>
							{post.duration && (
								<span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
									{post.duration}
								</span>
							)}
						</div>
					</div>

					<div className="prose max-w-none">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Description
						</h2>
						<p className="text-gray-600 whitespace-pre-line">
							{post.description}
						</p>
					</div>

					<div className="mt-8 pt-6 border-t border-gray-100">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Contact Owner
						</motion.button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostDetails;
