// File: components/PostForm/steps/StepPreview.tsx
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, MinusCircle } from "lucide-react";
import type { ReactNode } from "react";

interface PreviewFormData {
	propertyCategory?: "house" | "flat" | "land" | "shop" | string;
	title?: string;
	description?: string;
	location?: string;
	alternateLocation?: string;
	bedrooms?: string | number;
	bathrooms?: string | number;
	builtUpArea?: string | number;
	furnishing?: string;
	attachedBathroom?: boolean;
	parking?: boolean;
	availableFrom?: string;
	availableLandSpace?: string | number;
	availableLandSpaceUnit?: string;
	unit?: string;
	pricePerUnit?: string | number;
	totalPrice?: string | number;
	shopArea?: string | number;
	hasShutter?: boolean;
	price?: string | number;
	pricePerFrequency?: string | number;
	duration?: string;
	pictures?: FileList;
	[key: string]: unknown;
}

const StepPreview = () => {
	const { getValues } = useFormContext<PreviewFormData>();
	const [previewData, setPreviewData] = useState<PreviewFormData>({});
	const [previews, setPreviews] = useState<string[]>([]);

	useEffect(() => {
		const values = getValues();
		setPreviewData(values);
		const files = values.pictures
			? Array.from(values.pictures as FileList)
			: [];
		const urls = files.map((file) => URL.createObjectURL(file));
		setPreviews(urls);
		return () => urls.forEach((url) => URL.revokeObjectURL(url));
	}, [getValues]);

	const formatBoolean = (val: boolean | undefined | null) => (
		<span
			className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
        ${
					val === true
						? "bg-green-100 text-green-600"
						: val === false
							? "bg-red-100 text-red-600"
							: "bg-gray-100 text-gray-500"
				}`}
		>
			{val === true ? (
				<CheckCircle size={14} />
			) : val === false ? (
				<XCircle size={14} />
			) : (
				<MinusCircle size={14} />
			)}
			{val === true ? "Yes" : val === false ? "No" : "N/A"}
		</span>
	);

	const formatDate = (val: string | undefined | null) => {
		if (!val) return "-";
		const d = new Date(val);
		return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString();
	};

	const toDisplayValue = (value: unknown): ReactNode => {
		if (value === undefined || value === null || value === "") {
			return "-";
		}

		if (typeof value === "string" || typeof value === "number") {
			return value;
		}

		if (typeof value === "boolean") {
			return value ? "Yes" : "No";
		}

		return String(value);
	};

	const propertyCategory = previewData.propertyCategory;
	const isHouseOrFlat =
		propertyCategory === "house" || propertyCategory === "flat";
	const isLand = propertyCategory === "land";
	const isShop = propertyCategory === "shop";

	const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
		<div className="flex flex-col">
			<span className="text-gray-500 text-sm">{label}</span>
			<span className="text-gray-900 font-semibold capitalize break-words">
				{value ?? "-"}
			</span>
		</div>
	);

	return (
		<div className="space-y-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200 max-w-5xl mx-auto">
			<h2 className="text-3xl font-bold text-center text-blue-700 tracking-tight">
				Review Your Post
			</h2>
			<p className="text-center text-gray-500">
				Please confirm all details before publishing
			</p>

			{/* Basic Info */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<InfoRow label="Title" value={previewData.title} />
				<InfoRow label="Description" value={previewData.description} />
				<InfoRow label="Location" value={previewData.location} />
				<InfoRow
					label="Alternate Location"
					value={toDisplayValue(previewData.alternateLocation)}
				/>
				<InfoRow label="Property Type" value={propertyCategory} />
			</div>

			{/* Conditional Sections */}
			{isHouseOrFlat && (
				<div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
					<h3 className="text-lg font-semibold text-blue-600">
						{propertyCategory} Details
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{["bedrooms", "bathrooms", "builtUpArea", "furnishing"].map(
							(field) => (
								<InfoRow
									key={field}
									label={field}
									value={toDisplayValue(previewData[field])}
								/>
							),
						)}
						<InfoRow
							label="Attached Bathroom"
							value={formatBoolean(previewData.attachedBathroom)}
						/>
						<InfoRow
							label="Parking"
							value={formatBoolean(previewData.parking)}
						/>
						<InfoRow
							label="Available From"
							value={formatDate(previewData.availableFrom)}
						/>
					</div>
				</div>
			)}

			{isLand && (
				<div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
					<h3 className="text-lg font-semibold text-blue-600">Land Details</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{[
							"availableLandSpace",
							"availableLandSpaceUnit",
							"unit",
							"pricePerUnit",
							"totalPrice",
						].map((field) => (
							<InfoRow
								key={field}
								label={field}
								value={toDisplayValue(previewData[field])}
							/>
						))}
					</div>
				</div>
			)}

			{isShop && (
				<div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
					<h3 className="text-lg font-semibold text-blue-600">Shop Details</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<InfoRow label="Shop Area (sq ft)" value={previewData.shopArea} />
						<InfoRow
							label="Has Shutter"
							value={formatBoolean(previewData.hasShutter)}
						/>
					</div>
				</div>
			)}

			{/* Price Section */}
			<div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-2">
				<h3 className="text-lg font-semibold text-blue-600">Pricing</h3>
				<InfoRow
					label="Price (INR)"
					value={
						previewData.price ||
						previewData.pricePerUnit ||
						previewData.pricePerFrequency
					}
				/>
				{previewData.duration && (
					<InfoRow label="Duration" value={previewData.duration} />
				)}
			</div>

			{/* Image Preview */}
			{previews.length > 0 && (
				<div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
					<h3 className="text-lg font-semibold text-blue-600 mb-3">
						Uploaded Pictures
					</h3>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						{previews.map((src, idx) => (
							<div
								key={idx}
								className="aspect-square rounded-lg overflow-hidden border shadow-sm hover:shadow-md hover:scale-105 transition"
							>
								<img
									src={src}
									alt={`preview-${idx}`}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default StepPreview;
