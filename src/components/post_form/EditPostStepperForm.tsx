// File: components/PostForm/EditPostStepperForm.tsx

// Edit stepper form for updating existing posts (sell or rent).
// Similar to PostStepperForm but with prefilled data and update functionality.

import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import StepPropertyType from "./steps/StepProperty";
import StepDetailsRent from "./steps/StepDetailsRent";
import StepDetailsSell from "./steps/StepDetailsSell";
import StepPicturesEdit from "./steps/StepPicturesEdit";
import StepPreview from "./steps/StepPreview";
import { Button } from "../ui/button";
import {
	RentPostFormInputs,
	SellPostFormInputs,
} from "../../types/postFormTypes";
import PostFormBreadcrumb from "./PostFormBreadcrumb";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toastUtils";
import BASE_URL from "../../services";
import { IUniversalListingType } from "../../types/listingTypes";

// Types
export type UniversalPostFormInputs = RentPostFormInputs | SellPostFormInputs;

interface EditPostStepperFormProps {
	intent: "sell" | "rent";
	initialData: IUniversalListingType;
	postId: string;
}

const allFields = [
	"title",
	"description",
	"location",
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
	"pricePerFrequency",
	"frequency",
	"availableForDuration",
	"availableForDurationUnit",
];

const EditPostStepperForm: React.FC<EditPostStepperFormProps> = ({
	intent,
	initialData,
	postId,
}) => {
	const navigate = useNavigate();
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(false);

	// Transform initial data to form format
	const getDefaultValues = () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const defaultValues: any = {
			intent: intent,
			propertyCategory: initialData.propertyCategory,
			title: initialData.title,
			description: initialData.description,
			location: initialData.location,
		};

		// Add intent-specific fields with type checking
		if (intent === "sell" && "totalPrice" in initialData) {
			defaultValues.totalPrice = initialData.totalPrice;
			defaultValues.pricePerUnit = initialData.pricePerUnit;
			defaultValues.unit = initialData.unit;
		} else if (intent === "rent" && "pricePerFrequency" in initialData) {
			defaultValues.pricePerFrequency = initialData.pricePerFrequency;
			defaultValues.frequency = initialData.frequency;
			defaultValues.availableForDuration = initialData.availableForDuration;
			defaultValues.availableForDurationUnit =
				initialData.availableForDurationUnit;
		}

		// Add property-specific fields
		if (
			initialData.propertyCategory === "house" ||
			initialData.propertyCategory === "flat"
		) {
			if ("bedrooms" in initialData) {
				defaultValues.bedrooms = initialData.bedrooms;
				defaultValues.bathrooms = initialData.bathrooms;
				defaultValues.builtUpArea = initialData.builtUpArea;
				defaultValues.floor = initialData.floor;
				defaultValues.attachedBathroom = initialData.attachedBathroom;
			}
		}

		if (initialData.propertyCategory === "shop") {
			if ("shopArea" in initialData) {
				defaultValues.shopArea = initialData.shopArea;
				defaultValues.hasShutter = initialData.hasShutter;
			}
		}

		if (initialData.propertyCategory === "land") {
			if ("availableLandSpace" in initialData) {
				defaultValues.availableLandSpace = initialData.availableLandSpace;
				defaultValues.availableLandSpaceUnit =
					initialData.availableLandSpaceUnit;
			}
		}

		// Common fields
		if ("furnishing" in initialData) {
			defaultValues.furnishing = initialData.furnishing;
		}
		if ("parking" in initialData) {
			defaultValues.parking = initialData.parking;
		}
		if ("availableFrom" in initialData && initialData.availableFrom) {
			defaultValues.availableFrom = new Date(initialData.availableFrom)
				.toISOString()
				.split("T")[0];
		}

		return defaultValues;
	};

	const methods = useForm<UniversalPostFormInputs & { intent: string }>({
		mode: "onChange",
		defaultValues: getDefaultValues(),
	});

	const { control, resetField } = methods;
	const propertyCategory = useWatch({ control, name: "propertyCategory" });

	useEffect(() => {
		// When propertyCategory changes, reset fields that don't apply to new category
		if (propertyCategory && propertyCategory !== initialData.propertyCategory) {
			const fieldsToKeep = [
				"propertyCategory",
				"title",
				"description",
				"location",
				"intent",
			];

			allFields.forEach((field) => {
				if (!fieldsToKeep.includes(field)) {
					resetField(field as keyof UniversalPostFormInputs, {
						defaultValue: undefined,
					});
				}
			});
		}
	}, [propertyCategory, resetField, initialData.propertyCategory]);

	const onNext = async () => {
		const valid = await methods.trigger();
		if (valid) setStep((prev) => prev + 1);
	};

	const onBack = () => {
		setStep((prev) => prev - 1);
	};

	const onSubmit = methods.handleSubmit(async (data) => {
		try {
			setLoading(true);

			const formData = new FormData();

			// Add regular form fields
			Object.entries(data).forEach(([key, value]) => {
				if (key === "pictures") {
					// Handle new pictures - these are File objects
					if (value instanceof FileList) {
						Array.from(value).forEach((file) =>
							formData.append("pictures", file)
						);
					}
				} else if (key === "existingPictures") {
					// Handle existing pictures - these are URLs to keep
					if (Array.isArray(value)) {
						value.forEach((imageUrl) =>
							formData.append("existingPictures", imageUrl)
						);
					}
				} else if (value !== undefined && value !== null && value !== "") {
					formData.append(key, String(value));
				}
			});

			// Make API call to update the post
			await BASE_URL.put(`/api/user/post/update/${postId}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			showSuccess("Post updated successfully!");
			navigate("/dashboard/view-your-listings");
		} catch (error: unknown) {
			console.error("Error updating post:", error);
			const errorMessage =
				error instanceof Error && error.message
					? error.message
					: "Failed to update post";
			showError(errorMessage);
		} finally {
			setLoading(false);
		}
	});

	const steps = ["Property Type", "Details", "Pictures", "Preview"];

	const renderStepContent = () => {
		switch (step) {
			case 0:
				return <StepPropertyType />;
			case 1:
				return intent === "rent" ? <StepDetailsRent /> : <StepDetailsSell />;
			case 2:
				return <StepPicturesEdit existingPictures={initialData.pictures} />;
			case 3:
				return <StepPreview />;
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Edit Your Property Listing
					</h1>
					<p className="text-gray-600">
						Update your property details and make changes as needed
					</p>
				</div>

				{/* Progress Steps */}
				<div className="mb-8">
					<PostFormBreadcrumb currentStep={step} />
				</div>

				{/* Form */}
				<div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
					<FormProvider {...methods}>
						<form onSubmit={onSubmit} className="p-8">
							{renderStepContent()}

							{/* Navigation Buttons */}
							<div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
								<Button
									type="button"
									variant="outline"
									onClick={onBack}
									disabled={step === 0}
									className="px-6 py-2"
								>
									Previous
								</Button>

								<div className="flex gap-3">
									<Button
										type="button"
										variant="outline"
										onClick={() => navigate("/dashboard/view-your-listings")}
										className="px-6 py-2"
									>
										Cancel
									</Button>

									{step < steps.length - 1 ? (
										<Button
											type="button"
											onClick={onNext}
											className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
										>
											Next
										</Button>
									) : (
										<Button
											type="submit"
											disabled={loading}
											className="px-6 py-2 bg-green-600 hover:bg-green-700"
										>
											{loading ? "Updating..." : "Update Post"}
										</Button>
									)}
								</div>
							</div>
						</form>
					</FormProvider>
				</div>
			</div>
		</div>
	);
};

export default EditPostStepperForm;
