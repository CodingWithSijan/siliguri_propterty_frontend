import { Fragment, useCallback, useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
	MapPin,
	Calendar,
	Star,
	AlertCircle,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { convert_ISO_Date_to_Normal } from "../../utils/convert_ISO_Date_to_Normal";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import { getPlainText } from "../../utils/descriptionUtils";
import { Button } from "../ui/button";
import useFetch from "../../hooks/useFetch";
import {
	fetchPostsByStatus,
	setHomepageFeaturedPosts,
	Post,
} from "../../services/fetchFunctionsForAdmin";
import { Skeleton } from "../ui/skeleton";
import { showError, showSuccess } from "../../utils/toastUtils";

const MAX_HOMEPAGE_FEATURED = 6;

const frequencyLabelMap: Record<string, string> = {
	day: "day",
	week: "week",
	month: "month",
	year: "year",
};

const unitLabelMap: Record<string, string> = {
	decimal: "decimal",
	"sq foot": "sq ft",
	katha: "katha",
	bigha: "bigha",
	acre: "acre",
};

const FeaturedProperties = () => {
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIntent, setSelectedIntent] = useState<
		"all" | "buy" | "sell" | "rent"
	>("all");
	const [selectedCategory, setSelectedCategory] = useState<
		"all" | "land" | "house" | "flat" | "shop"
	>("all");
	const [selectedFeaturedFilter, setSelectedFeaturedFilter] = useState<
		"all" | "featured" | "notFeatured"
	>("all");
	const [isSavingFeatured, setIsSavingFeatured] = useState(false);
	const [selectedFeaturedIds, setSelectedFeaturedIds] = useState<string[]>([]);
	const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
	const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);

	const fetchApprovedPosts = useCallback(() => {
		return fetchPostsByStatus("approved", {
			query: searchQuery,
			intent: selectedIntent === "all" ? undefined : selectedIntent,
			category: selectedCategory === "all" ? undefined : selectedCategory,
			featured:
				selectedFeaturedFilter === "all" ? undefined : selectedFeaturedFilter,
		});
	}, [searchQuery, selectedIntent, selectedCategory, selectedFeaturedFilter]);

	const {
		data: posts,
		loading: isLoadingPosts,
		refetch: refetchPosts,
	} = useFetch(fetchApprovedPosts, false);

	useEffect(() => {
		refetchPosts();
	}, [fetchApprovedPosts, refetchPosts]);

	useEffect(() => {
		setDisplayPosts(posts ?? []);
	}, [posts]);

	useEffect(() => {
		if (!posts) {
			setSelectedFeaturedIds([]);
			return;
		}

		const hasAdminConfiguredFeatured = posts.some(
			(post) => post.isFeaturedOnHomepage,
		);

		const featuredIds = hasAdminConfiguredFeatured
			? [...posts]
					.filter((post) => post.isFeaturedOnHomepage)
					.sort((a, b) => (a.featuredRank ?? 999) - (b.featuredRank ?? 999))
					.map((post) => post._id)
					.slice(0, MAX_HOMEPAGE_FEATURED)
			: [...posts]
					.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
					)
					.slice(0, MAX_HOMEPAGE_FEATURED)
					.map((post) => post._id);

		setSelectedFeaturedIds(featuredIds);
	}, [posts]);

	const handleSearch = () => {
		setSearchQuery(searchInput.trim());
	};

	const handleResetFilters = () => {
		setSearchInput("");
		setSearchQuery("");
		setSelectedIntent("all");
		setSelectedCategory("all");
		setSelectedFeaturedFilter("all");
	};

	const handleFeaturedToggle = (post: Post, checked: boolean) => {
		setSelectedFeaturedIds((prev) => {
			if (checked) {
				if (prev.includes(post._id)) {
					return prev;
				}
				if (prev.length >= MAX_HOMEPAGE_FEATURED) {
					showError(
						`You can select up to ${MAX_HOMEPAGE_FEATURED} properties.`,
					);
					return prev;
				}
				return [...prev, post._id];
			}
			return prev.filter((id) => id !== post._id);
		});
	};

	const handleSaveFeaturedPosts = async () => {
		try {
			setIsSavingFeatured(true);
			await setHomepageFeaturedPosts(selectedFeaturedIds);
			showSuccess("Homepage featured properties updated.");
			await refetchPosts();
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to update featured properties";
			showError(message);
		} finally {
			setIsSavingFeatured(false);
		}
	};

	const toggleExpanded = (postId: string) => {
		setExpandedPostIds((prev) =>
			prev.includes(postId)
				? prev.filter((id) => id !== postId)
				: [...prev, postId],
		);
	};

	const normalizeNumeric = (value?: number | string): number | null => {
		if (typeof value === "number" && Number.isFinite(value)) {
			return value;
		}
		if (typeof value === "string") {
			const parsed = Number(value);
			if (Number.isFinite(parsed)) {
				return parsed;
			}
		}
		return null;
	};

	const formatPrice = (post: Post): { primary: string; secondary?: string } => {
		const isRent = post.postType === "rent" || post.intent === "rent";
		const isLandSale = !isRent && post.propertyCategory === "land";

		if (isRent) {
			const frequency = frequencyLabelMap[post.frequency ?? ""] ?? "month";
			const value = normalizeNumeric(post.pricePerFrequency ?? post.price);
			if (value && value > 0) {
				return {
					primary: `₹${formatIndianCurrency(value)} / ${frequency}`,
					secondary: "Rental",
				};
			}
			return { primary: "Price on request", secondary: "Rental" };
		}

		if (isLandSale) {
			const unit =
				unitLabelMap[
					(post.unit ?? post.availableLandSpaceUnit ?? "").toLowerCase()
				] ||
				(post.unit ?? post.availableLandSpaceUnit ?? "unit");
			const perUnit = normalizeNumeric(post.pricePerUnit);
			const total = normalizeNumeric(post.totalPrice ?? post.price);

			if (perUnit && perUnit > 0) {
				return {
					primary: `₹${formatIndianCurrency(perUnit)} / ${unit}`,
					secondary:
						total && total > 0
							? `Total ₹${formatIndianCurrency(total)}`
							: "Land listing",
				};
			}

			if (total && total > 0) {
				return {
					primary: `₹${formatIndianCurrency(total)}`,
					secondary: "Land listing",
				};
			}

			return { primary: "Price on request", secondary: "Land listing" };
		}

		const total = normalizeNumeric(post.totalPrice ?? post.price);
		if (total && total > 0) {
			return { primary: `₹${formatIndianCurrency(total)}`, secondary: "Sale" };
		}

		const perUnit = normalizeNumeric(post.pricePerUnit);
		if (perUnit && perUnit > 0) {
			const unit =
				unitLabelMap[(post.unit ?? "").toLowerCase()] || post.unit || "unit";
			return {
				primary: `₹${formatIndianCurrency(perUnit)} / ${unit}`,
				secondary: "Sale",
			};
		}

		return { primary: "Price on request", secondary: "Sale" };
	};

	const formatPropertyType = (post: Post) =>
		post.propertyCategory || post.propertyType || "N/A";

	const getDescriptionPreview = (description?: string): string => {
		if (!description) {
			return "";
		}

		const plainText = getPlainText(description).replace(/\s+/g, " ").trim();
		return plainText;
	};

	return (
		<div className="space-y-5">
			<div className="grid gap-4 md:grid-cols-4">
				<Card className="border-emerald-100 bg-white/80">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-slate-600">
							Approved Listings
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold text-slate-900">
							{displayPosts.length}
						</p>
					</CardContent>
				</Card>
				<Card className="border-amber-100 bg-white/80">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-slate-600">
							Selected Featured
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold text-amber-700">
							{selectedFeaturedIds.length}/{MAX_HOMEPAGE_FEATURED}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="rounded-lg border bg-card p-4 shadow-sm">
				<div className="flex flex-col gap-3 md:flex-row md:items-center">
					<Input
						placeholder="Search by title, location, user or email"
						value={searchInput}
						onChange={(event) => setSearchInput(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								handleSearch();
							}
						}}
						className="w-full md:max-w-md"
					/>
					<div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
						<Select
							value={selectedIntent}
							onValueChange={(value) =>
								setSelectedIntent(value as "all" | "buy" | "sell" | "rent")
							}
						>
							<SelectTrigger className="w-full bg-background">
								<SelectValue placeholder="Intent" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All intents</SelectItem>
								<SelectItem value="sell">Sell</SelectItem>
								<SelectItem value="rent">Rent</SelectItem>
								<SelectItem value="buy">Buy</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={selectedCategory}
							onValueChange={(value) =>
								setSelectedCategory(
									value as "all" | "land" | "house" | "flat" | "shop",
								)
							}
						>
							<SelectTrigger className="w-full bg-background">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All categories</SelectItem>
								<SelectItem value="land">Land</SelectItem>
								<SelectItem value="house">House</SelectItem>
								<SelectItem value="flat">Flat</SelectItem>
								<SelectItem value="shop">Shop</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={selectedFeaturedFilter}
							onValueChange={(value) =>
								setSelectedFeaturedFilter(
									value as "all" | "featured" | "notFeatured",
								)
							}
						>
							<SelectTrigger className="w-full bg-background">
								<SelectValue placeholder="Featured filter" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All featured states</SelectItem>
								<SelectItem value="featured">Featured only</SelectItem>
								<SelectItem value="notFeatured">Not featured</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="mt-3 flex flex-wrap items-center gap-2">
					<Button
						type="button"
						onClick={handleSearch}
						className="w-full sm:w-[120px]"
					>
						Search
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={handleResetFilters}
						className="w-full sm:w-[120px]"
					>
						Reset
					</Button>
					<Button
						type="button"
						onClick={handleSaveFeaturedPosts}
						disabled={isSavingFeatured}
						className="w-full sm:w-[240px]"
					>
						{isSavingFeatured
							? "Updating homepage featured section..."
							: `Apply Selection to Homepage (${selectedFeaturedIds.length}/${MAX_HOMEPAGE_FEATURED})`}
					</Button>
					<p className="w-full text-xs text-slate-500 sm:w-auto">
						If no custom featured list exists, the newest{" "}
						{MAX_HOMEPAGE_FEATURED} listings are selected by default.
					</p>
				</div>
			</div>

			<div className="hidden overflow-hidden rounded-md border bg-card md:block">
				<div className="w-full overflow-x-auto">
					<Table>
						<TableHeader className="bg-muted/50">
							<TableRow>
								<TableHead className="min-w-[170px]">Feature</TableHead>
								<TableHead className="min-w-[240px]">Property</TableHead>
								<TableHead className="min-w-[210px]">Price</TableHead>
								<TableHead className="min-w-[180px]">Created By</TableHead>
								<TableHead className="min-w-[120px]">Details</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoadingPosts ? (
								<TableRow>
									<TableCell colSpan={5}>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								</TableRow>
							) : !displayPosts?.length ? (
								<TableRow>
									<TableCell colSpan={5} className="py-10 text-center">
										<div className="flex flex-col items-center gap-2 text-muted-foreground">
											<AlertCircle className="h-8 w-8" />
											<p>No approved posts found</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								displayPosts.map((post) => {
									const isExpanded = expandedPostIds.includes(post._id);
									const pricing = formatPrice(post);

									return (
										<Fragment key={post._id}>
											<TableRow>
												<TableCell>
													<label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
														<input
															type="checkbox"
															checked={selectedFeaturedIds.includes(post._id)}
															onChange={(event) =>
																handleFeaturedToggle(post, event.target.checked)
															}
															className="h-4 w-4"
														/>
														<span className="inline-flex items-center gap-1">
															<Star className="h-3.5 w-3.5 text-amber-500" />
															Feature
															{post.featuredRank
																? ` (#${post.featuredRank})`
																: ""}
														</span>
													</label>
												</TableCell>
												<TableCell className="break-words whitespace-normal">
													<div className="space-y-1">
														<div
															className="line-clamp-1 font-medium"
															title={post.title}
														>
															{post.title}
														</div>
														<div className="flex items-center gap-1 text-sm text-muted-foreground">
															<MapPin className="h-3 w-3" />
															<span>
																{post.wbLocalityLabel || post.location}
															</span>
														</div>
														<div className="flex flex-wrap gap-2">
															<Badge variant="secondary" className="capitalize">
																{post.intent || post.postType || "N/A"}
															</Badge>
															<Badge variant="outline" className="capitalize">
																{formatPropertyType(post)}
															</Badge>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<p className="text-sm font-semibold text-slate-900">
														{pricing.primary}
													</p>
													{pricing.secondary && (
														<p className="text-xs text-muted-foreground">
															{pricing.secondary}
														</p>
													)}
												</TableCell>
												<TableCell>
													<div className="space-y-1">
														<div className="font-medium">
															{post.user?.name || "Unknown User"}
														</div>
														<div className="text-xs text-muted-foreground">
															{post.user?.email || "N/A"}
														</div>
														<div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
															<Calendar className="h-3 w-3" />
															{convert_ISO_Date_to_Normal(post.createdAt ?? "")}
														</div>
													</div>
												</TableCell>
												<TableCell>
													<Button
														type="button"
														variant="outline"
														onClick={() => toggleExpanded(post._id)}
														className="h-8 w-full"
													>
														{isExpanded ? (
															<span className="inline-flex items-center gap-1">
																<ChevronUp className="h-4 w-4" /> Hide
															</span>
														) : (
															<span className="inline-flex items-center gap-1">
																<ChevronDown className="h-4 w-4" /> View
															</span>
														)}
													</Button>
												</TableCell>
											</TableRow>

											{isExpanded && (
												<TableRow className="bg-slate-50/60">
													<TableCell colSpan={5}>
														<div className="grid gap-4 lg:grid-cols-2">
															<div>
																<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
																	Images
																</p>
																{post.pictures && post.pictures.length > 0 ? (
																	<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
																		{post.pictures
																			.slice(0, 6)
																			.map((src, index) => (
																				<img
																					key={`${post._id}-img-${index}`}
																					src={src}
																					alt={`${post.title} ${index + 1}`}
																					className="h-24 w-full rounded-md object-cover"
																				/>
																			))}
																	</div>
																) : (
																	<p className="text-sm text-muted-foreground">
																		No images uploaded.
																	</p>
																)}
															</div>
															<div>
																<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
																	Important details
																</p>
																<div className="space-y-1 text-sm text-slate-700">
																	{getDescriptionPreview(post.description) && (
																		<p className="line-clamp-4 text-slate-600">
																			{getDescriptionPreview(post.description)}
																		</p>
																	)}
																	{typeof post.floor === "number" && (
																		<p>Floor: {post.floor}</p>
																	)}
																	{post.furnishing && (
																		<p>Furnishing: {post.furnishing}</p>
																	)}
																	{post.availableFrom && (
																		<p>
																			Available from:{" "}
																			{convert_ISO_Date_to_Normal(
																				post.availableFrom,
																			)}
																		</p>
																	)}
																	{post.attachedBathroom && (
																		<p>Attached bathroom available</p>
																	)}
																	{post.hasShutter && (
																		<p>Shop shutter available</p>
																	)}
																</div>
															</div>
														</div>
													</TableCell>
												</TableRow>
											)}
										</Fragment>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className="space-y-3 md:hidden">
				{isLoadingPosts ? (
					<div className="space-y-2">
						<Skeleton className="h-24 w-full" />
						<Skeleton className="h-24 w-full" />
					</div>
				) : !displayPosts?.length ? (
					<div className="rounded-md border bg-card p-6 text-center text-muted-foreground">
						<AlertCircle className="mx-auto mb-2 h-6 w-6" />
						No approved posts found
					</div>
				) : (
					displayPosts.map((post) => {
						const isExpanded = expandedPostIds.includes(post._id);
						const pricing = formatPrice(post);

						return (
							<div key={post._id} className="rounded-md border bg-card p-4">
								<div className="space-y-2">
									<div className="flex items-center justify-between gap-2">
										<label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
											<input
												type="checkbox"
												checked={selectedFeaturedIds.includes(post._id)}
												onChange={(event) =>
													handleFeaturedToggle(post, event.target.checked)
												}
												className="h-4 w-4"
											/>
											<span>
												Feature on homepage
												{post.featuredRank ? ` (#${post.featuredRank})` : ""}
											</span>
										</label>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => toggleExpanded(post._id)}
										>
											{isExpanded ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</Button>
									</div>

									<p
										className="line-clamp-2 text-sm font-semibold"
										title={post.title}
									>
										{post.title}
									</p>
									<p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
										<MapPin className="h-3 w-3" />
										{post.wbLocalityLabel || post.location}
									</p>
									<p className="text-sm font-semibold text-slate-900">
										{pricing.primary}
									</p>
									{pricing.secondary && (
										<p className="text-xs text-muted-foreground">
											{pricing.secondary}
										</p>
									)}

									<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
										<Badge variant="secondary" className="capitalize">
											{post.intent || post.postType || "N/A"}
										</Badge>
										<Badge variant="outline" className="capitalize">
											{formatPropertyType(post)}
										</Badge>
									</div>

									{isExpanded && (
										<div className="space-y-2 border-t pt-2">
											<div className="grid grid-cols-2 gap-2">
												{post.pictures && post.pictures.length > 0 ? (
													post.pictures
														.slice(0, 4)
														.map((src, index) => (
															<img
																key={`${post._id}-mobile-img-${index}`}
																src={src}
																alt={`${post.title} ${index + 1}`}
																className="h-24 w-full rounded-md object-cover"
															/>
														))
												) : (
													<p className="col-span-2 text-sm text-muted-foreground">
														No images uploaded.
													</p>
												)}
											</div>
											{getDescriptionPreview(post.description) && (
												<p className="text-xs text-muted-foreground">
													{getDescriptionPreview(post.description)}
												</p>
											)}
										</div>
									)}
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default FeaturedProperties;
