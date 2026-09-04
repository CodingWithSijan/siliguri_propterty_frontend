import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "../components/header_and_footer/Navbar";
import Breadcrumb from "../lib/Breadcrumb";
import BASE_URL from "../services";
import type {
	IRentListingType,
	ISellListingType,
	IUniversalListingType,
} from "../types/listingTypes";
import type { IListingSearchState } from "../types/searchTypes";
import {
	applyListingFilters,
	type IListingSearchFilters,
} from "../utils/listingSearch";
import { isWithinWestBengal, type IGeoPoint } from "../utils/geo";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../components/ui/pagination";
import RentListingCard from "../components/card/RentListingCard";
import SellListingCard from "../components/card/SellListingCard";
import ListingSearchPanel from "../components/listings/ListingSearchPanel";
import {
	resolveWestBengalLocationKey,
	WEST_BENGAL_LOCATIONS,
} from "../constants/westBengalLocations";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "../components/ui/sheet";
import { showError, showInfo } from "../utils/toastUtils";

interface AllListingsProps {
	forcedIntent?: "rent" | "sell";
	forcedCategory?: "house" | "flat" | "shop" | "land";
	title?: string;
}
const RECENT_SEARCHES_KEY = "sp_recent_searches";

const ITEMS_PER_PAGE = 8;

const parseNumber = (value: string | null): number | null => {
	if (!value) return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
};

const parsePage = (value: string | null): number => {
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		return 1;
	}
	return Math.floor(parsed);
};

const toStateFromParams = (
	searchParams: URLSearchParams,
	forcedIntent?: "rent" | "sell",
	forcedCategory?: "house" | "flat" | "shop" | "land",
): IListingSearchState => {
	const intent =
		forcedIntent ??
		(searchParams.get("intent") as "rent" | "sell" | "all" | null) ??
		"all";
	const category =
		forcedCategory ??
		(searchParams.get("category") as
			| "all"
			| "house"
			| "flat"
			| "shop"
			| "land"
			| null) ??
		"all";

	return {
		query: searchParams.get("q") ?? "",
		intent,
		category,
		minPrice: parseNumber(searchParams.get("minPrice")),
		maxPrice: parseNumber(searchParams.get("maxPrice")),
		locationKey: searchParams.get("location") ?? "",
		sortBy:
			(searchParams.get("sort") as
				| "newest"
				| "priceLow"
				| "priceHigh"
				| "nearest"
				| null) ?? "newest",
		lat: parseNumber(searchParams.get("lat")),
		lng: parseNumber(searchParams.get("lng")),
		radiusKm: parseNumber(searchParams.get("radiusKm")) ?? 12,
		page: parsePage(searchParams.get("page")),
	};
};

const stateToSearchParams = (state: IListingSearchState): URLSearchParams => {
	const params = new URLSearchParams();
	if (state.query) params.set("q", state.query);
	if (state.intent !== "all") params.set("intent", state.intent);
	if (state.category !== "all") params.set("category", state.category);
	if (state.minPrice !== null) params.set("minPrice", String(state.minPrice));
	if (state.maxPrice !== null) params.set("maxPrice", String(state.maxPrice));
	if (state.locationKey) params.set("location", state.locationKey);
	if (state.sortBy !== "newest") params.set("sort", state.sortBy);
	if (state.lat !== null && state.lng !== null) {
		params.set("lat", String(state.lat));
		params.set("lng", String(state.lng));
		params.set("radiusKm", String(state.radiusKm));
	}
	if (state.page > 1) params.set("page", String(state.page));
	return params;
};

const buildBreadcrumbItems = (state: IListingSearchState) => {
	const items: { label: string; path: string }[] = [
		{ label: "Properties", path: "/properties" },
	];

	if (state.intent === "rent") {
		items.push({ label: "For Rent", path: "/properties?intent=rent" });
	}

	if (state.intent === "sell") {
		items.push({ label: "For Sale", path: "/properties?intent=sell" });
	}

	if (state.category !== "all") {
		items.push({
			label: `${state.category.charAt(0).toUpperCase()}${state.category.slice(1)}`,
			path: `/properties?${stateToSearchParams({ ...state, page: 1 }).toString()}`,
		});
	}

	return items;
};

