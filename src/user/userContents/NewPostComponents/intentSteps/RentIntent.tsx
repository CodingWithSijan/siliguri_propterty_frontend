import React from "react";
import { FormDataTypes } from "../../../../types/PostForm.types";

interface Props {
	rentRole?: "owner" | "tenant";
	updateField: <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => void;
}

const RentIntent: React.FC<Props> = ({ rentRole, updateField }) => {
	return (
		<div className="mt-4 space-x-4">
			<button
				onClick={() => updateField("rentRole", "tenant")}
				className={`px-4 py-2 rounded-md ${
					rentRole === "tenant" ? "bg-green-500 text-white" : "bg-gray-200"
				}`}
			>
				Looking to Rent
			</button>
			<button
				onClick={() => updateField("rentRole", "owner")}
				className={`px-4 py-2 rounded-md ${
					rentRole === "owner" ? "bg-green-500 text-white" : "bg-gray-200"
				}`}
			>
				Want to Rent Out
			</button>
		</div>
	);
};

export default RentIntent;
