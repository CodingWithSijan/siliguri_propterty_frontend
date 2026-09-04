import React, { useMemo, useState } from "react";
import {
	Bath,
	BedDouble,
	ChevronLeft,
	ChevronRight,
	CalendarDays,
	Car,
	CheckCircle2,
	Clock3,
	Expand,
	Home,
	IndianRupee,
	Layers,
	MapPin,
	Phone,
	Ruler,
	Sparkles,
	Store,
	MessageSquare,
	X,
	XCircle,
} from "lucide-react";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";
import {
	IRentListingType,
	ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import { IListingUserDetails } from "../../types/listingUserDetails";
import { convert_ISO_Date_to_Normal } from "../../utils/convert_ISO_Date_to_Normal";
import {
	processDescription,
	getTruncatedHTML,
} from "../../utils/descriptionUtils";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { sendMessage } from "../../services/messaging";
import { showError, showSuccess } from "../../utils/toastUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

interface FeatureItem {
	label: string;
	value: string;
	icon: React.ReactNode;
}

interface ProfessionalListingDetailsProps {
	listing: IUniversalListingType;
	listingUserDetails: IListingUserDetails | null;
}

const toTitleCase = (value: string): string =>
	value
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

const isRentListing = (
	listing: IUniversalListingType,
): listing is IRentListingType => listing.intent === "rent";

const isSellListing = (
	listing: IUniversalListingType,
): listing is ISellListingType => listing.intent === "sell";

const toNumber = (value: unknown): number | null => {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.length === 0) {
			return null;
		}

		const parsed = Number(trimmed);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return null;
};

const getDisplayDate = (value?: string): string => {
	if (!value) {
		return "Not available";
	}

	return convert_ISO_Date_to_Normal(value);
};

const getDisplayPrice = (listing: IUniversalListingType): string => {
	if (isRentListing(listing)) {
		const rent = toNumber(listing.pricePerFrequency);
		if (rent !== null && listing.frequency) {
			return `${formatIndianCurrency(rent)} / ${listing.frequency}`;
		}
		return "Price on request";
	}

	if (isSellListing(listing) && listing.propertyCategory === "land") {
		const pricePerUnit = toNumber(listing.pricePerUnit);
		if (pricePerUnit !== null && listing.availableLandSpaceUnit) {
			return `${formatIndianCurrency(pricePerUnit)} / ${listing.availableLandSpaceUnit}`;
		}
	}

	if (isSellListing(listing)) {
		const totalPrice = toNumber(listing.totalPrice);
		if (totalPrice !== null) {
			return `${formatIndianCurrency(totalPrice)}`;
		}
	}

	if (isSellListing(listing)) {
		const sellPrice = toNumber(listing.price);
		if (sellPrice !== null) {
			return `${formatIndianCurrency(sellPrice)}`;
		}
	}

	return "Price on request";
};

