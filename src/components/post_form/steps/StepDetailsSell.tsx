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

const UNIT_CONVERSION_RATES: Record<string, number> = {
	katha: 1,
	bigha: 20,
	decimal: 0.8,
	acre: 66.67,
	"sq foot": 0.000367,
};

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

	useEffect(() => {
		if (
			pricePerUnit &&
			landSpace &&
			unit &&
			landSpaceUnit &&
			!isNaN(Number(landSpace))
		) {
			const landSpaceNum = parseFloat(landSpace);
			const unitRate = UNIT_CONVERSION_RATES[unit];
			const landUnitRate = UNIT_CONVERSION_RATES[landSpaceUnit];

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
			<section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
				<h3 className="text-base font-semibold text-slate-900">
					Property Specifications
				</h3>
				<p className="mt-1 text-sm text-slate-600">
					Enter complete property specifications and sale pricing details.
				</p>
			</section>

			{/* LAND FIELDS */}
			{propertyCategory === "land" && (
				<section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
					<h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">
						Land Pricing Setup
					</h4>
					<p className="mt-1 text-sm text-slate-600">
						Set the unit rate and total area to auto-calculate total price.
					</p>

					{/* Price per unit */}
					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label className="mb-1 block font-medium">Price (per unit)</label>
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
						<div>
							<label className="mb-1 block font-medium">Unit</label>
							<select
								{...register("unit", {
									required: "Unit  is required",
								})}
								className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label className="mb-1 block font-medium">Total Land Space</label>
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
						<div>
							<label className="mb-1 block font-medium">
								Total land space unit
							</label>
							<select
								{...register("availableLandSpaceUnit", {
									required: "Unit is required",
								})}
								className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
					<div className="mt-4">
						<label className="mb-1 block font-medium">Total Price</label>
						<Input
							className="w-full bg-slate-100 sm:w-1/2"
							readOnly
							type="number"
							{...register("totalPrice", { valueAsNumber: true })}
						/>
					</div>
				</section>
			)}

			{/* HOUSE or FLAT FIELDS */}
			{(propertyCategory === "house" || propertyCategory === "flat") && (
				<section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
					<h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">
						Residential Details
					</h4>
					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
				</section>
			)}

			{/* SHOP FIELDS */}
			{propertyCategory === "shop" && (
				<section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
					<h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">
						Commercial Details
					</h4>
					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
				</section>
			)}
		</div>
	);
};

export default StepDetailsSell;
