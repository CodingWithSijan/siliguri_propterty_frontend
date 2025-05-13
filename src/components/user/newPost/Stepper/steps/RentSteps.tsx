import { useForm } from "react-hook-form";
import { RentFormData } from "../../../../../types/postTypes";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../../ui/select";
import { Textarea } from "../../../../ui/textarea";
import {
	LuDollarSign,
	LuBuilding,
	LuText,
	LuTextQuote,
	LuMapPin,
	LuClock,
} from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";
import AddressInput from "../../../../../services/AddressInput";
import { useEffect } from "react";

interface Props {
	step: number;
	formData: RentFormData;
	updateField: <K extends keyof RentFormData>(
		key: K,
		value: RentFormData[K]
	) => void;
	onNext: () => void;
	onBack: () => void;
}

export default function RentSteps({
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
		trigger,
		formState: { errors },
	} = useForm<RentFormData>({
		defaultValues: formData,
	});

	const onSubmit = (data: RentFormData) => {
		Object.entries(data).forEach(([key, value]) => {
			updateField(
				key as keyof RentFormData,
				value as RentFormData[keyof RentFormData]
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

			{/* Location */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<LuMapPin /> Location
					</div>
				</Label>
				<AddressInput />
				{errors.location && (
					<p className="text-red-500 text-sm">{errors.location.message}</p>
				)}
			</div>

			{/* Rent Role */}
			<div>
				<Label>
					<div className="flex items-center gap-2">
						<LuBuilding /> Rent Role
					</div>
				</Label>
				<Select
					{...register("rentRole", { required: "Rent role is required" })}
					onValueChange={(value) => {
						setValue("rentRole", value);
						trigger("rentRole");
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="tenant">Tenant</SelectItem>
						<SelectItem value="owner">Owner</SelectItem>
					</SelectContent>
				</Select>
				{errors.rentRole && (
					<p className="text-red-500 text-sm">{errors.rentRole.message}</p>
				)}
			</div>

			{/* Budget or Price */}
			<div className="flex items-end gap-3">
				<div className="flex-1">
					<Label>
						<div className="flex items-center gap-2">
							<MdCurrencyRupee />
							{formData.rentRole === "owner" ? "Price" : "Budget"}
						</div>
					</Label>
					<Input
						type="number"
						{...register("budget", { required: "This field is required" })}
					/>
					{errors.budget && (
						<p className="text-red-500 text-sm">{errors.budget.message}</p>
					)}
				</div>
				<div>
					<Label>Frequency</Label>
					<Select
						{...register("duration", { required: "Duration is required" })}
						onValueChange={(value) => {
							setValue("duration", value);
							trigger("duration");
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select duration" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="day">Per Day</SelectItem>
							<SelectItem value="week">Per Week</SelectItem>
							<SelectItem value="month">Per Month</SelectItem>
							<SelectItem value="year">Per Year</SelectItem>
						</SelectContent>
					</Select>
					{errors.duration && (
						<p className="text-red-500 text-sm">{errors.duration.message}</p>
					)}
				</div>
			</div>

			{/* Price Type (only for owner) */}
			{formData.rentRole === "owner" && (
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
						<p className="text-red-500 text-sm">{errors.priceType.message}</p>
					)}
				</div>
			)}

			<div className="flex justify-between pt-4">
				<Button variant="outline" type="button" onClick={onBack}>
					Back
				</Button>
				<Button type="submit">Next</Button>
			</div>
		</form>
	);
}