const LOCATION_LABEL_MAP = Object.fromEntries(
	WEST_BENGAL_LOCATIONS.map((location) => [location.value, location.label]),
) as Record<string, string>;

const formatRecentSearchLabel = (params: string): string => {
	const parsed = new URLSearchParams(params);
	const parts: string[] = [];

	const query = parsed.get("q");
	if (query) {
		parts.push(`Keyword: ${query}`);
	}

	const intent = parsed.get("intent");
	if (intent === "rent") parts.push("For Rent");
	if (intent === "sell") parts.push("For Sale");

	const category = parsed.get("category");
	if (category) {
		parts.push(`Type: ${category.charAt(0).toUpperCase()}${category.slice(1)}`);
	}

	const location = parsed.get("location");
	if (location) {
		const resolvedKey = resolveWestBengalLocationKey(location);
		parts.push(`Area: ${LOCATION_LABEL_MAP[resolvedKey] ?? location}`);
	}

	const minPrice = parsed.get("minPrice");
	if (minPrice) {
		parts.push(`Min ₹${Number(minPrice).toLocaleString()}`);
	}

	const maxPrice = parsed.get("maxPrice");
	if (maxPrice) {
		parts.push(`Max ₹${Number(maxPrice).toLocaleString()}`);
	}

	const lat = parsed.get("lat");
	if (lat) {
		parts.push("Near Me");
	}

	return parts.length > 0 ? parts.join(" • ") : "Recent Search";
};

