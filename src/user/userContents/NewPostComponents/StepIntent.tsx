import React from "react";
import { StepIntentProps } from "../../../types/PostForm.types";
import BuyIntent from "./intentSteps/BuyIntent";
import SellIntent from "./intentSteps/SellIntent";
import RentIntent from "./intentSteps/RentIntent";

const StepIntent: React.FC<StepIntentProps> = ({ formData, updateField }) => {
	return (
		<div className="text-center space-y-4">
			<h2 className="text-xl font-semibold">What is your intent?</h2>

			<div className="flex justify-center gap-4 flex-wrap">
				{(["buy", "sell", "rent"] as const).map((val) => (
					<button
						key={val}
						onClick={() => {
							updateField("intent", val);
							if (val !== "rent") updateField("rentRole", undefined);
						}}
						className={`px-6 py-3 rounded-md ${
							formData.intent === val ? "bg-blue-600 text-white" : "bg-gray-200"
						}`}
					>
						{val.charAt(0).toUpperCase() + val.slice(1)}
					</button>
				))}
			</div>

			{formData.intent === "buy" && <BuyIntent />}
			{formData.intent === "sell" && <SellIntent />}
			{formData.intent === "rent" && (
				<RentIntent rentRole={formData.rentRole} updateField={updateField} />
			)}
		</div>
	);
};

export default StepIntent;
