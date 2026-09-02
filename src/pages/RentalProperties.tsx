import React, { useEffect, useState } from "react";
import Navbar from "../components/header_and_footer/Navbar";
import RentListingCard from "../components/card/RentListingCard";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../components/ui/pagination";
import { useSearchParams } from "react-router-dom";
import { IRentListingType } from "../types/listingTypes";
import BASE_URL from "../services";
import Breadcrumb from "../lib/Breadcrumb";

const RentalProperties: React.FC = () => {
	const [posts, setPosts] = useState<IRentListingType[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = parseInt(searchParams.get("page") || "1");

	const getBreadcrumbItems = () => {
		if (!posts) return [];

		return [{ label: "For Rent", path: "/rentals" }];
	};

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const res = await BASE_URL.get("api/user/post/rental-properties", {
					params: { page: currentPage, limit: 8 },
				});
				setPosts(res.data.rentals || []);
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
			<Breadcrumb items={getBreadcrumbItems()} />
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6 text-gray-800">
					Rental Properties
				</h1>
				{loading ? (
					<div className="animate-pulse space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="h-56 bg-gray-200 rounded-md" />
							))}
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
									<RentListingCard
										key={post._id}
										listing={post}
										userOrGlobal="global"
									/>
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

export default RentalProperties;
