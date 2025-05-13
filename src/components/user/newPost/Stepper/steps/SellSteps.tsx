import { SellFormData, UnitType } from "../../../../../types/postTypes";
import { useForm } from "react-hook-form";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "../../../../ui/select";
import AddressInput from "../../../../../services/AddressInput";
import {
	FaTag,
	FaFileAlt,
	FaMapMarkerAlt,
	FaRupeeSign,
	FaMoneyBillWave,
	FaBuilding,
} from "react-icons/fa";

interface Props {
	step: number;
	formData: SellFormData;
	updateField: <K extends keyof SellFormData>(
		key: K,
		value: SellFormData[K]
	) => void;
	onNext: () => void;
	onBack: () => void;
}

export default function SellSteps({
	step,
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
						<FaTag /> Title
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
						<FaFileAlt /> Description
					</div>
				</Label>
				<Input
					{...register("description", { required: "Description is required" })}
				/>
				{errors.description && (
					<p className="text-red-500 text-sm">{errors.description.message}</p>
				)}
			</div>

			{/* Location (Google Places Autocomplete) */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<FaMapMarkerAlt /> Location
					</div>
				</Label>
				<AddressInput
					defaultValue={formData.location}
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
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<FaRupeeSign /> Price (in NPR)
					</div>
				</Label>
				<Input
					type="number"
					{...register("price", { required: "Price is required" })}
				/>
				{errors.price && (
					<p className="text-red-500 text-sm">{errors.price.message}</p>
				)}
			</div>

			{/* Price Type */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<FaMoneyBillWave /> Price Type
					</div>
				</Label>
				<Select
					defaultValue={formData.priceType}
					onValueChange={(val) => {
						setValue("priceType", val as SellFormData["priceType"]);
						updateField("priceType", val as SellFormData["priceType"]);
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
			</div>

			{/* Property Type */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<FaBuilding /> Property Type
					</div>
				</Label>
				<Select
					defaultValue={formData.propertyCategory}
					onValueChange={(val) => {
						setValue(
							"propertyCategory",
							val as SellFormData["propertyCategory"]
						);
						updateField(
							"propertyCategory",
							val as SellFormData["propertyCategory"]
						);
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
			</div>

			{/* Unit (only when property type is land) */}
			{propertyType === "land" && (
				<div>
					<Label>Unit</Label>
					<Select
						defaultValue={formData.unit}
						onValueChange={(val) => {
							setValue("unit", val as UnitType);
							updateField("unit", val as UnitType);
						}}
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
