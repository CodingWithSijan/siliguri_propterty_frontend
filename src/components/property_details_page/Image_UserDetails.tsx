import React, { useState } from "react";
import { IListingUserDetails } from "../../types/listingUserDetails";
import { formatFullName } from "../../utils/capitalizeName";
import {
	FaPhoneAlt,
	FaTimes,
	FaChevronLeft,
	FaChevronRight,
	FaExpand,
} from "react-icons/fa";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";
import { getInitials } from "../../utils/getInitial";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
const Image_UserDetails: React.FC<{
	user: IListingUserDetails | null;
	listing_images: string[] | undefined;
	listing_title: string | "";
}> = ({ user, listing_images, listing_title }) => {
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
			{/* User Info Bar */}
			<div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-100 border-b border-gray-200/60">
				{/* Avatar + Name */}
				<div className="flex items-center gap-3">
					{user?.avatar ? (
						<img
							src={user.avatar}
							alt={user.name}
							className="w-8 h-8 rounded-lg object-cover border border-white shadow-sm"
						/>
					) : (
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
							{getInitials(user?.name ?? "")}
						</div>
					)}
					<span className="text-sm sm:text-base font-medium text-gray-900">
						{formatFullName(user?.name)}
					</span>
				</div>

				{/* Phone */}
				<a
					href={`tel:${user?.phone}`}
					className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200/60 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
				>
					<div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
						<FaPhoneAlt className="text-white text-xs" />
					</div>
					<span className="font-medium text-gray-900 text-sm sm:text-base">
						{user?.phone}
					</span>
				</a>
			</div>

			{/* Listing Image */}
			<div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 bg-gray-100">
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogTrigger asChild>
						<img
							src={images[0]}
							alt={listing_title}
							className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
							onClick={() => handleImageClick(0)}
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = propertyImagePlaceholder;
							}}
						/>
					</DialogTrigger>

					<DialogContent
						className="w-screen h-screen max-w-none max-h-none rounded-none border-0 p-0 bg-black/95 backdrop-blur-sm"
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
										className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
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
								className="max-w-[95%] max-h-[95%] object-contain select-none"
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
										className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all backdrop-blur-sm"
									>
										<FaChevronLeft className="w-6 h-6" />
									</button>
									<button
										onClick={nextImage}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all backdrop-blur-sm"
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
											className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
												index === currentImageIndex
													? "border-white shadow-lg"
													: "border-white/30 hover:border-white/60"
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
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
					<div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
						<FaExpand className="text-white w-6 h-6" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Image_UserDetails;
