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
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { addNewPost } from "../../app/slices/postSlice";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toastUtils";
import { CheckCircle2, FileText, Images, Home, Settings2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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

type FormValues = UniversalPostFormInputs & {
	intent: string;
	alternateLocation?: string;
	wbLocalityKey?: string;
	wbLocalityLabel?: string;
	coordinates?: {
		type: "Point";
		coordinates: [number, number];
	};
};

type KeysOfUnion<T> = T extends T ? keyof T : never;
type FormFieldKey = KeysOfUnion<FormValues>;

const STEPS = [
	{
		title: "Property Basics",
		description:
			"Choose category, add both locations and write the listing summary.",
		icon: Home,
	},
	{
		title: "Property Details",
		description:
			"Fill category-specific details with pricing and availability.",
		icon: Settings2,
	},
	{
		title: "Upload Photos",
		description: "Add clear images to boost listing quality and trust.",
		icon: Images,
	},
	{
		title: "Review & Publish",
		description: "Verify everything before submitting your listing.",
		icon: FileText,
	},
] as const;

const allFields = [
	"title",
	"description",
	"location",
	"wbLocalityKey",
	"wbLocalityLabel",
	"coordinates",
	"alternateLocation",
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
	"videos",
] as FormFieldKey[];

const step0RequiredFields: FormFieldKey[] = [
	"propertyCategory",
	"wbLocalityKey",
	"location",
	"coordinates",
	"title",
	"description",
];

const getStep1Fields = (
	intent: "sell" | "rent",
	propertyCategory: string | undefined,
): FormFieldKey[] => {
	if (intent === "sell") {
		if (propertyCategory === "land") {
			return [
				"pricePerUnit",
				"unit",
				"availableLandSpace",
				"availableLandSpaceUnit",
			];
		}

		if (propertyCategory === "house" || propertyCategory === "flat") {
			return ["bedrooms", "bathrooms", "builtUpArea", "price", "availableFrom"];
		}

		if (propertyCategory === "shop") {
			return ["shopArea", "price", "availableFrom"];
		}
	}

	if (intent === "rent") {
		if (propertyCategory === "house" || propertyCategory === "flat") {
			return [
				"bedrooms",
				"bathrooms",
				"builtUpArea",
				"availableFrom",
				"pricePerFrequency",
				"frequency",
				"availableForDuration",
				"availableForDurationUnit",
			];
		}

		if (propertyCategory === "shop") {
			return [
				"shopArea",
				"availableFrom",
				"pricePerFrequency",
				"frequency",
				"availableForDuration",
				"availableForDurationUnit",
			];
		}
	}

	return [];
};

const PostStepperForm: React.FC<PostStepperFormProps> = ({ intent }) => {
	const methods = useForm<FormValues>({
		mode: "onChange",
		defaultValues: {
			intent: intent,
			propertyCategory: undefined,
			wbLocalityKey: "",
			wbLocalityLabel: "",
			location: "",
			coordinates: { type: "Point", coordinates: [0, 0] },
		},
	});
	const { control, resetField } = methods;
	const propertyCategory = useWatch({ control, name: "propertyCategory" });

	useEffect(() => {
		// When propertyCategory changes, reset all form fields except these
		if (propertyCategory) {
			const fieldsToKeep: FormFieldKey[] = [
				"propertyCategory",
				"wbLocalityKey",
				"wbLocalityLabel",
				"location",
				"coordinates",
				"alternateLocation",
				"title",
				"description",
			];

			// Reset all known fields that are likely to be filled based on previous category
			allFields.forEach((field) => {
				if (!fieldsToKeep.includes(field)) {
					resetField(field, {
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
	const progress = Math.round(((step + 1) / STEPS.length) * 100);

	const getCurrentStepFields = (): FormFieldKey[] => {
		if (step === 0) {
			return step0RequiredFields;
		}

		if (step === 1) {
			return getStep1Fields(intent, propertyCategory);
		}

		if (step === 2) {
			return ["pictures", "videos"];
		}

		return [];
	};

	const onNext = async () => {
		const fields = getCurrentStepFields();
		const valid = fields.length > 0 ? await methods.trigger(fields) : true;
		if (valid) setStep((prev) => prev + 1);
	};

	const onBack = () => {
		setStep((prev) => prev - 1);
	};

	const goToStep = (targetStep: number) => {
		if (targetStep <= step) {
			setStep(targetStep);
		}
	};

	const onSubmit = methods.handleSubmit(async (data) => {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if ((key === "pictures" || key === "videos") && Array.isArray(value)) {
				value.forEach((file) => {
					if (file instanceof File) {
						formData.append(key, file);
					}
				});
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
		<div className="mx-auto w-full max-w-5xl px-2 pb-6 sm:px-4">
			<div className="sticky top-2 z-30 mb-3 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:hidden">
				<div className="mb-2 flex items-center justify-between gap-2">
					<div className="flex min-w-0 items-center gap-2">
						<div className="rounded-md bg-slate-100 p-1.5 text-slate-700">
							{React.createElement(STEPS[step].icon, {
								className: "h-3.5 w-3.5",
							})}
						</div>
						<p className="truncate text-sm font-semibold text-slate-900">
							{STEPS[step].title}
						</p>
					</div>
					<span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
						{step + 1}/{STEPS.length}
					</span>
				</div>

				<div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
					<div
						className="h-full rounded-full bg-slate-900 transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>

				<div className="flex items-center gap-2">
					{STEPS.map((item, index) => {
						const Icon = item.icon;
						const isCurrent = index === step;
						const isDone = index < step;
						const isLocked = index > step;
						return (
							<Tooltip key={item.title}>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={() => goToStep(index)}
										disabled={isLocked}
										aria-label={item.title}
										className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
											isCurrent
												? "border-slate-900 bg-slate-900 text-white"
												: isDone
													? "border-emerald-300 bg-emerald-50 text-emerald-700"
													: "border-slate-200 bg-white text-slate-400"
										} ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
									>
										{isDone ? (
											<CheckCircle2 className="h-3.5 w-3.5" />
										) : (
											<Icon className="h-3.5 w-3.5" />
										)}
									</button>
								</TooltipTrigger>
								<TooltipContent side="bottom" sideOffset={6}>
									<div className="space-y-0.5">
										<p className="font-medium">{item.title}</p>
										<p className="text-[11px] opacity-90">{item.description}</p>
									</div>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</div>

			<div className="mb-5 hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm sm:block sm:p-5">
				<div className="mb-3 flex flex-wrap items-center justify-between gap-2">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
							Create New {intent === "sell" ? "Sale" : "Rental"} Listing
						</p>
						<h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
							{STEPS[step].title}
						</h2>
					</div>
					<span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
						Step {step + 1} of {STEPS.length}
					</span>
				</div>

				<p className="text-sm text-slate-600">{STEPS[step].description}</p>

				<div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
					<div
						className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500 transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>

				<div className="mt-4 hidden gap-2 sm:grid sm:grid-cols-4">
					{STEPS.map((item, index) => {
						const Icon = item.icon;
						const isCurrent = index === step;
						const isDone = index < step;
						return (
							<div
								key={item.title}
								onClick={() => goToStep(index)}
								className={`rounded-xl border p-2.5 text-xs transition ${
									isCurrent
										? "border-blue-300 bg-blue-50 text-blue-700"
										: isDone
											? "border-emerald-300 bg-emerald-50 text-emerald-700"
											: "border-slate-200 bg-white text-slate-500"
								} ${index <= step ? "cursor-pointer" : "cursor-not-allowed"}`}
							>
								<div className="mb-1 flex items-center gap-1.5 font-semibold">
									{isDone ? (
										<CheckCircle2 className="h-4 w-4" />
									) : (
										<Icon className="h-4 w-4" />
									)}
									<span>{item.title}</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<FormProvider {...methods}>
				<form
					onSubmit={onSubmit}
					onKeyDown={(event) => {
						if (event.key === "Enter" && step < 3) {
							event.preventDefault();
						}
					}}
					className="mx-auto max-w-4xl space-y-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:space-y-6 sm:rounded-2xl sm:p-6 sm:shadow-lg"
				>
					{step === 0 && <StepPropertyType />}
					{step === 1 && intent === "rent" && <StepDetailsRent />}
					{step === 1 && intent === "sell" && <StepDetailsSell />}
					{step === 2 && <StepPictures />}
					{step === 3 && <StepPreview onEditStep={goToStep} />}
					<input type="hidden" {...methods.register("intent")} />
					<div className="sticky bottom-0 z-20 -mx-3 mt-2 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-6px_16px_rgba(15,23,42,0.05)] backdrop-blur sm:-mx-6 sm:px-6 sm:py-3">
						<div className="flex items-center justify-between gap-3">
							{step > 0 && (
								<Button
									type="button"
									variant="outline"
									onClick={onBack}
									className="h-10 min-w-[92px] sm:h-11 sm:min-w-[96px]"
								>
									Back
								</Button>
							)}
							{step === 0 && <div />}
							{step < 3 ? (
								<Button
									type="button"
									onClick={onNext}
									className="h-10 min-w-[104px] sm:h-11 sm:min-w-[110px]"
								>
									{step === 2 ? "Review" : "Next"}
								</Button>
							) : (
								<Button
									type="submit"
									className={`h-10 min-w-[112px] sm:h-11 sm:min-w-[120px] ${loading ? "bg-gray-500" : ""}`}
									disabled={loading}
								>
									{loading ? "Submitting..." : "Submit"}
								</Button>
							)}
						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	);
};

export default PostStepperForm;
