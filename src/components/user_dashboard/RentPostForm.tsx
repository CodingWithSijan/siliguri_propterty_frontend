// RentPostForm.tsx
// Form for creating a new 'Rent' real estate post. Uses React Hook Form, supports image uploads, and uses AddressInput for location.

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import AddressInput from "../../services/AddressInput";
import { showSuccess, showError } from "../../utils/toastUtils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import BASE_URL from "../../services";
import { Trash2 } from "lucide-react";
import { Props } from "../../types/user_dashboard_types";

// Property categories for the dropdown
const propertyCategories = ["apartment", "house", "room", "shop"];
// Price types for frequency/duration
const priceTypes = [
	{ value: "month", label: "Per Month" },
	{ value: "week", label: "Per Week" },
	{ value: "day", label: "Per Day" },
];
// Rent roles for the dropdown
const rentRoles = [
	{ value: "tenant", label: "Tenant" },
	{ value: "owner", label: "Owner" },
];

// Type definition for form inputs
// pictures is optional and only for 'owner' role
// duration is required in the form, but optional in type for flexibility
// price is optional for flexibility
type RentPostFormInputs = {
	title: string; // Title of the property
	description: string; // Description of the property
	location: string; // Address/location
	propertyCategory: string; // Category (apartment, house, etc.)
	price?: number; // Price or budget
	rentRole: string; // Owner or tenant
	duration?: string; // Frequency/duration (per month, week, etc.)
	pictures?: FileList; // Images (only for owner)
};

// Main RentPostForm component
const RentPostForm: React.FC<Props> = ({ registerReset }) => {
	// Initialize React Hook Form
	const {
		register, // For registering input fields
		handleSubmit, // Handles form submission
		reset, // Resets the form
		watch, // Watches form values
		control, // For controlled components (e.g., AddressInput)
		setValue, // Programmatically set field values
		formState: { errors, isSubmitting }, // Form state (errors, loading)
	} = useForm<RentPostFormInputs>();

	// Register the reset function with parent (if needed)
	useEffect(() => {
		registerReset(reset);
	}, [reset, registerReset]);

	// State for image previews
	const [previews, setPreviews] = useState<string[]>([]);
	// Watchers for pictures and rentRole fields
	const pictures = watch("pictures");
	const rentRoleWatch = watch("rentRole");
	const priceWatch = watch("price");

	// Update image previews when pictures change
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

	// If rentRole is 'tenant', clear pictures field and previews
	useEffect(() => {
		if (rentRoleWatch === "tenant") {
			setValue("pictures", undefined);
			setPreviews([]);
		}
	}, [rentRoleWatch, priceWatch, setValue]);

	// Form submission handler
	const onSubmit = async (data: RentPostFormInputs) => {
		const formData = new FormData();
		// Append all form fields to FormData for API
		formData.append("title", data.title);
		formData.append("description", data.description);
		formData.append("location", data.location);
		formData.append("propertyCategory", data.propertyCategory);
		formData.append("price", String(data.price));
		formData.append("rentRole", data.rentRole);
		if (data.duration) formData.append("duration", data.duration);
		// Append images if present
		if (data.pictures && data.pictures.length > 0) {
			Array.from(data.pictures).forEach((file) => {
				formData.append("pictures", file);
			});
		}
		try {
			await BASE_URL.post("/api/user/post/new-rent-post", formData);
			showSuccess("Rent post created successfully!");
			reset(); // Reset form
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (err: any) {
			showError(err?.response?.data?.message || "Failed to create rent post.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-6 bg-white p-6 rounded-xl shadow max-w-2xl mx-auto"
		>
			<h2 className="text-xl font-bold mb-4">Create Rent Post</h2>
			{/* Title input */}
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
			{/* Description input */}
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
			{/* Location input using AddressInput component */}
			<div>
				<label className="block mb-1 font-medium">Location *</label>
				<Controller
					name="location"
					control={control}
					rules={{ required: "Location is required" }}
					render={({ field }) => (
						<div>
							<AddressInput onChange={field.onChange} value={field.value} />
							{errors.location && (
								<p className="text-red-500 text-sm">
									{errors.location.message}
								</p>
							)}
						</div>
					)}
				/>
			</div>
			{/* Rent Role dropdown */}
			<div className="flex-1">
				<label className="block mb-1 font-medium">Rent Role *</label>
				<select
					{...register("rentRole", { required: "Select rent role" })}
					className="w-full border rounded px-3 py-2"
				>
					<option value="">Select role</option>
					{rentRoles.map((role) => (
						<option key={role.value} value={role.value}>
							{role.label}
						</option>
					))}
				</select>
				{errors.rentRole && (
					<p className="text-red-500 text-sm">{errors.rentRole.message}</p>
				)}
			</div>
			{/* Property Category dropdown */}
			<div>
				<label className="block mb-1 font-medium">Property Category *</label>
				<select
					{...register("propertyCategory", { required: "Select a category" })}
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
			{/* Price/Budget and Frequency/Duration fields */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="flex-1">
					<label className="block mb-1 font-medium">
						{/* Label changes based on rentRole */}
						{rentRoleWatch === "tenant" ? "Budget" : "Price"}
					</label>
					<Input
						type="number"
						step="0.01"
						{...register("price")}
						placeholder="Enter price"
					/>
				</div>
				<div className="flex-1">
					<label className="block mb-1 font-medium">
						Frequency/duration
						{!priceWatch || priceWatch >= 0 ? <span></span> : <span>*</span>}
					</label>
					<select
						{...register("duration", {
							validate: () => (!priceWatch || priceWatch >= 0 ? true : false),
						})}
						className="w-full border rounded px-3 py-2"
					>
						<option value="">Select Frequency</option>
						{priceTypes.map((pt) => (
							<option key={pt.value} value={pt.value}>
								{pt.label}
							</option>
						))}
					</select>
					{errors.duration && (
						<p className="text-red-500 text-sm">{errors.duration.message}</p>
					)}
				</div>
			</div>
			{/* Pictures upload (only for owner) */}
			{rentRoleWatch === "owner" && (
				<div>
					<label className="block mb-1 font-medium">Pictures</label>
					<Input
						type="file"
						multiple
						accept="image/*"
						{...register("pictures")}
					/>
					{/* Image previews with remove button */}
					{previews.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-2">
							{previews.map((src, idx) => (
								<div key={idx} className="relative w-20 h-20">
									<img
										src={src}
										alt={`preview-${idx}`}
										className="w-20 h-20 object-cover rounded border"
									/>
									<button
										type="button"
										className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
										onClick={() => {
											// Remove selected image from FileList
											const dt = new DataTransfer();
											if (pictures) {
												Array.from(pictures).forEach((file, fileIdx) => {
													if (fileIdx !== idx) dt.items.add(file);
												});
											}
											setValue("pictures", dt.files, { shouldValidate: true });
										}}
										tabIndex={-1}
									>
										<Trash2
											size={16}
											className="text-red-500 hover:text-white"
										/>
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* Submit button */}
			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? "Submitting..." : "Create Rent Post"}
			</Button>
		</form>
	);
};

export default RentPostForm;
