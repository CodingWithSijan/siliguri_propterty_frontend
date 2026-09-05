import React, { useEffect, useState } from "react";
import Navbar from "../components/header_and_footer/Navbar";
import Footer from "../components/header_and_footer/Footer";
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
import { useSearchParams, useParams } from "react-router-dom";
import { IRentListingType } from "../types/listingTypes";
import BASE_URL from "../services";
import Breadcrumb from "../lib/Breadcrumb";

const RentalPropertyByCategory: React.FC = () => {
	const [posts, setPosts] = useState<IRentListingType[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const { category } = useParams<{ category: string }>();

	const currentPage = parseInt(searchParams.get("page") || "1");
	const getBreadcrumbItems = () => {
		if (!posts) return [];

		return [
			{ label: "For Rent", path: "/rentals" },
			{
				label: category?.toUpperCase() || "",
				path: `/rentals/${category}`,
			},
		];
	};

	useEffect(() => {
		const fetchPosts = async () => {
			if (!category) return;

			setLoading(true);
			try {
				const res = await BASE_URL.get(
					"api/user/post/rental-property-by-category",
					{
						params: { category, page: currentPage, limit: 8 },
					},
				);

				setPosts(res.data.rentalListingsByCategory || []);
				setTotalPages(res.data.totalPages || 1);
			} catch (err) {
				console.error("Error fetching posts", err);
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, [currentPage, category]);

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

	const getCategoryTitle = () => {
		if (!category) return "Rental Properties";
		return `${category.charAt(0).toUpperCase() + category.slice(1)} for Rent`;
	};

	return (
		<>
			<Navbar />
			<div className="bg-slate-50 min-h-screen">
				<div className="max-w-7xl mx-auto px-4 py-10">
					<Breadcrumb items={getBreadcrumbItems()} />
					<section className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h1 className="text-3xl font-bold text-slate-900">
									{getCategoryTitle()}
								</h1>
								<p className="mt-2 text-slate-600 max-w-2xl">
									Discover the best rental properties for {category} across Siliguri.
								</p>
							</div>
							<div className="rounded-3xl bg-blue-50 px-4 py-3 text-sm text-blue-700 font-medium">
								Comfortable rentals with flexible move-in options
							</div>
						</div>
					</section>
					<div className="max-w-3xl mx-auto mb-8 px-3 py-6 rounded-3xl bg-white shadow-inner shadow-slate-100 border border-slate-200">
						<p className="text-center text-slate-600">
							Easily compare neighborhoods, budgets, and amenities for the space you need.
						</p>
					</div>
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
									No {category || "rental"} properties found.
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
						{totalPages >= 1 && (
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
						)}
					</>
				)}
			</div>
			<Footer />
		</div>
		</>
	);
};

export default RentalPropertyByCategory;
