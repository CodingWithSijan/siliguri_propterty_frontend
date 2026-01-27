import React, { useState } from "react";
import { MapPin, Home, Info, ChevronDown } from "lucide-react";
import DOMPurify from "dompurify";

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
	<div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
		<div className="flex items-center gap-3">
			<div className="flex-shrink-0 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
				<Icon className="w-5 h-5 text-slate-600" />
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
					{label}
				</p>
				<p className="text-sm font-medium text-slate-800 leading-relaxed">
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

	// Sanitize HTML to prevent XSS
	const sanitizedDescription = description
		? DOMPurify.sanitize(description, {
				ALLOWED_TAGS: [
					"p",
					"strong",
					"em",
					"u",
					"s",
					"h2",
					"h3",
					"ul",
					"ol",
					"li",
					"br",
				],
				ALLOWED_ATTR: [],
			})
		: "";

	// Extract plain text from HTML for word count
	const getPlainText = (html: string): string => {
		const div = document.createElement("div");
		div.innerHTML = html;
		return div.textContent || div.innerText || "";
	};

	const plainText = sanitizedDescription
		? getPlainText(sanitizedDescription)
		: "";
	const wordCount = plainText.trim().split(/\s+/).length;
	const shouldShowReadMore = wordCount > 100; // Changed from 50 to 100 words

	// Truncate HTML content while preserving tags
	const getTruncatedHTML = (html: string, maxWords: number): string => {
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = html;

		let wordCounter = 0;
		let truncated = false;

		const traverse = (node: Node): Node | null => {
			if (truncated) return null;

			if (node.nodeType === Node.TEXT_NODE) {
				const words = (node.textContent || "").trim().split(/\s+/);
				if (wordCounter + words.length > maxWords) {
					const allowedWords = maxWords - wordCounter;
					node.textContent = words.slice(0, allowedWords).join(" ") + "...";
					truncated = true;
					wordCounter = maxWords;
				} else {
					wordCounter += words.length;
				}
				return node;
			}

			if (node.nodeType === Node.ELEMENT_NODE) {
				const element = node as Element;
				const clone = element.cloneNode(false);

				Array.from(element.childNodes).forEach((child) => {
					if (!truncated) {
						const processedChild = traverse(child);
						if (processedChild) {
							clone.appendChild(processedChild);
						}
					}
				});

				return clone;
			}

			return null;
		};

		const result = traverse(tempDiv);
		return result ? (result as Element).innerHTML : "";
	};

	return (
		<div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
			{/* Header */}
			<div className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200">
				<h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
					{title}
				</h1>
			</div>

			{/* Content */}
			<div className="p-6 space-y-4">
				{/* Property Details Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<InfoCard icon={MapPin} label="Location" value={location} />
					<InfoCard
						icon={Home}
						label="Property Type"
						value={propertyCategory}
					/>
				</div>

				<InfoCard
					icon={MapPin}
					label="Full Address"
					value={alternateLocation}
				/>

				{/* Description Section */}
				{sanitizedDescription && (
					<div className="bg-slate-50 border border-gray-200 rounded-lg p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
								<Info className="w-5 h-5 text-slate-600" />
							</div>
							<h2 className="text-base font-semibold text-slate-700 uppercase tracking-wide">
								Property Description
							</h2>
						</div>

						<div
							className="property-description text-slate-700 leading-relaxed"
							dangerouslySetInnerHTML={{
								__html: isDescriptionExpanded
									? sanitizedDescription
									: shouldShowReadMore
										? getTruncatedHTML(sanitizedDescription, 100)
										: sanitizedDescription,
							}}
						/>

						{shouldShowReadMore && (
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

				{!sanitizedDescription && (
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
