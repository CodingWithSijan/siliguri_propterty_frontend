import React, { useEffect, useState } from "react";
import Navbar from "../components/header_and_footer/Navbar";
import RentListingCard from "../components/card/RentListingCard";
import SellListingCard from "../components/card/SellListingCard";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../components/ui/pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
	IUniversalListingType,
	IRentListingType,
	ISellListingType,
} from "../types/listingTypes";
import BASE_URL from "../services";
import { ClipLoader } from "react-spinners";

const loaderStyle: React.CSSProperties = {
	display: "block",
	margin: "40px auto",
	borderColor: "#2563eb",
};

const AllListings: React.FC = () => {
	const [posts, setPosts] = useState<IUniversalListingType[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const currentPage = parseInt(searchParams.get("page") || "1");

	const handleCardClick = (postId: string, intent: "rent" | "sell") => {
		if (intent === "rent") {
			navigate(`/rentals/${postId}`);
		} else {
			navigate(`/buys/${postId}`);
		}
	};

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const res = await BASE_URL.get("api/user/post/rent-sell-listings", {
					params: { page: currentPage, limit: 8 },
				});

				setPosts(res.data.listings || []);
				setTotalPages(res.data.totalPages || 1);
			} catch (err) {
				console.error("Error fetching posts", err);
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, [currentPage]);

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setSearchParams({ page: String(page) });
		}
	};

	const renderPageLinks = () => {
		const pages: (number | "...")[] = [];
		const range = (start: number, end: number) =>
			Array.from({ length: end - start + 1 }, (_, i) => start + i);
		if (totalPages <= 7) {
			pages.push(...range(1, totalPages));
		} else {
			pages.push(1);
			if (currentPage > 4) pages.push("...");
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);
			pages.push(...range(start, end));
			if (currentPage < totalPages - 3) pages.push("...");
			pages.push(totalPages);
		}
		return pages.map((page, index) => {
			if (page === "...") {
				return (
					<PaginationItem key={`ellipsis-${index}`}>
						<PaginationEllipsis />
					</PaginationItem>
				);
			}
			return (
				<PaginationItem key={page}>
					<PaginationLink
						href={`?page=${page}`}
						isActive={page === currentPage}
						size="default"
						onClick={(e) => {
							e.preventDefault();
							goToPage(Number(page));
						}}
					>
						{page}
					</PaginationLink>
				</PaginationItem>
			);
		});
	};

	return (
		<>
			<Navbar />
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6 text-gray-800">
					All Properties
				</h1>

				{loading ? (
					<div className="flex justify-center items-center min-h-[200px]">
						<ClipLoader
							cssOverride={loaderStyle}
							size={80}
							color={"#2563eb"}
							loading={loading}
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
							{posts.length === 0 ? (
								<div className="col-span-full text-center text-gray-500">
									No listing found.
								</div>
							) : (
								posts.map((post) => (
									<div key={post._id} className="h-full flex">
										{post.intent === "rent" ? (
											<div className="w-full">
												<RentListingCard
													listing={post as IRentListingType}
													userOrGlobal="global"
												/>
											</div>
										) : (
											<div className="w-full">
												<SellListingCard
													listing={post as ISellListingType}
													onClick={() => handleCardClick(post._id, "sell")}
													userOrGlobal="global"
												/>
											</div>
										)}
									</div>
								))
							)}
						</div>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href={`?page=${currentPage - 1}`}
										size="default"
										onClick={(e) => {
											e.preventDefault();
											goToPage(currentPage - 1);
										}}
									/>
								</PaginationItem>
								{renderPageLinks()}
								<PaginationItem>
									<PaginationNext
										href={`?page=${currentPage + 1}`}
										size="default"
										onClick={(e) => {
											e.preventDefault();
											goToPage(currentPage + 1);
										}}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</>
				)}
			</div>
		</>
	);
};

export default AllListings;
