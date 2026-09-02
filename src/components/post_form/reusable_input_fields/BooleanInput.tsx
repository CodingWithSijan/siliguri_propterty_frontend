// Reusable boolean (yes/no) input field component, typically rendered as a switch or checkbox.
// Used for fields like 'Parking Available', 'Attached Bathroom', etc.

import { useFormContext } from "react-hook-form";
import { CheckCircle2, XCircle } from "lucide-react";

const BooleanInput = ({ label, name }: { label: string; name: string }) => {
	const { register } = useFormContext();
	return (
		<div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
			<label
				htmlFor={name}
				className="flex cursor-pointer items-center justify-between gap-3"
			>
				<span className="text-sm font-medium text-slate-800">{label}</span>
				<span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
					<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
					<XCircle className="h-3.5 w-3.5 text-rose-500" />
				</span>
			</label>
			<input
				id={name}
				type="checkbox"
				{...register(name)}
				className="mt-2 h-4 w-4 accent-slate-900"
			/>
		</div>
	);
};

export default BooleanInput;
