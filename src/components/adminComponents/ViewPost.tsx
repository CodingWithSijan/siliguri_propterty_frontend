import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	IUniversalListingType,
	ISellListingType,
	IRentListingType,
} from "../../types/listingTypes";
import { IListingUserDetails } from "../../types/listingUserDetails";
import BASE_URL from "../../services";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	ArrowLeft,
	User,
	Phone,
	MapPin,
	Building2,
	IndianRupee,
	Calendar,
	CheckCircle2,
	XCircle,
	Clock,
	Home,
	Bed,
	Bath,
	Maximize,
} from "lucide-react";
import { approvePost, rejectPost } from "../../services/fetchFunctionsForAdmin";
import { showSuccess, showError } from "../../utils/toastUtils";

const ViewPost: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [listing, setListing] = useState<IUniversalListingType | null>(null);
	const [listingUserDetails, setListingUserDetails] =
		useState<IListingUserDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchListing = async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await BASE_URL.get(`/api/user/post/listingDetails/${id}`);
				setListing(res.data.listingDetails);
				setListingUserDetails(res.data.listingUser);
			} catch (error) {
				console.error("Failed to fetch listing:", error);
				setError("Failed to fetch listing details. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchListing();
	}, [id]);

	const handleApprove = async () => {
		if (!id) return;
		try {
			setActionLoading("approve");
			await approvePost(id);
			setListing((prev) =>
				prev ? { ...prev, approvalStatus: "approved" } : null
			);
			showSuccess("Post approved successfully");
		} catch (err) {
			console.error("Error approving:", err);
			showError("Failed to approve post");
		} finally {
			setActionLoading(null);
		}
	};

	const handleReject = async () => {
		if (!id) return;
		try {
			setActionLoading("reject");
			await rejectPost(id);
			setListing((prev) =>
				prev ? { ...prev, approvalStatus: "rejected" } : null
			);
			showSuccess("Post rejected successfully");
		} catch (err) {
			console.error("Error rejecting:", err);
			showError("Failed to reject post");
		} finally {
			setActionLoading(null);
		}
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

	const formatPrice = (listing: IUniversalListingType) => {
		if (listing.intent === "rent") {
			const rentListing = listing as IRentListingType;
			return rentListing.pricePerFrequency
				? `₹${rentListing.pricePerFrequency.toLocaleString()}/${
						rentListing.frequency || "month"
				  }`
				: "Price not set";
		}
		const sellListing = listing as ISellListingType;
		return sellListing.totalPrice
			? `₹${sellListing.totalPrice.toLocaleString()}`
			: sellListing.price || "Price not set";
	};

	const getPropertyDetails = (listing: IUniversalListingType) => {
		const details: string[] = [];

		// Type-safe property access
		if ("bedrooms" in listing && listing.bedrooms)
			details.push(`${listing.bedrooms} BHK`);
		if ("bathrooms" in listing && listing.bathrooms)
			details.push(`${listing.bathrooms} Bath`);
		if ("builtUpArea" in listing && listing.builtUpArea)
			details.push(`${listing.builtUpArea} sq.ft`);
		if ("shopArea" in listing && listing.shopArea)
			details.push(`${listing.shopArea} sq.ft`);
		if ("floor" in listing && listing.floor)
			details.push(`Floor: ${listing.floor}`);

		return details;
	};

	if (loading) {
		return (
			<div className="min-h-[400px] flex flex-col gap-4 p-6">
				<div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
				<div className="h-64 bg-gray-200 rounded-md animate-pulse" />
				<div className="grid grid-cols-2 gap-4">
					<div className="h-20 bg-gray-200 rounded animate-pulse" />
					<div className="h-20 bg-gray-200 rounded animate-pulse" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<Button onClick={() => window.location.reload()}>Try Again</Button>
				</div>
			</div>
		);
	}

	if (!listing) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Not Found</h2>
					<p className="text-gray-600">This property listing was not found.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<Button
					variant="outline"
					size="sm"
					onClick={() => navigate("/admin/posts")}
					className="flex items-center gap-2"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Posts
				</Button>
				<h1 className="text-2xl font-bold text-gray-900">Post Details</h1>
				{getStatusBadge(listing.approvalStatus)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Property Images */}
					{listing.pictures && listing.pictures.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Home className="w-5 h-5" />
									Property Images
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{listing.pictures.map((pic, index) => (
										<img
											key={index}
											src={pic}
											alt={`Property ${index + 1}`}
											className="w-full h-48 object-cover rounded-lg border"
										/>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Property Details */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Building2 className="w-5 h-5" />
								Property Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
								<div className="flex items-center gap-2 text-gray-600 mb-4">
									<MapPin className="w-4 h-4" />
									{listing.location}
								</div>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
										<Building2 className="w-4 h-4 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Type</p>
										<p className="font-medium">{listing.propertyCategory}</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
										<IndianRupee className="w-4 h-4 text-green-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Price</p>
										<p className="font-medium">{formatPrice(listing)}</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
										<Calendar className="w-4 h-4 text-purple-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Intent</p>
										<p className="font-medium capitalize">{listing.intent}</p>
									</div>
								</div>

								{getPropertyDetails(listing).map((detail, index) => (
									<div key={index} className="flex items-center gap-2">
										<div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
											{detail.includes("BHK") && (
												<Bed className="w-4 h-4 text-gray-600" />
											)}
											{detail.includes("Bath") && (
												<Bath className="w-4 h-4 text-gray-600" />
											)}
											{detail.includes("sq.ft") && (
												<Maximize className="w-4 h-4 text-gray-600" />
											)}
											{detail.includes("Floor") && (
												<Building2 className="w-4 h-4 text-gray-600" />
											)}
										</div>
										<div>
											<p className="text-sm text-gray-500">Feature</p>
											<p className="font-medium">{detail}</p>
										</div>
									</div>
								))}
							</div>

							{listing.description && (
								<div>
									<h4 className="font-semibold mb-2">Description</h4>
									<p className="text-gray-700 whitespace-pre-wrap">
										{listing.description}
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* User Information */}
					{listingUserDetails && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<User className="w-5 h-5" />
									Posted By
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-3">
									{listingUserDetails.avatar ? (
										<img
											src={listingUserDetails.avatar}
											alt="User avatar"
											className="w-12 h-12 rounded-full"
										/>
									) : (
										<div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
											<User className="w-6 h-6 text-gray-500" />
										</div>
									)}
									<div>
										<p className="font-medium">{listingUserDetails.name}</p>
										<p className="text-sm text-gray-500">Property Owner</p>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Phone className="w-4 h-4 text-gray-500" />
										<span className="text-sm">{listingUserDetails.phone}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Post Information */}
					<Card>
						<CardHeader>
							<CardTitle>Post Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="text-sm text-gray-500">Current Status</p>
								{getStatusBadge(listing.approvalStatus)}
							</div>
						</CardContent>
					</Card>

					{/* Admin Actions */}
					{listing.approvalStatus === "pending" && (
						<Card>
							<CardHeader>
								<CardTitle>Admin Actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									onClick={handleApprove}
									disabled={actionLoading === "approve"}
									className="w-full bg-green-600 hover:bg-green-700"
								>
									{actionLoading === "approve" ? (
										<>
											<span className="inline-flex items-center">
												<span className="h-2 w-2 bg-white rounded-full animate-pulse mr-2" />
												Approving...
											</span>
										</>
									) : (
										<>
											<CheckCircle2 className="w-4 h-4 mr-2" />
											Approve Post
										</>
									)}
								</Button>
								<Button
									onClick={handleReject}
									disabled={actionLoading === "reject"}
									variant="destructive"
									className="w-full"
								>
									{actionLoading === "reject" ? (
										<>
											<span className="inline-flex items-center">
												<span className="h-2 w-2 bg-white rounded-full animate-pulse mr-2" />
												Rejecting...
											</span>
										</>
									) : (
										<>
											<XCircle className="w-4 h-4 mr-2" />
											Reject Post
										</>
									)}
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
};

export default ViewPost;
