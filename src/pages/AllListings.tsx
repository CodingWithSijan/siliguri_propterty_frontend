import React, { useEffect, useState } from "react";
import Navbar from "../components/header_and_footer/Navbar";
import Footer from "../components/header_and_footer/Footer";
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

const AllListings: React.FC = () => {
	const [posts, setPosts] = useState<IUniversalListingType[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const currentPage = parseInt(searchParams.get("page") || "1");

	const handleCardClick = (post: IUniversalListingType) => {
		if (post.intent === "rent") {
			navigate(`/rentals/${post.propertyCategory}/${post._id}`);
		} else {
			navigate(`/buys/${post.propertyCategory}/${post._id}`);
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
			<div className="bg-slate-50 min-h-screen">
				<div className="max-w-7xl mx-auto px-4 py-10">
					<section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h1 className="text-3xl font-bold text-slate-900">
									Explore all available properties
								</h1>
								<p className="mt-2 text-slate-600 max-w-2xl">
									Find the latest homes, rentals, and investment opportunities in Siliguri with a curated collection of up-to-date listings.
								</p>
							</div>
							<div className="rounded-3xl bg-blue-50 px-4 py-3 text-sm text-blue-700 font-medium">
								Filtered by newest listings first
							</div>
						</div>
					</section>
					<div className="max-w-3xl mx-auto mb-8 px-3 py-6 rounded-3xl bg-white shadow-inner shadow-slate-100 border border-slate-200">
						<p className="text-center text-slate-600">
							Browse confidently. Every listing includes updated photos, pricing, and property details to help you decide faster.
						</p>
					</div>
					{loading ? (
					<div className="container mx-auto px-4 py-12">
						<div className="space-y-4">
							<div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								<div className="h-56 bg-gray-200 rounded animate-pulse"></div>
								<div className="h-56 bg-gray-200 rounded animate-pulse"></div>
								<div className="h-56 bg-gray-200 rounded animate-pulse"></div>
							</div>
						</div>
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
													onClick={() => handleCardClick(post)}
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
				<Footer />
			</div>
			</>
	);
};

export default AllListings;
