import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
	Bath,
	BedDouble,
	ImageIcon,
	Images,
	MapPin,
	Video,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import BASE_URL from "../../services";
import {
	ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import { optimizeCloudinaryImage } from "../../utils/optimizeCloudinaryImage";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel";

const SILIGURI_FALLBACK_SELL_IMAGE =
	"https://commons.wikimedia.org/wiki/Special:FilePath/The_mighty_Mountains_Siliguri.jpg";
const SILIGURI_FALLBACK_RENT_IMAGE =
	"https://commons.wikimedia.org/wiki/Special:FilePath/Tourism_3.jpg";

const isVideoUrl = (url: string): boolean => {
	const lower = url.toLowerCase();
	if (lower.includes("/video/upload/")) return true;
	if (lower.includes("/image/upload/")) return false;
	return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(lower);
};

const toCategoryLabel = (value: string): string =>
	value ? value.charAt(0).toUpperCase() + value.slice(1) : "Property";

const NewListings: React.FC = () => {
	const navigate = useNavigate();
	const [featuredPosts, setFeaturedPosts] = useState<IUniversalListingType[]>(
		[],
	);
	const [newPosts, setNewPosts] = useState<IUniversalListingType[]>([]);
	const [allApprovedPosts, setAllApprovedPosts] = useState<
		IUniversalListingType[]
	>([]);
	const [closedPosts, setClosedPosts] = useState<IUniversalListingType[]>([]);
	const featuredAutoplay = useRef(
		Autoplay({
			delay: 3600,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
		}),
	);
	const newestAutoplay = useRef(
		Autoplay({
			delay: 3000,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
		}),
	);

	useEffect(() => {
		const fetchHomeData = async () => {
			try {
				const [featuredRes, newestRes, allRes, closedRes] = await Promise.all([
					BASE_URL.get("/api/user/post/view-featured-posts"),
					BASE_URL.get("/api/user/post/view-new-homepage-posts"),
					BASE_URL.get("/api/user/post/view-all-approved-posts"),
					BASE_URL.get("/api/user/post/view-closed-posts"),
				]);
				setFeaturedPosts(featuredRes.data.featuredPosts ?? []);
				setNewPosts(newestRes.data.newPosts ?? []);
				setAllApprovedPosts(allRes.data.postArray ?? []);
				setClosedPosts(closedRes.data.closedPosts ?? []);
			} catch (error: unknown) {
				if (axios.isAxiosError(error)) {
					console.error(
						"Error fetching home listings:",
						error.response?.status,
						error.response?.data || error.message,
					);
				}
			}
		};

		void fetchHomeData();
	}, []);

	const featuredListings =
		featuredPosts.length > 0 ? featuredPosts.slice(0, 6) : newPosts.slice(0, 6);
	const newestListings = newPosts.slice(0, 6);
	const recentlyClosedListings = closedPosts.slice(0, 6);

	const getListingUrl = (listing: IUniversalListingType): string =>
		listing.intent === "rent"
			? `/rentals/${listing.propertyCategory}/${listing._id}`
			: `/buys/${listing.propertyCategory}/${listing._id}`;

	const getCardImage = (listing?: IUniversalListingType): string => {
		return (
			listing?.pictures?.[0] ||
			(listing?.intent === "rent"
				? SILIGURI_FALLBACK_RENT_IMAGE
				: SILIGURI_FALLBACK_SELL_IMAGE)
		);
	};

	const getOptimizedImage = (
		listing: IUniversalListingType | undefined,
		width: number,
		height: number,
	): string => {
		const imageUrl = getCardImage(listing);
		return optimizeCloudinaryImage(imageUrl, {
			width,
			height,
			crop: "fill",
		});
	};

	const getCategoryCount = (category: string): number => {
		return allApprovedPosts.filter((post) => post.propertyCategory === category)
			.length;
	};

	const getCategoryImage = (category: string): string => {
		const listing = allApprovedPosts.find(
			(post) => post.propertyCategory === category,
		);
		return getCardImage(listing);
	};

	const getListingPrice = (
		listing: IUniversalListingType,
	): { primary: string; secondary?: string } => {
		if (listing.intent === "rent") {
			const frequency =
				"frequency" in listing && listing.frequency
					? listing.frequency
					: "month";
			const price = Number(
				"pricePerFrequency" in listing ? (listing.pricePerFrequency ?? 0) : 0,
			);
			if (Number.isFinite(price) && price > 0) {
				return {
					primary: `${formatIndianCurrency(price)} / ${frequency}`,
					secondary: "Rental",
				};
			}
			return { primary: "Price on request", secondary: "Rental" };
		}

		const sellListing = listing as ISellListingType;
		if (
			listing.propertyCategory === "land" &&
			sellListing.pricePerUnit &&
			sellListing.unit
		) {
			const total = Number(sellListing.totalPrice ?? 0);
			return {
				primary: `${formatIndianCurrency(Number(sellListing.pricePerUnit))} / ${sellListing.unit}`,
				secondary:
					Number.isFinite(total) && total > 0
						? `Total ${formatIndianCurrency(total)}`
						: "Land listing",
			};
		}

		const value = Number(
			sellListing.totalPrice ??
				sellListing.price ??
				sellListing.pricePerUnit ??
				0,
		);
		if (Number.isFinite(value) && value > 0) {
			return { primary: formatIndianCurrency(value), secondary: "Sale" };
		}
		return { primary: "Price on request", secondary: "Sale" };
	};

	const getClosedBadge = (listing: IUniversalListingType): string => {
		return listing.intent === "rent" ? "Rented" : "Sold";
	};

	const getMapEmbedUrl = (listing: IUniversalListingType): string => {
		const coords = listing.coordinates?.coordinates;
		if (Array.isArray(coords) && coords.length === 2) {
			const [lng, lat] = coords;
			if (
				typeof lat === "number" &&
				typeof lng === "number" &&
				(lat !== 0 || lng !== 0)
			) {
				return `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
			}
		}

		const locationQuery = encodeURIComponent(
			listing.wbLocalityLabel || listing.alternateLocation || listing.location,
		);
		return `https://maps.google.com/maps?q=${locationQuery}&z=13&output=embed`;
	};

	const categoryCards = [
		{ key: "flat", title: "Flats and Apartments" },
		{ key: "land", title: "Plots and Land" },
		{ key: "house", title: "Independent Houses" },
		{ key: "shop", title: "Commercial Spaces" },
	];

	return (
		<section className="bg-white py-10 sm:py-12 lg:py-14">
			<div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
				<section>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
						Browse by category
					</p>
					<h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
						What are you looking for?
					</h2>

					<div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{categoryCards.map((category) => (
							<button
								key={category.key}
								type="button"
								onClick={() => navigate(`/properties?category=${category.key}`)}
								className="group relative h-36 overflow-hidden rounded-2xl text-left sm:h-40"
							>
								<img
									src={optimizeCloudinaryImage(getCategoryImage(category.key), {
										width: 640,
										height: 320,
										crop: "fill",
									})}
									alt={category.title}
									loading="lazy"
									decoding="async"
									className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
								<div className="absolute bottom-3 left-3 right-3">
									<p className="text-base font-semibold text-white sm:text-lg">
										{category.title}
									</p>
									<p className="text-xs text-emerald-100">
										{getCategoryCount(category.key)} listings
									</p>
								</div>
							</button>
						))}
					</div>
				</section>

				<section className="mt-9 rounded-3xl border border-[#e7e3d8] bg-[#f6f5f1] p-4 sm:mt-12 sm:p-8">
					<div className="mb-5 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
								Handpicked for you
							</p>
							<h3 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
								Featured properties in Siliguri
							</h3>
						</div>
						<button
							type="button"
							onClick={() => navigate("/properties")}
							className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
						>
							View all listings
						</button>
					</div>

					{featuredListings.length > 0 ? (
						<Carousel
							opts={{ align: "start", loop: true }}
							plugins={[featuredAutoplay.current]}
						>
							<CarouselContent>
								{featuredListings.map((listing) => {
									const listingPrice = getListingPrice(listing);
									const photoCount = listing.pictures?.length ?? 0;
									const mapEmbedUrl = getMapEmbedUrl(listing);

									return (
										<CarouselItem
											key={`featured-${listing._id}`}
											className="basis-full"
										>
											<div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[1.3fr_0.85fr]">
												<button
													type="button"
													onClick={() => navigate(getListingUrl(listing))}
													className="group relative h-[320px] w-full overflow-hidden text-left sm:h-[360px] md:h-[420px]"
												>
													<img
														src={getOptimizedImage(listing, 1280, 840)}
														alt={listing.title}
														loading="lazy"
														decoding="async"
														className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/38 to-black/8" />

													<div className="absolute left-3 right-3 top-3 flex items-center justify-between sm:left-4 sm:right-4 sm:top-4">
														<span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-800 sm:px-3 sm:text-[11px]">
															{listing.intent === "rent"
																? "For Rent"
																: "For Sale"}
														</span>
														<span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white sm:px-3 sm:text-[11px]">
															<Images className="h-3.5 w-3.5" />
															{photoCount} photos
														</span>
													</div>

													<div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
														<p className="text-lg font-bold leading-tight sm:text-2xl">
															{listingPrice.primary}
														</p>
														{listingPrice.secondary && (
															<p className="mt-1 text-[11px] text-slate-100 sm:text-xs">
																{listingPrice.secondary}
															</p>
														)}
														<p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
															{listing.title}
														</p>
														<p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-100 sm:text-sm">
															<MapPin className="h-4 w-4" />
															{listing.wbLocalityLabel || listing.location}
														</p>
														<div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-100 sm:mt-3 sm:gap-3 sm:text-xs">
															{listing.bedrooms !== undefined && (
																<span className="inline-flex items-center gap-1">
																	<BedDouble className="h-3.5 w-3.5" />
																	{listing.bedrooms} Beds
																</span>
															)}
															{listing.bathrooms !== undefined && (
																<span className="inline-flex items-center gap-1">
																	<Bath className="h-3.5 w-3.5" />
																	{listing.bathrooms} Baths
																</span>
															)}
															<span className="rounded-md border border-white/20 bg-white/10 px-2 py-1 capitalize">
																{listing.propertyCategory}
															</span>
														</div>
													</div>
												</button>

												<div className="relative h-48 w-full overflow-hidden border-t border-slate-200 bg-slate-50 p-2 sm:h-52 md:h-[420px] md:border-l md:border-t-0 md:p-3">
													<iframe
														title={`Map view for ${listing.title}`}
														src={mapEmbedUrl}
														className="h-full w-full rounded-xl"
														loading="lazy"
														referrerPolicy="no-referrer-when-downgrade"
													/>
													<div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm sm:left-5 sm:top-5 sm:px-2.5 sm:text-[11px]">
														Map View
													</div>
												</div>
											</div>
										</CarouselItem>
									);
								})}
							</CarouselContent>
							<CarouselPrevious className="!left-auto !right-12 !top-3 !h-8 !w-8 !translate-y-0 border border-slate-200 bg-white/95 sm:!right-16 sm:!top-4 sm:!h-10 sm:!w-10" />
							<CarouselNext className="!right-3 !top-3 !h-8 !w-8 !translate-y-0 border border-slate-200 bg-white/95 sm:!right-4 sm:!top-4 sm:!h-10 sm:!w-10" />
						</Carousel>
					) : (
						<div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-sm text-slate-600">
							No featured properties yet.
						</div>
					)}
				</section>

				<section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 sm:mt-10 sm:p-8">
					<div className="mb-5 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700">
								Just listed
							</p>
							<h3 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
								New properties
							</h3>
						</div>
						<button
							type="button"
							onClick={() => navigate("/properties")}
							className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
						>
							Explore all
						</button>
					</div>

					{newestListings.length > 0 ? (
						<Carousel
							opts={{ align: "start", loop: true }}
							plugins={[newestAutoplay.current]}
						>
							<CarouselContent>
								{newestListings.map((listing) => (
									<CarouselItem
										key={`new-${listing._id}`}
										className="basis-[92%] pl-1 sm:basis-1/2 sm:pl-4 lg:basis-1/3"
									>
										{(() => {
											const listingPrice = getListingPrice(listing);
											const photoCount = listing.pictures?.length ?? 0;
											const videoCount =
												listing.videos?.filter((url) => isVideoUrl(url))
													.length ?? 0;
											const categoryLabel = toCategoryLabel(
												listing.propertyCategory,
											);
											const intentLabel =
												listing.intent === "rent" ? "For Rent" : "For Sale";
											return (
												<button
													type="button"
													onClick={() => navigate(getListingUrl(listing))}
													className="group flex h-full min-h-[300px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[320px]"
												>
													<div className="relative h-40 w-full overflow-hidden sm:h-48">
														<img
															src={getOptimizedImage(listing, 720, 480)}
															alt={listing.title}
															loading="lazy"
															decoding="async"
															className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
														<div className="absolute left-2 top-2 rounded bg-slate-900/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
															{intentLabel}
														</div>
														<div className="absolute left-2 top-9 rounded-full border border-white/25 bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
															{categoryLabel}
														</div>
														{(photoCount > 0 || videoCount > 0) && (
															<div className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
																{photoCount > 0 && (
																	<span className="inline-flex items-center gap-1">
																		<ImageIcon className="h-3 w-3" />
																		{photoCount}
																	</span>
																)}
																{videoCount > 0 && (
																	<span className="inline-flex items-center gap-1">
																		<Video className="h-3 w-3" />
																		{videoCount}
																	</span>
																)}
															</div>
														)}
													</div>
													<div className="flex flex-1 flex-col p-3.5 sm:p-4">
														<p className="text-base font-bold text-slate-900 sm:text-lg">
															{listingPrice.primary}
														</p>
														{listingPrice.secondary && (
															<p className="text-[11px] text-slate-500 sm:text-xs">
																{listingPrice.secondary}
															</p>
														)}
														<p className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-snug text-slate-800 sm:text-sm">
															{listing.title}
														</p>
														<p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
															<MapPin className="h-3.5 w-3.5" />
															{listing.wbLocalityLabel || listing.location}
														</p>
														<div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate-500">
															<span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 capitalize">
																{listing.intent === "rent" ? "Rental" : "Sale"}
															</span>
															<span className="text-[11px] font-medium text-slate-500">
																Explore details
															</span>
														</div>
													</div>
												</button>
											);
										})()}
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className="hidden md:flex left-3 md:left-3 border border-slate-200 bg-white/95" />
							<CarouselNext className="hidden md:flex right-3 md:right-3 border border-slate-200 bg-white/95" />
						</Carousel>
					) : (
						<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
							No new properties available right now.
						</div>
					)}
				</section>

				{recentlyClosedListings.length > 0 && (
					<section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 sm:mt-10 sm:p-8">
						<div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
									Closed listings
								</p>
								<h3 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
									Recently sold or rented
								</h3>
							</div>
						</div>

						<div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{recentlyClosedListings.map((listing) => (
								<button
									key={`closed-${listing._id}`}
									type="button"
									onClick={() =>
										navigate(
											listing.intent === "rent"
												? `/rentals/${listing.propertyCategory}/${listing._id}`
												: `/buys/${listing.propertyCategory}/${listing._id}`,
										)
									}
									className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left"
								>
									<div className="relative h-40 w-full overflow-hidden">
										<img
											src={getOptimizedImage(listing, 640, 360)}
											alt={listing.title}
											loading="lazy"
											decoding="async"
											className="h-full w-full object-cover grayscale-[12%]"
										/>
										<span className="absolute left-3 top-3 rounded bg-slate-800 px-2 py-1 text-[11px] font-semibold text-white">
											{getClosedBadge(listing)}
										</span>
									</div>

									<div className="p-4">
										<p className="text-lg font-bold text-slate-900">
											{getListingPrice(listing).primary}
										</p>
										<p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-800">
											{listing.title}
										</p>
										<p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
											<MapPin className="h-3.5 w-3.5" />
											{listing.wbLocalityLabel || listing.location}
										</p>
									</div>
								</button>
							))}
						</div>
					</section>
				)}
			</div>
		</section>
	);
};

export default NewListings;
