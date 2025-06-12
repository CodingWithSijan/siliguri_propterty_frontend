// Reusable boolean (yes/no) input field component, typically rendered as a switch or checkbox.
// Used for fields like 'Parking Available', 'Attached Bathroom', etc.

import { useFormContext } from "react-hook-form";

const BooleanInput = ({ label, name }: { label: string; name: string }) => {
	const { register } = useFormContext();
	return (
		<div className="flex items-center gap-2 ">
			<input id={name} type="checkbox" {...register(name)} />
			<label htmlFor={name}>{label}</label>
		</div>
	);
};

export default BooleanInput;
