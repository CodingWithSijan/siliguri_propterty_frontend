import { FormDataTypes } from "../../../../../types/postTypes";
import { Button } from "../../../../ui/button";
import { Label } from "../../../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../ui/radio-group";

interface Props {
	formData: FormDataTypes;
	updateField: <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => void;
	onNext: () => void;
}

export default function IntentStep({ formData, updateField, onNext }: Props) {
	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Select your intent</h2>
			<RadioGroup
				defaultValue={formData.intent}
				onValueChange={(value) =>
					updateField("intent", value as FormDataTypes["intent"])
				}
			>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="buy" id="buy" />
					<Label htmlFor="buy">Buy</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="sell" id="sell" />
					<Label htmlFor="sell">Sell</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="rent" id="rent" />
					<Label htmlFor="rent">Rent</Label>
				</div>
			</RadioGroup>

			<Button className="mt-6" onClick={onNext}>
				Next
			</Button>
		</div>
	);
}
