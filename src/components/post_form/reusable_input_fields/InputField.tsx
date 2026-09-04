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
			<label className="mb-1 block text-sm font-medium text-slate-800">
				{label}
			</label>
			<Input
				type="number"
				placeholder={`Enter ${label.toLowerCase()}`}
				{...register(name, {
					valueAsNumber: true,
					required: `${name} is required`,
				})}
				className="border-slate-300 focus-visible:ring-slate-400"
			/>
			{errors[name] && (
				<p className="mt-1 text-sm text-red-500">
					{String(errors[name]?.message)}
				</p>
			)}
		</div>
	);
};

export default InputField;
