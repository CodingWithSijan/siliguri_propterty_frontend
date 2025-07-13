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
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

const NewListings: React.FC = () => {
	const [latestPosts, setLatestPosts] = useState<IUniversalListingType[]>([]);
	const navigate = useNavigate();

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
						error.response?.data || error.message
					);
				} else {
					console.error("Unexpected Error:", (error as Error).message);
				}
			}
		};
		fetchLatest();
	}, []);

	const handleCardClick = (postId: string) => {
		navigate(`/post/${postId}`);
	};

	const plugin = React.useRef(
		Autoplay({ delay: 4000, stopOnInteraction: true })
	);

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-8">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				Latest Properties
			</h2>
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
								<div className="w-full h-full flex items-stretch">
									{item.intent === "rent" ? (
										<RentListingCard
											listing={item as IRentListingType}
											userOrGlobal="global"
										/>
									) : (
										<SellListingCard
											listing={item as ISellListingType}
											onClick={() => handleCardClick(item._id)}
											userOrGlobal="global"
										/>
									)}
								</div>
							</CarouselItem>
						))}
				</CarouselContent>
				<div className="hidden sm:flex justify-between w-full absolute top-1/2 -translate-y-1/2 px-4">
					<CarouselPrevious className="-translate-x-2" />
					<CarouselNext className="translate-x-2" />
				</div>
			</Carousel>
		</div>
	);
};

export default NewListings;
