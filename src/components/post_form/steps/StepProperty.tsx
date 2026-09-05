// Step for entering/selecting the property type and location in the post form.
// Handles property category selection and location input.

import { useFormContext, Controller } from "react-hook-form";
import { useEffect } from "react";
import { MapPin } from "lucide-react";
import AddressInput from "../../../services/AddressInput";
import { Input } from "../../ui/input";
import RichTextEditor from "../../common/RichTextEditor";
import {
	WEST_BENGAL_LOCATION_MAP,
	WEST_BENGAL_LOCATIONS,
} from "../../../constants/westBengalLocations";

const StepPropertyType = () => {
	const {
		register,
		control,
		formState: { errors },
		getValues,
		setValue,
		watch,
		register: rhfRegister,
	} = useFormContext();

	const intent = getValues("intent");
	const selectedAreaKey = watch("wbLocalityKey") as string | undefined;
	const watchedLocation = watch("location") as string | undefined;

	useEffect(() => {
		if (selectedAreaKey || !watchedLocation) {
			return;
		}

		const normalizedLocation = watchedLocation.toLowerCase();
		const matchedArea = Object.values(WEST_BENGAL_LOCATION_MAP).find(
			(area) =>
				normalizedLocation.includes(area.label.toLowerCase()) ||
				area.aliases.some((alias) => normalizedLocation.includes(alias)),
		);

		if (!matchedArea) {
			return;
		}

		setValue("wbLocalityKey", matchedArea.value, {
			shouldDirty: false,
		});
		setValue("wbLocalityLabel", matchedArea.label, {
			shouldDirty: false,
		});
	}, [selectedAreaKey, setValue, watchedLocation]);

	// Make sure coordinates is registered
	useEffect(() => {
		rhfRegister("coordinates", {
			required: true,
			validate: (value) => {
				if (!value || typeof value !== "object") {
					return "Please select a valid Siliguri location";
				}

				const coords = value as { coordinates?: [number, number] };
				if (
					!Array.isArray(coords.coordinates) ||
					coords.coordinates.length !== 2
				) {
					return "Please select a valid Siliguri location";
				}

				const [lng, lat] = coords.coordinates;
				const isValidRange =
					Number.isFinite(lat) &&
					Number.isFinite(lng) &&
					lat >= 26.62 &&
					lat <= 26.83 &&
					lng >= 88.28 &&
					lng <= 88.5;

				return isValidRange || "Please select a valid Siliguri location";
			},
		});
	}, [rhfRegister]);

	return (
		<div className="space-y-6">
			<section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
				<h3 className="text-base font-semibold text-slate-900">
					Category & Location
				</h3>
				<p className="mt-1 text-sm text-slate-600">
					Select the right category and choose the nearest Siliguri area.
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
						<div>
							<label className="mb-1 block font-medium">
								<span className="inline-flex items-center gap-1">
									<MapPin className="h-4 w-4 text-blue-500" />
									Siliguri Area *
								</span>
							</label>
							<select
								{...register("wbLocalityKey", {
									required: "Area is required",
									onChange: (event) => {
										const areaKey = String(event.target.value || "");
										const area = WEST_BENGAL_LOCATION_MAP[areaKey];
										if (!area) {
											setValue("wbLocalityLabel", "", {
												shouldDirty: true,
											});
											setValue("location", "", {
												shouldDirty: true,
												shouldValidate: true,
											});
											setValue("coordinates", undefined, {
												shouldDirty: true,
												shouldValidate: true,
											});
											return;
										}

										setValue("wbLocalityLabel", area.label, {
											shouldDirty: true,
										});
										setValue("location", area.label, {
											shouldDirty: true,
											shouldValidate: true,
										});
										setValue(
											"coordinates",
											{ type: "Point", coordinates: [area.lng, area.lat] },
											{ shouldDirty: true, shouldValidate: true },
										);
									},
								})}
								className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
							>
								<option value="">Select area</option>
								{WEST_BENGAL_LOCATIONS.map((area) => (
									<option key={area.value} value={area.value}>
										{area.label}
									</option>
								))}
							</select>
							{typeof errors.wbLocalityKey?.message === "string" && (
								<p className="text-sm text-red-500">
									{errors.wbLocalityKey.message}
								</p>
							)}
							{typeof errors.coordinates?.message === "string" && (
								<p className="text-sm text-red-500">
									{errors.coordinates.message}
								</p>
							)}
							<input
								type="hidden"
								{...register("location", { required: "Location is required" })}
							/>
							{typeof errors.location?.message === "string" && (
								<p className="text-sm text-red-500">
									{errors.location.message}
								</p>
							)}
						</div>
					</div>

					<div>
						<label htmlFor="alternateLocation" className="font-medium">
							Location / LandMark
							<span className="ml-1 text-sm font-normal italic text-blue-600">
								Add house number, road, apartment, or a nearby landmark for
								better accuracy.
							</span>
						</label>
						<Controller
							name="alternateLocation"
							control={control}
							render={({ field }) => (
								<AddressInput
									value={field.value ?? ""}
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
