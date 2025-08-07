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
		<div className="bg-white sm:p-8 w-full mx-auto space-y-8">
			{/* Title & Intent Badge */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight max-w-3xl">
					{title}
				</h1>
				<div className="flex-shrink-0">
					<span
						className={`inline-block px-5 py-2.5 text-sm font-semibold rounded-full shadow-sm border transition-all duration-200 ${
							intent === "rent"
								? "bg-gradient-to-br from-amber-50 to-yellow-100 text-amber-800 border-amber-200/60"
								: intent === "sell"
								? "bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-800 border-emerald-200/60"
								: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-200/60"
						}`}
					>
						{intent?.toUpperCase()}
					</span>
				</div>
			</div>

			{/* Grid Info Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				{/* Location */}
				<div className="flex items-center gap-4 p-5 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200/60 hover:shadow-md hover:border-slate-300/60 transition-all duration-300 group">
					<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
						<FaMapMarkerAlt className="text-white text-base" />
					</div>
					<div className="min-w-0 flex-1">
						<span className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
							Location
						</span>
						<span
							className="font-semibold text-gray-900 text-sm sm:text-base truncate block"
							title={location}
						>
							{location}
						</span>
					</div>
				</div>

				{/* Property Category */}
				<div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/60 hover:shadow-md hover:border-blue-300/60 transition-all duration-300 group">
					<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
						<FaHome className="text-white text-base" />
					</div>
					<div className="min-w-0 flex-1">
						<span className="block text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
							Property Type
						</span>
						<span
							className="font-semibold text-gray-900 text-sm sm:text-base truncate block"
							title={propertyCategory}
						>
							{propertyCategory}
						</span>
					</div>
				</div>
			</div>

			{/* Description Section */}
			<div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-6 border border-gray-200/60 shadow-sm">
				<div className="flex items-center gap-3 mb-5">
					<div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl flex items-center justify-center shadow-sm">
						<FaInfoCircle className="text-white text-base" />
					</div>
					<h2 className="text-lg font-semibold text-gray-900">
						Property Description
					</h2>
				</div>
				<div className="prose prose-gray max-w-none">
					<p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
						{description || "No description available for this property."}
					</p>
				</div>
			</div>
		</div>
	);
};

export default CommonListingDetails;
