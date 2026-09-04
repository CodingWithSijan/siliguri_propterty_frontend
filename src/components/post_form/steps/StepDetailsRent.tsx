// File: components/PostForm/steps/StepDetailsRent.tsx
// Step for entering details specific to rental properties.
// Conditionally renders fields based on property type (house, flat, shop).
// Includes price, duration, and availability fields for rental listings.

import { useFormContext } from "react-hook-form";
import InputField from "../reusable_input_fields/InputField";
import BooleanInput from "../reusable_input_fields/BooleanInput";
import SelectFurnishing from "../reusable_input_fields/SelectFurnishing";
import InputDate from "../reusable_input_fields/InputDate";

const StepDetailsRent = () => {
	const {
		register,
		watch,
		formState: { errors },
	} = useFormContext();

	const propertyCategory = watch("propertyCategory");

	return (
		<div className="space-y-6">
			<section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
				<h3 className="text-base font-semibold text-slate-900">
					Property Specifications
				</h3>
				<p className="mt-1 text-sm text-slate-600">
					Add physical details and availability information for this rental
					listing.
				</p>

				{/* Show house/flat-specific fields */}
				{(propertyCategory === "house" || propertyCategory === "flat") && (
					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InputField label="Bedrooms" name="bedrooms" />
						<InputField label="Bathrooms" name="bathrooms" />
						{/* Only show 'Floor' for houses */}
						{propertyCategory === "house" && (
							<InputField label="Floor" name="floor" />
						)}
						<InputField label="Built Up Area (in sq foot)" name="builtUpArea" />
						<BooleanInput label="Attached Bathroom" name="attachedBathroom" />
						<BooleanInput label="Parking Available" name="parking" />
						<SelectFurnishing />
						<InputDate label="Available From" name="availableFrom" />
					</div>
				)}

				{/* Show shop-specific fields */}
				{propertyCategory === "shop" && (
					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<InputField label="Shop Area (in sq foot)" name="shopArea" />
						<BooleanInput label="Has Shutter" name="hasShutter" />
						<SelectFurnishing />
						<InputDate label="Available From" name="availableFrom" />
					</div>
				)}
			</section>

			<section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
				<h3 className="text-base font-semibold text-slate-900">
					Pricing & Tenure
				</h3>
				<p className="mt-1 text-sm text-slate-600">
					Set rental price, billing frequency, and expected duration.
				</p>

				{/* Price and rental frequency fields */}
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1 block font-medium">Price (INR)</label>
						<input
							type="number"
							step="100"
							{...register("pricePerFrequency", {
								required: "Price is required",
								valueAsNumber: true,
							})}
							className="w-full rounded-lg border border-slate-300 px-3 py-2"
							placeholder="Enter price or budget"
						/>
						{errors.pricePerFrequency && (
							<p className="text-sm text-red-500">
								{String(errors.pricePerFrequency?.message)}
							</p>
						)}
					</div>

					<div>
						<label className="mb-1 block font-medium">Duration</label>
						<select
							{...register("frequency", {
								required: "Duration is required",
							})}
							className="w-full rounded-lg border border-slate-300 px-3 py-2"
						>
							<option value="">Select duration</option>
							<option value="day">Per Day</option>
							<option value="week">Per Week</option>
							<option value="month">Per Month</option>
							<option value="year">Per Year</option>
						</select>
						{errors.frequency && (
							<p className="text-sm text-red-500">
								{String(errors.frequency?.message)}
							</p>
						)}
					</div>
				</div>

				{/* Available for duration fields */}
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1 block font-medium">
							Available For Duration
						</label>
						<input
							type="number"
							{...register("availableForDuration", {
								valueAsNumber: true,
								required: "Available For Duration is required",
							})}
							className="w-full rounded-lg border border-slate-300 px-3 py-2"
							placeholder="e.g., 6"
						/>
						{errors.availableForDuration && (
							<p className="text-sm text-red-500">
								{String(errors.availableForDuration?.message)}
							</p>
						)}
					</div>
					<div>
						<label className="mb-1 block font-medium">Duration Unit</label>
						<select
							{...register("availableForDurationUnit", {
								required: "Duration Unit is required",
							})}
							className="w-full rounded-lg border border-slate-300 px-3 py-2"
						>
							<option value="">Select unit</option>
							<option value="day">Days</option>
							<option value="week">Weeks</option>
							<option value="month">Months</option>
							<option value="year">Years</option>
						</select>
						{errors.availableForDurationUnit && (
							<p className="text-sm text-red-500">
								{String(errors.availableForDurationUnit?.message)}
							</p>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default StepDetailsRent;
