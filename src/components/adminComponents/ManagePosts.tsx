import { useState, useEffect } from "react";
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
	const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

	const {
		data: posts,
		loading: isLoadingPosts,
		refetch: refetchPosts,
	} = useFetch(
		() =>
			selectedStatus === "all"
				? fetchAllPosts()
				: fetchPostsByStatus(selectedStatus),
		false,
	);

	const { data: analytics, loading: isLoadingAnalytics } = useFetch(() =>
		fetchAnalytics(),
	);

	useEffect(() => {
		refetchPosts();
	}, [selectedStatus, refetchPosts]);

	const handleStatusChange = (value: string) => setSelectedStatus(value);

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
			await refetchPosts();
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
			await refetchPosts();
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
			await refetchPosts();
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
				const frequencyText =
					post.frequency === "day"
						? "day"
						: post.frequency === "week"
							? "week"
							: post.frequency === "month"
								? "month"
								: "year";
				return `₹${post.pricePerFrequency.toLocaleString()}/${frequencyText}`;
			}
			// Fallback to legacy price field
			return post.price
				? `₹${post.price.toLocaleString()}/month`
				: "Price not set";
		} else {
			// For sell posts
			if (post.totalPrice) {
				return `₹${Number(post.totalPrice).toLocaleString()}`;
			}
			if (post.pricePerUnit && post.unit) {
				return `₹${post.pricePerUnit.toLocaleString()}/${post.unit}`;
			}
			// Fallback to legacy price field
			return post.price ? `₹${post.price.toLocaleString()}` : "Price not set";
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

	const getUserInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
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
	}) => (
		<Card className="hover:border-primary/50 transition-colors">
			<CardHeader className="flex justify-between items-center pb-2">
				<CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
				<div className={`p-2 rounded-full bg-${color.replace("text-", "")}/10`}>
					<Icon className={`w-4 h-4 ${color}`} />
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

	return (
		<div className="h-[calc(100vh-2rem)] overflow-auto">
			<div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
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
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/50 p-4 rounded-lg">
					<h2 className="text-lg font-semibold">Posts</h2>
					<Select value={selectedStatus} onValueChange={handleStatusChange}>
						<SelectTrigger className="w-full sm:w-[200px] bg-background">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="approved">Approved</SelectItem>
							<SelectItem value="rejected">Rejected</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Table */}
				<div className="rounded-md border bg-card overflow-hidden">
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
								) : !posts?.length ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center py-10">
											<div className="flex flex-col items-center gap-2 text-muted-foreground">
												<AlertCircle className="h-8 w-8" />
												<p>No posts found</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									posts.map((post: Post) => (
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
														<Badge variant="outline">{post.propertyType}</Badge>
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
														<br />
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
