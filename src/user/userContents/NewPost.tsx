import React, { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FormDataTypes } from "../../types/PostForm.types";
import { showError, showSuccess } from "../../utils/toastUtils";
import BASE_URL from "../../services";
import StepIndicator from "./NewPostComponents/StepIndicator";
import StepIntent from "./NewPostComponents/StepIntent";
import StepDetails from "./NewPostComponents/StepDetails";
import StepPrice from "./NewPostComponents/StepPrice";

const NewPost: React.FC = () => {
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [preview, setPreview] = useState<string[]>([]);
	const [formData, setFormData] = useState<FormDataTypes>({
		intent: "",
		rentRole: undefined,
		title: "",
		description: "",
		location: "",
		propertyCategory: "",
		unit: undefined,
		priceType: "fixed",
		price: "",
		pictures: [],
	});

	const updateField = <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const nextStep = () => {
		if (step === 0 && !formData.intent) return showError("Select intent");
		if (step === 0 && formData.intent === "rent" && !formData.rentRole)
			return showError("Select your role in renting");

		if (
			step === 1 &&
			(!formData.title ||
				!formData.description ||
				!formData.location ||
				!formData.propertyCategory)
		)
			return showError("Fill all details");

		if (step === 1 && formData.intent === "sell" && !formData.unit)
			return showError("Select a price unit");

		if (
			step === 2 &&
			formData.intent === "sell" &&
			formData.priceType === "fixed" &&
			!formData.price
		)
			return showError("Enter price");

		setStep((prev) => prev + 1);
	};

	const prevStep = () => setStep((prev) => prev - 1);

	const handleSubmit = async () => {
		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (key === "pictures") {
				formData.pictures.forEach((pic) => data.append("pictures", pic));
			} else if (typeof value === "string") {
				data.append(key, value);
			}
		});

		try {
			setLoading(true);
			await BASE_URL.post("/api/users/post/new-post", data);
			showSuccess("Post submitted!");
			setFormData({
				intent: "",
				rentRole: undefined,
				title: "",
				description: "",
				location: "",
				propertyCategory: "",
				unit: undefined,
				priceType: "fixed",
				price: "",
				pictures: [],
			});
			setStep(0);
			setPreview([]);
		} catch {
			showError("Submission failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6 text-black">
			<div className="flex justify-center">
				<StepIndicator step={step} formData={formData} />
			</div>

			{/* Step Components */}
			{step === 0 && (
				<StepIntent formData={formData} updateField={updateField} />
			)}
			{step === 1 && (
				<StepDetails formData={formData} updateField={updateField} />
			)}
			{step === 2 && (
				<StepPrice
					formData={formData}
					updateField={updateField}
					preview={preview}
					setPreview={setPreview}
				/>
			)}

			{/* Navigation Buttons */}
			<div className="flex justify-between pt-4">
				{step > 0 ? (
					<button
						onClick={prevStep}
						className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md"
					>
						<FiArrowLeft /> Back
					</button>
				) : (
					<div></div>
				)}

				{step < 2 ? (
					<button
						onClick={nextStep}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md"
					>
						Next <FiArrowRight />
					</button>
				) : (
					<button
						onClick={handleSubmit}
						className="px-6 py-2 bg-green-600 text-white rounded-md"
						disabled={loading}
					>
						{loading ? "Submitting..." : "Submit Post"}
					</button>
				)}
			</div>
		</div>
	);
};

export default NewPost;
