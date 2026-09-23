import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Bath, BedDouble, MapPin } from "lucide-react";
import BASE_URL from "../../services";
import {
	ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import HeroSectionImage1Background from "../../assets/image1_hero_section.jpg";
import HeroSectionImage2Background from "../../assets/image2_hero_section.jpg";

const NewListings: React.FC = () => {
	const navigate = useNavigate();
	const [latestPosts, setLatestPosts] = useState<IUniversalListingType[]>([]);
	const [allApprovedPosts, setAllApprovedPosts] = useState<
		IUniversalListingType[]
	>([]);
	const [closedPosts, setClosedPosts] = useState<IUniversalListingType[]>([]);

	useEffect(() => {
		const fetchHomeData = async () => {
			try {
				const [latestRes, allRes, closedRes] = await Promise.all([
					BASE_URL.get("/api/user/post/view-latest-posts"),
					BASE_URL.get("/api/user/post/view-all-approved-posts"),
					BASE_URL.get("/api/user/post/view-closed-posts"),
				]);
				setLatestPosts(latestRes.data.recentPosts ?? []);
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

	const featuredListings = latestPosts.slice(0, 3);
	const recentlyClosedListings = closedPosts.slice(0, 6);

	const getCardImage = (listing?: IUniversalListingType): string => {
		return (
			listing?.pictures?.[0] ||
			(listing?.intent === "rent"
				? HeroSectionImage2Background
				: HeroSectionImage1Background)
		);
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

	const getListingPrice = (listing: IUniversalListingType): string => {
		if (listing.intent === "rent") {
			const price = Number(
				"pricePerFrequency" in listing ? (listing.pricePerFrequency ?? 0) : 0,
			);
			if (Number.isFinite(price) && price > 0) {
				return `${formatIndianCurrency(price)}/mo`;
			}
			return "Price on request";
		}

		const sellListing = listing as ISellListingType;
		const value = Number(
			sellListing.totalPrice ??
				sellListing.price ??
				sellListing.pricePerUnit ??
				0,
		);
		if (Number.isFinite(value) && value > 0) {
			return formatIndianCurrency(value);
		}
		return "Price on request";
	};

	const getClosedBadge = (listing: IUniversalListingType): string => {
		return listing.intent === "rent" ? "Rented" : "Sold";
	};

	const categoryCards = [
		{ key: "flat", title: "Flats and Apartments" },
		{ key: "land", title: "Plots and Land" },
		{ key: "house", title: "Independent Houses" },
		{ key: "shop", title: "Commercial Spaces" },
	];

	return (
		<section className="bg-white py-16">
			<div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
				<section>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
						Browse by category
					</p>
					<h2 className="mt-2 text-4xl font-bold leading-tight text-slate-900">
						What are you looking for?
					</h2>

					<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{categoryCards.map((category) => (
							<button
								key={category.key}
								type="button"
								onClick={() => navigate(`/properties?category=${category.key}`)}
								className="group relative h-40 overflow-hidden rounded-2xl text-left"
							>
								<img
									src={getCategoryImage(category.key)}
									alt={category.title}
									className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
								<div className="absolute bottom-3 left-3 right-3">
									<p className="text-lg font-semibold text-white">
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

				<section className="mt-14 rounded-3xl border border-[#e7e3d8] bg-[#f6f5f1] p-6 sm:p-8">
					<div className="mb-6 flex items-end justify-between gap-3">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
								Handpicked for you
							</p>
							<h3 className="mt-2 text-4xl font-bold leading-tight text-slate-900">
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

					<div className="grid gap-4 lg:grid-cols-3">
						{featuredListings.map((listing) => (
							<button
								key={listing._id}
								type="button"
								onClick={() =>
									navigate(
										listing.intent === "rent"
											? `/rentals/${listing.propertyCategory}/${listing._id}`
											: `/buys/${listing.propertyCategory}/${listing._id}`,
									)
								}
								className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md"
							>
								<div className="relative h-44 w-full overflow-hidden">
									<img
										src={getCardImage(listing)}
										alt={listing.title}
										className="h-full w-full object-cover"
									/>
									<span className="absolute left-3 top-3 rounded bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white">
										{listing.intent === "rent" ? "For Rent" : "For Sale"}
									</span>
								</div>

								<div className="p-4">
									<div className="flex items-start justify-between gap-2">
										<h4 className="text-2xl font-bold text-slate-900">
											{getListingPrice(listing)}
										</h4>
										<span className="text-xs text-slate-500">
											{listing.intent === "rent" ? "Monthly" : "Estimated"}
										</span>
									</div>
									<p className="mt-2 line-clamp-1 text-base font-semibold text-slate-800">
										{listing.title}
									</p>
									<p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
										<MapPin className="h-4 w-4" />
										{listing.wbLocalityLabel || listing.location}
									</p>

									<div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
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
										<span className="inline-flex items-center gap-1 text-emerald-700">
											<BadgeCheck className="h-3.5 w-3.5" /> Verified
										</span>
									</div>
								</div>
							</button>
						))}
					</div>
				</section>

				{recentlyClosedListings.length > 0 && (
					<section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
						<div className="mb-6 flex items-end justify-between gap-3">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
									Closed listings
								</p>
								<h3 className="mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
									Recently sold or rented
								</h3>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
											src={getCardImage(listing)}
											alt={listing.title}
											className="h-full w-full object-cover grayscale-[12%]"
										/>
										<span className="absolute left-3 top-3 rounded bg-slate-800 px-2 py-1 text-[11px] font-semibold text-white">
											{getClosedBadge(listing)}
										</span>
									</div>

									<div className="p-4">
										<p className="text-lg font-bold text-slate-900">
											{getListingPrice(listing)}
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
