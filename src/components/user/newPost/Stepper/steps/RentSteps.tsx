import { FormDataTypes } from "../../../../../types/postTypes";
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

export default function RentSteps({
	step,
	formData,
	updateField,
	onNext,
	onBack,
}: {
	step: number;
	formData: FormDataTypes;
	updateField: <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => void;
	onNext: () => void;
	onBack: () => void;
}) {
	return (
		<div className="space-y-4">
			<div>
				<Label>Title</Label>
				<Input
					value={formData.title}
					onChange={(e) => updateField("title", e.target.value)}
				/>
			</div>
			<div>
				<Label>Description</Label>
				<Input
					value={formData.description}
					onChange={(e) => updateField("description", e.target.value)}
				/>
			</div>
			<div>
				<Label>Location</Label>
				<Input
					value={formData.location}
					onChange={(e) => updateField("location", e.target.value)}
				/>
			</div>

			<div>
				<Label>Rent Role</Label>
				<Select
					value={(formData as any).rentRole}
					onValueChange={(val) => updateField("rentRole", val)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="tenant">Tenant</SelectItem>
						<SelectItem value="owner">Owner</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label>Budget</Label>
				<Input
					value={(formData as any).budget}
					onChange={(e) => updateField("budget", e.target.value)}
				/>
			</div>

			<div>
				<Label>Duration</Label>
				<Select
					value={(formData as any).duration}
					onValueChange={(val) => updateField("duration", val)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select duration" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="day">Day</SelectItem>
						<SelectItem value="week">Week</SelectItem>
						<SelectItem value="month">Month</SelectItem>
						<SelectItem value="year">Year</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex justify-between">
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button onClick={onNext}>Next</Button>
			</div>
		</div>
	);
}
