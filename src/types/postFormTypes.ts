export interface BasePostFormInputs {
	title: string;
	description: string;
	location: string;
	propertyCategory: string;
	price?: number;
}

export type BuyPostFormInputs = BasePostFormInputs;

// Type definition for form inputs
// pictures is optional and only for 'owner' role
// duration is required in the form, but optional in type for flexibility
// price is optional for flexibility
export interface RentPostFormInputs extends BasePostFormInputs {
	rentRole: string; // Owner or tenant
	duration?: "day" | "week" | "month" | "year"; // Frequency/duration (per month, week, etc.)
	pictures?: FileList; // Images (only for owner)
}

// TypeScript type for the form inputs
// 'pictures' is a FileList for multi-file upload
// 'unit' is optional
// All other fields are required
// Used for type safety with react-hook-form
//
export interface SellPostFormInputs extends BasePostFormInputs {
	unit?: "decimal" | "sq foot" | "katha" | "bigha" | "acre";
	pictures?: FileList;
	availableLandSpace?: string;
	availableLandSpaceUnit?: "decimal" | "sq foot" | "katha" | "bigha" | "acre";
}
