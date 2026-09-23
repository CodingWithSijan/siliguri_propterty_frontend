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
	ArrowRight,
	Bath,
	Bed,
	Building2,
	Calendar,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Eye,
	Home,
	Layers,
	MapPin,
	Phone,
	Ruler,
	ShieldCheck,
	Tag,
	User,
	XCircle,
} from "lucide-react";
import { approvePost, rejectPost } from "../../services/fetchFunctionsForAdmin";
import { showSuccess, showError } from "../../utils/toastUtils";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";
import { sanitizeHTML } from "../../utils/descriptionUtils";

const ViewPost: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [listing, setListing] = useState<IUniversalListingType | null>(null);
	const [listingUserDetails, setListingUserDetails] =
		useState<IListingUserDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [activeImageIndex, setActiveImageIndex] = useState(0);

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
				prev ? { ...prev, approvalStatus: "approved" } : null,
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
				prev ? { ...prev, approvalStatus: "rejected" } : null,
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

	const getPostedAgoLabel = (value?: string): string => {
		if (!value) {
			return "Recently added";
		}

		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return "Recently added";
		}

		const diffMs = Date.now() - date.getTime();
		if (diffMs <= 0) {
			return "Just now";
		}

		const day = 24 * 60 * 60 * 1000;
		const days = Math.floor(diffMs / day);
		if (days < 7) {
			return `${days} day${days === 1 ? "" : "s"} ago`;
		}

		if (days < 30) {
			const weeks = Math.floor(days / 7);
			return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
		}

		if (days < 365) {
			const months = Math.floor(days / 30);
			return `${months} month${months === 1 ? "" : "s"} ago`;
		}

		const years = Math.floor(days / 365);
		return `${years} year${years === 1 ? "" : "s"} ago`;
	};

	const formatDate = (value?: string): string => {
		if (!value) {
			return "Not available";
		}

		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return "Not available";
		}

		return date.toLocaleDateString("en-IN", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatPrice = (listing: IUniversalListingType) => {
		if (listing.intent === "rent") {
			const rentListing = listing as IRentListingType;
			if (rentListing.pricePerFrequency && rentListing.frequency) {
				return `₹${rentListing.pricePerFrequency.toLocaleString()}/${rentListing.frequency}`;
			}
			return rentListing.pricePerFrequency
				? `₹${rentListing.pricePerFrequency.toLocaleString()}/month`
				: "Price not set";
		}
		const sellListing = listing as ISellListingType;
		if (
			sellListing.propertyCategory === "land" &&
			sellListing.pricePerUnit &&
			sellListing.availableLandSpaceUnit
		) {
			return `₹${sellListing.pricePerUnit.toLocaleString()}/${sellListing.availableLandSpaceUnit}`;
		}
		return sellListing.totalPrice
			? `₹${sellListing.totalPrice.toLocaleString()}`
			: sellListing.price || "Price not set";
	};

	const formatAmount = (value: number): string => {
		return `₹${new Intl.NumberFormat("en-IN").format(value)}`;
	};

	const toNumber = (value: unknown): number | null => {
		if (typeof value === "number" && Number.isFinite(value)) {
			return value;
		}

		if (typeof value === "string") {
			const parsed = Number(value);
			return Number.isFinite(parsed) ? parsed : null;
		}

		return null;
	};

	const getPriceCards = (listing: IUniversalListingType) => {
		const cards: Array<{ label: string; value: string; hint?: string }> = [];

		if (listing.intent === "rent") {
			const rentListing = listing as IRentListingType;
			const rent = toNumber(rentListing.pricePerFrequency);
			if (rent !== null) {
				cards.push({
					label: "Rent",
					value: `${formatAmount(rent)} per ${rentListing.frequency || "month"}`,
				});
			}
			return cards;
		}

		const sellListing = listing as ISellListingType;
		const totalPrice = toNumber(sellListing.totalPrice ?? sellListing.price);
		const rate = toNumber(sellListing.pricePerUnit);
		const unit = String(
			sellListing.availableLandSpaceUnit || sellListing.unit || "",
		)
			.trim()
			.toLowerCase();

		if (totalPrice !== null) {
			cards.push({
				label: "Total Price",
				value: formatAmount(totalPrice),
			});
		}

		if (rate !== null && unit) {
			cards.push({
				label: "Unit Rate",
				value: `${formatAmount(rate)} per ${unit}`,
			});

			if (unit === "bigha") {
				const perKatha = rate / 20;
				cards.push({
					label: "Derived Rate",
					value: `${formatAmount(Math.round(perKatha))} per katha`,
					hint: "1 bigha = 20 katha",
				});
			}

			if (unit === "katha") {
				const perBigha = rate * 20;
				cards.push({
					label: "Derived Rate",
					value: `${formatAmount(Math.round(perBigha))} per bigha`,
					hint: "1 bigha = 20 katha",
				});
			}
		}

		if (cards.length === 0) {
			cards.push({
				label: "Price",
				value: formatPrice(listing),
			});
		}

		return cards;
	};

	const images =
		listing?.pictures && listing.pictures.length > 0
			? listing.pictures
			: [propertyImagePlaceholder];

	const sanitizedDescription = listing?.description
		? sanitizeHTML(listing.description)
		: "";

	const priceCards = listing ? getPriceCards(listing) : [];

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
		<div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
			<div className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#f8fafc_100%)] p-5 dark:border-slate-700 dark:bg-[linear-gradient(135deg,#0f172a_0%,#111827_48%,#0f172a_100%)] md:p-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigate("/admin/posts")}
							className="mb-4 flex items-center gap-2 bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to moderation queue
						</Button>
						<div className="mb-2 flex flex-wrap items-center gap-2">
							{getStatusBadge(listing.approvalStatus)}
							<Badge variant="outline" className="capitalize">
								{listing.intent}
							</Badge>
							<Badge variant="outline" className="capitalize">
								{listing.propertyCategory}
							</Badge>
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
							{listing.title}
						</h1>
						<p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
							<MapPin className="h-4 w-4" />
							{listing.wbLocalityLabel ||
								listing.alternateLocation ||
								listing.location}
						</p>
					</div>
					<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
						<p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
							Moderation Snapshot
						</p>
						<div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
							<p className="inline-flex items-center gap-2">
								<Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
								Listed {getPostedAgoLabel(listing.createdAt)}
							</p>
							<p className="inline-flex items-center gap-2">
								<Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
								{listing.viewCount ?? 0} views
							</p>
							<p className="inline-flex items-center gap-2">
								<Tag className="h-4 w-4 text-slate-500 dark:text-slate-400" />
								{listing.listingStatus === "sold" ? "Closed" : "Active"}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				<div className="space-y-6 xl:col-span-2">
					<Card className="overflow-hidden border-slate-200 dark:border-slate-700 dark:bg-slate-900">
						<CardContent className="p-0">
							<div className="relative h-[280px] bg-slate-100 dark:bg-slate-800 sm:h-[360px]">
								<img
									src={images[activeImageIndex]}
									alt={listing.title}
									className="h-full w-full object-cover"
								/>
								{images.length > 1 && (
									<>
										<button
											type="button"
											onClick={() =>
												setActiveImageIndex(
													(prev) => (prev - 1 + images.length) % images.length,
												)
											}
											className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white/90 p-1.5 text-slate-700 dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-100"
											aria-label="Previous image"
										>
											<ChevronLeft className="h-4 w-4" />
										</button>
										<button
											type="button"
											onClick={() =>
												setActiveImageIndex(
													(prev) => (prev + 1) % images.length,
												)
											}
											className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white/90 p-1.5 text-slate-700 dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-100"
											aria-label="Next image"
										>
											<ChevronRight className="h-4 w-4" />
										</button>
									</>
								)}
							</div>
							{images.length > 1 && (
								<div className="grid grid-cols-5 gap-2 border-t border-slate-200 p-3 dark:border-slate-700 sm:grid-cols-7 lg:grid-cols-8">
									{images.map((image, index) => (
										<button
											key={`${image}-${index}`}
											type="button"
											onClick={() => setActiveImageIndex(index)}
											className={`overflow-hidden rounded-md border ${
												activeImageIndex === index
													? "border-sky-500 ring-2 ring-sky-200"
													: "border-slate-200 dark:border-slate-700"
											}`}
										>
											<img
												src={image}
												alt={`Thumb ${index + 1}`}
												className="h-14 w-full object-cover"
											/>
										</button>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-900">
						<CardHeader>
							<CardTitle className="text-xl text-slate-900 dark:text-slate-100">
								Property Overview
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-5">
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{priceCards.map((card) => (
									<div
										key={`${card.label}-${card.value}`}
										className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60"
									>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											{card.label}
										</p>
										<p className="mt-1 min-h-6 text-base font-semibold text-slate-900 dark:text-slate-100">
											{card.value}
										</p>
										{card.hint ? (
											<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
												{card.hint}
											</p>
										) : null}
									</div>
								))}
								<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
									<p className="text-xs text-slate-500 dark:text-slate-400">
										Property Type
									</p>
									<p className="mt-1 min-h-6 text-base font-semibold capitalize text-slate-900 dark:text-slate-100">
										{listing.propertyCategory}
									</p>
								</div>
								<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
									<p className="text-xs text-slate-500 dark:text-slate-400">
										Intent
									</p>
									<p className="mt-1 min-h-6 text-base font-semibold capitalize text-slate-900 dark:text-slate-100">
										{listing.intent}
									</p>
								</div>
							</div>

							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{"bedrooms" in listing && listing.bedrooms !== undefined && (
									<div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
										<p className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
											<Bed className="h-4 w-4" /> Bedrooms
										</p>
										<p className="mt-1 min-h-6 font-semibold text-slate-900 dark:text-slate-100">
											{listing.bedrooms}
										</p>
									</div>
								)}
								{"bathrooms" in listing && listing.bathrooms !== undefined && (
									<div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
										<p className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
											<Bath className="h-4 w-4" /> Bathrooms
										</p>
										<p className="mt-1 min-h-6 font-semibold text-slate-900 dark:text-slate-100">
											{listing.bathrooms}
										</p>
									</div>
								)}
								{"builtUpArea" in listing &&
									listing.builtUpArea !== undefined && (
										<div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
											<p className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
												<Ruler className="h-4 w-4" /> Built-up area
											</p>
											<p className="mt-1 min-h-6 font-semibold text-slate-900 dark:text-slate-100">
												{listing.builtUpArea} sq ft
											</p>
										</div>
									)}
								{"shopArea" in listing && listing.shopArea !== undefined && (
									<div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
										<p className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
											<Home className="h-4 w-4" /> Shop area
										</p>
										<p className="mt-1 min-h-6 font-semibold text-slate-900 dark:text-slate-100">
											{listing.shopArea} sq ft
										</p>
									</div>
								)}
								{"floor" in listing && listing.floor !== undefined && (
									<div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
										<p className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
											<Layers className="h-4 w-4" /> Floor
										</p>
										<p className="mt-1 min-h-6 font-semibold text-slate-900 dark:text-slate-100">
											{listing.floor}
										</p>
									</div>
								)}
							</div>

							{sanitizedDescription && (
								<div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
									<h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
										Description
									</h3>
									<div
										className="prose prose-sm max-w-none leading-7 text-slate-700 dark:prose-invert dark:text-slate-200"
										dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
									/>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-900">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-slate-100">
								<User className="h-5 w-5" />
								Owner Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							{listingUserDetails ? (
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										{listingUserDetails.avatar ? (
											<img
												src={listingUserDetails.avatar}
												alt={listingUserDetails.name}
												className="h-12 w-12 rounded-full border border-slate-200 object-cover dark:border-slate-700"
											/>
										) : (
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
												<User className="h-5 w-5" />
											</div>
										)}
										<div>
											<p className="font-semibold text-slate-900 dark:text-slate-100">
												{listingUserDetails.name}
											</p>
											<p className="text-sm text-slate-500 dark:text-slate-400">
												Listing owner
											</p>
										</div>
									</div>
									<p className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
										<Phone className="h-4 w-4" />
										{listingUserDetails.phone || "Phone not provided"}
									</p>
								</div>
							) : (
								<p className="text-sm text-slate-500 dark:text-slate-400">
									User details unavailable.
								</p>
							)}
						</CardContent>
					</Card>

					<Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-900">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-slate-100">
								<ShieldCheck className="h-5 w-5" />
								Moderation Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
							<p className="inline-flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Created: {formatDate(listing.createdAt)}
							</p>
							<p className="inline-flex items-center gap-2">
								<ArrowRight className="h-4 w-4" />
								Updated: {formatDate(listing.updatedAt)}
							</p>
							<p className="inline-flex items-center gap-2">
								<Building2 className="h-4 w-4" />
								Status:{" "}
								{listing.listingStatus === "sold" ? "Closed" : "Available"}
							</p>
							<div className="pt-1">
								{getStatusBadge(listing.approvalStatus)}
							</div>
						</CardContent>
					</Card>

					{listing.approvalStatus === "pending" && (
						<Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-900">
							<CardHeader>
								<CardTitle className="text-lg text-slate-900 dark:text-slate-100">
									Moderation Actions
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									onClick={handleApprove}
									disabled={actionLoading !== null}
									className="w-full bg-emerald-600 hover:bg-emerald-700"
								>
									{actionLoading === "approve"
										? "Approving..."
										: "Approve listing"}
								</Button>
								<Button
									onClick={handleReject}
									disabled={actionLoading !== null}
									variant="destructive"
									className="w-full"
								>
									{actionLoading === "reject"
										? "Rejecting..."
										: "Reject listing"}
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
