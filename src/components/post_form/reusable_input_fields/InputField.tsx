// Reusable input field component for text, number, etc.
// Used throughout the post form steps for consistent styling and validation.

import { useFormContext } from "react-hook-form";
import { Input } from "../../ui/input";

const InputField = ({ label, name }: { label: string; name: string }) => {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	return (
		<div>
			<label className="block font-medium mb-1">{label}</label>
			<Input
				type="number"
				defaultValue={0}
				{...register(name, {
					valueAsNumber: true,
					required: `${name} is required`,
				})}
			/>
			{errors[name] && (
				<p className="text-sm text-red-500">{String(errors[name]?.message)}</p>
			)}
		</div>
	);
};

export default InputField;
