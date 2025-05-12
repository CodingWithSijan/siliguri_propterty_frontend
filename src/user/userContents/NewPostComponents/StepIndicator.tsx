import React from "react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { FormDataTypes } from "../../../types/PostForm.types";

interface Props {
	step: number;
	formData: FormDataTypes;
}

const steps = ["Intent", "Details", "Price & Upload"];

const StepIndicator: React.FC<Props> = ({ step, formData }) => {
	const isStepComplete = (index: number) => {
		switch (index) {
			case 0:
				return (
					formData.intent && (formData.intent !== "rent" || !!formData.rentRole)
				);
			case 1:
				return (
					formData.title.trim() !== "" &&
					formData.description.trim() !== "" &&
					formData.location.trim() !== "" &&
					formData.propertyCategory !== "" &&
					(formData.intent !== "sell" || !!formData.unit)
				);
			case 2:
				return (
					formData.pictures.length > 0 &&
					(formData.intent !== "sell" ||
						formData.priceType === "negotiable" ||
						(formData.priceType === "fixed" && !!formData.price))
				);
			default:
				return false;
		}
	};

	return (
		<div className="flex justify-center items-center space-x-4">
			{steps.map((label, index) => {
				const completed = isStepComplete(index);
				const isActive = step === index;

				return (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
						className="flex items-center"
					>
						{/* Step Circle */}
						<div
							className={`w-8 h-8 flex items-center justify-center rounded-full font-bold
								${
									completed
										? "bg-green-600 text-white"
										: isActive
										? "bg-blue-600 text-white"
										: "bg-gray-200 text-gray-600"
								}`}
						>
							{completed ? <FiCheck size={16} /> : index + 1}
						</div>

						{/* Label */}
						<span
							className={`ml-2 text-sm ${
								isActive ? "font-semibold text-blue-600" : "text-gray-600"
							}`}
						>
							{label}
						</span>

						{/* Line */}
						{index < steps.length - 1 && (
							<div className="mx-2 h-0.5 w-6 bg-gray-300"></div>
						)}
					</motion.div>
				);
			})}
		</div>
	);
};

export default StepIndicator;
