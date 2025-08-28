import React from "react";
import { ICommonListingDetailsType } from "../../types/commonListingDetailsTypes";
import { FaMapMarkerAlt, FaHome, FaInfo } from "react-icons/fa";

const CommonListingDetails: React.FC<ICommonListingDetailsType> = ({
	title,
	description,
	location,
	propertyCategory,
	intent,
}) => {
	return (
		<div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl sm:p-4 w-full mx-auto space-y-4">
			{/* Title & Intent Badge */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
				<h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight max-w-3xl">
					{title}
				</h1>
				<div className="flex-shrink-0">
					<span
						className={`inline-block px-3 py-1.5 text-xs font-semibold -froundedull shadow-sm border transition-all duration-200 ${
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
			<div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-2">
				{/* Location */}
				<div className="flex items-center gap-3 p-3 bg-white shadow-sm">
					<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-sm">
						<FaMapMarkerAlt className="text-white text-sm" />
					</div>
					<div className="min-w-0 flex-1">
						<span className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">
							Location
						</span>
						<span
							className="font-semibold text-gray-900 text-sm  block"
							title={location}
						>
							{location}
						</span>
					</div>
				</div>

				{/* Property Category */}
				<div className="flex items-center bg-white gap-3 p-3 shadow-sm">
					<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-sm">
						<FaHome className="text-white text-sm" />
					</div>
					<div className="min-w-0 flex-1">
						<span className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">
							Property Type
						</span>
						<span
							className="font-semibold text-gray-900 text-sm truncate block"
							title={propertyCategory}
						>
							{propertyCategory}
						</span>
					</div>
				</div>
			</div>

			{/* Description Section */}
			<div className=" p-4 border bg-white shadow-sm">
				<div className="flex items-center gap-2 mb-3">
					<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-sm">
						<FaInfo className="text-white text-sm" />
					</div>
					<h2 className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">
						Property Description
					</h2>
				</div>

				<div className="prose prose-gray max-w-none">
					<p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
						{description || "No description available for this property."}
					</p>
				</div>
			</div>
		</div>
	);
};

export default CommonListingDetails;
