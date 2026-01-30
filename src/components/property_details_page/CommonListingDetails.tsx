import React, { useState } from "react";
import { MapPin, Home, Info, ChevronDown } from "lucide-react";
import {
	processDescription,
	getTruncatedHTML,
} from "../../utils/descriptionUtils";

interface ICommonListingDetailsType {
	title: string;
	description?: string;
	location: string;
	alternateLocation: string;
	propertyCategory: string;
}

const CommonListingDetails: React.FC<ICommonListingDetailsType> = ({
	title,
	description,
	location,
	alternateLocation,
	propertyCategory,
}) => {
	const [isDescriptionExpanded, setIsDescriptionExpanded] =
		useState<boolean>(false);

	// Process description using utility
	const { sanitizedHTML, shouldTruncate } = processDescription(
		description,
		100,
	);

	return (
		<div className="max-w-4xl mx-auto">
			{/* Header */}
			<div className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200">
				<h1 className="text-md sm:text-xl text-slate-800 leading-tight">
					{title}
				</h1>
			</div>

			{/* Content */}
			<div className="p-6 space-y-4">
				{/* Property Details Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Location Card */}
					<div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
						<div className="flex items-center gap-3">
							<div className="flex-shrink-0 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
								<MapPin className="w-5 h-5 text-red-600 " />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
									Location
								</p>
								<p className="text-sm font-medium text-slate-800 leading-relaxed">
									{location.charAt(0).toUpperCase() + location.slice(1)}
								</p>
							</div>
						</div>
					</div>

					{/* Property Type Card */}
					<div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
						<div className="flex items-center gap-3">
							<div className="flex-shrink-0 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
								<Home className="w-5 h-5 text-yellow-600" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
									Property Type
								</p>
								<p className="text-sm font-medium text-slate-800 leading-relaxed">
									{propertyCategory.toUpperCase()}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Full Address Card */}
				<div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
					<div className="flex items-center gap-3">
						<div className="flex-shrink-0 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
							<MapPin className="w-5 h-5 text-blue-600" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
								Full Address
							</p>
							<p className="text-sm font-medium text-slate-800 leading-relaxed">
								{alternateLocation.charAt(0).toUpperCase() +
									alternateLocation.slice(1)}
							</p>
						</div>
					</div>
				</div>

				{/* Description Section */}
				{sanitizedHTML && (
					<div className="bg-slate-50 border border-gray-200 rounded-lg p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
								<Info className="w-5 h-5 text-yellow-600" />
							</div>
							<h2 className="text-base font-semibold text-slate-700 uppercase tracking-wide">
								Property Description
							</h2>
						</div>

						<div
							className="property-description text-slate-700 leading-relaxed"
							dangerouslySetInnerHTML={{
								__html: isDescriptionExpanded
									? sanitizedHTML
									: shouldTruncate
										? getTruncatedHTML(sanitizedHTML, 100)
										: sanitizedHTML,
							}}
						/>

						{shouldTruncate && (
							<button
								onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
								className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-slate-50 transition-colors"
							>
								{isDescriptionExpanded ? "Show Less" : "Read More"}
								<ChevronDown
									className={`w-4 h-4 transition-transform ${
										isDescriptionExpanded ? "rotate-180" : ""
									}`}
								/>
							</button>
						)}
					</div>
				)}

				{!sanitizedHTML && (
					<div className="bg-slate-50 border border-gray-200 rounded-lg p-6">
						<p className="text-slate-500 text-center italic">
							No description available for this property.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CommonListingDetails;