const getPrimaryFacts = (listing: IUniversalListingType): FeatureItem[] => {
	const facts: FeatureItem[] = [];

	if (
		listing.propertyCategory === "house" ||
		listing.propertyCategory === "flat"
	) {
		if (listing.bedrooms !== undefined) {
			facts.push({
				label: "Bedrooms",
				value: String(listing.bedrooms),
				icon: <BedDouble className="h-5 w-5 text-sky-700" />,
			});
		}
		if (listing.bathrooms !== undefined) {
			facts.push({
				label: "Bathrooms",
				value: String(listing.bathrooms),
				icon: <Bath className="h-5 w-5 text-sky-700" />,
			});
		}
		if (listing.builtUpArea !== undefined) {
			facts.push({
				label: "Built-up Area",
				value: `${listing.builtUpArea} sq ft`,
				icon: <Ruler className="h-5 w-5 text-sky-700" />,
			});
		}
		if (listing.floor !== undefined) {
			facts.push({
				label: "Floor",
				value: String(listing.floor),
				icon: <Layers className="h-5 w-5 text-sky-700" />,
			});
		}
	}

	if (listing.propertyCategory === "shop") {
		if (listing.shopArea !== undefined) {
			facts.push({
				label: "Shop Area",
				value: `${listing.shopArea} sq ft`,
				icon: <Store className="h-5 w-5 text-sky-700" />,
			});
		}
		if (listing.hasShutter !== undefined) {
			facts.push({
				label: "Shutter",
				value: listing.hasShutter ? "Yes" : "No",
				icon: listing.hasShutter ? (
					<CheckCircle2 className="h-5 w-5 text-emerald-600" />
				) : (
					<XCircle className="h-5 w-5 text-rose-600" />
				),
			});
		}
	}

	if (isSellListing(listing) && listing.propertyCategory === "land") {
		if (listing.availableLandSpace && listing.availableLandSpaceUnit) {
			facts.push({
				label: "Land Area",
				value: `${listing.availableLandSpace} ${listing.availableLandSpaceUnit}`,
				icon: <MapPin className="h-5 w-5 text-sky-700" />,
			});
		}
		const pricePerUnit = toNumber(listing.pricePerUnit);
		if (pricePerUnit !== null) {
			facts.push({
				label: "Price / Unit",
				value: `${formatIndianCurrency(pricePerUnit)}`,
				icon: <IndianRupee className="h-5 w-5 text-sky-700" />,
			});
		}
	}

	if (listing.furnishing) {
		facts.push({
			label: "Furnishing",
			value: toTitleCase(String(listing.furnishing).split("-").join(" ")),
			icon: <Home className="h-5 w-5 text-sky-700" />,
		});
	}

	if (listing.parking !== undefined) {
		facts.push({
			label: "Parking",
			value: listing.parking ? "Available" : "Not available",
			icon: <Car className="h-5 w-5 text-sky-700" />,
		});
	}

	if (listing.attachedBathroom !== undefined) {
		facts.push({
			label: "Attached Bathroom",
			value: listing.attachedBathroom ? "Yes" : "No",
			icon: listing.attachedBathroom ? (
				<CheckCircle2 className="h-5 w-5 text-emerald-600" />
			) : (
				<XCircle className="h-5 w-5 text-rose-600" />
			),
		});
	}

	if (isRentListing(listing) && listing.availableFrom) {
		facts.push({
			label: "Available From",
			value: convert_ISO_Date_to_Normal(listing.availableFrom),
			icon: <CalendarDays className="h-5 w-5 text-sky-700" />,
		});
	}

	if (isRentListing(listing) && listing.frequency) {
		facts.push({
			label: "Billing",
			value: toTitleCase(listing.frequency),
			icon: <Clock3 className="h-5 w-5 text-sky-700" />,
		});
	}

	if (
		isRentListing(listing) &&
		listing.availableForDuration &&
		listing.availableForDurationUnit
	) {
		const unit =
			listing.availableForDuration > 1
				? `${listing.availableForDurationUnit}s`
				: listing.availableForDurationUnit;
		facts.push({
			label: "Lease Term",
			value: `${listing.availableForDuration} ${unit}`,
			icon: <Clock3 className="h-5 w-5 text-sky-700" />,
		});
	}

	return facts;
};

