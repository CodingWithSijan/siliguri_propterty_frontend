import React from "react";
import { IListingUserDetails } from "../../types/listingUserDetails";
import { formatFullName } from "../../utils/capitalizeName";
import { FaPhoneAlt } from "react-icons/fa";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";
import { getInitials } from "../../utils/getInitial";
import ImageModal from "./ImageModal";

const Image_UserDetails: React.FC<{
	user: IListingUserDetails | null;
	listing_images: string[] | undefined;
	listing_title: string | "";
}> = ({ user, listing_images, listing_title }) => {
	return (
		<div className="overflow-hidden border border-gray-200/60 shadow-sm bg-white">
			{/* User Info Bar */}
			<div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-100 border-b border-gray-200/60">
				{/* Avatar + Name */}
				<div className="flex items-center gap-4">
					{user?.avatar ? (
						<img
							src={user.avatar}
							alt={user.name}
							className="w-10 h-10 rounded-xl object-full border-2 border-white shadow-sm"
						/>
					) : (
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
							{getInitials(user?.name ?? "")}
						</div>
					)}
					<span className="text-sm sm:text-base font-semibold text-gray-900">
						{formatFullName(user?.name)}
					</span>
				</div>

				{/* Phone */}
				<div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200/60">
					<div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
						<FaPhoneAlt className="text-white text-xs" />
					</div>
					<span className="font-semibold text-gray-900 text-sm sm:text-base">
						{user?.phone}
					</span>
				</div>
			</div>

			{/* Listing Image */}
			<div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100">
				<img
					src={
						listing_images && listing_images.length > 0
							? listing_images[0]
							: propertyImagePlaceholder
					}
					alt={listing_title}
					className="w-full h-full object-full"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.src = propertyImagePlaceholder;
					}}
				/>

				{/* Optional overlay gradient for better text readability if needed */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
			</div>
		</div>
	);
};

export default Image_UserDetails;
