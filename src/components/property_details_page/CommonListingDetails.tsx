import React from "react";
import { ICommonListingDetailsType } from "../../types/commonListingDetailsTypes";
import { FaMapMarkerAlt, FaHome, FaInfoCircle } from "react-icons/fa";

const CommonListingDetails: React.FC<ICommonListingDetailsType> = ({
	title,
	description,
	location,
	propertyCategory,
	intent,
}) => {
	return (
		<div className="bg-white p-6 sm:p-8 w-full mx-auto space-y-6">
			{/* Title & Intent Badge */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
					{title}
				</h1>
				<span
					className={`px-4 py-1 text-sm max-w-fit font-semibold rounded-full shadow-sm ${
						intent === "rent"
							? "bg-yellow-100 text-yellow-700"
							: intent === "sell"
							? "bg-green-100 text-green-700"
							: "bg-blue-100 text-blue-700"
					}`}
				>
					{intent?.toUpperCase()}
				</span>
			</div>

			{/* Grid Info Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base text-gray-800">
				{/* Location */}
				<div className="flex items-center gap-3">
					<FaMapMarkerAlt className="text-red-500 text-lg" />
					<div>
						<span className="block text-gray-500 text-xs uppercase">
							Location
						</span>
						<span className="font-medium">{location}</span>
					</div>
				</div>

				{/* Property Category */}
				<div className="flex items-center gap-3">
					<FaHome className="text-blue-600 text-lg" />
					<div>
						<span className="block text-gray-500 text-xs uppercase">
							Property Type
						</span>
						<span className="font-medium">{propertyCategory}</span>
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="flex items-start gap-3 mt-2">
				<FaInfoCircle className="text-gray-500 mt-1" />
				<p className="text-gray-700 text-sm sm:text-base leading-relaxed">
					{description}
				</p>
			</div>
		</div>
	);
};

export default CommonListingDetails;
