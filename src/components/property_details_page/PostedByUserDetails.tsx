import React from "react";
import { IListingUserDetails } from "../../types/listingUserDetails";
import { convert_ISO_Date_to_Normal } from "../../utils/convert_ISO_Date_to_Normal";
import { User, Phone, Calendar } from "lucide-react";

const PostedByUserDetails: React.FC<{
	userDetails: IListingUserDetails | null;
	postedDate?: string | null; // ISO date
}> = ({ userDetails, postedDate }) => {
	if (!userDetails) {
		return (
			<fieldset className="relative border border-gray-200  shadow-sm bg-white">
				<legend className="px-3  uppercase italic text-sm font-medium text-gray-500 ml-4 -mt-2 bg-white">
					Posted by
				</legend>
				<div className="flex items-center gap-4 p-5">
					<div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
						<User size={28} />
					</div>
					<div className="min-w-0">
						<div className="text-base font-semibold text-gray-800">Unknown</div>
						<div className="text-sm text-gray-500">No details available</div>
					</div>
				</div>
			</fieldset>
		);
	}

	const { name, avatar, phone } = userDetails;

	return (
		<fieldset className="relative border border-gray-200  shadow-sm bg-white">
			<legend className="px-3 text-sm font-medium text-gray-500 ml-4 -mt-2 bg-white  uppercase italic">
				Contact
			</legend>
			<div className="flex items-center justify-between gap-5 py-6 px-4">
				{/* Avatar */}
				<div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
					{avatar ? (
						<img
							src={avatar}
							alt={`${name} avatar`}
							className="w-full h-full object-cover"
						/>
					) : (
						<span>{name ? name.charAt(0).toUpperCase() : "U"}</span>
					)}
				</div>

				{/* User Info */}
				<div className="flex-1 min-w-0">
					{/* Name */}
					<div className="text-lg font-semibold text-gray-900 truncate flex items-center gap-2">
						<User size={18} className="text-gray-500" />
						{name}
					</div>

					{/* Phone */}
					<div className="text-sm text-gray-700 mt-2 flex items-center gap-2">
						<Phone size={16} className="text-blue-600" />
						{phone ? (
							<a
								href={`tel:${phone}`}
								className="text-blue-600 hover:underline font-medium"
							>
								{phone}
							</a>
						) : (
							<span className="text-gray-400 italic">No phone provided</span>
						)}
					</div>

					{/* Posted Date */}
					{postedDate && (
						<div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
							<Calendar size={14} className="text-gray-400" />
							Posted on{" "}
							<span className="font-medium text-gray-700">
								{convert_ISO_Date_to_Normal(postedDate)}
							</span>
						</div>
					)}
				</div>
			</div>
		</fieldset>
	);
};

export default PostedByUserDetails;
