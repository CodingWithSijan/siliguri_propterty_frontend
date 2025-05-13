"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FormDataTypes } from "../../../../types/postTypes";
import IntentStep from "./steps/IntentStep";
import BuySteps from "./steps/BuySteps";
import SellSteps from "./steps/SellSteps";
import RentSteps from "./steps/RentSteps";
import ReviewStep from "./steps/ReviewSteps";
import { Step, Steps } from "../../../ui/Steps";

const StepperForm = () => {
	const [step, setStep] = useState(0);
	const [formData, setFormData] = useState<FormDataTypes>({
		intent: "buy",
		title: "",
		description: "",
		location: "",
		propertyCategory: "land",
		pictures: [],
	});

	const updateField = <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => setFormData((prev) => ({ ...prev, [key]: value }));

	const next = () => setStep((s) => s + 1);
	const back = () => setStep((s) => Math.max(s - 1, 0));

	const renderSteps = () => {
		if (step === 0)
			return (
				<IntentStep
					formData={formData}
					updateField={updateField}
					onNext={next}
				/>
			);
		if (formData.intent === "buy")
			return (
				<BuySteps
					step={step}
					formData={formData}
					updateField={updateField}
					onNext={next}
					onBack={back}
				/>
			);
		if (formData.intent === "sell")
			return (
				<SellSteps
					step={step}
					formData={formData}
					updateField={updateField}
					onNext={next}
					onBack={back}
				/>
			);
		if (formData.intent === "rent")
			return (
				<RentSteps
					step={step}
					formData={formData}
					updateField={updateField}
					onNext={next}
					onBack={back}
				/>
			);
		return <ReviewStep formData={formData} onBack={back} />;
	};

	const totalSteps = formData.intent ? 4 : 1;
	const stepLabels = ["Intent", "Details", "Extra", "Review"];

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
			<Steps current={step} className="mb-6">
				{stepLabels.slice(0, totalSteps).map((label, i) => (
					<Step
						key={i}
						index={i}
						current={step}
						title={label}
						status={step > i ? "complete" : step === i ? "current" : "upcoming"}
					/>
				))}
			</Steps>

			<motion.div
				key={step}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
			>
				{renderSteps()}
			</motion.div>
		</div>
	);
};

export default StepperForm;
