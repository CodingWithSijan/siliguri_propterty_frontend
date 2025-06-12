// Step for entering details specific to properties for sale.
// Conditionally renders fields based on property type (house, flat, land, shop).
// Includes price, area, and other relevant fields for selling listings.

import { useFormContext } from "react-hook-form";
import { Input } from "../../ui/input";
import InputField from "../reusable_input_fields/InputField";
import SelectFurnishing from "../reusable_input_fields/SelectFurnishing";
import BooleanInput from "../reusable_input_fields/BooleanInput";
import InputDate from "../reusable_input_fields/InputDate";
import { useEffect } from "react";

const StepDetailsSell = () => {
	const {
		register,
		watch,
		setValue,
		formState: { errors },
	} = useFormContext();

	const pricePerUnit = watch("pricePerUnit");
	const unit = watch("unit");
	const landSpace = watch("availableLandSpace");
	const landSpaceUnit = watch("availableLandSpaceUnit");

	const unitConversionRates: Record<string, number> = {
		katha: 1,
		bigha: 20, // 1 bigha = 20 katha
		decimal: 0.8, // 1 katha = 1.25 decimal → 1 decimal = 0.8 katha
		acre: 66.67, // 1 acre = 66.67 katha
		"sq foot": 0.000367, // 1 sq foot ≈ 0.000367 katha
	};

	useEffect(() => {
		if (
			pricePerUnit &&
			landSpace &&
			unit &&
			landSpaceUnit &&
			!isNaN(Number(landSpace))
		) {
			const landSpaceNum = parseFloat(landSpace);
			const unitRate = unitConversionRates[unit];
			const landUnitRate = unitConversionRates[landSpaceUnit];

			if (unitRate && landUnitRate) {
				const landInPriceUnit = (landSpaceNum * landUnitRate) / unitRate;
				const total = Math.round(landInPriceUnit * pricePerUnit);
				setValue("totalPrice", total);
			}
		}
	}, [pricePerUnit, landSpace, unit, landSpaceUnit, setValue]);

	const propertyCategory = watch("propertyCategory");
	const unitOptions = ["decimal", "sq foot", "katha", "bigha", "acre"];

	return (
		<div className="space-y-6">
			{/* LAND FIELDS */}
			{propertyCategory === "land" && (
				<>
					{/* Price per unit */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<label className="block font-medium mb-1">Price (per unit)</label>
							<Input
								type="number"
								step="10000"
								{...register("pricePerUnit", {
									valueAsNumber: true,
									required: "Price per unit is required",
								})}
								placeholder="Enter price per unit"
							/>
							{errors.pricePerUnit && (
								<p className="text-sm text-red-500">
									{String(errors.pricePerUnit?.message)}
								</p>
							)}
						</div>
						<div className="flex-1">
							<label className="block font-medium mb-1">Unit</label>
							<select
								{...register("unit", {
									required: "Unit  is required",
								})}
								className="w-full border rounded px-3 py-2"
							>
								<option value="">Select unit</option>
								{unitOptions.map((unit) => (
									<option key={unit} value={unit}>
										per {unit}
									</option>
								))}
							</select>
							{errors.unit && (
								<p className="text-sm text-red-500">
									{String(errors.unit?.message)}
								</p>
							)}
						</div>
					</div>

					{/* Land space */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<label className="block font-medium mb-1">Total Land Space</label>
							<Input
								type="number"
								{...register("availableLandSpace", {
									required: "Total land space is required",
									valueAsNumber: true,
								})}
								placeholder="e.g., 10.5"
							/>
							{errors.availableLandSpace && (
								<p className="text-sm text-red-500">
									{String(errors.availableLandSpace?.message)}
								</p>
							)}
						</div>
						<div className="flex-1">
							<label className="block font-medium mb-1">
								Total land space unit
							</label>
							<select
								{...register("availableLandSpaceUnit", {
									required: "Unit is required",
								})}
								className="w-full border rounded px-3 py-2"
							>
								<option value="">Select unit</option>
								{unitOptions.map((unit) => (
									<option key={unit} value={unit}>
										{unit}
									</option>
								))}
							</select>
							{errors.availableLandSpaceUnit && (
								<p className="text-sm text-red-500">
									{String(errors.availableLandSpaceUnit?.message)}
								</p>
							)}
						</div>
					</div>

					{/* Total Price */}
					<div>
						<label className="block font-medium mb-1 ">Total Price</label>
						<Input
							className="bg-gray-100 w-1/2 "
							readOnly
							type="number"
							{...register("totalPrice", { valueAsNumber: true })}
						/>
					</div>
				</>
			)}

			{/* HOUSE or FLAT FIELDS */}
			{(propertyCategory === "house" || propertyCategory === "flat") && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<InputField label="Bedrooms" name="bedrooms" />
					<InputField label="Bathrooms" name="bathrooms" />
					{propertyCategory === "house" && (
						<InputField label="Floor" name="floor" />
					)}
					<InputField label="Built Up Area" name="builtUpArea" />
					<BooleanInput label="Attached Bathroom" name="attachedBathroom" />
					<BooleanInput label="Parking available" name="parking" />
					<SelectFurnishing />
					<div>
						<label htmlFor="price" className="block font-medium mb-1">
							Price
						</label>
						<Input
							type="number"
							step="100"
							{...register("price", {
								required: "Price is requried",
								valueAsNumber: true,
							})}
						/>
						{errors.price && (
							<p className="text-red-500 text-sm">
								{String(errors.price.message)}
							</p>
						)}
					</div>
					<InputDate label="Available From" name="availableFrom" />
				</div>
			)}

			{/* SHOP FIELDS */}
			{propertyCategory === "shop" && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<InputField label="Shop Area (in sq foot)" name="shopArea" />
					<BooleanInput label="Has Shutter" name="hasShutter" />
					<SelectFurnishing />
					<InputDate label="Available From" name="availableFrom" />
					<div>
						<label htmlFor="price" className="block font-medium mb-1">
							Price (in INR)
						</label>
						<Input
							type="number"
							step="100"
							{...register("price", {
								required: "Price is requried",
								valueAsNumber: true,
							})}
						/>
						{errors.price && (
							<p className="text-red-500 text-sm">
								{String(errors.price.message)}
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default StepDetailsSell;
