import React, { useEffect, useState } from "react";
import BASE_URL from "../../services";
import SellListingCard from "../card/SellListingCard";
import RentListingCard from "../card/RentListingCard";
import BuyListingCard from "../card/BuyListingCard";
import { IUniversalListingType } from "../../types/listingTypes";
import { motion } from "framer-motion";
import {
	ISellListingType,
	IRentListingType,
	IBuyListingType,
} from "../../types/listingTypes";

const AllPostsHomepage: React.FC = () => {
	const [posts, setPosts] = useState<IUniversalListingType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				const response = await BASE_URL.get(
					"api/user/post/view-all-approved-posts"
				);
				setPosts(
					response.data.postsArray.filter(
						(p: IUniversalListingType) => p.approvalStatus === "approved"
					)
				);
			} catch {
				setError("Failed to fetch posts. Please try again later.");
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, []);

	if (loading) {
		return (
			<div className="py-12 text-center text-gray-500">Loading posts...</div>
		);
	}
	if (error) {
		return <div className="py-12 text-center text-red-500">{error}</div>;
	}

	return (
		<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{posts.map((post) => {
				switch (post.intent) {
					case "sell":
						return (
							<SellListingCard
								key={post._id}
								listing={post as ISellListingType}
								onClick={() => {}}
								userOrGlobal="global"
							/>
						);
					case "rent":
						return (
							<RentListingCard
								key={post._id}
								listing={post as IRentListingType}
								onClick={() => {}}
								userOrGlobal="global"
							/>
						);
					case "buy":
						return (
							<BuyListingCard
								key={post._id}
								listing={post as IBuyListingType}
								onClick={() => {}}
								userOrGlobal="global"
							/>
						);
					default:
						return null;
				}
			})}
		</motion.div>
	);
};

export default AllPostsHomepage;
