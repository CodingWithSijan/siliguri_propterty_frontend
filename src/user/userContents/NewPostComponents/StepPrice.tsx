import React from "react";
import { FiDollarSign, FiUpload } from "react-icons/fi";
import ImagePreviewGrid from "./ImagePreviewGrid";
import { StepPriceProps } from "../../../types/PostForm.types";

const StepPrice: React.FC<StepPriceProps> = ({
	formData,
	updateField,
	preview,
	setPreview,
}) => {
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		updateField("pictures", files);
		setPreview(files.map((f) => URL.createObjectURL(f)));
	};

	return (
		<div className="space-y-5">
			<label className="block">
				<span className="flex items-center gap-2 text-gray-700 mb-1">
					<FiDollarSign /> Price Type
				</span>
				<select
					name="priceType"
					value={formData.priceType}
					onChange={(e) => updateField("priceType", e.target.value)}
					className="w-full border p-3 rounded-md"
				>
					<option value="fixed">Fixed</option>
					<option value="negotiable">Negotiable</option>
				</select>
			</label>

			{formData.priceType === "fixed" && (
				<label className="block">
					<span className="flex items-center gap-2 text-gray-700 mb-1">
						<FiDollarSign /> Fixed Price
					</span>
					<input
						type="number"
						name="price"
						value={formData.price}
						onChange={(e) => updateField("price", e.target.value)}
						className="w-full border p-3 rounded-md"
						placeholder="Enter price"
					/>
				</label>
			)}

			<label className="block">
				<span className="flex items-center gap-2 text-gray-700 mb-1">
					<FiUpload /> Upload Images
				</span>
				<input
					type="file"
					multiple
					accept="image/*"
					onChange={handleImageChange}
					className="w-full"
				/>
			</label>

			{preview.length > 0 && (
				<ImagePreviewGrid
					preview={preview}
					setPreview={setPreview}
					updateField={updateField}
				/>
			)}
		</div>
	);
};

export default StepPrice;
