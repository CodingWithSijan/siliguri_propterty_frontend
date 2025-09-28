import React, { useState } from "react";
import {
	FaTimes,
	FaChevronLeft,
	FaChevronRight,
	FaExpand,
} from "react-icons/fa";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
const Image_UserDetails: React.FC<{
	listing_images: string[] | undefined;
	listing_title: string | "";
}> = ({ listing_images, listing_title }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const images =
		listing_images && listing_images.length > 0
			? listing_images
			: [propertyImagePlaceholder];

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const handleImageClick = (index: number) => {
		setCurrentImageIndex(index);
		setIsModalOpen(true);
	};

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowRight") nextImage();
		if (e.key === "ArrowLeft") prevImage();
		if (e.key === "Escape") setIsModalOpen(false);
	};

	// Handle click outside image to close modal
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			setIsModalOpen(false);
		}
	};
	return (
		<div className="w-full overflow-hidden border border-gray-200/60 shadow-sm bg-white">
			{/* Listing Image */}
			<div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 bg-gray-100">
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogTrigger asChild>
						<img
							src={images[0]}
							alt={listing_title}
							className="w-full h-full object-cover cursor-pointer"
							onClick={() => handleImageClick(0)}
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = propertyImagePlaceholder;
							}}
						/>
					</DialogTrigger>

					<DialogContent
						className="w-screen h-[97vh] rounded-none border-0 p-0 bg-black/95 backdrop-blur-sm"
						onKeyDown={handleKeyDown}
						onClick={handleBackdropClick}
					>
						{/* Header with close button and image counter */}
						<DialogHeader className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/70 to-transparent">
							<div className="flex items-center justify-between">
								<DialogTitle className="text-white text-lg font-medium">
									{listing_title}
								</DialogTitle>
								<div className="flex items-center gap-4">
									<span className="text-white/80 text-sm">
										{currentImageIndex + 1} / {images.length}
									</span>
									<button
										onClick={() => setIsModalOpen(false)}
										className="text-white/80 p-2 rounded-full"
									>
										<FaTimes className="w-5 h-5" />
									</button>
								</div>
							</div>
						</DialogHeader>

						{/* Main image display */}
						<DialogDescription className="relative w-full h-full flex items-center justify-center">
							<img
								src={images[currentImageIndex]}
								alt={`${listing_title} - Image ${currentImageIndex + 1}`}
								className="w-[95%] h-[95%] object-contain select-none"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.src = propertyImagePlaceholder;
								}}
							/>

							{/* Navigation arrows */}
							{images.length > 1 && (
								<>
									<button
										onClick={prevImage}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 bg-black/30 p-3 rounded-full backdrop-blur-sm"
									>
										<FaChevronLeft className="w-6 h-6" />
									</button>
									<button
										onClick={nextImage}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 bg-black/30 p-3 rounded-full backdrop-blur-sm"
									>
										<FaChevronRight className="w-6 h-6" />
									</button>
								</>
							)}
						</DialogDescription>

						{/* Thumbnail strip at bottom */}
						{images.length > 1 && (
							<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
								<div className="flex justify-center gap-2 overflow-x-auto max-w-full">
									{images.map((image, index) => (
										<button
											key={index}
											onClick={() => setCurrentImageIndex(index)}
											className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
												index === currentImageIndex
													? "border-white shadow-lg"
													: "border-white/30"
											}`}
										>
											<img
												src={image}
												alt={`Thumbnail ${index + 1}`}
												className="w-full h-full object-cover"
												onError={(e) => {
													const target = e.target as HTMLImageElement;
													target.src = propertyImagePlaceholder;
												}}
											/>
										</button>
									))}
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>

				{/* Image count indicator for multiple images */}
				{images.length > 1 && (
					<div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
						<FaExpand className="inline w-3 h-3 mr-2" />
						{images.length} photos
					</div>
				)}

				{/* Hover effect overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 pointer-events-none flex items-center justify-center">
					<div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
						<FaExpand className="text-white w-6 h-6" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Image_UserDetails;