const AllListings: React.FC<AllListingsProps> = ({
	forcedIntent,
	forcedCategory,
	title,
}) => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [allPosts, setAllPosts] = useState<IUniversalListingType[]>([]);
	const [loading, setLoading] = useState(false);
	const [geoLoading, setGeoLoading] = useState(false);
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
	const [desktopFilterVisible, setDesktopFilterVisible] = useState(true);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);

	const state = useMemo(
		() => toStateFromParams(searchParams, forcedIntent, forcedCategory),
		[forcedCategory, forcedIntent, searchParams],
	);

	useEffect(() => {
		try {
			const recentRaw = localStorage.getItem(RECENT_SEARCHES_KEY);
			if (recentRaw) {
				setRecentSearches(JSON.parse(recentRaw) as string[]);
			}
		} catch {
			setRecentSearches([]);
		}
	}, []);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const res = await BASE_URL.get(
					"/api/user/post/view-all-approved-posts",
				);
				setAllPosts((res.data.postArray ?? []) as IUniversalListingType[]);
			} catch {
				showError("Failed to load listings. Please try again.");
				setAllPosts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	useEffect(() => {
		const paramsString = stateToSearchParams(state).toString();
		const hasActiveSearch =
			paramsString.length > 0 &&
			(state.query.length > 0 ||
				state.locationKey.length > 0 ||
				state.minPrice !== null ||
				state.maxPrice !== null ||
				state.intent !== "all" ||
				state.category !== "all" ||
				state.lat !== null);

		if (!hasActiveSearch) {
			return;
		}

		setRecentSearches((prev) => {
			const next = [
				paramsString,
				...prev.filter((item) => item !== paramsString),
			].slice(0, 6);
			localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
			return next;
		});
	}, [state]);

	const searchFilters = useMemo<IListingSearchFilters>(
		() => ({
			query: state.query,
			intent: forcedIntent ?? state.intent,
			category: forcedCategory ?? state.category,
			minPrice: state.minPrice,
			maxPrice: state.maxPrice,
			locationKey: state.locationKey,
			sortBy: state.sortBy,
			lat: state.lat,
			lng: state.lng,
			radiusKm: state.radiusKm,
		}),
		[
			forcedCategory,
			forcedIntent,
			state.category,
			state.intent,
			state.lat,
			state.lng,
			state.locationKey,
			state.maxPrice,
			state.minPrice,
			state.query,
			state.radiusKm,
			state.sortBy,
		],
	);

	const filteredPosts = useMemo(
		() => applyListingFilters(allPosts, searchFilters),
		[allPosts, searchFilters],
	);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredPosts.length / ITEMS_PER_PAGE),
	);
	const currentPage = Math.min(state.page, totalPages);

	useEffect(() => {
		if (state.page > totalPages) {
			const nextState = { ...state, page: totalPages };
			setSearchParams(stateToSearchParams(nextState), { replace: true });
		}
	}, [setSearchParams, state, totalPages]);

	const paginatedPosts = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
	}, [currentPage, filteredPosts]);

	const updateState = (patch: Partial<IListingSearchState>) => {
		const nextState: IListingSearchState = {
			...state,
			...patch,
			intent: forcedIntent ?? patch.intent ?? state.intent,
			category: forcedCategory ?? patch.category ?? state.category,
		};

		setSearchParams(stateToSearchParams(nextState));
	};

	const onUseCurrentLocation = () => {
		if (!navigator.geolocation) {
			showError("Geolocation is not available in this browser.");
			return;
		}

		setGeoLoading(true);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const point: IGeoPoint = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};

				if (!isWithinWestBengal(point)) {
					showError(
						"This platform currently supports geo-filtering inside Siliguri only.",
					);
					setGeoLoading(false);
					return;
				}

				showInfo("Geo-filter applied based on your current location.");
				updateState({
					lat: point.lat,
					lng: point.lng,
					sortBy: "nearest",
					page: 1,
				});
				setGeoLoading(false);
			},
			() => {
				showError(
					"Unable to access your location. Please allow location permission.",
				);
				setGeoLoading(false);
			},
			{ enableHighAccuracy: true, timeout: 10000 },
		);
	};

	const onClearGeoFilter = () => {
		updateState({ lat: null, lng: null, sortBy: "newest", page: 1 });
	};

	const onResetFilters = () => {
		const resetState: IListingSearchState = {
			query: "",
			intent: forcedIntent ?? "all",
			category: forcedCategory ?? "all",
			minPrice: null,
			maxPrice: null,
			locationKey: "",
			sortBy: "newest",
			lat: null,
			lng: null,
			radiusKm: 12,
			page: 1,
		};
		setSearchParams(stateToSearchParams(resetState));
	};

	const applySearchQuery = (params: string) => {
		setSearchParams(new URLSearchParams(params));
	};

	const goToPage = (page: number) => {
		if (page < 1 || page > totalPages) {
			return;
		}
		updateState({ page });
	};

	const renderPageLinks = () => {
		const pages: (number | "...")[] = [];
		const range = (start: number, end: number) =>
			Array.from({ length: end - start + 1 }, (_, index) => start + index);

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
						href="#"
						isActive={page === currentPage}
						size="default"
						onClick={(event) => {
							event.preventDefault();
							goToPage(Number(page));
						}}
					>
						{page}
					</PaginationLink>
				</PaginationItem>
			);
		});
	};

	const heading = title ?? "All Properties";
	const breadcrumbItems = buildBreadcrumbItems({ ...state, page: 1 });

	return (
		<>
			<Navbar />
			<Breadcrumb items={breadcrumbItems} />
			<main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
				<header className="mb-6 flex flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
							{heading}
						</h1>
						<p className="mt-1 text-sm text-slate-600 md:text-base">
							{filteredPosts.length} properties match your current filters.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setMobileFilterOpen(true)}
							className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:hidden"
						>
							<SlidersHorizontal className="h-4 w-4" />
							Filters
						</button>
						<button
							type="button"
							onClick={() => setDesktopFilterVisible((prev) => !prev)}
							className="hidden items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:inline-flex"
						>
							<SlidersHorizontal className="h-4 w-4" />
							{desktopFilterVisible ? "Hide Filters" : "Show Filters"}
						</button>
					</div>
				</header>

				<Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
					<SheetContent
						side="left"
						className="w-full max-w-[92vw] overflow-y-auto sm:max-w-md"
					>
						<SheetHeader>
							<SheetTitle>Search Filters</SheetTitle>
							<SheetDescription>
								Refine listings by intent, type, price, area, and geo distance.
							</SheetDescription>
						</SheetHeader>
						<div className="px-2 pb-6">
							<ListingSearchPanel
								state={state}
								onChange={updateState}
								onUseCurrentLocation={onUseCurrentLocation}
								onClearGeoFilter={onClearGeoFilter}
								onReset={onResetFilters}
								geoLoading={geoLoading}
								lockIntent={forcedIntent}
								lockCategory={forcedCategory}
								layout="full"
							/>
						</div>
					</SheetContent>
				</Sheet>

				{recentSearches.length > 0 && (
					<section className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
						<h3 className="mb-2 text-sm font-semibold text-slate-700">
							Recent Searches
						</h3>
						<div className="flex flex-wrap gap-2">
							{recentSearches.map((params) => (
								<button
									key={params}
									type="button"
									onClick={() => applySearchQuery(params)}
									className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
									title={params}
								>
									{formatRecentSearchLabel(params)}
								</button>
							))}
						</div>
					</section>
				)}

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
					{desktopFilterVisible ? (
						<aside className="hidden lg:block lg:sticky lg:top-20">
							<ListingSearchPanel
								state={state}
								onChange={updateState}
								onUseCurrentLocation={onUseCurrentLocation}
								onClearGeoFilter={onClearGeoFilter}
								onReset={onResetFilters}
								geoLoading={geoLoading}
								lockIntent={forcedIntent}
								lockCategory={forcedCategory}
								layout="sidebar"
							/>
						</aside>
					) : (
						<div className="hidden lg:block" />
					)}

					<div>
						{loading ? (
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{Array.from({ length: 8 }).map((_, index) => (
									<div
										key={index}
										className="h-72 animate-pulse rounded-xl bg-slate-200"
									/>
								))}
							</div>
						) : (
							<>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
									{paginatedPosts.length === 0 ? (
										<div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
											No properties found. Adjust filters and try again.
										</div>
									) : (
										paginatedPosts.map((post) => (
											<div key={post._id} className="h-full">
												{post.intent === "rent" ? (
													<RentListingCard
														listing={post as IRentListingType}
														userOrGlobal="global"
													/>
												) : (
													<SellListingCard
														listing={post as ISellListingType}
														onClick={() =>
															navigate(
																`/buys/${post.propertyCategory}/${post._id}`,
															)
														}
														userOrGlobal="global"
													/>
												)}
											</div>
										))
									)}
								</div>

								{totalPages > 1 && (
									<div className="mt-8 flex justify-center">
										<Pagination>
											<PaginationContent>
												<PaginationItem>
													<PaginationPrevious
														href="#"
														size="default"
														onClick={(event) => {
															event.preventDefault();
															goToPage(currentPage - 1);
														}}
													/>
												</PaginationItem>
												{renderPageLinks()}
												<PaginationItem>
													<PaginationNext
														href="#"
														size="default"
														onClick={(event) => {
															event.preventDefault();
															goToPage(currentPage + 1);
														}}
													/>
												</PaginationItem>
											</PaginationContent>
										</Pagination>
									</div>
								)}
							</>
						)}
					</div>
				</div>

				<button
					type="button"
					onClick={() => setMobileFilterOpen(true)}
					className="fixed bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 lg:hidden"
				>
					<SlidersHorizontal className="h-4 w-4" />
					Filters
				</button>
			</main>
		</>
	);
};

export default AllListings;
