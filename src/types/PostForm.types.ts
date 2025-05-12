export interface FormDataTypes {
	intent: "buy" | "sell" | "rent" | "";
	rentRole?: "owner" | "tenant";
	title: string;
	description: string;
	location: string;
	propertyCategory: "land" | "apartment" | "house" | "room" | "";
	unit?: "per Katha" | "per Bigha" | "per Decima" | "per Acre" | "per Sq Foot";
	priceType: "fixed" | "negotiable";
	price?: string;
	pictures: File[];
}

// ======================
// Step Component Props
// ======================

// Intent step props
export interface StepIntentProps {
	formData: FormDataTypes;
	updateField: <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => void;
}

// RentIntent component props
export interface RentIntentProps {
	rentRole?: "owner" | "tenant";
	updateField: <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => void;
}

// Details step props
export interface StepDetailsProps {
	formData: FormDataTypes;
	updateField: <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => void;
}

// Price step props
export interface StepPriceProps {
	formData: FormDataTypes;
	updateField: <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => void;
	preview: string[];
	setPreview: React.Dispatch<React.SetStateAction<string[]>>;
}

// Image preview grid props
export interface ImagePreviewGridProps {
	preview: string[];
	setPreview: React.Dispatch<React.SetStateAction<string[]>>;
	updateField: <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => void;
}
