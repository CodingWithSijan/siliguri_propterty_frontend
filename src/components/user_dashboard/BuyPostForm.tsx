// BuyPostForm.tsx
// Form for creating a new 'Buy' real estate post. Uses React Hook Form and AddressInput for location.

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import AddressInput from "../../services/AddressInput";
import { showSuccess, showError } from "../../utils/toastUtils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import BASE_URL from "../../services";
import { Props } from "../../types/user_dashboard_types";
import { BuyPostFormInputs } from "../../types/postFormTypes";

const propertyCategories = ["apartment", "house", "room", "shop", "land"];

const BuyPostForm: React.FC<Props> = ({ registerReset }) => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors, isSubmitting },
	} = useForm<BuyPostFormInputs>();
	useEffect(() => {
		registerReset(reset);
	}, [reset, registerReset]);

	const onSubmit = async (data: BuyPostFormInputs) => {
		try {
			await BASE_URL.post("/api/user/post/new-buy-post", data);
			showSuccess("Buy post created successfully!");
			reset();
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (err: any) {
			showError(err?.response?.data?.message || "Failed to create buy post.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-6 bg-white p-6 rounded-xl shadow max-w-2xl mx-auto"
		>
			<h2 className="text-xl font-bold mb-4">Create Buy Post</h2>
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
			<div>
				<label className="block mb-1 font-medium">Description *</label>
				<Textarea
					{...register("description", { required: "Description is required" })}
					placeholder="Describe your property needs"
					rows={4}
				/>
				{errors.description && (
					<p className="text-red-500 text-sm">{errors.description.message}</p>
				)}
			</div>
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
			<div>
				<label className="block mb-1 font-medium">Price (optional)</label>
				<Input
					type="number"
					step="0.01"
					{...register("price", {
						valueAsNumber: true,
						min: { value: 0, message: "Price must be positive" },
					})}
					placeholder="Enter price (optional)"
				/>
				{errors.price && (
					<p className="text-red-500 text-sm">{errors.price.message}</p>
				)}
			</div>
			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? "Submitting..." : "Create Buy Post"}
			</Button>
		</form>
	);
};

export default BuyPostForm;
