import {
	FurnishingType,
	PropertyCategory,
	UnitOfMeasurement,
} from "./postFormTypes";
import { IUser } from "./userTypes";

export type ISODateString = string;
export interface IBaseListingType {
	_id: string;
	intent: "sell" | "rent";
	user?: IUser;
	title: string;
	description: string;
	pictures?: string[];
	location: string;
	propertyCategory: PropertyCategory;
	approvalStatus: "approved" | "pending" | "rejected";
}
export interface ISellListingType extends IBaseListingType {
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

export interface IRentListingType extends IBaseListingType {
	// Common fields
	frequency?: "day" | "week" | "month" | "year";
	pricePerFrequency?: number;
	furnishing?: FurnishingType;
	availableFrom?: ISODateString;
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

export type IUniversalListingType = ISellListingType | IRentListingType;
