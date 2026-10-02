import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	Bath,
	BedDouble,
	ChevronLeft,
	ChevronRight,
	CalendarDays,
	Car,
	CheckCircle2,
	Clock3,
	Home,
	IndianRupee,
	Layers,
	Maximize2,
	MapPin,
	Minimize2,
	Phone,
	Ruler,
	Share2,
	Heart,
	Store,
	MessageSquare,
	X,
	ZoomIn,
	ZoomOut,
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
import { sendMessage } from "../../services/messaging";
import { showError, showInfo, showSuccess } from "../../utils/toastUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { applySeoMeta } from "../../utils/seo";
import { optimizeCloudinaryImage } from "../../utils/optimizeCloudinaryImage";

interface FeatureItem {
	label: string;
	value: string;
	icon: React.ReactNode;
}

interface DetailItem {
	label: string;
	value: string;
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

const isVideoUrl = (url: string): boolean => {
	const lower = url.toLowerCase();
	if (lower.includes("/video/upload/")) return true;
	if (lower.includes("/image/upload/")) return false;
	return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(lower);
};

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

const getPostedAgoLabel = (value?: string): string => {
	if (!value) {
		return "Posted recently";
	}

	const postedAt = new Date(value);
	if (Number.isNaN(postedAt.getTime())) {
		return "Posted recently";
	}

	const now = new Date();
	const diffMs = now.getTime() - postedAt.getTime();
	if (diffMs <= 0) {
		return "Posted just now";
	}

	const dayMs = 24 * 60 * 60 * 1000;
	const days = Math.floor(diffMs / dayMs);

	if (days === 0) {
		return "Posted Today";
	}

	if (days < 7) {
		return `Posted ${days} day${days === 1 ? "" : "s"} ago`;
	}

	if (days < 30) {
		const weeks = Math.floor(days / 7);
		return `Posted ${weeks} week${weeks === 1 ? "" : "s"} ago`;
	}

	if (days < 365) {
		const months = Math.floor(days / 30);
		return `Posted ${months} month${months === 1 ? "" : "s"} ago`;
	}

	const years = Math.floor(days / 365);
	return `Posted ${years} year${years === 1 ? "" : "s"} ago`;
};

const getDisplayPrice = (listing: IUniversalListingType): string => {
	if (isRentListing(listing)) {
		const rent = toNumber(listing.pricePerFrequency);
		if (rent !== null && listing.frequency) {
			return `₹${formatIndianCurrency(rent)} / ${listing.frequency}`;
		}
		return "Price on request";
	}

	if (isSellListing(listing) && listing.propertyCategory === "land") {
		const pricePerUnit = toNumber(listing.pricePerUnit);
		if (pricePerUnit !== null && listing.availableLandSpaceUnit) {
			return `₹${formatIndianCurrency(pricePerUnit)} / ${listing.availableLandSpaceUnit}`;
		}
	}

	if (isSellListing(listing)) {
		const totalPrice = toNumber(listing.totalPrice);
		if (totalPrice !== null) {
			return `₹${formatIndianCurrency(totalPrice)}`;
		}
	}

	if (isSellListing(listing)) {
		const sellPrice = toNumber(listing.price);
		if (sellPrice !== null) {
			return `₹${formatIndianCurrency(sellPrice)}`;
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
		if (typeof listing.bedrooms === "number" && listing.bedrooms > 0) {
			facts.push({
				label: "Bedrooms",
				value: String(listing.bedrooms),
				icon: <BedDouble className="h-5 w-5 text-sky-700" />,
			});
		}
		if (typeof listing.bathrooms === "number" && listing.bathrooms > 0) {
			facts.push({
				label: "Bathrooms",
				value: String(listing.bathrooms),
				icon: <Bath className="h-5 w-5 text-sky-700" />,
			});
		}
		if (typeof listing.builtUpArea === "number" && listing.builtUpArea > 0) {
			facts.push({
				label: "Built-up Area",
				value: `${listing.builtUpArea} sq ft`,
				icon: <Ruler className="h-5 w-5 text-sky-700" />,
			});
		}
		if (typeof listing.floor === "number" && listing.floor >= 0) {
			facts.push({
				label: "Floor",
				value: String(listing.floor),
				icon: <Layers className="h-5 w-5 text-sky-700" />,
			});
		}
	}

	if (listing.propertyCategory === "shop") {
		if (typeof listing.shopArea === "number" && listing.shopArea > 0) {
			facts.push({
				label: "Shop Area",
				value: `${listing.shopArea} sq ft`,
				icon: <Store className="h-5 w-5 text-sky-700" />,
			});
		}
		if (listing.hasShutter) {
			facts.push({
				label: "Shutter",
				value: "Available",
				icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
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
				value: `₹${formatIndianCurrency(pricePerUnit)}`,
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

	if (listing.parking) {
		facts.push({
			label: "Parking",
			value: "Available",
			icon: <Car className="h-5 w-5 text-sky-700" />,
		});
	}

	if (listing.attachedBathroom) {
		facts.push({
			label: "Attached Bathroom",
			value: "Yes",
			icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
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
	const [zoomLevel, setZoomLevel] = useState(1);
	const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
	const [isTouchInteracting, setIsTouchInteracting] = useState(false);
	const touchStart = useRef<{ x: number; y: number } | null>(null);
	const panStart = useRef<{
		x: number;
		y: number;
		offsetX: number;
		offsetY: number;
	} | null>(null);
	const pinchStart = useRef<{
		distance: number;
		zoom: number;
		offsetX: number;
		offsetY: number;
		centerX: number;
		centerY: number;
	} | null>(null);
	const galleryViewportRef = useRef<HTMLDivElement>(null);
	const galleryImageRef = useRef<HTMLImageElement>(null);
	const [isImageFullscreen, setIsImageFullscreen] = useState(false);
	const [inquiryName, setInquiryName] = useState("");
	const [inquiryPhone, setInquiryPhone] = useState("");
	const [inquiryVisitDate, setInquiryVisitDate] = useState("");
	const [inquiryMessage, setInquiryMessage] = useState("");
	const [isSaved, setIsSaved] = useState(false);
	const [sendingMessage, setSendingMessage] = useState(false);
	const MIN_ZOOM = 1;
	const MAX_ZOOM = 4;
	const ZOOM_STEP = 0.25;

	const images =
		listing.pictures && listing.pictures.length > 0
			? listing.pictures
			: [propertyImagePlaceholder];
	const videos = (listing.videos ?? []).filter((video) => isVideoUrl(video));

	const selectedImage =
		images[Math.min(selectedIndex, images.length - 1)] ??
		propertyImagePlaceholder;
	const heroImage = optimizeCloudinaryImage(selectedImage, {
		width: 1800,
		height: 1200,
		crop: "fill",
		quality: "auto:best",
	});
	const galleryMainImage = optimizeCloudinaryImage(selectedImage, {
		width: 2600,
		height: 1800,
		crop: "limit",
		quality: "auto:best",
	});
	const clampImageOffset = (offset: { x: number; y: number }, zoom: number) => {
		const viewport = galleryViewportRef.current;
		const image = galleryImageRef.current;
		if (!viewport || !image?.naturalWidth || !image.naturalHeight) {
			return offset;
		}

		const fitScale = Math.min(
			viewport.clientWidth / image.naturalWidth,
			viewport.clientHeight / image.naturalHeight,
		);
		const maxX = Math.max(
			0,
			(image.naturalWidth * fitScale * zoom - viewport.clientWidth) / 2,
		);
		const maxY = Math.max(
			0,
			(image.naturalHeight * fitScale * zoom - viewport.clientHeight) / 2,
		);

		return {
			x: Math.max(-maxX, Math.min(maxX, offset.x)),
			y: Math.max(-maxY, Math.min(maxY, offset.y)),
		};
	};
	const facts = useMemo(() => getPrimaryFacts(listing), [listing]);
	const displayPrice = useMemo(() => getDisplayPrice(listing), [listing]);
	const { sanitizedHTML, shouldTruncate } = processDescription(
		listing.description,
		130,
	);
	const canShowMapLink =
		Array.isArray(listing.coordinates?.coordinates) &&
		listing.coordinates.coordinates.length === 2 &&
		listing.coordinates.coordinates.some((value) => value !== 0);

	const heroPill = isRentListing(listing) ? "For Rent" : "For Sale";
	const isVerifiedListing = listing.approvalStatus === "approved";
	const categoryLabel = toTitleCase(listing.propertyCategory);
	const localityLabel =
		listing.wbLocalityLabel?.trim() || listing.location?.trim() || "";
	const exactAddressLabel = listing.alternateLocation?.trim() || "";
	const locationSummary =
		localityLabel &&
		exactAddressLabel &&
		localityLabel.toLowerCase() !== exactAddressLabel.toLowerCase()
			? `${exactAddressLabel}, ${localityLabel}`
			: exactAddressLabel || localityLabel || "Location not provided";
	const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		locationSummary,
	)}`;
	const mapCoordinateUrl = canShowMapLink
		? `https://www.google.com/maps?q=${listing.coordinates?.coordinates[1]},${listing.coordinates?.coordinates[0]}`
		: null;
	const mapEmbedUrl = canShowMapLink
		? `https://maps.google.com/maps?q=${listing.coordinates?.coordinates[1]},${listing.coordinates?.coordinates[0]}&z=15&output=embed`
		: `https://maps.google.com/maps?q=${encodeURIComponent(locationSummary)}&z=14&output=embed`;
	const whatsappPhone = (listingUserDetails?.phone ?? "").replace(/\D/g, "");
	const whatsappUrl = whatsappPhone
		? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hi, I am interested in your property: ${listing.title}`)}`
		: null;
	const amenityItems = useMemo(() => {
		const amenities: string[] = [];

		if (listing.parking) {
			amenities.push("Parking");
		}

		if (listing.attachedBathroom) {
			amenities.push("Attached Bathroom");
		}

		if (listing.furnishing) {
			amenities.push(
				toTitleCase(String(listing.furnishing).replace(/-/g, " ")),
			);
		}

		if (listing.propertyCategory === "shop" && listing.hasShutter) {
			amenities.push("Front Shutter");
		}

		if (
			isRentListing(listing) &&
			listing.availableForDuration &&
			listing.availableForDurationUnit
		) {
			const durationUnit =
				listing.availableForDuration > 1
					? `${listing.availableForDurationUnit}s`
					: listing.availableForDurationUnit;
			amenities.push(
				`Available for ${listing.availableForDuration} ${durationUnit}`,
			);
		}

		return amenities;
	}, [listing]);

	const additionalDetails = useMemo<DetailItem[]>(() => {
		const details: DetailItem[] = [];

		details.push({
			label: "Property Category",
			value: categoryLabel,
		});

		if (listing.listingStatus && listing.listingStatus !== "available") {
			details.push({
				label: "Status",
				value: toTitleCase(listing.listingStatus),
			});
		}

		if (localityLabel) {
			details.push({
				label: "Locality",
				value: localityLabel,
			});
		}

		if (isRentListing(listing) && listing.frequency) {
			details.push({
				label: "Rent Billing",
				value: toTitleCase(listing.frequency),
			});
		}

		if (isSellListing(listing) && listing.propertyCategory === "land") {
			if (listing.availableLandSpace && listing.availableLandSpaceUnit) {
				details.push({
					label: "Land Size",
					value: `${listing.availableLandSpace} ${listing.availableLandSpaceUnit}`,
				});
			}
			const totalPrice = toNumber(listing.totalPrice);
			if (totalPrice !== null) {
				details.push({
					label: "Total Land Price",
					value: `₹${formatIndianCurrency(totalPrice)}`,
				});
			}
		}

		return details;
	}, [categoryLabel, listing, localityLabel]);

	useEffect(() => {
		const savedRaw = localStorage.getItem("savedListings");
		if (!savedRaw) {
			setIsSaved(false);
			return;
		}

		try {
			const parsed = JSON.parse(savedRaw) as string[];
			setIsSaved(parsed.includes(listing._id));
		} catch {
			setIsSaved(false);
		}
	}, [listing._id]);

	useEffect(() => {
		const price = getDisplayPrice(listing);
		const canonicalPath =
			typeof window !== "undefined" && window.location?.pathname
				? `${window.location.pathname}${window.location.search}`
				: `/${listing.intent === "rent" ? "rentals" : "buys"}/${listing.propertyCategory}/${listing._id}`;

		applySeoMeta({
			title: `${listing.title} | Siliguri Property`,
			description: `${listing.title} in ${locationSummary}. ${price}. View property details, photos, map location and enquiry options on Siliguri Property.`,
			canonicalPath,
			ogType: "article",
			robots:
				listing.approvalStatus === "approved" &&
				listing.listingStatus !== "sold"
					? "index, follow"
					: "noindex, follow",
		});
	}, [listing, locationSummary]);

	const handleShareListing = async () => {
		const backendBase = String(import.meta.env.VITE_BACKEND_URL ?? "").replace(
			/\/$/,
			"",
		);
		const shareUrl = backendBase
			? `${backendBase}/api/user/post/share/${listing._id}`
			: window.location.href;
		const price = getDisplayPrice(listing);
		const summaryFacts = facts
			.slice(0, 3)
			.map((fact) => `${fact.label}: ${fact.value}`)
			.join(" | ");
		const shareText = `${listing.title}\n${heroPill} • ${categoryLabel}\n${price}\n${locationSummary}${summaryFacts ? `\n${summaryFacts}` : ""}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: `${listing.title} | SiliguriProperty`,
					text: shareText,
					url: shareUrl,
				});
				return;
			} catch {
				// fallback to clipboard below
			}
		}

		try {
			await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
			showSuccess("Property overview and link copied");
		} catch {
			showError("Unable to share this listing");
		}
	};

	const handleToggleSave = () => {
		if (!isAuthenticated) {
			showInfo("Please log in to save listings");
			navigate("/login");
			return;
		}

		const savedRaw = localStorage.getItem("savedListings");
		let savedListings: string[] = [];

		if (savedRaw) {
			try {
				savedListings = JSON.parse(savedRaw) as string[];
			} catch {
				savedListings = [];
			}
		}

		if (savedListings.includes(listing._id)) {
			const updated = savedListings.filter((id) => id !== listing._id);
			localStorage.setItem("savedListings", JSON.stringify(updated));
			setIsSaved(false);
			showInfo("Removed from saved listings");
			return;
		}

		savedListings.push(listing._id);
		localStorage.setItem("savedListings", JSON.stringify(savedListings));
		setIsSaved(true);
		showSuccess("Saved to your local favorites");
	};

	const previousImage = () => {
		setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
		setZoomLevel(MIN_ZOOM);
		setImageOffset({ x: 0, y: 0 });
	};

	const nextImage = () => {
		setSelectedIndex((prev) => (prev + 1) % images.length);
		setZoomLevel(MIN_ZOOM);
		setImageOffset({ x: 0, y: 0 });
	};

	const handleGalleryTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
		if (event.touches.length === 2) {
			touchStart.current = null;
			panStart.current = null;
			const first = event.touches[0];
			const second = event.touches[1];
			const rect = galleryViewportRef.current?.getBoundingClientRect();
			if (!rect) return;

			pinchStart.current = {
				distance: Math.max(
					1,
					Math.hypot(
						second.clientX - first.clientX,
						second.clientY - first.clientY,
					),
				),
				zoom: zoomLevel,
				offsetX: imageOffset.x,
				offsetY: imageOffset.y,
				centerX: (first.clientX + second.clientX) / 2 - rect.left,
				centerY: (first.clientY + second.clientY) / 2 - rect.top,
			};
			setIsTouchInteracting(true);
			return;
		}

		if (event.touches.length !== 1) {
			touchStart.current = null;
			panStart.current = null;
			return;
		}

		pinchStart.current = null;
		const touch = event.touches[0];
		if (zoomLevel > MIN_ZOOM) {
			touchStart.current = null;
			panStart.current = {
				x: touch.clientX,
				y: touch.clientY,
				offsetX: imageOffset.x,
				offsetY: imageOffset.y,
			};
			setIsTouchInteracting(true);
			return;
		}

		panStart.current = null;
		touchStart.current = { x: touch.clientX, y: touch.clientY };
	};

	const handleGalleryTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
		const rect = galleryViewportRef.current?.getBoundingClientRect();
		if (!rect) return;

		if (event.touches.length === 2 && pinchStart.current) {
			event.preventDefault();
			const first = event.touches[0];
			const second = event.touches[1];
			const start = pinchStart.current;
			const distance = Math.hypot(
				second.clientX - first.clientX,
				second.clientY - first.clientY,
			);
			const zoom = Math.max(
				MIN_ZOOM,
				Math.min(MAX_ZOOM, start.zoom * (distance / start.distance)),
			);
			const centerX = (first.clientX + second.clientX) / 2 - rect.left;
			const centerY = (first.clientY + second.clientY) / 2 - rect.top;
			const scaleRatio = zoom / start.zoom;
			const offset = clampImageOffset(
				{
					x:
						centerX -
						rect.width / 2 -
						scaleRatio * (start.centerX - rect.width / 2 - start.offsetX),
					y:
						centerY -
						rect.height / 2 -
						scaleRatio * (start.centerY - rect.height / 2 - start.offsetY),
				},
				zoom,
			);
			setZoomLevel(zoom);
			setImageOffset(offset);
			return;
		}

		if (event.touches.length === 1 && panStart.current) {
			event.preventDefault();
			const touch = event.touches[0];
			setImageOffset(
				clampImageOffset(
					{
						x: panStart.current.offsetX + touch.clientX - panStart.current.x,
						y: panStart.current.offsetY + touch.clientY - panStart.current.y,
					},
					zoomLevel,
				),
			);
		}
	};

	const handleGalleryTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
		if (event.touches.length === 1 && pinchStart.current) {
			pinchStart.current = null;
			const touch = event.touches[0];
			panStart.current =
				zoomLevel > MIN_ZOOM
					? {
							x: touch.clientX,
							y: touch.clientY,
							offsetX: imageOffset.x,
							offsetY: imageOffset.y,
						}
					: null;
			return;
		}

		const start = touchStart.current;
		touchStart.current = null;
		if (event.touches.length > 0) return;
		if (pinchStart.current || panStart.current) {
			pinchStart.current = null;
			panStart.current = null;
			setIsTouchInteracting(false);
			return;
		}

		if (!start || event.changedTouches.length === 0) {
			return;
		}

		const touch = event.changedTouches[0];
		const deltaX = touch.clientX - start.x;
		const deltaY = touch.clientY - start.y;
		if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) {
			return;
		}

		if (deltaX < 0) {
			nextImage();
		} else {
			previousImage();
		}
	};

	const applyZoom = (zoom: number) => {
		setZoomLevel(zoom);
		setImageOffset((current) =>
			zoom <= MIN_ZOOM ? { x: 0, y: 0 } : clampImageOffset(current, zoom),
		);
	};

	const zoomIn = () => {
		applyZoom(Math.min(MAX_ZOOM, Number((zoomLevel + ZOOM_STEP).toFixed(2))));
	};

	const zoomOut = () => {
		applyZoom(Math.max(MIN_ZOOM, Number((zoomLevel - ZOOM_STEP).toFixed(2))));
	};

	const closeGallery = () => {
		setIsGalleryOpen(false);
		setZoomLevel(MIN_ZOOM);
		setImageOffset({ x: 0, y: 0 });
	};

	const handleWheelZoom = (event: React.WheelEvent<HTMLDivElement>) => {
		event.preventDefault();
		if (event.deltaY < 0) {
			zoomIn();
			return;
		}
		zoomOut();
	};

	const toggleFullscreen = async () => {
		try {
			if (!document.fullscreenElement) {
				await document.documentElement.requestFullscreen();
				return;
			}
			await document.exitFullscreen();
		} catch {
			showError("Fullscreen is not supported on this browser");
		}
	};

	useEffect(() => {
		const onFullscreenChange = () => {
			setIsImageFullscreen(Boolean(document.fullscreenElement));
		};

		document.addEventListener("fullscreenchange", onFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", onFullscreenChange);
		};
	}, []);

	useEffect(() => {
		if (!isGalleryOpen) {
			return;
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsGalleryOpen(false);
				setZoomLevel(MIN_ZOOM);
				setImageOffset({ x: 0, y: 0 });
				return;
			}

			if (event.key === "ArrowLeft") {
				setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
				setZoomLevel(MIN_ZOOM);
				setImageOffset({ x: 0, y: 0 });
				return;
			}

			if (event.key === "ArrowRight") {
				setSelectedIndex((prev) => (prev + 1) % images.length);
				setZoomLevel(MIN_ZOOM);
				setImageOffset({ x: 0, y: 0 });
				return;
			}

			if (event.key === "+" || event.key === "=") {
				event.preventDefault();
				setZoomLevel((prev) =>
					Math.min(MAX_ZOOM, Number((prev + ZOOM_STEP).toFixed(2))),
				);
				setImageOffset({ x: 0, y: 0 });
				return;
			}

			if (event.key === "-" || event.key === "_") {
				event.preventDefault();
				setZoomLevel((prev) =>
					Math.max(MIN_ZOOM, Number((prev - ZOOM_STEP).toFixed(2))),
				);
				setImageOffset({ x: 0, y: 0 });
				return;
			}

			if (event.key.toLowerCase() === "r") {
				setZoomLevel(MIN_ZOOM);
				setImageOffset({ x: 0, y: 0 });
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [isGalleryOpen, images.length, MAX_ZOOM, MIN_ZOOM, ZOOM_STEP]);

	const handleSendOwnerMessage = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!isAuthenticated) {
			showError("Please log in first to send messages");
			navigate("/login");
			return;
		}

		if (!listingUserDetails?.userId) {
			showError("Owner details unavailable");
			return;
		}

		if (inquiryPhone.trim()) {
			const cleaned = inquiryPhone.replace(/\D/g, "");
			if (cleaned.length < 10 || cleaned.length > 15) {
				showError("Please enter a valid phone number");
				return;
			}
		}

		const messageBody =
			inquiryMessage.trim() ||
			`I would like to request a visit for this property: ${listing.title}. Please contact me with available time slots.`;

		if (!messageBody.trim()) {
			showError("Unable to compose your request. Please try again.");
			return;
		}

		const composedMessage = [
			"Request Type: Property Visit",
			inquiryName.trim() ? `Name: ${inquiryName.trim()}` : null,
			inquiryPhone.trim() ? `Phone: ${inquiryPhone.trim()}` : null,
			inquiryVisitDate ? `Preferred Visit Date: ${inquiryVisitDate}` : null,
			`Message: ${messageBody}`,
		]
			.filter(Boolean)
			.join("\n");

		try {
			setSendingMessage(true);
			await sendMessage({
				toUserId: listingUserDetails.userId,
				content: composedMessage,
				listingId: listing._id,
			});
			showSuccess("Visit request sent to owner");
			setInquiryName("");
			setInquiryPhone("");
			setInquiryVisitDate("");
			setInquiryMessage("");
		} catch {
			showError("Failed to send message");
		} finally {
			setSendingMessage(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
			<div className="mx-auto w-full max-w-[1720px] px-3 py-5 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 lg:py-8">
				<div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,0.9fr)] xl:items-start">
					<div className="space-y-6">
						<section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-200/40">
							<div className="p-2">
								<button
									type="button"
									onClick={() => {
										setSelectedIndex(0);
										setIsGalleryOpen(true);
									}}
									className="group relative w-full overflow-hidden rounded-2xl"
								>
									<img
										src={heroImage}
										alt={listing.title}
										className="h-[260px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-[380px] xl:h-[480px]"
										onError={(event) => {
											const target = event.target as HTMLImageElement;
											target.src = propertyImagePlaceholder;
										}}
									/>
								</button>

								{images.length > 1 && (
									<div className="mt-2 flex gap-2 overflow-x-auto pb-1">
										{images.map((image, index) => (
											<button
												key={`thumb-${index}`}
												type="button"
												onClick={() => {
													setSelectedIndex(index);
													setIsGalleryOpen(true);
												}}
												className={`relative shrink-0 overflow-hidden rounded-xl border transition ${
													index === selectedIndex
														? "border-emerald-500"
														: "border-slate-200 hover:border-slate-300"
												}`}
											>
												<img
													src={optimizeCloudinaryImage(image, {
														width: 360,
														height: 240,
														crop: "fill",
														quality: "auto:good",
													})}
													alt={`${listing.title} image ${index + 1}`}
													className="h-20 w-28 object-cover sm:h-24 sm:w-36"
													onError={(event) => {
														const target = event.target as HTMLImageElement;
														target.src = propertyImagePlaceholder;
													}}
												/>
											</button>
										))}
									</div>
								)}
							</div>
						</section>

						{videos.length > 0 && (
							<section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/40 sm:p-6">
								<div className="mb-4 flex items-center justify-between">
									<h2 className="text-xl font-semibold text-slate-900">
										Property Videos
									</h2>
									<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
										{videos.length} video{videos.length > 1 ? "s" : ""}
									</span>
								</div>
								<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
									{videos.map((video, index) => (
										<video
											key={`listing-video-${index}`}
											src={video}
											controls
											playsInline
											preload="metadata"
											className="h-[220px] w-full rounded-2xl border border-slate-200 bg-black object-cover sm:h-[260px]"
											poster={heroImage}
										>
											Your browser does not support the video tag.
										</video>
									))}
								</div>
							</section>
						)}

						<section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/40 sm:p-6">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div className="flex flex-wrap items-center gap-2">
									{isVerifiedListing && (
										<span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
											Verified
										</span>
									)}
									<span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
										{heroPill}
									</span>
									<span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
										{categoryLabel}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => {
											void handleShareListing();
										}}
										className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
									>
										<Share2 className="h-3.5 w-3.5" /> Share
									</button>
									<button
										type="button"
										onClick={handleToggleSave}
										className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
									>
										<Heart
											className={`h-3.5 w-3.5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`}
										/>
										{isSaved ? "Saved" : "Save"}
									</button>
								</div>
							</div>

							<div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
								<div className="min-w-0">
									<h1 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
										{listing.title}
									</h1>
									<p className="mt-2 inline-flex items-start gap-2 text-sm text-slate-700 sm:text-base">
										<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
										{locationSummary}
									</p>
								</div>
								<div className="w-full text-right md:w-auto md:min-w-[220px] md:self-start md:pt-1">
									<p className="text-xl font-semibold leading-tight text-emerald-700 sm:text-2xl">
										{displayPrice}
									</p>
								</div>
							</div>

							{facts.length > 0 && (
								<div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
									{facts.slice(0, 8).map((fact) => (
										<div
											key={`${fact.label}-${fact.value}`}
											className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
										>
											<div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
												{fact.icon}
												{fact.label}
											</div>
											<p className="text-sm font-bold text-slate-900 sm:text-base">
												{fact.value}
											</p>
										</div>
									))}
								</div>
							)}

							{additionalDetails.length > 0 && (
								<div className="mt-6 border-t border-slate-200 pt-6">
									<h2 className="text-xl font-semibold text-slate-900">
										Property Details
									</h2>
									<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
										{additionalDetails.map((detail) => (
											<div
												key={`${detail.label}-${detail.value}`}
												className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
											>
												<p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
													{detail.label}
												</p>
												<p className="mt-1 text-sm font-semibold text-slate-900">
													{detail.value}
												</p>
											</div>
										))}
									</div>
								</div>
							)}

							<div className="mt-6 border-t border-slate-200 pt-6">
								<h2 className="text-xl font-semibold text-slate-900">
									Overview
								</h2>
								{sanitizedHTML ? (
									<>
										<div
											className="mt-3 prose prose-sm max-w-none text-slate-700 sm:prose-base"
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
									<p className="mt-3 text-sm text-slate-500">
										No description available for this property.
									</p>
								)}
							</div>

							{amenityItems.length > 0 && (
								<div className="mt-6 border-t border-slate-200 pt-6">
									<h2 className="text-xl font-semibold text-slate-900">
										Amenities
									</h2>
									<div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
										{amenityItems.map((amenity) => (
											<div
												key={amenity}
												className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
											>
												<CheckCircle2 className="h-4 w-4" />
												{amenity}
											</div>
										))}
									</div>
								</div>
							)}
						</section>

						<Dialog
							open={isGalleryOpen}
							onOpenChange={(open) => {
								setIsGalleryOpen(open);
								if (!open) {
									setZoomLevel(MIN_ZOOM);
									setImageOffset({ x: 0, y: 0 });
								}
							}}
						>
							<DialogContent
								showClose={false}
								className="!top-0 !left-0 !right-0 !bottom-0 !h-screen !w-screen !max-w-none !translate-x-0 !translate-y-0 sm:!max-w-none rounded-none border-0 bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.95)_0%,_rgba(2,6,23,0.98)_55%)] p-2 sm:p-3"
							>
								<DialogTitle className="sr-only">
									Property image gallery
								</DialogTitle>
								<DialogDescription className="sr-only">
									Browse listing images in fullscreen.
								</DialogDescription>

								<div
									ref={galleryViewportRef}
									className="relative flex h-[calc(100vh-96px)] touch-none items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/60 sm:h-[calc(100vh-120px)]"
									onWheel={handleWheelZoom}
									onTouchStart={handleGalleryTouchStart}
									onTouchMove={handleGalleryTouchMove}
									onTouchEnd={handleGalleryTouchEnd}
									onTouchCancel={() => {
										touchStart.current = null;
										panStart.current = null;
										pinchStart.current = null;
										setIsTouchInteracting(false);
									}}
								>
									<div className="absolute right-2 top-2 z-20 flex flex-col gap-2 sm:right-3 sm:top-3">
										<button
											type="button"
											onClick={zoomOut}
											disabled={zoomLevel <= MIN_ZOOM}
											className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white transition hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-40"
											aria-label="Zoom out"
										>
											<ZoomOut className="h-4 w-4" />
										</button>
										<button
											type="button"
											onClick={zoomIn}
											disabled={zoomLevel >= MAX_ZOOM}
											className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white transition hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-40"
											aria-label="Zoom in"
										>
											<ZoomIn className="h-4 w-4" />
										</button>
										<button
											type="button"
											onClick={() => {
												void toggleFullscreen();
											}}
											className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white transition hover:bg-black/50"
											aria-label={
												isImageFullscreen
													? "Exit fullscreen"
													: "Enter fullscreen"
											}
										>
											{isImageFullscreen ? (
												<Minimize2 className="h-4 w-4" />
											) : (
												<Maximize2 className="h-4 w-4" />
											)}
										</button>
										<button
											type="button"
											onClick={closeGallery}
											className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-300/40 bg-rose-500/20 text-white transition hover:bg-rose-500/35"
											aria-label="Close gallery"
										>
											<X className="h-4 w-4" />
										</button>
									</div>

									<img
										ref={galleryImageRef}
										src={galleryMainImage}
										alt={`${listing.title} image ${selectedIndex + 1}`}
										className={`h-full w-full cursor-zoom-in object-contain ${isTouchInteracting ? "transition-none" : "transition-transform duration-200 ease-out"}`}
										style={{
											transform: `translate(${imageOffset.x}px, ${imageOffset.y}px) scale(${zoomLevel})`,
											transformOrigin: "center center",
										}}
										onDoubleClick={() => {
											setZoomLevel((prev) =>
												prev === MIN_ZOOM ? 2 : MIN_ZOOM,
											);
										}}
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

									<div className="absolute bottom-3 left-3 z-20 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
										{Math.round(zoomLevel * 100)}%
									</div>
								</div>

								<div className="mt-2 flex items-center justify-between px-1 text-xs text-white/75">
									<div className="truncate pr-2">{listing.title}</div>
									<div className="shrink-0">
										{selectedIndex + 1} / {images.length}
									</div>
								</div>

								{images.length > 1 && (
									<div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
										{images.map((image, index) => (
											<button
												key={`modal-thumb-${index}`}
												type="button"
												onClick={() => {
													setSelectedIndex(index);
													setZoomLevel(MIN_ZOOM);
													setImageOffset({ x: 0, y: 0 });
												}}
												className={`overflow-hidden rounded-lg border ${
													index === selectedIndex
														? "border-sky-400"
														: "border-white/25"
												}`}
											>
												<img
													src={optimizeCloudinaryImage(image, {
														width: 280,
														height: 176,
														crop: "fill",
														quality: "auto:good",
													})}
													alt={`Thumbnail ${index + 1}`}
													className="h-11 w-full object-cover"
												/>
											</button>
										))}
									</div>
								)}
							</DialogContent>
						</Dialog>

						<section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-200/40">
							<div className="border-b border-slate-200 px-5 py-4 sm:px-6">
								<h2 className="text-xl font-semibold text-slate-900">
									Location Map
								</h2>
								<p className="mt-1 text-sm text-slate-600">{locationSummary}</p>
							</div>
							<iframe
								src={mapEmbedUrl}
								title="Property location map"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								className="h-[300px] w-full border-0 sm:h-[360px]"
							/>
						</section>
					</div>

					<aside className="space-y-4 lg:sticky lg:top-24">
						<section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/40 sm:p-6">
							<div className="flex items-center gap-3 border-b border-slate-200 pb-4">
								<div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-sm font-semibold text-white">
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
									<p className="text-xs text-slate-500">Property contact</p>
								</div>
							</div>

							<div className="mt-4 space-y-2">
								{listingUserDetails?.phone ? (
									<a
										href={`tel:${listingUserDetails.phone}`}
										className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
									>
										<Phone className="h-4 w-4" />
										Call {listingUserDetails.phone}
									</a>
								) : (
									<div className="rounded-lg border border-dashed border-slate-300 px-4 py-2.5 text-center text-sm text-slate-500">
										Phone unavailable
									</div>
								)}

								{whatsappUrl && (
									<a
										href={whatsappUrl}
										target="_blank"
										rel="noreferrer"
										className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
									>
										<MessageSquare className="h-4 w-4" />
										Chat on WhatsApp
									</a>
								)}

								<a
									href={mapCoordinateUrl ?? mapSearchUrl}
									target="_blank"
									rel="noreferrer"
									className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
								>
									<MapPin className="h-4 w-4" />
									View on Map
								</a>
							</div>

							<div className="mt-5 border-t border-slate-200 pt-5">
								<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
									Request Visit
								</p>
								<form
									className="mt-3 space-y-3"
									onSubmit={handleSendOwnerMessage}
								>
									<input
										type="text"
										value={inquiryName}
										onChange={(event) => setInquiryName(event.target.value)}
										placeholder="Your name"
										className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-300"
									/>
									<input
										type="tel"
										value={inquiryPhone}
										onChange={(event) => setInquiryPhone(event.target.value)}
										placeholder="Phone number"
										className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-300"
									/>
									<input
										type="date"
										value={inquiryVisitDate}
										onChange={(event) =>
											setInquiryVisitDate(event.target.value)
										}
										className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-300"
									/>
									<textarea
										rows={4}
										value={inquiryMessage}
										onChange={(event) => setInquiryMessage(event.target.value)}
										placeholder="Add extra message (optional)"
										className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-300"
									/>
									<button
										type="submit"
										disabled={sendingMessage}
										className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
									>
										{sendingMessage ? "Sending Inquiry..." : "Send Inquiry"}
									</button>
								</form>
							</div>

							<div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
								{getPostedAgoLabel(listing.createdAt)}
							</div>
						</section>
					</aside>
				</div>
			</div>
		</div>
	);
};

export default ProfessionalListingDetails;
