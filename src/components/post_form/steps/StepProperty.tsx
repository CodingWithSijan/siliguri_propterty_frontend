// Step for entering/selecting the property type and location in the post form.
// Handles property category selection and location input.

import { useFormContext, Controller } from "react-hook-form";
import AddressInput from "../../../services/AddressInput";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

const StepPropertyType = () => {
	const {
		register,
		control,
		formState: { errors },
		getValues,
	} = useFormContext();

	const intent = getValues("intent");

	return (
		<div className="space-y-6">
			<div>
				<label className="block font-medium mb-1">Property Category *</label>
				<select
					{...register("propertyCategory", {
						required: "Property Category is required",
					})}
					className="w-full border rounded px-3 py-2"
				>
					<option value="">Select property type</option>
					{intent === "sell" && <option value="land">Land</option>}
					<option value="house">House</option>
					<option value="flat">Flat</option>
					<option value="shop">Shop</option>
				</select>
				{typeof errors.propertyCategory?.message === "string" && (
					<p className="text-red-500 text-sm">
						{errors.propertyCategory.message}
					</p>
				)}
			</div>

			<div>
				<label className="block font-medium mb-1">Location *</label>
				<Controller
					name="location"
					rules={{ required: "Location is required" }}
					control={control}
					render={({ field }) => (
						<>
							<AddressInput value={field.value} onChange={field.onChange} />
							{typeof errors.location?.message === "string" && (
								<p className="text-red-500 text-sm">
									{errors.location.message}
								</p>
							)}
						</>
					)}
				/>
			</div>
			<div>
				<label htmlFor="alternateLocation">
					Alternate Location{" "}
					<span className="italic">
						(Enter exact location here if required)
					</span>
				</label>
				<Input
					type="text"
					placeholder="Enter detailed location here..."
					{...register("alternateLocation")}
				/>
			</div>
			<div>
				<label htmlFor="title" className="block font-medium mb-1">
					Title
				</label>
				<Input
					type="text"
					placeholder="Enter title for your post..."
					{...register("title", {
						required: "Title is required",
						minLength: {
							value: 10,
							message: "Title must be atleast 10 characters",
						},
					})}
				/>
				{errors.title && (
					<p className="text-red-500 text-sm">{String(errors.title.message)}</p>
				)}
			</div>
			<div>
				<label htmlFor="title" className="block font-medium mb-1">
					Description
				</label>
				<Textarea
					placeholder="Enter description for your post..."
					{...register("description", {
						required: "Description is required",
						minLength: {
							value: 10,
							message: "description must be atleast 10 characters",
						},
					})}
				/>
				{errors.description && (
					<p className="text-red-500 text-sm">
						{String(errors.description.message)}
					</p>
				)}
			</div>
		</div>
	);
};

export default StepPropertyType;
