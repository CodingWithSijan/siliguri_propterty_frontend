import React, { useEffect, useState } from "react";
import Navbar from "../components/header_and_footer/Navbar";
import Footer from "../components/header_and_footer/Footer";
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
import { useSearchParams } from "react-router-dom";
import { ISellListingType } from "../types/listingTypes";
import BASE_URL from "../services";
import Breadcrumb from "../lib/Breadcrumb";
const SellProperties: React.FC = () => {
	const [posts, setPosts] = useState<ISellListingType[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = parseInt(searchParams.get("page") || "1");
	const getBreadcrumbItems = () => {
		if (!posts) return [];

		return [{ label: "For Sale", path: "/buys" }];
	};
	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);

			try {
				const res = await BASE_URL.get("api/user/post/sell-properties", {
					params: { page: currentPage, limit: 8 },
				});

				console.log(res.data.sells);

				setPosts(res.data.sells || []);
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
			<div className="bg-slate-50 min-h-screen">
				<div className="max-w-7xl mx-auto px-4 py-10">
					<section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h1 className="text-3xl font-bold text-slate-900">
									Premium properties for sale
								</h1>
								<p className="mt-2 text-slate-600 max-w-2xl">
									Browse top sale listings in Siliguri and find your ideal property with confidence.
								</p>
							</div>
							<div className="rounded-3xl bg-blue-50 px-4 py-3 text-sm text-blue-700 font-medium">
								Verified for sale listings
							</div>
						</div>
					</section>
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
									<SellListingCard
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
				<Footer />
			</div>
		</>
	);
};

export default SellProperties;
