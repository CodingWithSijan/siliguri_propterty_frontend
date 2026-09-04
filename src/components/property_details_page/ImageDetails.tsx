import React, { useEffect, useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Expand,
	Maximize2,
	Minimize2,
	X,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

const Image_UserDetails: React.FC<{
	listing_images: string[] | undefined;
	listing_title: string | "";
}> = ({ listing_images, listing_title }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);
	const [isImageFullscreen, setIsImageFullscreen] = useState(false);
	const MIN_ZOOM = 1;
	const MAX_ZOOM = 4;
	const ZOOM_STEP = 0.25;

	const images =
		listing_images && listing_images.length > 0
			? listing_images
			: [propertyImagePlaceholder];

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
		setZoomLevel(MIN_ZOOM);
	};

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
		setZoomLevel(MIN_ZOOM);
	};

	const handleImageClick = (index: number) => {
		setCurrentImageIndex(index);
		setZoomLevel(MIN_ZOOM);
		setIsModalOpen(true);
	};

	const closeGallery = () => {
		setIsModalOpen(false);
		setZoomLevel(MIN_ZOOM);
	};

	const zoomIn = () => {
		setZoomLevel((prev) =>
			Math.min(MAX_ZOOM, Number((prev + ZOOM_STEP).toFixed(2))),
		);
	};

	const zoomOut = () => {
		setZoomLevel((prev) =>
			Math.max(MIN_ZOOM, Number((prev - ZOOM_STEP).toFixed(2))),
		);
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
			// Ignore unsupported fullscreen requests.
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
		if (!isModalOpen) {
			return;
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeGallery();
				return;
			}

			if (event.key === "ArrowRight") {
				nextImage();
				return;
			}

			if (event.key === "ArrowLeft") {
				prevImage();
				return;
			}

			if (event.key === "+" || event.key === "=") {
				event.preventDefault();
				zoomIn();
				return;
			}

			if (event.key === "-" || event.key === "_") {
				event.preventDefault();
				zoomOut();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [isModalOpen, images.length]);

	return (
		<div className="w-full overflow-hidden border border-slate-200 bg-white">
			{/* Listing Image */}
			<div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 bg-gray-100 group cursor-pointer">
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogTrigger asChild>
						<img
							src={images[0]}
							alt={listing_title}
							className="w-full h-full object-cover cursor-pointer transition-opacity group-hover:opacity-80"
							onClick={() => handleImageClick(0)}
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = propertyImagePlaceholder;
							}}
						/>
					</DialogTrigger>

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
							className="relative flex h-[calc(100vh-96px)] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/60 sm:h-[calc(100vh-120px)]"
							onWheel={handleWheelZoom}
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
										isImageFullscreen ? "Exit fullscreen" : "Enter fullscreen"
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
								src={images[currentImageIndex]}
								alt={`${listing_title} - Image ${currentImageIndex + 1}`}
								className="h-full w-full cursor-zoom-in select-none object-contain transition-transform duration-200 ease-out"
								style={{ transform: `scale(${zoomLevel})` }}
								onDoubleClick={() => {
									setZoomLevel((prev) => (prev === MIN_ZOOM ? 2 : MIN_ZOOM));
								}}
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = propertyImagePlaceholder;
								}}
							/>

							{/* Navigation arrows */}
							{images.length > 1 && (
								<>
									<button
										type="button"
										onClick={prevImage}
										className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
										aria-label="Previous image"
									>
										<ChevronLeft className="h-5 w-5" />
									</button>
									<button
										type="button"
										onClick={nextImage}
										className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/65"
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
							<div className="truncate pr-2">{listing_title}</div>
							<div className="shrink-0">
								{currentImageIndex + 1} / {images.length}
							</div>
						</div>

						{images.length > 1 && (
							<div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-8">
								{images.map((image, index) => (
									<button
										key={index}
										type="button"
										onClick={() => {
											setCurrentImageIndex(index);
											setZoomLevel(MIN_ZOOM);
										}}
										className={`overflow-hidden rounded-lg border ${
											index === currentImageIndex
												? "border-sky-400"
												: "border-white/25"
										}`}
									>
										<img
											src={image}
											alt={`Thumbnail ${index + 1}`}
											className="h-11 w-full object-cover"
											onError={(e) => {
												const target = e.target as HTMLImageElement;
												target.src = propertyImagePlaceholder;
											}}
										/>
									</button>
								))}
							</div>
						)}
					</DialogContent>
				</Dialog>

				{/* Image count indicator for multiple images */}
				{images.length > 1 && (
					<div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
						<Expand className="mr-2 inline h-3 w-3" />
						{images.length} photos
					</div>
				)}

				{/* Hover effect overlay */}
				<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
					<div className="text-center">
						<Expand className="mx-auto mb-3 h-10 w-10 text-white" />
						<p className="text-white text-2xl font-semibold tracking-wide">
							Click to view pictures
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Image_UserDetails;
