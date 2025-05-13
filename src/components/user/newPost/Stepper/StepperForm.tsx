"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	FormDataTypes,
	BuyFormData,
	SellFormData,
	RentFormData,
} from "../../../../types/postTypes";
import IntentStep from "./steps/IntentStep";
import BuySteps from "./steps/BuySteps";
import SellSteps from "./steps/SellSteps";
import RentSteps from "./steps/RentSteps";
import ReviewStep from "./steps/ReviewSteps";
import SellImageStep from "./steps/SellImageStep";
import { Step, Steps } from "../../../ui/Steps";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
} from "../../../ui/alert-dialog";
import { Button } from "../../../ui/button";

const StepperForm = () => {
	const [step, setStep] = useState(0);
	const [formData, setFormData] = useState<FormDataTypes>({
		intent: "buy",
		title: "",
		description: "",
		location: "",
		propertyCategory: "",
		pictures: [],
	});
	const [showConfirmation, setShowConfirmation] = useState(false);

	const updateBuyField = <K extends keyof BuyFormData>(
		key: K,
		value: BuyFormData[K]
	) => {
		setFormData((prev) => ({ ...prev, [key]: value } as BuyFormData));
	};

	const updateSellField = <K extends keyof SellFormData>(
		key: K,
		value: SellFormData[K]
	) => {
		setFormData((prev) => ({ ...prev, [key]: value } as SellFormData));
	};

	const updateRentField = <K extends keyof RentFormData>(
		key: K,
		value: RentFormData[K]
	) => {
		setFormData((prev) => ({ ...prev, [key]: value } as RentFormData));
	};

	const next = () => setStep((s) => s + 1);
	const back = () => setStep((s) => Math.max(s - 1, 0));

	const handleBack = () => {
		console.log("Current step:", step); // Debugging log
		if (step === 0 || step === 1) {
			// Show confirmation dialog for step 1 as well
			console.log("Triggering confirmation dialog"); // Debugging log
			setShowConfirmation(true);
		} else {
			back();
		}
	};

	const confirmRestart = (confirm: boolean) => {
		if (confirm) {
			setFormData({
				intent: "buy",
				title: "",
				description: "",
				location: "",
				propertyCategory: "",
				pictures: [],
			});
			setStep(0);
		}
		setShowConfirmation(false);
	};

	const renderSteps = () => {
		if (step === 0)
			return (
				<IntentStep
					formData={formData}
					updateField={(key, value) =>
						updateBuyField(key as keyof FormDataTypes, value)
					}
					onNext={next}
				/>
			);
		if (formData.intent === "buy") {
			if (step === 1) {
				return (
					<BuySteps
						step={step}
						formData={formData as BuyFormData}
						updateField={updateBuyField}
						onNext={next}
						onBack={handleBack}
					/>
				);
			} else if (step === 2) {
				return <ReviewStep formData={formData} onBack={handleBack} />;
			}
		}
		if (formData.intent === "sell") {
			if (step === 1) {
				return (
					<SellSteps
						step={step}
						formData={formData as SellFormData}
						updateField={updateSellField}
						onNext={next}
						onBack={handleBack}
					/>
				);
			} else if (step === 2) {
				return (
					<SellImageStep
						pictures={formData.pictures}
						updatePictures={(pictures) => updateSellField("pictures", pictures)}
						onNext={next}
						onBack={handleBack}
					/>
				);
			} else if (step === 3) {
				return <ReviewStep formData={formData} onBack={handleBack} />;
			}
		}
		if (formData.intent === "rent") {
			if (step === 1) {
				return (
					<RentSteps
						step={step}
						formData={formData as RentFormData}
						updateField={updateRentField}
						onNext={next}
						onBack={handleBack}
					/>
				);
			} else if (step === 2) {
				return <ReviewStep formData={formData} onBack={handleBack} />;
			}
		}
		return <ReviewStep formData={formData} onBack={handleBack} />;
	};

	const totalSteps = formData.intent === "sell" ? 4 : 3;
	const stepLabels = ["Intent", "Details", "Extra", "Review"];

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
			{showConfirmation && (
				<AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
					<AlertDialogContent
						style={{ border: "2px solid red", backgroundColor: "white" }} // Debugging styles
					>
						<AlertDialogHeader>
							<AlertDialogTitle>Confirm Navigation</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to go back? This will clear all your
								progress.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<Button variant="outline" onClick={() => confirmRestart(false)}>
								Cancel
							</Button>
							<Button onClick={() => confirmRestart(true)}>Yes, Go Back</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}

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
