import React from "react";
import { StepDetailsProps } from "../../../types/PostForm.types";
import { FiTag, FiAlignLeft, FiMapPin, FiList } from "react-icons/fi";
import AddressInput from "../../../services/AddressInput";

const StepDetails: React.FC<StepDetailsProps> = ({ formData, updateField }) => (
	<div className="space-y-5">
		<label className="block">
			<span className="flex items-center gap-2 text-gray-700 mb-1">
				<FiTag /> Title
			</span>
			<input
				name="title"
				value={formData.title}
				onChange={(e) => updateField("title", e.target.value)}
				className="w-full border p-3 rounded-md"
				placeholder="Property title"
			/>
		</label>

		<label className="block">
			<span className="flex items-center gap-2 text-gray-700 mb-1">
				<FiAlignLeft /> Description
			</span>
			<textarea
				name="description"
				value={formData.description}
				onChange={(e) => updateField("description", e.target.value)}
				className="w-full border p-3 rounded-md"
				placeholder="Describe your property"
			/>
		</label>

		<label className="block">
			<span className="flex items-center gap-2 text-gray-700 mb-1">
				<FiMapPin /> Location
			</span>
			<AddressInput
				value={formData.location}
				onChange={(val) => updateField("location", val)}
			/>
		</label>

		<label className="block">
			<span className="flex items-center gap-2 text-gray-700 mb-1">
				<FiList /> Property Type
			</span>
			<select
				name="propertyCategory"
				value={formData.propertyCategory}
				onChange={(e) => updateField("propertyCategory", e.target.value)}
				className="w-full border p-3 rounded-md"
			>
				<option value="">Select type</option>
				<option value="land">Land</option>
				<option value="apartment">Apartment</option>
				<option value="house">House</option>
				<option value="room">Room</option>
			</select>
		</label>

		{formData.intent === "sell" && formData.propertyCategory && (
			<label className="block mt-3">
				<span className="flex items-center gap-2 text-gray-700 mb-1">
					Unit (Pricing Basis)
				</span>
				<select
					value={formData.unit}
					onChange={(e) => updateField("unit", e.target.value)}
					className="w-full border p-3 rounded-md"
				>
					<option value="">Select Unit</option>
					<option value="per Katha">Per Katha</option>
					<option value="per Bigha">Per Bigha</option>
					<option value="per Decima">Per Decima</option>
					<option value="per Acre">Per Acre</option>
					<option value="per Sq Foot">Per Sq Foot</option>
				</select>
			</label>
		)}
	</div>
);

export default StepDetails;
