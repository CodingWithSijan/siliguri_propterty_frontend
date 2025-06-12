// File: types/postFormTypes.ts

export type PropertyCategory = "land" | "house" | "flat" | "shop";
export type UnitOfMeasurement =
	| "decimal"
	| "sq foot"
	| "katha"
	| "bigha"
	| "acre";

export type FurnishingType =
	| "unfurnished"
	| "semi-furnished"
	| "fully-furnished";
export interface BasePostFormInputs {
	title: string;
	description: string;
	location: string;
	propertyCategory: PropertyCategory;
	pictures?: FileList;
	availableFrom?: string; // ISO date string
}

export interface RentPostFormInputs extends BasePostFormInputs {
	// Common fields
	frequency?: "day" | "week" | "month" | "year";
	pricePerFrequency?: number;
	furnishing?: FurnishingType;
	availableForDuration?: number;
	availableForDurationUnit?: "day" | "week" | "month" | "year";

	// house/flat
	bedrooms?: number;
	bathrooms?: number;
	floor?: number;
	builtUpArea?: number;
	attachedBathroom?: boolean;
	parking?: boolean;

	// shop specific
	shopArea?: number;
	hasShutter?: boolean;
}

export interface SellPostFormInputs extends BasePostFormInputs {
	furnishing?: FurnishingType;
	unit?: UnitOfMeasurement;
	price?: string;
	// Common residential fields (house/flat)
	bedrooms?: number;
	bathrooms?: number;
	floor?: number;
	builtUpArea?: number;
	attachedBathroom?: boolean;
	parking?: boolean;

	// Land Specific
	pricePerUnit?: number;
	availableLandSpace?: string;
	availableLandSpaceUnit?: UnitOfMeasurement;
	totalPrice?: number;

	// shop specific
	shopArea?: number;
	hasShutter?: boolean;
}

export type UniversalPostFormInputs = RentPostFormInputs | SellPostFormInputs;
