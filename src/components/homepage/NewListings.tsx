import React, { useEffect, useState } from "react";
import BASE_URL from "../../services";
import SellListingCard from "../card/SellListingCard";
import RentListingCard from "../card/RentListingCard";
import {
	IRentListingType,
	ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewListings: React.FC = () => {
	const [posts, setPosts] = useState<IUniversalListingType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [slidePercentage, setSlidePercentage] = useState(100);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				const response = await BASE_URL.get("api/user/post/view-latest-posts");
				setPosts(response.data.recentPosts);
			} catch {
				setError("Failed to fetch posts. Please try again later.");
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, []);

	useEffect(() => {
		const updateSlidePercentage = () => {
			const width = window.innerWidth;
			if (width >= 1480) setSlidePercentage(25); // 4 cards
			else if (width >= 1280) setSlidePercentage(33.33); // 3 cards
			else if (width >= 900) setSlidePercentage(50); // 2 cards
			else setSlidePercentage(100); // 1 card
		};
		updateSlidePercentage();
		window.addEventListener("resize", updateSlidePercentage);
		return () => window.removeEventListener("resize", updateSlidePercentage);
	}, []);

	if (loading)
		return (
			<div className="py-12 text-center text-gray-500">Loading posts...</div>
		);
	if (error)
		return <div className="py-12 text-center text-red-500">{error}</div>;

	// Custom arrow components
	const customArrow = (onClick: () => void, direction: "left" | "right") => (
		<button
			onClick={onClick}
			className={`absolute z-10 top-1/2 transform -translate-y-1/2 ${
				direction === "left" ? "left-2" : "right-2"
			} bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition`}
		>
			{direction === "left" ? (
				<ChevronLeft size={24} />
			) : (
				<ChevronRight size={24} />
			)}
		</button>
	);

	return (
		<section className="bg-white my-10 w-full mx-auto px-0 h-full">
			<h1 className="text-3xl font-extrabold text-center pt-8 text-blue-700 drop-shadow mb-2">
				New Properties
			</h1>
			<h3 className="text-center text-gray-600 text-lg mb-4">
				Discover our new listings
			</h3>

			<motion.div
				className="w-full mt-6 pt-6 px-2 md:px-8 lg:px-16 xl:px-32 flex justify-center"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="relative w-full max-w-[1600px]">
					<Carousel
						showArrows={true}
						autoPlay
						infiniteLoop
						transitionTime={2000}
						swipeable
						centerMode
						centerSlidePercentage={slidePercentage}
						renderArrowPrev={(onClick) => customArrow(onClick, "left")}
						renderArrowNext={(onClick) => customArrow(onClick, "right")}
						className="rounded-2xl bg-white py-6"
					>
						{posts && posts.map((post) => {
							switch (post.intent) {
								case "sell":
									return (
										<div
											key={post._id}
											className="px-2 md:px-4 h-full flex items-stretch"
										>
											<SellListingCard
												listing={post as ISellListingType}
												onClick={() => {}}
												userOrGlobal="global"
											/>
										</div>
									);
								case "rent":
									return (
										<div
											key={post._id}
											className="px-2 md:px-4 h-full flex items-stretch"
										>
											<RentListingCard
												listing={post as IRentListingType}
												onClick={() => {}}
												userOrGlobal="global"
											/>
										</div>
									);
								default:
									return null;
							}
						})}
					</Carousel>
				</div>
			</motion.div>
		</section>
	);
};

export default NewListings;
