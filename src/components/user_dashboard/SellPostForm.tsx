// SellPostForm.tsx
// This component provides a form for users to create a new 'Sell' real estate post.
// It uses React Hook Form for form state management and validation, and supports image uploads with preview.

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import AddressInput from "../../services/AddressInput";
import { showSuccess, showError } from "../../utils/toastUtils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import BASE_URL from "../../services";
import { Trash2 } from "lucide-react";
import { SellPostFormInputs } from "../../types/postFormTypes";
// Property category options for the select dropdown
const propertyCategories = ["land", "apartment", "house", "room", "shop"];

// Unit options for the select dropdown
const unitOptions = ["decimal", "katha", "bigha", "acre", "sq foot"];

// Main functional component for the Sell Post Form
const SellPostForm: React.FC = () => {
	// Initialize react-hook-form with TypeScript generics
	const {
		register, // for registering input fields
		handleSubmit, // to handle form submission
		reset, // to reset the form after successful submit
		watch, // to watch form values (used for file preview)
		control, // for controlled components (used for AddressInput)
		setValue, // to programmatically set form values
		formState: { errors, isSubmitting }, // form state and validation errors
	} = useForm<SellPostFormInputs>();

	// State to hold preview URLs for uploaded images
	const [previews, setPreviews] = useState<string[]>([]);

	// Watch the 'pictures' field for changes
	const pictures = watch("pictures");
	// Watch the propertyCategory field for changes
	const watchPropertyCategories = watch("propertyCategory");
	// Effect to generate image previews when files are selected
	useEffect(() => {
		if (pictures && pictures.length > 0) {
			const files = Array.from(pictures);
			const urls = files.map((file) => URL.createObjectURL(file));
			setPreviews(urls);
			// Cleanup: revoke object URLs to avoid memory leaks
			return () => urls.forEach((url) => URL.revokeObjectURL(url));
		} else {
			setPreviews([]);
		}
	}, [pictures]);
	useEffect(() => {
		if (watchPropertyCategories !== "land") {
			setValue("unit", "");
			setValue("availableLandSpace", "");
			setValue("availableLandSpaceUnit", "");
		}
	}, [watchPropertyCategories, setValue]);

	// Form submission handler
	// Wraps data in FormData for file upload and posts to backend
	const onSubmit = async (data: SellPostFormInputs) => {
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("description", data.description);
		formData.append("location", data.location);
		formData.append("propertyCategory", data.propertyCategory);
		if (data.unit) formData.append("unit", data.unit);
		if (data.availableLandSpaceUnit)
			formData.append("availableLandSpaceUnit", data.availableLandSpaceUnit);
		formData.append("price", String(data.price));
		formData.append("availableLandSpace", String(data.availableLandSpace));
		// Append each selected picture file to FormData
		if (data.pictures && data.pictures.length > 0) {
			Array.from(data.pictures).forEach((file) => {
				formData.append("pictures", file);
			});
		}

		try {
			// Send POST request to backend API
			await BASE_URL.post("/api/user/post/new-sell-post", formData);
			showSuccess("Sell post created successfully!");
			reset(); // Reset form fields
			window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on success
		} catch (err: any) {
			showError(err?.response?.data?.message || "Failed to create sell post.");
		}
	};

	// Render the form UI
	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-6 bg-white p-6 rounded-xl shadow max-w-2xl mx-auto"
		>
			{/* Form Title */}
			<h2 className="text-xl font-bold mb-4">Create Post</h2>
			<p>* Required Fields</p>
			{/* Title Field */}
			<div>
				<label className="block mb-1 font-medium">Title *</label>
				<Input
					{...register("title", { required: "Title is required" })}
					placeholder="Enter property title"
				/>
				{errors.title && (
					<p className="text-red-500 text-sm">{errors.title.message}</p>
				)}
			</div>

			{/* Description Field */}
			<div>
				<label className="block mb-1 font-medium">Description *</label>
				<Textarea
					{...register("description", { required: "Description is required" })}
					placeholder="Describe your property"
					rows={4}
				/>
				{errors.description && (
					<p className="text-red-500 text-sm">{errors.description.message}</p>
				)}
			</div>

			{/* Location Field using AddressInput (controlled with Controller) */}
			<div>
				<label className="block mb-1 font-medium">Location *</label>
				<Controller
					name="location"
					control={control}
					rules={{
						required: "Location is required",
					}}
					render={({ field }) => (
						<div>
							<AddressInput
								onChange={(val: string) => field.onChange(val)}
								value={field.value}
							/>
							{errors.location && (
								<p className="text-red-500 text-sm">
									{errors.location.message}
								</p>
							)}
						</div>
					)}
				/>
			</div>

			{/* Property Category Select Field */}
			<div className=" ">
				<div>
					<label className="block mb-1 font-medium">Property Category *</label>
					<select
						{...register("propertyCategory", {
							required: "Please select a category",
							onChange: (e) => {
								const selected = e.target.value;
								if (selected !== "land") {
									setValue("unit", ""); // clear unit immediately
								}
							},
						})}
						className="w-full border rounded px-3 py-2"
					>
						<option value="">Select category</option>
						{propertyCategories.map((cat) => (
							<option key={cat} value={cat}>
								{cat.charAt(0).toUpperCase() + cat.slice(1)}
							</option>
						))}
					</select>
					{errors.propertyCategory && (
						<p className="text-red-500 text-sm">
							{errors.propertyCategory.message}
						</p>
					)}
				</div>
			</div>

			{/* Unit Select Field (optional) */}

			{/* Price Field */}
			<div
				className={`flex flex-col sm:flex-row sm:justify-start gap-4 ${
					watch("propertyCategory") === "land" ? "border-1 p-4 " : ""
				} `}
			>
				<div>
					<label className=" mb-1 font-medium ">
						Price {watchPropertyCategories === "land" ? "per unit" : ""}
					</label>
					<Input
						className="px-3 py-2"
						type="number"
						{...register("price", {
							valueAsNumber: true,
							min: { value: 0, message: "Price must be positive" },
						})}
						placeholder="Enter price"
					/>
					{errors.price && (
						<p className="text-red-500 text-sm">{errors.price.message}</p>
					)}
				</div>
				{/* Watch after setting only display unit if land is selected */}
				{watch("propertyCategory") === "land" && (
					<div>
						<label className="block mb-1 font-medium">Unit</label>
						<select {...register("unit")} className="border rounded px-3 py-1">
							<option value="" disabled>
								Select unit
							</option>
							{unitOptions.map((unit) => (
								<option key={unit} value={unit}>
									{"per " + unit}
								</option>
							))}
						</select>
					</div>
				)}
			</div>
			{/* Total Available Land space */}
			{watch("propertyCategory") === "land" && (
				<div
					className={`flex flex-col sm:flex-row sm:justify-start gap-4 ${
						watch("propertyCategory") === "land" ? "border-1 p-4 " : ""
					} `}
				>
					<div>
						<label className=" mb-1 font-medium ">Total land space</label>
						<Input
							className="px-3 py-2"
							type="number"
							step="1"
							{...register("availableLandSpace", {
								required: "Total available land space is required",
								valueAsNumber: true,
								min: {
									value: 0,
									message: "Total available land space must be positive",
								},
							})}
							placeholder="Enter total space in numbers"
						/>
						{errors.availableLandSpace && (
							<p className="text-red-500 text-sm">
								{errors.availableLandSpace.message}
							</p>
						)}
					</div>
					{/* Watch after setting only display unit if land is selected */}
					{watch("propertyCategory") === "land" && (
						<div>
							<label className="block mb-1 font-medium">Unit</label>
							<select
								{...register("availableLandSpaceUnit")}
								className="border rounded px-3 py-1"
							>
								<option value="" disabled>
									Select unit
								</option>
								{unitOptions.map((unit) => (
									<option key={unit} value={unit}>
										{unit}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			)}

			{/* Price Type Select Field */}

			{/* Pictures File Upload Field with Preview */}
			<div>
				<label className="block mb-1 font-medium">Pictures</label>
				<Input
					type="file"
					multiple
					accept="image/*"
					{...register("pictures")}
				/>
				{/* Show image previews if any files are selected */}
				{previews.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-2">
						{previews.map((src, idx) => (
							<div key={idx} className="relative w-20 h-20">
								{/* Preview Image */}
								<img
									src={src}
									alt={`preview-${idx}`}
									className="w-20 h-20 object-cover rounded border"
								/>
								{/* Delete Button */}
								<button
									type="button"
									className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-500 hover:text-black transition"
									onClick={() => {
										// Remove the file at index idx from the FileList
										const dt = new DataTransfer();
										Array.from(pictures).forEach((file, fileIdx) => {
											if (fileIdx !== idx) dt.items.add(file);
										});
										// Update the 'pictures' field in react-hook-form
										setValue("pictures", dt.files, { shouldValidate: true });
									}}
									tabIndex={-1}
								>
									<Trash2 size={16} className="text-red-500 hover:text-white" />
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Submit Button */}
			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? "Submitting..." : "Create Sell Post"}
			</Button>
		</form>
	);
};

export default SellPostForm;
