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
			<label className="block font-medium mb-1">Furnishing</label>
			<select
				{...register("furnishing")}
				className="w-full border rounded px-3 py-2"
			>
				<option value="unfurnished">Unfurnished</option>
				<option value="semi-furnished">Semi-furnished</option>
				<option value="fully-furnished">Fully-furnished</option>
			</select>
			{errors.furnishing && (
				<p className="text-sm text-red-500">
					{errors?.furnishing.message as string}
				</p>
			)}
		</div>
	);
};

export default SelectFurnishing;
