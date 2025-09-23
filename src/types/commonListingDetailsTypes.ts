import { PropertyCategory } from "./postFormTypes";

export interface ICommonListingDetailsType {
	title: string;
	description: string;
	location: string;
	alternateLocation: string;
	propertyCategory: PropertyCategory;
	intent: "sell" | "rent";
}
