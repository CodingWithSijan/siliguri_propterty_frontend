// File: components/PostForm/PostStepperForm.tsx

// Main stepper form for creating a new post (sell or rent).
// Handles step navigation, form state, and submission logic.
// Renders the appropriate step component based on the current step and intent.

import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import StepPropertyType from "./steps/StepProperty";
import StepDetailsRent from "./steps/StepDetailsRent";
import StepDetailsSell from "./steps/StepDetailsSell";
import StepPictures from "./steps/StepPictures";
import StepPreview from "./steps/StepPreview";
import { Button } from "../ui/button";
import {
	RentPostFormInputs,
	SellPostFormInputs,
} from "../../types/postFormTypes";
import PostFormBreadcrumb from "./PostFormBreadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { addNewPost } from "../../app/slices/postSlice";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toastUtils";

const getErrorMessage = (error: unknown): string => {
	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as { message?: unknown }).message === "string"
	) {
		return (error as { message: string }).message;
	}

	return "Post Submission Failed";
};

// Types
export type UniversalPostFormInputs = RentPostFormInputs | SellPostFormInputs;
interface PostStepperFormProps {
	intent: "sell" | "rent";
}
const allFields = [
	"title",
	"description",
	"location",
	"coordinates",
	"pricePerUnit",
	"unit",
	"availableLandSpace",
	"availableLandSpaceUnit",
	"totalPrice",
	"bedrooms",
	"bathrooms",
	"furnishing",
	"floor",
	"builtUpArea",
	"attachedBathroom",
	"parking",
	"shopArea",
	"hasShutter",
	"availableFrom",
	"pictures",
];

const PostStepperForm: React.FC<PostStepperFormProps> = ({ intent }) => {
	const methods = useForm<UniversalPostFormInputs & { intent: string }>({
		mode: "onChange",
		defaultValues: {
			intent: intent,
			propertyCategory: undefined,
			location: "",
			coordinates: { type: "Point", coordinates: [0, 0] },
		},
	});
	const { control, resetField } = methods;
	const propertyCategory = useWatch({ control, name: "propertyCategory" });

	useEffect(() => {
		// When propertyCategory changes, reset all form fields except these
		if (propertyCategory) {
			const fieldsToKeep = ["propertyCategory"];

			// Reset all known fields that are likely to be filled based on previous category
			allFields.forEach((field) => {
				if (!fieldsToKeep.includes(field)) {
					resetField(field as keyof UniversalPostFormInputs, {
						defaultValue: undefined,
					});
				}
			});
		}
	}, [propertyCategory, resetField]);

	const navigate = useNavigate();

	const { loading } = useSelector((state: RootState) => state.addPost);
	const dispatch = useDispatch<AppDispatch>();

	const [step, setStep] = useState(0);

	const onNext = async () => {
		const valid = await methods.trigger();
		if (valid) setStep((prev) => prev + 1);
	};

	const onBack = () => {
		setStep((prev) => prev - 1);
	};

	const onSubmit = methods.handleSubmit(async (data) => {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (key === "pictures" && value instanceof FileList) {
				Array.from(value).forEach((file) => formData.append("pictures", file));
			} else if (value !== undefined && value !== "") {
				if (typeof value === "object") {
					formData.append(key, JSON.stringify(value)); // stringify objects
				} else {
					formData.append(key, value as string | Blob);
				}
			}
		});

		try {
			await dispatch(addNewPost(formData)).unwrap();
			showSuccess("Post submitted successfully");
			methods.reset();
			navigate("/dashboard/view-your-listings");
		} catch (error: unknown) {
			showError(getErrorMessage(error));
		}
	});

	return (
		<>
			<div className="flex justify-center items-center">
				<PostFormBreadcrumb currentStep={step} />
			</div>
			<FormProvider {...methods}>
				<form
					onSubmit={onSubmit}
					className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6"
				>
					{step === 0 && <StepPropertyType />}
					{step === 1 && intent === "rent" && <StepDetailsRent />}
					{step === 1 && intent === "sell" && <StepDetailsSell />}
					{step === 2 && <StepPictures />}
					{step === 3 && <StepPreview />}
					<input type="hidden" {...methods.register("intent")} />
					<div className="flex justify-between">
						{step > 0 && (
							<Button type="button" onClick={onBack}>
								Back
							</Button>
						)}
						{step < 3 ? (
							<Button type="button" onClick={onNext}>
								Next
							</Button>
						) : (
							<Button
								type="button"
								onClick={onSubmit}
								className={`${loading ? "bg-gray-500" : ""}`}
							>
								{loading ? "Submitting..." : "Submit"}
							</Button>
						)}
					</div>
				</form>
			</FormProvider>
		</>
	);
};

export default PostStepperForm;
