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
			<label className="mb-1 block text-sm font-medium text-slate-800">
				{label}
			</label>
			<Input
				type="date"
				{...register(name, { required: "Available From date is required" })}
				className="border-slate-300 focus-visible:ring-slate-400"
			/>
			<p className="mt-1 text-xs text-slate-500">
				Use the expected possession or move-in date.
			</p>
			{errors[name] && (
				<p className="mt-1 text-sm text-red-500">
					{String(errors[name]?.message)}
				</p>
			)}
		</div>
	);
};

export default InputDate;
