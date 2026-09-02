// Reusable select input for choosing furnishing type (unfurnished, semi-furnished, fully-furnished).
// Used in both rent and sell post forms.

import { useFormContext } from "react-hook-form";

const SelectFurnishing = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext();
	return (
		<div>
			<label className="mb-1 block text-sm font-medium text-slate-800">
				Furnishing Level
			</label>
			<select
				{...register("furnishing")}
				className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
			>
				<option value="unfurnished">Unfurnished</option>
				<option value="semi-furnished">Semi-furnished</option>
				<option value="fully-furnished">Fully-furnished</option>
			</select>
			<p className="mt-1 text-xs text-slate-500">
				Choose what a tenant or buyer should expect on move-in day.
			</p>
			{errors.furnishing && (
				<p className="mt-1 text-sm text-red-500">
					{errors?.furnishing.message as string}
				</p>
			)}
		</div>
	);
};

export default SelectFurnishing;
