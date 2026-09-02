// Step for entering/selecting the property type and location in the post form.
// Handles property category selection and location input.

import { useFormContext, Controller } from "react-hook-form";
import AddressInput from "../../../services/AddressInput";
import { Input } from "../../ui/input";
// import { Textarea } from "../../ui/textarea";
import { useEffect } from "react";
import RichTextEditor from "../../common/RichTextEditor";

const StepPropertyType = () => {
	const {
		register,
		control,
		formState: { errors },
		getValues,
		setValue,
		register: rhfRegister,
	} = useFormContext();

	const intent = getValues("intent");
	// Make sure coordinates is registered
	useEffect(() => {
		rhfRegister("coordinates", { required: true });
	}, [rhfRegister]);

	return (
		<div className="space-y-6">
			<section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
				<h3 className="text-base font-semibold text-slate-900">
					Category & Location
				</h3>
				<p className="mt-1 text-sm text-slate-600">
					Select the right category and set an accurate map location first.
				</p>

				<div className="mt-4 grid grid-cols-1 gap-4">
					<div>
						<label className="mb-1 block font-medium">
							Property Category *
						</label>
						<select
							{...register("propertyCategory", {
								required: "Property Category is required",
							})}
							className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
						>
							<option value="">Select property type</option>
							{intent === "sell" && <option value="land">Land</option>}
							<option value="house">House</option>
							<option value="flat">Flat</option>
							<option value="shop">Shop</option>
						</select>
						{typeof errors.propertyCategory?.message === "string" && (
							<p className="text-sm text-red-500">
								{errors.propertyCategory.message}
							</p>
						)}
					</div>

					<div>
						<label className="mb-1 block font-medium">
							Location *
							<span className="ml-1 text-sm font-normal italic text-blue-600">
								Pick an approximate place from suggestions for better map
								accuracy.
							</span>
						</label>
						<Controller
							name="location"
							rules={{ required: "Location is required" }}
							control={control}
							render={({ field }) => (
								<AddressInput
									value={field.value}
									onChange={field.onChange}
									onSelect={(address, coords) => {
										field.onChange(address);
										if (coords) {
											setValue(
												"coordinates",
												{
													type: "Point",
													coordinates: [coords.lng, coords.lat],
												},
												{ shouldValidate: true, shouldDirty: true },
											);
										}
									}}
								/>
							)}
						/>
					</div>

					<div>
						<label htmlFor="alternateLocation" className="font-medium">
							Alternate Location
							<span className="ml-1 text-sm font-normal italic text-blue-600">
								Add exact landmark or address details here.
							</span>
						</label>
						<Input
							type="text"
							placeholder="Apartment name, nearby landmark, road, etc."
							{...register("alternateLocation")}
						/>
					</div>
				</div>
			</section>

			<section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
				<h3 className="text-base font-semibold text-slate-900">
					Listing Overview
				</h3>
				<p className="mt-1 text-sm text-slate-600">
					Write a clear headline and details buyers or tenants can trust.
				</p>

				<div className="mt-4 space-y-4">
					<div>
						<label htmlFor="title" className="mb-1 block font-medium">
							Title
						</label>
						<Input
							type="text"
							placeholder="Example: Spacious 2BHK Flat Near City Center"
							{...register("title", {
								required: "Title is required",
								minLength: {
									value: 10,
									message: "Title must be atleast 10 characters",
								},
							})}
						/>
						{errors.title && (
							<p className="text-sm text-red-500">
								{String(errors.title.message)}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="description" className="mb-1 block font-medium">
							Description
						</label>
						<Controller
							name="description"
							control={control}
							rules={{
								required: "Description is required",
								minLength: {
									value: 10,
									message: "Description must be atleast 10 characters",
								},
							}}
							render={({ field }) => (
								<RichTextEditor
									value={field.value || ""}
									onChange={field.onChange}
									placeholder="Highlight size, condition, nearby facilities, and any unique features..."
									disabled={false}
								/>
							)}
						/>
						{errors.description && (
							<p className="text-sm text-red-500">
								{String(errors.description.message)}
							</p>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default StepPropertyType;
