// File: components/PostForm/steps/StepPreview.tsx

import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

const StepPreview = () => {
	const { getValues } = useFormContext();
	const [previewData, setPreviewData] = useState<any>({});
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
			className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
				val === true
					? "bg-green-100 text-green-600"
					: val === false
					? "bg-red-100 text-red-600"
					: "bg-gray-100 text-gray-500"
			}`}
		>
			{val === true ? "Yes" : val === false ? "No" : "-"}
		</span>
	);

	const formatDate = (val: string | undefined | null) => {
		if (!val) return "-";
		const d = new Date(val);
		return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString();
	};

	const propertyCategory = previewData.propertyCategory;
	const isHouseOrFlat =
		propertyCategory === "house" || propertyCategory === "flat";
	const isLand = propertyCategory === "land";
	const isShop = propertyCategory === "shop";

	return (
		<div className="space-y-8 p-4 sm:p-6 bg-white rounded-xl shadow border max-w-4xl mx-auto">
			<h2 className="text-3xl font-semibold text-center text-blue-700 mb-6 underline decoration-blue-400 underline-offset-4">
				🎯 Review Your Post
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-800">
				<div>
					<p className="text-gray-500 font-medium">Title</p>
					<p className="text-gray-900 font-semibold">
						{previewData.title || "-"}
					</p>
				</div>
				<div>
					<p className="text-gray-500 font-medium">Description</p>
					<p className="text-gray-900 font-semibold">
						{previewData.description || "-"}
					</p>
				</div>
				<div>
					<p className="text-gray-500 font-medium">Location</p>
					<p className="text-gray-900 font-semibold">
						{previewData.location || "-"}
					</p>
				</div>
				<div>
					<p className="text-gray-500 font-medium">Property Type</p>
					<p className="text-gray-900 font-semibold capitalize">
						{propertyCategory || "-"}
					</p>
				</div>
			</div>

			{isHouseOrFlat && (
				<div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
					<h3 className="text-lg font-medium text-blue-600 border-b pb-1">
						🏠 {propertyCategory} Details
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{["bedrooms", "bathrooms", "builtUpArea", "furnishing"].map(
							(field) => (
								<div key={field}>
									<p className="text-gray-500 font-medium capitalize">
										{field}
									</p>
									<p className="text-gray-900 font-semibold capitalize">
										{previewData[field] || "-"}
									</p>
								</div>
							)
						)}
						<div>
							<p className="text-gray-500 font-medium">Attached Bathroom</p>
							{formatBoolean(previewData.attachedBathroom)}
						</div>
						<div>
							<p className="text-gray-500 font-medium">Parking</p>
							{formatBoolean(previewData.parking)}
						</div>
						<div>
							<p className="text-gray-500 font-medium">Available From</p>
							<p className="text-gray-900 font-semibold">
								{formatDate(previewData.availableFrom)}
							</p>
						</div>
					</div>
				</div>
			)}

			{isLand && (
				<div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
					<h3 className="text-lg font-medium text-blue-600 border-b pb-1">
						🌾 Land Details
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{[
							"availableLandSpace",
							"availableLandSpaceUnit",
							"unit",
							"pricePerUnit",
							"totalPrice",
						].map((field) => (
							<div key={field}>
								<p className="text-gray-500 font-medium capitalize">{field}</p>
								<p className="text-gray-900 font-semibold capitalize">
									{previewData[field] || "-"}
								</p>
							</div>
						))}
					</div>
				</div>
			)}

			{isShop && (
				<div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
					<h3 className="text-lg font-medium text-blue-600 border-b pb-1">
						🏪 Shop Details
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<p className="text-gray-500 font-medium">
								Shop Area (in sq foot)
							</p>
							<p className="text-gray-900 font-semibold">
								{previewData.shopArea || "-"}
							</p>
						</div>
						<div>
							<p className="text-gray-500 font-medium">Has Shutter</p>
							{formatBoolean(previewData.hasShutter)}
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<p className="text-gray-500 font-medium">Price (in INR)</p>
					<p className="text-gray-900 font-semibold">
						{previewData.price ||
							previewData.pricePerUnit ||
							previewData.pricePerFrequency ||
							"-"}
					</p>
					{previewData.duration && (
						<div>
							<p className="text-gray-500 font-medium">Duration</p>
							<p className="text-gray-900 font-semibold capitalize">
								{previewData.duration}
							</p>
						</div>
					)}
				</div>

				{previews.length > 0 && (
					<div className="mt-8">
						<h3 className="text-lg font-semibold text-blue-600 mb-3 border-b pb-1">
							📷 Uploaded Pictures
						</h3>
						<div className="flex flex-wrap gap-4">
							{previews.map((src, idx) => (
								<div
									key={idx}
									className="w-28 h-28 rounded-lg overflow-hidden shadow border hover:scale-105 transition"
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
		</div>
	);
};

export default StepPreview;
