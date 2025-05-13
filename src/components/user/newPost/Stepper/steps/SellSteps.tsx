import { SellFormData } from "../../../../../types/postTypes";
import { useForm } from "react-hook-form";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { Textarea } from "../../../../ui/textarea";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "../../../../ui/select";
import AddressInput from "../../../../../services/AddressInput";
import { LuText, LuTextQuote, LuMapPin, LuBuilding } from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";
import { useEffect } from "react";

interface Props {
	formData: SellFormData;
	updateField: <K extends keyof SellFormData>(
		key: K,
		value: SellFormData[K]
	) => void;
	onNext: () => void;
	onBack: () => void;
}

export default function SellSteps({
	formData,
	updateField,
	onNext,
	onBack,
}: Props) {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		trigger,
		formState: { errors },
	} = useForm<SellFormData>({
		defaultValues: formData,
	});

	const propertyType = watch("propertyCategory");

	const onSubmit = (data: SellFormData) => {
		Object.entries(data).forEach(([key, value]) => {
			updateField(
				key as keyof SellFormData,
				value as SellFormData[keyof SellFormData]
			);
		});
		onNext();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
			{/* Title */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<LuText /> Title
					</div>
				</Label>
				<Input {...register("title", { required: "Title is required" })} />
				{errors.title && (
					<p className="text-red-500 text-sm">{errors.title.message}</p>
				)}
			</div>

			{/* Description */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<LuTextQuote /> Description
					</div>
				</Label>
				<Textarea
					{...register("description", { required: "Description is required" })}
					rows={4}
				/>
				{errors.description && (
					<p className="text-red-500 text-sm">{errors.description.message}</p>
				)}
			</div>

			{/* Location (Google Places Autocomplete) */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<LuMapPin /> Location
					</div>
				</Label>
				<AddressInput
					value={formData.location}
					onSelect={(val: string) => {
						setValue("location", val);
						updateField("location", val);
					}}
				/>
				{errors.location && (
					<p className="text-red-500 text-sm">{errors.location.message}</p>
				)}
			</div>

			{/* Price */}
			<div className="flex flex-col max-w-sm">
				<Label>
					<div className="flex items-center gap-2">
						<MdCurrencyRupee /> Price (in INR)
					</div>
				</Label>
				<Input
					type="number"
					{...register("price", {
						required: "Price is required",
						valueAsNumber: true,
						validate: (value) =>
							parseFloat(value) > 0 || "Price must be a positive number",
					})}
				/>
				{errors.price && (
					<p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
				)}
			</div>

			{/* Price Type */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<MdCurrencyRupee /> Price Type
					</div>
				</Label>
				<Select
					{...register("priceType", { required: "Price type is required" })}
					onValueChange={(value) => {
						setValue("priceType", value);
						trigger("priceType");
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select price type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="fixed">Fixed</SelectItem>
						<SelectItem value="negotiable">Negotiable</SelectItem>
					</SelectContent>
				</Select>
				{errors.priceType && (
					<p className="text-red-500 text-sm mt-1">
						{errors.priceType.message}
					</p>
				)}
			</div>

			{/* Property Type */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<LuBuilding /> Property Type
					</div>
				</Label>
				<Select
					{...register("propertyCategory", {
						required: "Property type is required",
					})}
					onValueChange={(value) => {
						setValue(
							"propertyCategory",
							value as SellFormData["propertyCategory"]
						);
						trigger("propertyCategory");
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Choose property type" />
					</SelectTrigger>
					<SelectContent>
						{["land", "apartment", "house", "room", "shop"].map((type) => (
							<SelectItem key={type} value={type}>
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.propertyCategory && (
					<p className="text-red-500 text-sm mt-1">
						{errors.propertyCategory.message}
					</p>
				)}
			</div>

			{/* Unit (only when property type is land) */}
			{propertyType === "land" && (
				<div>
					<Label>
						<div className="flex items-center gap-2">
							<LuBuilding /> Unit
						</div>
					</Label>
					<Select
						{...register("unit", {
							required:
								formData.propertyCategory === "land"
									? "Unit is required for land"
									: false,
						})}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select unit" />
						</SelectTrigger>
						<SelectContent>
							{[
								"per decimal",
								"per katha",
								"per bigha",
								"per acre",
								"per sq foot",
							].map((unit) => (
								<SelectItem key={unit} value={unit}>
									{unit}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.unit && (
						<p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
					)}
				</div>
			)}

			{/* Unit (only when property type is not land) */}
			{formData.propertyCategory !== "land" && (
				<div>
					<Label>Unit</Label>
					<Select
						{...register("unit", { required: "Unit is required" })}
						onValueChange={(value) => {
							setValue("unit", value);
							trigger("unit");
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select unit" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="sqft">Square Feet</SelectItem>
							<SelectItem value="sqm">Square Meter</SelectItem>
							<SelectItem value="acre">Acre</SelectItem>
						</SelectContent>
					</Select>
					{errors.unit && (
						<p className="text-red-500 text-sm">{errors.unit.message}</p>
					)}
				</div>
			)}

			{/* Navigation Buttons */}
			<div className="flex justify-between pt-4">
				<Button variant="outline" type="button" onClick={onBack}>
					Back
				</Button>
				<Button type="submit">Next</Button>
			</div>
		</form>
	);
}
