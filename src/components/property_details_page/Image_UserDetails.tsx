import React from "react";
import { IListingUserDetails } from "../../types/listingUserDetails";
import { formatFullName } from "../../utils/capitalizeName";
import { FaPhoneAlt } from "react-icons/fa";
import propertyImagePlaceholder from "../../assets/looking_for_rent.png";
import { getInitials } from "../../utils/getInitial";

const Image_UserDetails: React.FC<{
	user: IListingUserDetails | null;
	listing_images: string[] | undefined;
	listing_title: string | "";
}> = ({ user, listing_images, listing_title }) => {
	return (
		<div className="overflow-hidden border border-gray-300 shadow-sm bg-white">
			{/* User Info Bar */}
			<div className="flex justify-between items-center px-4 py-3 bg-blue-50">
				{/* Avatar + Name */}
				<div className="flex items-center gap-3">
					{user?.avatar ? (
						<img
							src={user.avatar}
							alt={user.name}
							className="w-8 h-8 rounded-full object-full border border-blue-300"
						/>
					) : (
						<div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
							{getInitials(user?.name ?? "")}
						</div>
					)}
					<span className="text-sm sm:text-base font-medium text-gray-800">
						{formatFullName(user?.name)}
					</span>
				</div>

				{/* Phone */}
				<div className="flex items-center gap-2 text-blue-700 text-sm sm:text-base">
					<FaPhoneAlt />
					<span className="font-semibold">{user?.phone}</span>
				</div>
			</div>

			{/* Listing Image */}
			<div className="relative w-full h-56 sm:h-72 md:h-150">
				<img
					src={
						listing_images && listing_images.length > 0
							? listing_images[0]
							: propertyImagePlaceholder
					}
					alt={listing_title}
					className="w-full h-full object-full"
				/>
			</div>
		</div>
	);
};

export default Image_UserDetails;
