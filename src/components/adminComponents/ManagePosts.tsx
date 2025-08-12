import { useState, useEffect } from "react";
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
	User,
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
	fetchAllPosts,
	fetchAnalytics,
	fetchPostsByStatus,
	rejectPost,
} from "../../services/fetchFunctionsForAdmin";
import { Skeleton } from "../ui/skeleton";

import { IUniversalListingType } from "../../types/listingTypes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ManagePosts = () => {
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
		false
	);

	const { data: analytics, loading: isLoadingAnalytics } = useFetch(() =>
		fetchAnalytics()
	);

	useEffect(() => {
		refetchPosts();
	}, [selectedStatus]);

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

	const formatPrice = (post: any) => {
		if (post.intent === "rent") {
			return post.pricePerFrequency
				? `₹${post.pricePerFrequency.toLocaleString()}/${
						post.frequency || "month"
				  }`
				: "Price not set";
		}
		return post.totalPrice
			? `₹${post.totalPrice.toLocaleString()}`
			: post.price || "Price not set";
	};

	const getPropertyDetails = (post: IUniversalListingType) => {
		const details: string[] = [];
		if ("bedrooms" in post && post.bedrooms)
			details.push(`${post.bedrooms} BHK`);
		if ("builtUpArea" in post && post.builtUpArea)
			details.push(`${post.builtUpArea} sq.ft`);
		if ("shopArea" in post && post.shopArea)
			details.push(`${post.shopArea} sq.ft`);
		return details.join(" • ");
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
									<TableHead className="min-w-[200px]">
										Price & Category
									</TableHead>
									<TableHead className="min-w-[180px] ">Created By</TableHead>
									<TableHead className="min-w-[120px]">Status</TableHead>
									<TableHead className="min-w-[150px]">Created At</TableHead>
									<TableHead className="min-w-[180px]">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{isLoadingPosts ? (
									<TableRow>
										<TableCell colSpan={6}>
											<Skeleton className="h-4 w-full" />
										</TableCell>
									</TableRow>
								) : !posts?.length ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-10">
											<div className="flex flex-col items-center gap-2 text-muted-foreground">
												<AlertCircle className="h-8 w-8" />
												<p>No posts found</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									posts.map((post: any) => (
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
													<div className="flex items-center gap-1">
														<IndianRupee className="h-3 w-3" />
														<span>{formatPrice(post)}</span>
													</div>
													<div className="text-sm text-muted-foreground flex items-center gap-1">
														<Building2 className="h-3 w-3" />
														<Badge variant="outline">
															{post.propertyCategory}
														</Badge>
													</div>
													<div className="text-xs text-muted-foreground">
														{getPropertyDetails(post)}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														{post.user?.avatar ? (
															<img
																src={post.user.avatar}
																alt="avatar"
																className="w-6 h-6 rounded-full"
															/>
														) : (
															<User className="h-4 w-4 text-muted-foreground" />
														)}
														<span className="truncate">
															{post.user?.email || "Unknown"}
														</span>
													</div>
													<div className="text-xs text-muted-foreground flex items-center gap-1">
														<span>{post.user?.name || "N/A"}</span>
														<span>|</span>
														<span>{post.user?.phoneNumber || "N/A"}</span>
													</div>
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
															onClick={() => console.log("View", post._id)}
														>
															View
														</DropdownMenuItem>

														{post.approvalStatus === "pending" && (
															<>
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
															</>
														)}
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