const ProfessionalListingDetails: React.FC<ProfessionalListingDetailsProps> = ({
	listing,
	listingUserDetails,
}) => {
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const navigate = useNavigate();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [expandedDescription, setExpandedDescription] = useState(false);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
	const [messageContent, setMessageContent] = useState("");
	const [sendingMessage, setSendingMessage] = useState(false);

	const images =
		listing.pictures && listing.pictures.length > 0
			? listing.pictures
			: [propertyImagePlaceholder];

	const selectedImage =
		images[Math.min(selectedIndex, images.length - 1)] ??
		propertyImagePlaceholder;
	const facts = useMemo(() => getPrimaryFacts(listing), [listing]);
	const { sanitizedHTML, shouldTruncate } = processDescription(
		listing.description,
		130,
	);
	const canShowMapLink =
		Array.isArray(listing.coordinates?.coordinates) &&
		listing.coordinates.coordinates.length === 2 &&
		listing.coordinates.coordinates.some((value) => value !== 0);

	const heroPill = isRentListing(listing) ? "For Rent" : "For Sale";
	const categoryLabel = toTitleCase(listing.propertyCategory);
	const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		listing.alternateLocation || listing.location,
	)}`;
	const mapCoordinateUrl = canShowMapLink
		? `https://www.google.com/maps?q=${listing.coordinates?.coordinates[1]},${listing.coordinates?.coordinates[0]}`
		: null;

	const previousImage = () => {
		setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const nextImage = () => {
		setSelectedIndex((prev) => (prev + 1) % images.length);
	};

	const handleSendOwnerMessage = async () => {
		if (!isAuthenticated) {
			showError("Please log in first to send messages");
			navigate("/login");
			return;
		}

		if (!listingUserDetails?.userId) {
			showError("Owner details unavailable");
			return;
		}

		if (!messageContent.trim()) {
			showError("Please write a message");
			return;
		}

		try {
			setSendingMessage(true);
			await sendMessage({
				toUserId: listingUserDetails.userId,
				content: messageContent.trim(),
				listingId: listing._id,
			});
			showSuccess("Message sent to owner");
			setMessageContent("");
			setIsMessageModalOpen(false);
		} catch {
			showError("Failed to send message");
		} finally {
			setSendingMessage(false);
		}
	};

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#ecfeff_0%,_#f8fafc_45%,_#eef2ff_100%)]">
			<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
				<section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-[0_22px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur">
					<div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.5fr_1fr]">
						<div className="p-4 sm:p-6 lg:p-7">
							<div className="mb-5 flex flex-wrap items-center gap-2">
								<span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
									{heroPill}
								</span>
								<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
									{categoryLabel}
								</span>
								<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
									{listing.approvalStatus}
								</span>
							</div>

							<h1 className="text-balance text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
								{listing.title}
							</h1>

							<div className="mt-4 flex items-start gap-2 text-slate-600">
								<MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
								<p className="text-sm sm:text-base">
									{listing.alternateLocation || listing.location}
								</p>
							</div>

							<div className="mt-2 text-xs text-slate-500 sm:text-sm">
								Locality: {listing.location}
							</div>

							<div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
								<div className="group relative h-64 w-full sm:h-80 lg:h-[420px]">
									<button
										type="button"
										onClick={() => setIsGalleryOpen(true)}
										className="h-full w-full cursor-zoom-in"
										aria-label="Open image gallery"
									>
										<img
											src={selectedImage}
											alt={listing.title}
											className="h-full w-full object-cover"
											onError={(event) => {
												const target = event.target as HTMLImageElement;
												target.src = propertyImagePlaceholder;
											}}
										/>
									</button>
									<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
									<div className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
										<Expand className="mr-1 inline h-3.5 w-3.5" />
										{images.length} photos
									</div>
								</div>

								{images.length > 1 && (
									<div className="grid grid-cols-4 gap-2 p-2 sm:grid-cols-6">
										{images.map((image, index) => {
											const isActive = selectedIndex === index;
											return (
												<button
													key={`${image}-${index}`}
													type="button"
													onClick={() => setSelectedIndex(index)}
													className={`overflow-hidden rounded-xl border transition ${
														isActive
															? "border-sky-600 ring-2 ring-sky-200"
															: "border-slate-200 hover:border-slate-300"
													}`}
												>
													<img
														src={image}
														alt={`${listing.title} ${index + 1}`}
														className="h-16 w-full object-cover"
														onError={(event) => {
															const target = event.target as HTMLImageElement;
															target.src = propertyImagePlaceholder;
														}}
													/>
												</button>
											);
										})}
									</div>
								)}
							</div>

							<Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
								<DialogContent
									showClose={false}
									className="max-w-[96vw] border-0 bg-black/95 p-3 sm:max-w-6xl sm:p-4"
								>
									<DialogTitle className="sr-only">
										Property image gallery
									</DialogTitle>
									<DialogDescription className="sr-only">
										Browse listing images in fullscreen.
									</DialogDescription>

									<div className="flex items-center justify-between px-1 pb-2 text-xs text-white/80 sm:text-sm">
										<div className="truncate pr-2">{listing.title}</div>
										<div>
											{selectedIndex + 1} / {images.length}
										</div>
									</div>

									<div className="relative flex h-[60vh] items-center justify-center overflow-hidden rounded-xl bg-black sm:h-[68vh]">
										<img
											src={selectedImage}
											alt={`${listing.title} image ${selectedIndex + 1}`}
											className="h-full w-full object-contain"
											onError={(event) => {
												const target = event.target as HTMLImageElement;
												target.src = propertyImagePlaceholder;
											}}
										/>

										{images.length > 1 && (
											<>
												<button
													type="button"
													onClick={previousImage}
													className="absolute left-2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
													aria-label="Previous image"
												>
													<ChevronLeft className="h-5 w-5" />
												</button>
												<button
													type="button"
													onClick={nextImage}
													className="absolute right-2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
													aria-label="Next image"
												>
													<ChevronRight className="h-5 w-5" />
												</button>
											</>
										)}

										<button
											type="button"
											onClick={() => setIsGalleryOpen(false)}
											className="absolute top-2 right-2 rounded-full bg-black/55 p-2 text-white transition hover:bg-black/75"
											aria-label="Close gallery"
										>
											<X className="h-5 w-5" />
										</button>
									</div>

									{images.length > 1 && (
										<div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
											{images.map((image, index) => (
												<button
													key={`modal-thumb-${index}`}
													type="button"
													onClick={() => setSelectedIndex(index)}
													className={`overflow-hidden rounded-lg border ${
														index === selectedIndex
															? "border-sky-400"
															: "border-slate-700"
													}`}
												>
													<img
														src={image}
														alt={`Thumbnail ${index + 1}`}
														className="h-12 w-full object-cover"
													/>
												</button>
											))}
										</div>
									)}
								</DialogContent>
							</Dialog>
						</div>

						<aside className="border-t border-slate-200 bg-slate-50/70 p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-7">
							<div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm sm:p-5">
								<p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
									Asking Price
								</p>
								<p className="mt-1 text-2xl font-bold text-emerald-700 sm:text-3xl">
									{getDisplayPrice(listing)}
								</p>
								{isRentListing(listing) &&
									toNumber(listing.pricePerFrequency) !== null &&
									listing.frequency && (
										<p className="mt-1 text-sm text-slate-500">
											Negotiable based on agreement and duration.
										</p>
									)}
							</div>

							<div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
								<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
									Agent / Owner
								</p>
								<div className="flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-sky-600 text-sm font-semibold text-white">
										{listingUserDetails?.avatar ? (
											<img
												src={listingUserDetails.avatar}
												alt={listingUserDetails.name}
												className="h-full w-full object-cover"
											/>
										) : (
											(listingUserDetails?.name?.charAt(0).toUpperCase() ?? "U")
										)}
									</div>
									<div>
										<p className="text-sm font-semibold text-slate-900">
											{listingUserDetails?.name || "Listing Owner"}
										</p>
										<p className="text-xs text-slate-500">
											Verified profile details
										</p>
									</div>
								</div>

								<div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
									{listingUserDetails?.phone ? (
										<a
											href={`tel:${listingUserDetails.phone}`}
											className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
										>
											<Phone className="h-4 w-4" />
											Call {listingUserDetails.phone}
										</a>
									) : (
										<div className="rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-center text-sm text-slate-500">
											Phone unavailable
										</div>
									)}

									<a
										href={mapCoordinateUrl ?? mapSearchUrl}
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
									>
										<MapPin className="h-4 w-4" />
										{mapCoordinateUrl ? "Open Exact Map" : "View on Map"}
									</a>

									<button
										type="button"
										onClick={() => setIsMessageModalOpen(true)}
										className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-800 transition hover:bg-sky-100"
									>
										<MessageSquare className="h-4 w-4" />
										Send Message
									</button>
								</div>
							</div>

							<div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
								<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
									Listing Timeline
								</p>
								<div className="space-y-2 text-sm text-slate-700">
									<p>
										<span className="font-medium text-slate-900">Posted:</span>{" "}
										{getDisplayDate(listing.createdAt)}
									</p>
									<p>
										<span className="font-medium text-slate-900">
											Last Updated:
										</span>{" "}
										{getDisplayDate(listing.updatedAt)}
									</p>
									<p>
										<span className="font-medium text-slate-900">Intent:</span>{" "}
										{toTitleCase(listing.intent)}
									</p>
								</div>
							</div>
						</aside>
					</div>
				</section>

				<section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
					<div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.35)] sm:p-6">
						<div className="mb-4 flex items-center gap-2">
							<Sparkles className="h-5 w-5 text-amber-600" />
							<h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
								Property Description
							</h2>
						</div>
						{sanitizedHTML ? (
							<>
								<div
									className="prose prose-sm max-w-none text-slate-700 sm:prose-base"
									dangerouslySetInnerHTML={{
										__html: expandedDescription
											? sanitizedHTML
											: shouldTruncate
												? getTruncatedHTML(sanitizedHTML, 130)
												: sanitizedHTML,
									}}
								/>
								{shouldTruncate && (
									<button
										type="button"
										onClick={() => setExpandedDescription((prev) => !prev)}
										className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
									>
										{expandedDescription ? "Show Less" : "Read More"}
									</button>
								)}
							</>
						) : (
							<p className="text-sm text-slate-500">
								No description available for this property.
							</p>
						)}
					</div>

					<div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.35)] sm:p-6">
						<h2 className="mb-4 text-lg font-semibold text-slate-900 sm:text-xl">
							Highlights & Specifications
						</h2>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{facts.length > 0 ? (
								facts.map((fact) => (
									<div
										key={`${fact.label}-${fact.value}`}
										className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
									>
										<div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
											{fact.icon}
											{fact.label}
										</div>
										<p className="text-sm font-medium text-slate-900">
											{fact.value}
										</p>
									</div>
								))
							) : (
								<p className="text-sm text-slate-500">
									No specific highlights were provided for this property.
								</p>
							)}
						</div>
					</div>
				</section>
			</div>
			<Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogTitle>Message the Owner</DialogTitle>
					<DialogDescription>
						Send your inquiry directly to{" "}
						{listingUserDetails?.name || "the owner"}.
					</DialogDescription>
					<div className="space-y-3">
						<Textarea
							rows={5}
							placeholder="Hi, I am interested in this property. Please share more details."
							value={messageContent}
							onChange={(event) => setMessageContent(event.target.value)}
						/>
						<div className="flex justify-end">
							<Button
								type="button"
								onClick={handleSendOwnerMessage}
								disabled={sendingMessage}
							>
								{sendingMessage ? "Sending..." : "Send Message"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ProfessionalListingDetails;
