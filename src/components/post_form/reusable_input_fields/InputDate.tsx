// Reusable date input field component.
// Used for fields like 'Available From' in post forms.

import { useFormContext } from "react-hook-form";
import { Input } from "../../ui/input";

const InputDate = ({ label, name }: { label: string; name: string }) => {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	return (
		<div>
			<label className="block font-medium mb-1">{label}</label>
			<Input
				type="date"
				{...register(name, { required: "Available From date is required" })}
			/>
			{errors[name] && (
				<p className="text-sm text-red-500">{String(errors[name]?.message)}</p>
			)}
		</div>
	);
};

export default InputDate;
