import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	ChevronDown,
	ChevronUp,
	LocateFixed,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import Navbar from "../components/header_and_footer/Navbar";
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
import { getDaysAgoFromObjectId } from "../utils/getDaysAgo";

interface AllListingsProps {
	forcedIntent?: "rent" | "sell";
	forcedCategory?: "house" | "flat" | "shop" | "land";
	title?: string;
}
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

const normalizeSearchState = (
	state: IListingSearchState,
	forcedIntent?: "rent" | "sell",
	forcedCategory?: "house" | "flat" | "shop" | "land",
): IListingSearchState => {
	const next: IListingSearchState = {
		...state,
		intent: forcedIntent ?? state.intent,
		category: forcedCategory ?? state.category,
	};

	if (next.intent === "rent" && next.category === "land") {
		next.category = "all";
	}

	if (next.minPrice !== null && next.minPrice < 0) {
		next.minPrice = 0;
	}

	if (next.maxPrice !== null && next.maxPrice < 0) {
		next.maxPrice = 0;
	}

	if (
		next.minPrice !== null &&
		next.maxPrice !== null &&
		next.minPrice > next.maxPrice
	) {
		const min = next.maxPrice;
		next.maxPrice = next.minPrice;
		next.minPrice = min;
	}

	const hasGeo = next.lat !== null && next.lng !== null;
	if (!hasGeo && next.sortBy === "nearest") {
		next.sortBy = "newest";
	}

	if (next.radiusKm < 1) {
		next.radiusKm = 1;
	}

	if (next.radiusKm > 60) {
		next.radiusKm = 60;
	}

	return next;
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

const LOCATION_LABEL_MAP = Object.fromEntries(
	WEST_BENGAL_LOCATIONS.map((location) => [location.value, location.label]),
) as Record<string, string>;

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
	const [mobileQuickFiltersExpanded, setMobileQuickFiltersExpanded] =
		useState(false);

	const state = useMemo(
		() => toStateFromParams(searchParams, forcedIntent, forcedCategory),
		[forcedCategory, forcedIntent, searchParams],
	);
	const normalizedState = useMemo(
		() => normalizeSearchState(state, forcedIntent, forcedCategory),
		[forcedCategory, forcedIntent, state],
	);
	const effectiveIntent = forcedIntent ?? state.intent;
	const categoryOptions =
		effectiveIntent === "rent"
			? [
					{ label: "All Types", value: "all" },
					{ label: "House", value: "house" },
					{ label: "Flat", value: "flat" },
					{ label: "Shop", value: "shop" },
				]
			: [
					{ label: "All Types", value: "all" },
					{ label: "House", value: "house" },
					{ label: "Flat", value: "flat" },
					{ label: "Shop", value: "shop" },
					{ label: "Land", value: "land" },
				];

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
		const currentParams = stateToSearchParams(state).toString();
		const normalizedParams = stateToSearchParams(normalizedState).toString();
		if (currentParams !== normalizedParams) {
			setSearchParams(stateToSearchParams(normalizedState), { replace: true });
		}
	}, [normalizedState, setSearchParams, state]);

	const searchFilters = useMemo<IListingSearchFilters>(
		() => ({
			query: normalizedState.query,
			intent: normalizedState.intent,
			category: normalizedState.category,
			minPrice: normalizedState.minPrice,
			maxPrice: normalizedState.maxPrice,
			locationKey: normalizedState.locationKey,
			sortBy: normalizedState.sortBy,
			lat: normalizedState.lat,
			lng: normalizedState.lng,
			radiusKm: normalizedState.radiusKm,
		}),
		[
			normalizedState.category,
			normalizedState.intent,
			normalizedState.lat,
			normalizedState.lng,
			normalizedState.locationKey,
			normalizedState.maxPrice,
			normalizedState.minPrice,
			normalizedState.query,
			normalizedState.radiusKm,
			normalizedState.sortBy,
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
	const currentPage = Math.min(normalizedState.page, totalPages);

	useEffect(() => {
		if (normalizedState.page > totalPages) {
			const nextState = { ...normalizedState, page: totalPages };
			setSearchParams(stateToSearchParams(nextState), { replace: true });
		}
	}, [normalizedState, setSearchParams, totalPages]);

	const paginatedPosts = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
	}, [currentPage, filteredPosts]);

	const updateState = (patch: Partial<IListingSearchState>) => {
		const nextState = normalizeSearchState(
			{
				...normalizedState,
				...patch,
				intent: forcedIntent ?? patch.intent ?? normalizedState.intent,
				category: forcedCategory ?? patch.category ?? normalizedState.category,
			},
			forcedIntent,
			forcedCategory,
		);

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
	const activeAreaLabel = normalizedState.locationKey
		? LOCATION_LABEL_MAP[
				resolveWestBengalLocationKey(normalizedState.locationKey)
			] || normalizedState.locationKey
		: "Siliguri";
	const contextualHeading =
		effectiveIntent === "rent"
			? `${filteredPosts.length} Properties for Rent in ${activeAreaLabel}`
			: effectiveIntent === "sell"
				? `${filteredPosts.length} Properties for Sale in ${activeAreaLabel}`
				: `${filteredPosts.length} Properties in ${activeAreaLabel}`;

	const activeFilterChips = [
		normalizedState.intent !== "all"
			? {
					key: "intent",
					label: normalizedState.intent === "sell" ? "Buy" : "Rent",
					onClear: () => updateState({ intent: "all", page: 1 }),
				}
			: null,
		normalizedState.category !== "all"
			? {
					key: "category",
					label: `Type: ${normalizedState.category}`,
					onClear: () => updateState({ category: "all", page: 1 }),
				}
			: null,
		normalizedState.locationKey
			? {
					key: "location",
					label: `Area: ${activeAreaLabel}`,
					onClear: () => updateState({ locationKey: "", page: 1 }),
				}
			: null,
		normalizedState.minPrice !== null
			? {
					key: "minPrice",
					label: `Min ₹${normalizedState.minPrice.toLocaleString("en-IN")}`,
					onClear: () => updateState({ minPrice: null, page: 1 }),
				}
			: null,
		normalizedState.maxPrice !== null
			? {
					key: "maxPrice",
					label: `Max ₹${normalizedState.maxPrice.toLocaleString("en-IN")}`,
					onClear: () => updateState({ maxPrice: null, page: 1 }),
				}
			: null,
		normalizedState.lat !== null && normalizedState.lng !== null
			? {
					key: "nearMe",
					label: `Near me (${normalizedState.radiusKm} km)`,
					onClear: onClearGeoFilter,
				}
			: null,
	].filter(Boolean) as Array<{
		key: string;
		label: string;
		onClear: () => void;
	}>;

	const quickBudgetPresets =
		effectiveIntent === "rent"
			? [
					{ label: "Under ₹10k", min: null, max: 10000 },
					{ label: "₹10k-₹25k", min: 10000, max: 25000 },
					{ label: "₹25k+", min: 25000, max: null },
				]
			: [
					{ label: "Under ₹25L", min: null, max: 2500000 },
					{ label: "₹25L-₹75L", min: 2500000, max: 7500000 },
					{ label: "₹75L+", min: 7500000, max: null },
				];

	const priceAnalytics = useMemo(() => {
		const prices = filteredPosts
			.map((item) => {
				if (item.intent === "rent") {
					return "pricePerFrequency" in item
						? Number(item.pricePerFrequency ?? NaN)
						: NaN;
				}
				if ("totalPrice" in item && item.totalPrice !== undefined) {
					return Number(item.totalPrice);
				}
				if ("price" in item && item.price !== undefined) {
					return Number(item.price);
				}
				if ("pricePerUnit" in item && item.pricePerUnit !== undefined) {
					return Number(item.pricePerUnit);
				}
				return NaN;
			})
			.filter((price) => Number.isFinite(price) && price > 0)
			.sort((a, b) => a - b);

		if (prices.length === 0) {
			return {
				median: "Not enough data",
				min: "Not enough data",
				max: "Not enough data",
			};
		}

		const middle = Math.floor(prices.length / 2);
		const medianRaw =
			prices.length % 2 === 0
				? Math.round((prices[middle - 1] + prices[middle]) / 2)
				: prices[middle];

		return {
			median: `₹${medianRaw.toLocaleString("en-IN")}`,
			min: `₹${prices[0].toLocaleString("en-IN")}`,
			max: `₹${prices[prices.length - 1].toLocaleString("en-IN")}`,
		};
	}, [filteredPosts]);

	const inventoryMix = useMemo(() => {
		const rentCount = filteredPosts.filter(
			(item) => item.intent === "rent",
		).length;
		const sellCount = filteredPosts.filter(
			(item) => item.intent === "sell",
		).length;
		const total = rentCount + sellCount;
		if (total === 0) {
			return "No active inventory";
		}
		const rentPct = Math.round((rentCount / total) * 100);
		const sellPct = 100 - rentPct;
		return `Buy ${sellPct}% • Rent ${rentPct}%`;
	}, [filteredPosts]);

	const topLocalities = useMemo(() => {
		const counts = filteredPosts.reduce<Record<string, number>>((acc, item) => {
			const key =
				item.wbLocalityLabel?.trim() || item.location?.trim() || "Unknown";
			acc[key] = (acc[key] ?? 0) + 1;
			return acc;
		}, {});

		return Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);
	}, [filteredPosts]);

	const listingAgeInsight = useMemo(() => {
		const ages = filteredPosts
			.map((item) => getDaysAgoFromObjectId(item._id))
			.filter((days): days is number => days !== null)
			.sort((a, b) => a - b);

		if (ages.length === 0) {
			return "Not enough listing age data";
		}

		const mid = Math.floor(ages.length / 2);
		const median =
			ages.length % 2 === 0
				? Math.round((ages[mid - 1] + ages[mid]) / 2)
				: ages[mid];

		if (median === 0) {
			return "Median listing age: Posted today";
		}

		return `Median listing age: ${median} day${median > 1 ? "s" : ""}`;
	}, [filteredPosts]);

	return (
		<>
			<Navbar />
			<section className="sticky top-[66px] z-30 border-y border-slate-200 bg-white/95 backdrop-blur md:top-[104px]">
				<div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-6">
					<div className="grid grid-cols-1 gap-2 md:hidden">
						<div className="grid grid-cols-[1fr_auto] gap-2">
							<div className="relative">
								<Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
								<input
									type="text"
									value={normalizedState.query}
									onChange={(event) =>
										updateState({ query: event.target.value, page: 1 })
									}
									placeholder="Search locality, landmark, title"
									className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
								/>
							</div>

							<button
								type="button"
								onClick={() => setMobileFilterOpen(true)}
								className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
							>
								<SlidersHorizontal className="h-4 w-4" />
								Filters
							</button>
						</div>

						<div className="flex items-center gap-2">
							{[
								{ label: "All", value: "all" },
								{ label: "Buy", value: "sell" },
								{ label: "Rent", value: "rent" },
							].map((intentOption) => {
								const active =
									(forcedIntent ?? normalizedState.intent) ===
									intentOption.value;
								return (
									<button
										key={intentOption.value}
										type="button"
										disabled={Boolean(forcedIntent)}
										onClick={() =>
											updateState({
												intent:
													intentOption.value as IListingSearchState["intent"],
												page: 1,
											})
										}
										className={`rounded-full border px-3 py-1 text-xs font-semibold ${
											active
												? "border-emerald-600 bg-emerald-600 text-white"
												: "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
										}`}
									>
										{intentOption.label}
									</button>
								);
							})}

							<button
								type="button"
								onClick={() =>
									setMobileQuickFiltersExpanded((current) => !current)
								}
								className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
							>
								More
								{mobileQuickFiltersExpanded ? (
									<ChevronUp className="h-3.5 w-3.5" />
								) : (
									<ChevronDown className="h-3.5 w-3.5" />
								)}
							</button>
						</div>

						{mobileQuickFiltersExpanded && (
							<div className="space-y-2 rounded-xl border border-slate-200 bg-white p-2.5">
								<div className="grid grid-cols-2 gap-2">
									<select
										value={normalizedState.locationKey}
										onChange={(event) =>
											updateState({ locationKey: event.target.value, page: 1 })
										}
										className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500"
									>
										<option value="">Any Area</option>
										{WEST_BENGAL_LOCATIONS.map((location) => (
											<option key={location.value} value={location.value}>
												{location.label}
											</option>
										))}
									</select>

									<select
										value={normalizedState.sortBy}
										onChange={(event) =>
											updateState({
												sortBy: event.target
													.value as IListingSearchState["sortBy"],
												page: 1,
											})
										}
										className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-900 outline-none focus:border-emerald-500"
									>
										<option value="newest">Newest First</option>
										<option value="priceLow">Price: Low to High</option>
										<option value="priceHigh">Price: High to Low</option>
										<option value="nearest">Nearest</option>
									</select>

									<button
										type="button"
										onClick={onUseCurrentLocation}
										disabled={geoLoading}
										className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
									>
										<LocateFixed className="h-3.5 w-3.5" />
										{geoLoading ? "Detecting..." : "Near Me"}
									</button>

									<button
										type="button"
										onClick={onResetFilters}
										className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
									>
										Clear all
									</button>
								</div>

								<div className="flex flex-wrap gap-1.5">
									{categoryOptions.map((categoryOption) => {
										const active =
											(forcedCategory ?? normalizedState.category) ===
											categoryOption.value;
										return (
											<button
												key={categoryOption.value}
												type="button"
												disabled={Boolean(forcedCategory)}
												onClick={() =>
													updateState({
														category:
															categoryOption.value as IListingSearchState["category"],
														page: 1,
													})
												}
												className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
													active
														? "border-emerald-600 bg-emerald-50 text-emerald-700"
														: "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
												}`}
											>
												{categoryOption.label}
											</button>
										);
									})}

									{quickBudgetPresets.map((preset) => {
										const active =
											normalizedState.minPrice === preset.min &&
											normalizedState.maxPrice === preset.max;
										return (
											<button
												key={preset.label}
												type="button"
												onClick={() =>
													updateState({
														minPrice: preset.min,
														maxPrice: preset.max,
														page: 1,
													})
												}
												className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
													active
														? "border-emerald-600 bg-emerald-50 text-emerald-700"
														: "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
												}`}
											>
												{preset.label}
											</button>
										);
									})}
								</div>
							</div>
						)}
					</div>

					<div className="hidden grid-cols-1 gap-2 md:grid lg:grid-cols-[1.4fr_0.8fr_0.7fr_auto_auto_auto]">
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
							<input
								type="text"
								value={normalizedState.query}
								onChange={(event) =>
									updateState({ query: event.target.value, page: 1 })
								}
								placeholder="Search locality, landmark, title"
								className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
							/>
						</div>

						<select
							value={normalizedState.locationKey}
							onChange={(event) =>
								updateState({ locationKey: event.target.value, page: 1 })
							}
							className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
						>
							<option value="">Any Area</option>
							{WEST_BENGAL_LOCATIONS.map((location) => (
								<option key={location.value} value={location.value}>
									{location.label}
								</option>
							))}
						</select>

						<select
							value={normalizedState.sortBy}
							onChange={(event) =>
								updateState({
									sortBy: event.target.value as IListingSearchState["sortBy"],
									page: 1,
								})
							}
							className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
						>
							<option value="newest">Newest First</option>
							<option value="priceLow">Price: Low to High</option>
							<option value="priceHigh">Price: High to Low</option>
							<option value="nearest">Nearest</option>
						</select>

						<button
							type="button"
							onClick={onUseCurrentLocation}
							disabled={geoLoading}
							className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
						>
							<LocateFixed className="h-4 w-4" />
							{geoLoading ? "Detecting..." : "Near Me"}
						</button>

						<button
							type="button"
							onClick={() => setMobileFilterOpen(true)}
							className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
						>
							<SlidersHorizontal className="h-4 w-4" />
							More Filters
						</button>

						<button
							type="button"
							onClick={onResetFilters}
							className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
						>
							Clear all
						</button>
					</div>

					<div className="mt-2 hidden flex-wrap gap-2 md:flex">
						{[
							{ label: "All", value: "all" },
							{ label: "Buy", value: "sell" },
							{ label: "Rent", value: "rent" },
						].map((intentOption) => {
							const active =
								(forcedIntent ?? normalizedState.intent) === intentOption.value;
							return (
								<button
									key={intentOption.value}
									type="button"
									disabled={Boolean(forcedIntent)}
									onClick={() =>
										updateState({
											intent:
												intentOption.value as IListingSearchState["intent"],
											page: 1,
										})
									}
									className={`rounded-full border px-3 py-1 text-xs font-semibold ${
										active
											? "border-emerald-600 bg-emerald-600 text-white"
											: "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
									}`}
								>
									{intentOption.label}
								</button>
							);
						})}

						{categoryOptions.map((categoryOption) => {
							const active =
								(forcedCategory ?? normalizedState.category) ===
								categoryOption.value;
							return (
								<button
									key={categoryOption.value}
									type="button"
									disabled={Boolean(forcedCategory)}
									onClick={() =>
										updateState({
											category:
												categoryOption.value as IListingSearchState["category"],
											page: 1,
										})
									}
									className={`rounded-full border px-3 py-1 text-xs font-semibold ${
										active
											? "border-emerald-600 bg-emerald-50 text-emerald-700"
											: "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
									}`}
								>
									{categoryOption.label}
								</button>
							);
						})}

						{quickBudgetPresets.map((preset) => {
							const active =
								normalizedState.minPrice === preset.min &&
								normalizedState.maxPrice === preset.max;
							return (
								<button
									key={preset.label}
									type="button"
									onClick={() =>
										updateState({
											minPrice: preset.min,
											maxPrice: preset.max,
											page: 1,
										})
									}
									className={`rounded-full border px-3 py-1 text-xs font-semibold ${
										active
											? "border-emerald-600 bg-emerald-50 text-emerald-700"
											: "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
									}`}
								>
									{preset.label}
								</button>
							);
						})}
					</div>
				</div>
			</section>

			<main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
				<header className="mb-6 flex flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
							{heading !== "All Properties" ? heading : contextualHeading}
						</h1>
						<p className="mt-1 text-sm text-slate-600 md:text-base">
							{filteredPosts.length} properties match your current filters.
						</p>
					</div>
					<div className="flex items-center gap-2 text-sm text-slate-500">
						{normalizedState.lat !== null && normalizedState.lng !== null
							? "Near Me enabled"
							: ""}
					</div>
				</header>

				{activeFilterChips.length > 0 && (
					<div className="mb-5 flex flex-wrap items-center gap-2">
						{activeFilterChips.map((chip) => (
							<button
								key={chip.key}
								type="button"
								onClick={chip.onClear}
								className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
							>
								{chip.label}
								<span className="text-emerald-600">x</span>
							</button>
						))}
						<button
							type="button"
							onClick={onResetFilters}
							className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
						>
							Clear all filters
						</button>
					</div>
				)}

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
								state={normalizedState}
								onChange={updateState}
								onUseCurrentLocation={onUseCurrentLocation}
								onClearGeoFilter={onClearGeoFilter}
								onReset={onResetFilters}
								geoLoading={geoLoading}
								lockIntent={forcedIntent}
								lockCategory={forcedCategory}
								layout="sidebar"
							/>
						</div>
					</SheetContent>
				</Sheet>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,860px)_minmax(280px,320px)] lg:items-start">
					<div className="space-y-4 lg:max-w-[860px]">
						{loading ? (
							<div className="space-y-4">
								{Array.from({ length: 8 }).map((_, index) => (
									<div
										key={index}
										className="h-56 animate-pulse rounded-xl bg-slate-200"
									/>
								))}
							</div>
						) : (
							<>
								<div className="space-y-4">
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
														variant="search"
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
														variant="search"
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

					<aside className="space-y-4 lg:sticky lg:top-32">
						<div className="rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 p-5 text-white shadow-md">
							<h3 className="text-xl font-bold">
								Sell faster with SiliguriProperty
							</h3>
							<p className="mt-2 text-sm text-emerald-100">
								Publish once and reach active buyers and tenants browsing this
								exact market.
							</p>
							<button
								type="button"
								onClick={() => navigate("/dashboard/new-post")}
								className="mt-4 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
							>
								Post Property FREE
							</button>
						</div>

						<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<h4 className="text-base font-semibold text-slate-900">
								Market Analytics
							</h4>
							<p className="mt-1 text-xs text-slate-500">
								Based on current filtered inventory
							</p>
							<div className="mt-3 space-y-3 text-sm">
								<div className="rounded-lg bg-slate-50 p-3">
									<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
										Median Price
									</p>
									<p className="mt-1 font-semibold text-slate-900">
										{priceAnalytics.median}
									</p>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<div className="rounded-lg bg-slate-50 p-3">
										<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
											Min
										</p>
										<p className="mt-1 font-semibold text-slate-900">
											{priceAnalytics.min}
										</p>
									</div>
									<div className="rounded-lg bg-slate-50 p-3">
										<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
											Max
										</p>
										<p className="mt-1 font-semibold text-slate-900">
											{priceAnalytics.max}
										</p>
									</div>
								</div>
								<div className="rounded-lg bg-slate-50 p-3">
									<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
										Inventory Mix
									</p>
									<p className="mt-1 font-semibold text-slate-900">
										{inventoryMix}
									</p>
								</div>
								<div className="rounded-lg bg-slate-50 p-3">
									<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
										Listing Freshness
									</p>
									<p className="mt-1 font-semibold text-slate-900">
										{listingAgeInsight}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<h4 className="text-base font-semibold text-slate-900">
								Top Localities
							</h4>
							<div className="mt-3 space-y-2">
								{topLocalities.length === 0 ? (
									<p className="text-sm text-slate-500">
										No locality data for current filters.
									</p>
								) : (
									topLocalities.map(([name, count]) => (
										<div
											key={name}
											className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
										>
											<span className="text-sm text-slate-700 line-clamp-1">
												{name}
											</span>
											<span className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-slate-600">
												{count}
											</span>
										</div>
									))
								)}
							</div>
						</div>
					</aside>
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
