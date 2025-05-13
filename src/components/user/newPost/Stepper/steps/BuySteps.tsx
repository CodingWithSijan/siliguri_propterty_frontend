import { BuyFormData } from "../../../../../types/postTypes";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import { useForm } from "react-hook-form";
import { Textarea } from "../../../../ui/textarea";
import AddressInput from "../../../../../services/AddressInput";
import {
	LuText,
	LuTextQuote,
	LuMapPin,
	LuDollarSign,
	LuHouse,
} from "react-icons/lu";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "../../../../ui/select";

interface Props {
	step: number;
	formData: BuyFormData;
	updateField: <K extends keyof BuyFormData>(
		key: K,
		value: BuyFormData[K]
	) => void;
	onNext: () => void;
	onBack: () => void;
}

export default function BuySteps({
	step,
	formData,
	updateField,
	onNext,
	onBack,
}: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		trigger,
	} = useForm<BuyFormData>({
		defaultValues: formData,
	});
	const showError = (error: any): void => {
		console.log(error);
		console.log(JSON.stringify(formData, null, 2));
	};
	const onSubmit = (data: BuyFormData) => {
		Object.entries(data).forEach(([key, value]) => {
			updateField(
				key as keyof BuyFormData,
				value as BuyFormData[keyof BuyFormData]
			);
		});

		onNext();
		console.log(JSON.stringify(errors, null, 2));
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
				{errors.description && <p className="text-red-500 text-sm"></p>}
			</div>
			<button onClick={() => showError(errors)}>sdas</button>

			{/* errors.description.message */}
			{/* Location */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<LuMapPin /> Location
					</div>
				</Label>
				<AddressInput
					value={watch("location")}
					onChange={(val) => {
						setValue("location", val);
						trigger("location");
					}}
				/>
				{errors.location && (
					<p className="text-red-500 text-sm">{errors.location.message}</p>
				)}
			</div>
			{/* Property Category */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<LuHouse /> Property Category
					</div>
				</Label>
				<Select
					{...register("propertyCategory", {
						required: "Property category is required",
					})}
					onValueChange={(value) => {
						setValue("propertyCategory", null);
						trigger("propertyCategory");
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select property category" />
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
					<p className="text-red-500 text-sm">
						{errors.propertyCategory.message}
					</p>
				)}
			</div>
			{/* Budget with Optional Unit */}
			<div className="flex items-end gap-3">
				<div className="flex-1">
					<Label>
						<div className="flex items-center gap-2">
							<LuDollarSign /> Budget
						</div>
					</Label>
					<Input
						type="number"
						{...register("budget", { required: "Budget is required" })}
					/>
					{errors.budget && (
						<p className="text-red-500 text-sm">{errors.budget.message}</p>
					)}
				</div>
				{formData.propertyCategory === "land" && (
					<div>
						<Label>Unit</Label>
						<Select
							{...register("unit")}
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
								<SelectItem value="acre">Acre</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
			</div>

			{/* Price Type */}
			<div>
				<Label>Price Type</Label>
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
					<p className="text-red-500 text-sm">{errors.priceType.message}</p>
				)}
			</div>

			<div className="flex justify-between pt-4">
				<Button variant="outline" type="button" onClick={onBack}>
					Back
				</Button>
				<Button type="submit">Next</Button>
			</div>
		</form>
	);
}
