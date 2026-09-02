import React, { useEffect, useState } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel";
import BASE_URL from "../../services";
import axios from "axios";
import {
	IUniversalListingType,
	IRentListingType,
	ISellListingType,
} from "../../types/listingTypes";
import RentListingCard from "../card/RentListingCard";
import SellListingCard from "../card/SellListingCard";
import Autoplay from "embla-carousel-autoplay";
import { FaHome } from "react-icons/fa";

const NewListings: React.FC = () => {
	const [latestPosts, setLatestPosts] = useState<IUniversalListingType[]>([]);

	useEffect(() => {
		const fetchLatest = async () => {
			try {
				const response = await BASE_URL.get("/api/user/post/view-latest-posts");
				setLatestPosts(response.data.recentPosts);
			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					console.error(
						"Error fetching latest posts:",
						error.response?.status,
						error.response?.data || error.message,
					);
				} else {
					console.error("Unexpected Error:", (error as Error).message);
				}
			}
		};
		fetchLatest();
	}, []);

	const plugin = React.useRef(
		Autoplay({ delay: 4000, stopOnInteraction: true }),
	);

	return (
		<section className="py-16 bg-gradient-to-br from-slate-50 via-white to-cyan-50">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
				{/* Enhanced Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
						<FaHome className="text-blue-600" />
						<span className="text-sm font-medium text-blue-700">
							Latest Properties
						</span>
					</div>

					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Newest{" "}
						<span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
							Properties
						</span>
					</h2>

					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Discover the latest property listings in Siliguri. Fresh
						opportunities updated daily.
					</p>
				</div>
				{/* Carousel Container with Enhanced Styling */}
				<div className="p-4 sm:p-4">
					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						plugins={[plugin.current]}
						className="w-full"
					>
						<CarouselContent>
							{latestPosts &&
								latestPosts.map((item) => (
									<CarouselItem
										key={item._id}
										className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-2 flex"
									>
										<div className="w-full h-full flex">
											{item.intent === "rent" ? (
												<RentListingCard
													listing={item as IRentListingType}
													userOrGlobal="global"
												/>
											) : (
												<SellListingCard
													listing={item as ISellListingType}
													userOrGlobal="global"
												/>
											)}
										</div>
									</CarouselItem>
								))}
						</CarouselContent>
						<div className="hidden sm:flex justify-between w-full absolute top-1/2 -translate-y-1/2 px-4">
							<CarouselPrevious className="-translate-x-2 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300" />
							<CarouselNext className="translate-x-2 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300" />
						</div>
					</Carousel>
				</div>
				{/* View All Properties Button
				{latestPosts && latestPosts.length > 0 && (
					<div className="text-center mt-12">
						<button
							onClick={() => navigate("/properties")}
							className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
						>
							<span>View All Properties</span>
							<FaArrowRight className="text-sm" />
						</button>
					</div>
				)} */}
			</div>
		</section>
	);
};

export default NewListings;
