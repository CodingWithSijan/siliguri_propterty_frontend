import React, { useState } from "react";
import { MapPin, Home, Info, ChevronDown, Share2 } from "lucide-react";

interface ICommonListingDetailsType {
	title: string;
	description?: string;
	location: string;
	alternateLocation: string;
	propertyCategory: string;
}

interface InfoCardProps {
	icon: React.ElementType;
	label: string;
	value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
	<div className="bg-white border border-gray-100 p-2">
		<div className="flex items-center gap-3">
			<div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
				<Icon className="w-5 h-5 text-slate-600" />
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-xs  text-slate-600 uppercase tracking-wide mb-2">
					{label}
				</p>
				<p className="text-sm  text-slate-800 leading-relaxed line-clamp-3">
					{value}
				</p>
			</div>
		</div>
	</div>
);

const CommonListingDetails: React.FC<ICommonListingDetailsType> = ({
	title,
	description,
	location,
	alternateLocation,
	propertyCategory,
}) => {
	const [isDescriptionExpanded, setIsDescriptionExpanded] =
		useState<boolean>(false);

	const handleShare = (): void => {
		if (navigator.share) {
			navigator.share({
				title: title,
				text: `Check out this property listing: ${title}`,
				url: window.location.href,
			});
		}
	};

	const shouldShowReadMore = description && description.split(" ").length > 50;

	return (
		<div className="max-w-4xl mx-auto bg-white border border-gray-200 overflow-hidden">
			{/* Header */}
			<div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
				<div className="flex justify-between gap-4">
					<div className="flex-1">
						<h1 className="text-md sm:text-xl text-slate-800 leading-tight mb-2">
							{title}
						</h1>
					</div>
					{/* <button onClick={handleShare} className="p-2" title="Share listing">
						<Share2 className="w-5 h-5 text-slate-600" />
					</button> */}
				</div>
			</div>

			{/* Content */}
			<div className="p-2 space-y-2">
				{/* Property Details */}
				<div className="flex flex-col gap-4">
					<InfoCard icon={MapPin} label="Location" value={location} />
					<InfoCard
						icon={Home}
						label="Property Type"
						value={propertyCategory}
					/>
					<InfoCard
						icon={MapPin}
						label="Full Address"
						value={alternateLocation}
					/>
				</div>

				{/* Description */}
				<div className="bg-gray-50 border border-gray-100 rounded-lg p-2 sm:p-4">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-5 h-5 flex items-center justify-center">
							<Info className="w-5 h-5 text-slate-600" />
						</div>
						<h2 className="text-sm text-slate-600 uppercase tracking-wide">
							Property Description
						</h2>
					</div>

					<div className="max-w-none">
						<p className="text-slate-700 leading-relaxed">
							{description
								? isDescriptionExpanded
									? description
									: description.split(" ").slice(0, 50).join(" ")
								: "No description available for this property."}
						</p>
					</div>

					{shouldShowReadMore && (
						<button
							onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
							className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600"
						>
							{isDescriptionExpanded ? "Show Less" : "Read More"}
							<ChevronDown
								className={`w-4 h-4 ${
									isDescriptionExpanded ? "rotate-180" : ""
								}`}
							/>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default CommonListingDetails;
