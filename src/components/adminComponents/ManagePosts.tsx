import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
	CheckCircle2,
	XCircle,
	Clock,
	HomeIcon,
	Building2,
	MapPin,
	IndianRupee,
	Calendar,
	AlertCircle,
	MoreVertical,
} from "lucide-react";
import { convert_ISO_Date_to_Normal } from "../../utils/convert_ISO_Date_to_Normal";
import { Button } from "../ui/button";
import useFetch from "../../hooks/useFetch";
import {
	approvePost,
	deletePost,
	fetchAllPosts,
	fetchAnalytics,
	fetchPostsByStatus,
	PhoneFilterOption,
	rejectPost,
} from "../../services/fetchFunctionsForAdmin";
import { Skeleton } from "../ui/skeleton";

import { Post } from "../../services/fetchFunctionsForAdmin";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ManagePosts = () => {
	const navigate = useNavigate();
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [selectedPhoneFilter, setSelectedPhoneFilter] =
		useState<PhoneFilterOption>("all");
	const [selectedIntent, setSelectedIntent] = useState<
		"all" | "buy" | "sell" | "rent"
	>("all");
	const [selectedCategory, setSelectedCategory] = useState<
		"all" | "land" | "house" | "flat" | "shop"
	>("all");
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [minPriceInput, setMinPriceInput] = useState("");
	const [maxPriceInput, setMaxPriceInput] = useState("");
	const [locationInput, setLocationInput] = useState("");
	const [appliedMinPrice, setAppliedMinPrice] = useState<number | undefined>();
	const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | undefined>();
	const [appliedLocation, setAppliedLocation] = useState("");
	const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
	const [displayPosts, setDisplayPosts] = useState<Post[]>([]);

	const parseOptionalNumber = (value: string): number | undefined => {
		const trimmed = value.trim();
		if (!trimmed) {
			return undefined;
		}
		const parsed = Number(trimmed);
		return Number.isFinite(parsed) ? parsed : undefined;
	};

	const fetchPostsBySelectedStatus = useCallback(() => {
		return selectedStatus === "all"
			? fetchAllPosts({
					query: searchQuery,
					phoneFilter: selectedPhoneFilter,
					intent: selectedIntent === "all" ? undefined : selectedIntent,
					category: selectedCategory === "all" ? undefined : selectedCategory,
					minPrice: appliedMinPrice,
					maxPrice: appliedMaxPrice,
					location: appliedLocation,
				})
			: fetchPostsByStatus(selectedStatus, {
					query: searchQuery,
					phoneFilter: selectedPhoneFilter,
					intent: selectedIntent === "all" ? undefined : selectedIntent,
					category: selectedCategory === "all" ? undefined : selectedCategory,
					minPrice: appliedMinPrice,
					maxPrice: appliedMaxPrice,
					location: appliedLocation,
				});
	}, [
		selectedStatus,
		searchQuery,
		selectedPhoneFilter,
		selectedIntent,
		selectedCategory,
		appliedMinPrice,
		appliedMaxPrice,
		appliedLocation,
	]);

	const fetchAnalyticsData = useCallback(() => fetchAnalytics(), []);

	const {
		data: posts,
		loading: isLoadingPosts,
		refetch: refetchPosts,
	} = useFetch(fetchPostsBySelectedStatus, false);

	const { data: analytics, loading: isLoadingAnalytics } =
		useFetch(fetchAnalyticsData);

	useEffect(() => {
		refetchPosts();
	}, [
		selectedStatus,
		selectedPhoneFilter,
		searchQuery,
		selectedIntent,
		selectedCategory,
		appliedMinPrice,
		appliedMaxPrice,
		appliedLocation,
		refetchPosts,
	]);

	useEffect(() => {
		setDisplayPosts(posts ?? []);
	}, [posts]);

	const handleStatusChange = (value: string) => setSelectedStatus(value);
	const handlePhoneFilterChange = (value: PhoneFilterOption) =>
		setSelectedPhoneFilter(value);
	const handleSearch = () => {
		setSearchQuery(searchInput.trim());
		setAppliedMinPrice(parseOptionalNumber(minPriceInput));
		setAppliedMaxPrice(parseOptionalNumber(maxPriceInput));
		setAppliedLocation(locationInput.trim());
	};

	const handleResetFilters = () => {
		setSelectedStatus("all");
		setSelectedPhoneFilter("all");
		setSelectedIntent("all");
		setSelectedCategory("all");
		setSearchInput("");
		setSearchQuery("");
		setMinPriceInput("");
		setMaxPriceInput("");
		setLocationInput("");
		setAppliedMinPrice(undefined);
		setAppliedMaxPrice(undefined);
		setAppliedLocation("");
	};

	const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
		const config = {
			approved: {
				icon: CheckCircle2,
				color: "bg-green-500",
				label: "Approved",
			},
			rejected: { icon: XCircle, color: "bg-red-500", label: "Rejected" },
			pending: { icon: Clock, color: "bg-yellow-500", label: "Pending" },
		}[status];

		const Icon = config.icon;
		return (
			<Badge className={`${config.color} text-white flex items-center gap-1`}>
				<Icon className="w-4 h-4" />
				{config.label}
			</Badge>
		);
	};

	const handleApprove = async (postId: string) => {
		try {
			setIsActionLoading(postId);
			await approvePost(postId);
			setDisplayPosts((prev) =>
				prev.map((post) =>
					post._id === postId ? { ...post, approvalStatus: "approved" } : post,
				),
			);
		} catch (err) {
			console.error("Error approving:", err);
		} finally {
			setIsActionLoading(null);
		}
	};

	const handleReject = async (postId: string) => {
		try {
			setIsActionLoading(postId);
			await rejectPost(postId);
			setDisplayPosts((prev) =>
				prev.map((post) =>
					post._id === postId ? { ...post, approvalStatus: "rejected" } : post,
				),
			);
		} catch (err) {
			console.error("Error rejecting:", err);
		} finally {
			setIsActionLoading(null);
		}
	};

	const handleDeletePost = async (postId: string) => {
		try {
			setIsActionLoading(postId);
			await deletePost(postId);
			setDisplayPosts((prev) => prev.filter((post) => post._id !== postId));
		} catch (err) {
			console.error("Error deleting:", err);
		} finally {
			setIsActionLoading(null);
		}
	};

	const formatPrice = (post: Post) => {
		const isRent = post.postType === "rent" || post.intent === "rent";

		if (isRent) {
			// For rent posts
			if (post.pricePerFrequency && post.frequency) {
				const rentPrice = Number(post.pricePerFrequency);
				if (Number.isNaN(rentPrice)) return "Price not set";
				const frequencyText =
					post.frequency === "day"
						? "day"
						: post.frequency === "week"
							? "week"
							: post.frequency === "month"
								? "month"
								: "year";
				return `₹${rentPrice.toLocaleString()}/${frequencyText}`;
			}
			// Fallback to legacy price field
			if (post.price !== undefined) {
				const legacyRentPrice = Number(post.price);
				if (!Number.isNaN(legacyRentPrice)) {
					return `₹${legacyRentPrice.toLocaleString()}/month`;
				}
			}
			return "Price not set";
		} else {
			// For sell posts
			if (post.totalPrice) {
				return `₹${Number(post.totalPrice).toLocaleString()}`;
			}
			if (post.pricePerUnit && post.unit) {
				return `₹${post.pricePerUnit.toLocaleString()}/${post.unit}`;
			}
			// Fallback to legacy price field
			if (post.price !== undefined) {
				const legacySellPrice = Number(post.price);
				if (!Number.isNaN(legacySellPrice)) {
					return `₹${legacySellPrice.toLocaleString()}`;
				}
			}
			return "Price not set";
		}
	};

	const formatCurrency = (amount: number | string) => {
		const num = typeof amount === "string" ? Number(amount) : amount;
		if (isNaN(num)) return "N/A";

		// Format large numbers in Indian currency format
		if (num >= 10000000) {
			// 1 crore
			return `₹${(num / 10000000).toFixed(1)}Cr`;
		} else if (num >= 100000) {
			// 1 lakh
			return `₹${(num / 100000).toFixed(1)}L`;
		} else if (num >= 1000) {
			// 1 thousand
			return `₹${(num / 1000).toFixed(1)}K`;
		}
		return `₹${num.toLocaleString()}`;
	};

	const formatPropertyType = (post: Post): string => {
		return post.propertyType || post.propertyCategory || "N/A";
	};

	const getUserInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const STATS_CARD_COLOR_STYLE: Record<
		string,
		{ bgClass: string; iconClass: string }
	> = {
		"text-blue-500": { bgClass: "bg-blue-100", iconClass: "text-blue-500" },
		"text-green-500": { bgClass: "bg-green-100", iconClass: "text-green-500" },
		"text-red-500": { bgClass: "bg-red-100", iconClass: "text-red-500" },
		"text-yellow-500": {
			bgClass: "bg-yellow-100",
			iconClass: "text-yellow-500",
		},
	};

	const StatsCard = ({
		title,
		value,
		icon: Icon,
		color,
	}: {
		title: string;
		value: number;
		icon: React.ElementType;
		color: string;
	}) => {
		const colorStyle =
			STATS_CARD_COLOR_STYLE[color] ?? STATS_CARD_COLOR_STYLE["text-blue-500"];

		return (
			<Card className="hover:border-primary/50 transition-colors">
				<CardHeader className="flex justify-between items-center pb-2">
					<CardTitle className="text-sm text-muted-foreground">
						{title}
					</CardTitle>
					<div className={`p-2 rounded-full ${colorStyle.bgClass}`}>
						<Icon className={`w-4 h-4 ${colorStyle.iconClass}`} />
					</div>
				</CardHeader>
				<CardContent>
					{isLoadingAnalytics ? (
						<Skeleton className="h-9 w-20" />
					) : (
						<div className="text-3xl font-bold">{value}</div>
					)}
				</CardContent>
			</Card>
		);
	};

	return (
		<div className="w-full">
			<div className="mx-auto max-w-[1600px] space-y-8 p-3 sm:p-4 md:p-8">
				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
					<StatsCard
						title="Total Posts"
						value={analytics?.postsRes ?? 0}
						icon={HomeIcon}
						color="text-blue-500"
					/>
					<StatsCard
						title="Approved"
						value={analytics?.approvedPostsRes ?? 0}
						icon={CheckCircle2}
						color="text-green-500"
					/>
					<StatsCard
						title="Rejected"
						value={analytics?.rejectedPostsRes ?? 0}
						icon={XCircle}
						color="text-red-500"
					/>
					<StatsCard
						title="Pending"
						value={analytics?.pendingPostsRes ?? 0}
						icon={Clock}
						color="text-yellow-500"
					/>
				</div>

				{/* Filter */}
				<div className="flex flex-col gap-4 rounded-lg bg-muted/50 p-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<h2 className="text-lg font-semibold">Posts</h2>
						<div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
							<Select value={selectedStatus} onValueChange={handleStatusChange}>
								<SelectTrigger className="w-full bg-background">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All status</SelectItem>
									<SelectItem value="approved">Approved</SelectItem>
									<SelectItem value="rejected">Rejected</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
								</SelectContent>
							</Select>
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
								value={selectedPhoneFilter}
								onValueChange={(value) =>
									handlePhoneFilterChange(value as PhoneFilterOption)
								}
							>
								<SelectTrigger className="w-full bg-background">
									<SelectValue placeholder="Phone filter" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All creators</SelectItem>
									<SelectItem value="withPhone">With phone number</SelectItem>
									<SelectItem value="withoutPhone">
										Without phone number
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<Input
							type="number"
							min={0}
							value={minPriceInput}
							onChange={(event) => setMinPriceInput(event.target.value)}
							placeholder="Min price"
							className="bg-background"
						/>
						<Input
							type="number"
							min={0}
							value={maxPriceInput}
							onChange={(event) => setMaxPriceInput(event.target.value)}
							placeholder="Max price"
							className="bg-background"
						/>
						<Input
							value={locationInput}
							onChange={(event) => setLocationInput(event.target.value)}
							placeholder="Area / Location (e.g. Matigara, Sevoke Road)"
							className="bg-background"
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-3">
						<Input
							value={searchInput}
							onChange={(event) => setSearchInput(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									handleSearch();
								}
							}}
							placeholder="Search by title, location, creator name/email"
							className="bg-background"
						/>
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
					</div>
				</div>

				<div className="space-y-3 md:hidden">
					{isLoadingPosts ? (
						<div className="rounded-md border bg-card p-4">
							<Skeleton className="h-4 w-full" />
						</div>
					) : !displayPosts?.length ? (
						<div className="rounded-md border bg-card p-8 text-center">
							<div className="flex flex-col items-center gap-2 text-muted-foreground">
								<AlertCircle className="h-8 w-8" />
								<p>No posts found</p>
							</div>
						</div>
					) : (
						displayPosts.map((post: Post) => (
							<div key={post._id} className="rounded-md border bg-card p-4">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1 space-y-2">
										<p
											className="line-clamp-2 text-sm font-semibold"
											title={post.title}
										>
											{post.title}
										</p>
										<p className="flex items-center gap-1 text-xs text-muted-foreground">
											<MapPin className="h-3 w-3" />
											<span className="line-clamp-2">
												{post.location || "N/A"}
											</span>
										</p>
										<div className="flex flex-wrap items-center gap-2">
											<Badge variant="secondary" className="capitalize">
												{post.intent || post.postType || "N/A"}
											</Badge>
											<Badge variant="outline" className="capitalize">
												{post.propertyCategory || post.propertyType || "N/A"}
											</Badge>
											{getStatusBadge(post.approvalStatus)}
										</div>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button size="sm" className="h-8 w-8 bg-gray-400 p-1">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() =>
													navigate(`/admin/posts/view-post/${post._id}`)
												}
											>
												View
											</DropdownMenuItem>
											<DropdownMenuItem
												disabled={isActionLoading === post._id}
												onClick={() => handleApprove(post._id)}
												className="text-green-600"
											>
												{isActionLoading === post._id
													? "Approving..."
													: "Approve"}
											</DropdownMenuItem>
											<DropdownMenuItem
												disabled={isActionLoading === post._id}
												onClick={() => handleReject(post._id)}
												className="text-red-600"
											>
												Reject
											</DropdownMenuItem>
											<DropdownMenuItem
												disabled={isActionLoading === post._id}
												onClick={() => handleDeletePost(post._id)}
												className="font-bold text-red-500 hover:text-red-200"
											>
												Delete Post
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<div className="mt-3 grid grid-cols-1 gap-2 text-xs text-muted-foreground">
									<p className="flex items-center gap-1">
										<IndianRupee className="h-3 w-3" />
										<span className="font-medium text-foreground">
											{formatPrice(post)}
										</span>
									</p>
									<p className="flex items-center gap-1">
										<Calendar className="h-3 w-3" />
										{convert_ISO_Date_to_Normal(post.createdAt ?? "")}
									</p>
									<p className="truncate">
										Creator: {post.user?.name || "Unknown User"}
									</p>
								</div>
							</div>
						))
					)}
				</div>

				{/* Table */}
				<div className="hidden overflow-hidden rounded-md border bg-card md:block">
					<div className="w-full overflow-x-auto">
						<Table>
							<TableHeader className="bg-muted/50">
								<TableRow>
									<TableHead className="min-w-[200px] ">
										Title & Location
									</TableHead>
									<TableHead className="min-w-[150px]">
										Intent & Category
									</TableHead>
									<TableHead className="min-w-[150px]">Price & Type</TableHead>
									<TableHead className="min-w-[180px] ">Created By</TableHead>
									<TableHead className="min-w-[120px]">Status</TableHead>
									<TableHead className="min-w-[150px]">Created At</TableHead>
									<TableHead className="min-w-[180px]">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{isLoadingPosts ? (
									<TableRow>
										<TableCell colSpan={7}>
											<Skeleton className="h-4 w-full" />
										</TableCell>
									</TableRow>
								) : !displayPosts?.length ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center py-10">
											<div className="flex flex-col items-center gap-2 text-muted-foreground">
												<AlertCircle className="h-8 w-8" />
												<p>No posts found</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									displayPosts.map((post: Post) => (
										<TableRow key={post._id}>
											<TableCell className="break-words whitespace-normal">
												<div className="space-y-1">
													<div
														className="font-medium line-clamp-1"
														title={post.title}
													>
														{post.title}
													</div>
													<div className="text-sm text-muted-foreground flex items-center gap-1">
														<MapPin className="w-3 h-3" />
														<span>{post.location}</span>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="text-sm font-medium">
														<Badge variant="secondary" className="capitalize">
															{post.intent || post.postType || "N/A"}
														</Badge>
													</div>
													<div className="text-sm text-muted-foreground">
														<Badge variant="outline" className="capitalize">
															{post.propertyCategory ||
																post.propertyType ||
																"N/A"}
														</Badge>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="flex items-center gap-1">
														<IndianRupee className="h-3 w-3" />
														<span className="font-medium">
															{formatPrice(post)}
														</span>
													</div>
													{/* Additional pricing details */}
													{(post.intent === "sell" ||
														post.postType === "sell") && (
														<>
															{post.pricePerUnit && post.unit && (
																<div className="text-xs text-muted-foreground">
																	{formatCurrency(post.pricePerUnit)}/
																	{post.unit}
																</div>
															)}
															{post.totalPrice && post.pricePerUnit && (
																<div className="text-xs text-green-600 font-medium">
																	Total: {formatCurrency(post.totalPrice)}
																</div>
															)}
														</>
													)}
													{(post.intent === "rent" ||
														post.postType === "rent") &&
														post.frequency && (
															<div className="text-xs text-muted-foreground capitalize">
																{post.frequency}ly rental
															</div>
														)}
													<div className="text-sm text-muted-foreground flex items-center gap-1">
														<Building2 className="h-3 w-3" />
														<Badge variant="outline" className="capitalize">
															{formatPropertyType(post)}
														</Badge>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														{/* Avatar display */}
														<div className="flex-shrink-0">
															{post.user?.avatar ? (
																<img
																	src={post.user.avatar}
																	alt={post.user.name || "User"}
																	className="w-8 h-8 rounded-full object-cover border border-gray-200"
																	onError={(e) => {
																		// Fallback to initials if image fails to load
																		const target = e.target as HTMLImageElement;
																		target.style.display = "none";
																		const initialsDiv =
																			target.nextElementSibling as HTMLDivElement;
																		if (initialsDiv)
																			initialsDiv.style.display = "flex";
																	}}
																/>
															) : null}
															<div
																className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium ${
																	post.user?.avatar ? "hidden" : "flex"
																}`}
															>
																{getUserInitials(post.user?.name)}
															</div>
														</div>
														<div className="min-w-0 flex-1">
															<span className="truncate font-medium block">
																{post.user?.name || "Unknown User"}
															</span>
														</div>
													</div>
													<div className="text-xs text-muted-foreground flex items-center gap-1">
														<span>{post.user?.email || "N/A"}</span>
														{post.user?.isVerified && (
															<>
																<span>|</span>
																<CheckCircle2 className="h-3 w-3 text-green-500" />
																<span>Verified</span>
															</>
														)}
													</div>
													{post.user?.phoneNumber && (
														<div className="text-xs text-muted-foreground">
															{post.user.phoneNumber}
														</div>
													)}
												</div>
											</TableCell>
											<TableCell>
												{getStatusBadge(post.approvalStatus)}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1 text-sm">
													<Calendar className="h-3 w-3" />
													{convert_ISO_Date_to_Normal(post.createdAt ?? "")}
												</div>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															size="sm"
															className="p-1 h-8 w-8 bg-gray-400"
														>
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() =>
																navigate(`/admin/posts/view-post/${post._id}`)
															}
														>
															View
														</DropdownMenuItem>
														<DropdownMenuItem
															disabled={isActionLoading === post._id}
															onClick={() => handleApprove(post._id)}
															className="text-green-600"
														>
															{isActionLoading === post._id
																? "Approving..."
																: "Approve"}
														</DropdownMenuItem>
														<DropdownMenuItem
															disabled={isActionLoading === post._id}
															onClick={() => handleReject(post._id)}
															className="text-red-600"
														>
															Reject
														</DropdownMenuItem>
														<DropdownMenuItem
															disabled={isActionLoading === post._id}
															onClick={() => handleDeletePost(post._id)}
															className="text-red-500 font-bold hover:text-red-200"
														>
															Delete Post
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManagePosts;
